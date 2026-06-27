'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logAction } from '@/lib/audit/log'
import { requirePlatformAdmin } from '@/lib/auth/context'

const ResolveAppealSchema = z.object({
  appealId: z.string().uuid(),
  resolution: z.enum(['approved', 'rejected']),
  note: z.string().optional(),
})

export async function resolveAppeal(input: z.infer<typeof ResolveAppealSchema>) {
  const result = ResolveAppealSchema.safeParse(input)
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || 'Invalid input' }
  }

  await requirePlatformAdmin()

  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const supabase = createServiceClient()

  const { data: appeal } = await supabase
    .from('appeals')
    .select('*')
    .eq('id', result.data.appealId)
    .single()

  if (!appeal) return { success: false, error: 'Appeal not found' }

  const { error } = await supabase
    .from('appeals')
    .update({
      status: result.data.resolution,
      resolution_note: result.data.note || null,
      resolved_at: new Date().toISOString(),
      resolved_by: user.id,
    })
    .eq('id', result.data.appealId)

  if (error) return { success: false, error: error.message }

  if (result.data.resolution === 'approved') {
    await supabase
      .from('organisations')
      .update({ is_suspended: false, status: 'active' })
      .eq('id', appeal.organisation_id)

    await supabase.from('platform_actions').insert({
      action_type: 'resolve_appeal',
      target_org_id: appeal.organisation_id,
      reason: result.data.note || 'Appeal approved - Organisation reactivated',
      created_by: user.id,
    })
  }

  await logAction({
    organisation_id: appeal.organisation_id,
    user_id: user.id,
    action: result.data.resolution === 'approved' ? 'APPEAL_APPROVED' : 'APPEAL_REJECTED',
    resource_table: 'appeals',
    resource_id: result.data.appealId,
    details: { note: result.data.note },
  })

  revalidatePath('/admin/appeals', 'page')
  revalidatePath('/admin/moderation', 'page')
  return { success: true }
}

export async function getAppeal(appealId: string) {
  await requirePlatformAdmin()
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('appeals')
    .select('*, organisations(name, slug, is_suspended)')
    .eq('id', appealId)
    .single()
  return data
}

export async function getAllAppeals() {
  await requirePlatformAdmin()
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('appeals')
    .select('*, organisations(name, slug)')
    .order('created_at', { ascending: false })
    .limit(100)
  return data || []
}
