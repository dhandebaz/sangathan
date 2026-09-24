'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { disconnectIntegration } from '@/lib/integrations/store'

const DisconnectSchema = z.object({ orgId: z.string().uuid(), providerId: z.string().min(1) })
const ADMIN_ROLES = ['admin', 'second_admin', 'executive']

export async function disconnectOrgIntegration(input: z.infer<typeof DisconnectSchema>) {
  const parsed = DisconnectSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: 'Invalid input' }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { data: membership } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .eq('organisation_id', parsed.data.orgId)
    .maybeSingle()
  if (!membership || !ADMIN_ROLES.includes((membership.role as string) || '')) {
    return { success: false, error: 'Only organisation admins can disconnect integrations' }
  }

  try {
    await disconnectIntegration(parsed.data.orgId, parsed.data.providerId, user.id)
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Disconnect failed' }
  }
  revalidatePath('/', 'layout')
  return { success: true }
}
