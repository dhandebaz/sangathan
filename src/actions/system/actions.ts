'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logAction } from '@/lib/audit/log'
import { requirePlatformAdmin } from '@/lib/auth/context'

const OrgActionSchema = z.object({
  organisationId: z.string().uuid(),
})

export const suspendOrganisation = async (input: z.infer<typeof OrgActionSchema>) => {
  const result = OrgActionSchema.safeParse(input)
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || 'Invalid organisation payload' }
  }

  await requirePlatformAdmin()

  const authClient = await createClient()
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  const supabase = createServiceClient()

  // STRICT WHERE CLAUSE: Ensure ID is provided via .eq()
  const { error } = await supabase
    .from('organisations')
    .update({ is_suspended: true } as never)
    .eq('id', result.data.organisationId)

  if (error) throw new Error(error.message)

  // Secondary Platform Action Log (High Severity Mutation)
  await supabase.from('platform_actions').insert({
    action_type: 'suspension',
    target_org_id: result.data.organisationId,
    severity: 'level_5',
    reason: 'Manual suspension via Admin Console',
    created_by: user.id
  })

  await logAction({
    organisation_id: result.data.organisationId,
    user_id: user.id,
    action: 'ORG_SUSPENDED',
    resource_table: 'organisations',
    resource_id: result.data.organisationId,
  })

  revalidatePath('/admin/organisations')
  revalidatePath(`/admin/organisations/${result.data.organisationId}`)
  return { success: true }
}

export const reactivateOrganisation = async (input: z.infer<typeof OrgActionSchema>) => {
  const result = OrgActionSchema.safeParse(input)
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || 'Invalid organisation payload' }
  }

  await requirePlatformAdmin()

  const authClient = await createClient()
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  const supabase = createServiceClient()

  // STRICT WHERE CLAUSE: Ensure ID is provided via .eq()
  const { error } = await supabase
    .from('organisations')
    .update({ is_suspended: false } as never)
    .eq('id', result.data.organisationId)

  if (error) throw new Error(error.message)

  // Secondary Platform Action Log (Resolution)
  await supabase.from('platform_actions').insert({
    action_type: 'resolve_appeal',
    target_org_id: result.data.organisationId,
    reason: 'Manual reactivation via Admin Console',
    created_by: user.id
  })

  await logAction({
    organisation_id: result.data.organisationId,
    user_id: user.id,
    action: 'ORG_REACTIVATED',
    resource_table: 'organisations',
    resource_id: result.data.organisationId,
  })

  revalidatePath('/admin/organisations')
  revalidatePath(`/admin/organisations/${result.data.organisationId}`)
  return { success: true }
}
