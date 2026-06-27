'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logAction } from '@/lib/audit/log'
import { requirePlatformAdmin } from '@/lib/auth/context'
import type { Json } from '@/types/database'

const UpdateOrgSchema = z.object({
  organisationId: z.string().uuid(),
  status: z.enum(['active', 'warning', 'suspended', 'under_review']).optional(),
  membership_policy: z.enum(['open_auto', 'admin_approval', 'invite_only']).optional(),
  legal_hold: z.boolean().optional(),
  legal_hold_reason: z.string().optional(),
  broadcast_restricted: z.boolean().optional(),
  risk_score: z.number().min(0).max(100).optional(),
})

export async function updateOrganisation(input: z.infer<typeof UpdateOrgSchema>) {
  const result = UpdateOrgSchema.safeParse(input)
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || 'Invalid input' }
  }

  await requirePlatformAdmin()

  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const supabase = createServiceClient()

  const updateData: Record<string, unknown> = {}
  if (result.data.status !== undefined) updateData.status = result.data.status
  if (result.data.membership_policy !== undefined) updateData.membership_policy = result.data.membership_policy
  if (result.data.legal_hold !== undefined) updateData.legal_hold = result.data.legal_hold
  if (result.data.legal_hold_reason !== undefined) updateData.legal_hold_reason = result.data.legal_hold_reason
  if (result.data.broadcast_restricted !== undefined) updateData.broadcast_restricted = result.data.broadcast_restricted
  if (result.data.risk_score !== undefined) updateData.risk_score = result.data.risk_score

  const { error } = await supabase
    .from('organisations')
    .update(updateData)
    .eq('id', result.data.organisationId)

  if (error) return { success: false, error: error.message }

  await logAction({
    organisation_id: result.data.organisationId,
    user_id: user.id,
    action: 'ORG_UPDATED_BY_ADMIN',
    resource_table: 'organisations',
    resource_id: result.data.organisationId,
    details: updateData as Json,
  })

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function deleteOrganisation(organisationId: string) {
  await requirePlatformAdmin()

  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const supabase = createServiceClient()

  const { error } = await supabase
    .from('organisations')
    .update({ deleted_at: new Date().toISOString(), status: 'suspended' })
    .eq('id', organisationId)

  if (error) return { success: false, error: error.message }

  await logAction({
    organisation_id: organisationId,
    user_id: user.id,
    action: 'ORG_DELETED_BY_ADMIN',
    resource_table: 'organisations',
    resource_id: organisationId,
  })

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function getAllOrganisations() {
  await requirePlatformAdmin()
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('organisations')
    .select('id, name, slug, status, membership_policy, org_type, created_at, legal_hold, broadcast_restricted, plan_name, risk_score')
    .order('created_at', { ascending: false })
  return data || []
}

export async function getOrganisationDetails(organisationId: string) {
  await requirePlatformAdmin()
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('organisations')
    .select('*')
    .eq('id', organisationId)
    .single()
  return data
}
