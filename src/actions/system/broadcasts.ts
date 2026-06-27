'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logAction } from '@/lib/audit/log'
import { requirePlatformAdmin } from '@/lib/auth/context'

const CreateBroadcastSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  priority: z.enum(['low', 'normal', 'high', 'critical']).default('normal'),
  target_org_id: z.string().uuid().nullable().optional(),
  send_email: z.boolean().default(false),
  expires_at: z.string().optional(),
})

export async function createPlatformBroadcast(input: z.infer<typeof CreateBroadcastSchema>) {
  const result = CreateBroadcastSchema.safeParse(input)
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || 'Invalid input' }
  }

  await requirePlatformAdmin()

  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const supabase = createServiceClient()

  const { error } = await supabase.from('announcements').insert({
    organisation_id: result.data.target_org_id || '00000000-0000-0000-0000-000000000000',
    title: result.data.title,
    content: result.data.content,
    is_pinned: result.data.priority === 'critical' || result.data.priority === 'high',
    send_email: result.data.send_email,
    expires_at: result.data.expires_at || null,
    created_by: user.id,
  })

  if (error) return { success: false, error: error.message }

  await logAction({
    organisation_id: '00000000-0000-0000-0000-000000000000',
    user_id: user.id,
    action: 'PLATFORM_BROADCAST_CREATED',
    resource_table: 'announcements',
    resource_id: result.data.title,
    details: { priority: result.data.priority, target_org: result.data.target_org_id },
  })

  revalidatePath('/admin/broadcasts', 'page')
  return { success: true }
}

export async function getAllBroadcasts() {
  await requirePlatformAdmin()
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('announcements')
    .select('*, organisations(name)')
    .order('created_at', { ascending: false })
    .limit(100)
  return data || []
}

export async function deleteBroadcast(broadcastId: string) {
  await requirePlatformAdmin()

  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', broadcastId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/broadcasts', 'page')
  return { success: true }
}
