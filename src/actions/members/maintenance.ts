'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logAction } from '@/lib/audit/log'

const ArchiveDormantSchema = z.object({
  orgId: z.string().uuid(),
  days: z.number().int().min(30).max(365).default(90),
})

const ADMIN_ROLES = ['admin', 'second_admin', 'executive']

/**
 * Archives active profiles with no sign-in for `days` (default 90).
 * Archived members keep their records — they simply stop counting toward
 * the meter. Never deletes anything.
 */
export async function archiveDormantMembers(input: z.infer<typeof ArchiveDormantSchema>) {
  const parsed = ArchiveDormantSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: 'Invalid input' }
  const { orgId, days } = parsed.data

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { data: actor } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .eq('organisation_id', orgId)
    .maybeSingle()
  if (!actor || !ADMIN_ROLES.includes((actor.role as string) || '')) {
    return { success: false, error: 'Only organisation admins can archive members' }
  }

  const admin = createServiceClient()
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000

  const { data: members } = await admin
    .from('profiles')
    .select('id')
    .eq('organisation_id', orgId)
    .eq('status', 'active')
  if (!members || members.length === 0) return { success: true, archived: 0 }

  // Batch auth lookup (single paginated sweep, capped).
  const signIn = new Map<string, string | null>()
  for (let page = 1; page <= 300; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) return { success: false, error: `Directory lookup failed: ${error.message}` }
    for (const u of data.users) signIn.set(u.id, u.last_sign_in_at || null)
    if (data.users.length < 1000) break
  }

  const dormant = (members as { id: string }[])
    .map((m) => m.id)
    .filter((id) => {
      if (id === user.id) return false // never archive yourself
      const last = signIn.get(id)
      if (!last) return true // never signed in → dormant
      return Date.now() - new Date(last).getTime() > cutoff
    })

  if (dormant.length === 0) return { success: true, archived: 0 }

  const { error } = await admin
    .from('profiles')
    .update({ status: 'inactive', updated_at: new Date().toISOString() })
    .in('id', dormant)
    .eq('organisation_id', orgId)

  if (error) return { success: false, error: error.message }

  await logAction({
    organisation_id: orgId,
    user_id: user.id,
    action: 'DORMANT_MEMBERS_ARCHIVED',
    resource_table: 'profiles',
    resource_id: orgId,
    details: { archived: dormant.length, days },
  })

  revalidatePath('/', 'layout')
  return { success: true, archived: dormant.length }
}
