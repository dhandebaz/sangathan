'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logAction } from '@/lib/audit/log'
import { requirePlatformAdmin } from '@/lib/auth/context'

const ProcessDataRequestSchema = z.object({
  requestId: z.string().uuid(),
  status: z.enum(['completed', 'rejected']),
  note: z.string().optional(),
})

export async function processDataRequest(input: z.infer<typeof ProcessDataRequestSchema>) {
  const result = ProcessDataRequestSchema.safeParse(input)
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || 'Invalid input' }
  }

  await requirePlatformAdmin()

  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const supabase = createServiceClient()

  const { data: request } = await supabase
    .from('data_requests')
    .select('*')
    .eq('id', result.data.requestId)
    .single()

  if (!request) return { success: false, error: 'Data request not found' }

  const { error } = await supabase
    .from('data_requests')
    .update({
      status: result.data.status,
      processed_at: new Date().toISOString(),
      processed_by: user.id,
      details: { ...(request.details || {}), resolution_note: result.data.note },
    })
    .eq('id', result.data.requestId)

  if (error) return { success: false, error: error.message }

  await logAction({
    organisation_id: request.organisation_id,
    user_id: user.id,
    action: result.data.status === 'completed' ? 'DATA_REQUEST_COMPLETED' : 'DATA_REQUEST_REJECTED',
    resource_table: 'data_requests',
    resource_id: result.data.requestId,
  })

  revalidatePath('/admin/data-requests', 'page')
  return { success: true }
}

export async function getAllDataRequests() {
  await requirePlatformAdmin()
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('data_requests')
    .select('*, organisations(name), profiles:user_id(email)')
    .order('created_at', { ascending: false })
    .limit(100)
  return data || []
}
