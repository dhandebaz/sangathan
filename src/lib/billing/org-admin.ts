import 'server-only'
import { createClient } from '@/lib/supabase/server'

const ADMIN_ROLES = ['admin', 'second_admin', 'executive']

/** Verifies the caller is logged in and an admin of the given org. */
export async function requireOrgAdmin(
  orgId: string,
): Promise<{ ok: true; userId: string } | { ok: false; error: string; status: number }> {
  if (!orgId) return { ok: false, error: 'Missing organisation', status: 400 }
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Unauthorized', status: 401 }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .eq('organisation_id', orgId)
    .maybeSingle()

  const role = (profile?.role as string) || ''
  if (!ADMIN_ROLES.includes(role)) {
    return { ok: false, error: 'Only organisation admins can manage billing', status: 403 }
  }
  return { ok: true, userId: user.id }
}
