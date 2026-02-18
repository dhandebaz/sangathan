'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/service'
import { logAction } from '@/lib/audit/log'
import { requirePlatformAdmin } from '@/lib/auth/context'

const OrgActionSchema = z.object({
  organisationId: z.string().uuid(),
})

// --- Actions ---

export const suspendOrganisation = async (input: z.infer<typeof OrgActionSchema>) => {
  const { user } = await requirePlatformAdmin()
  const supabase = createServiceClient()

  // 1. Update Org Status
  const { error } = await supabase
    .from('organisations')
    .update({ is_suspended: true } as never)
    .eq('id', input.organisationId)

  if (error) throw new Error(error.message)

  // 2. Log Action
  await logAction({
    organisation_id: input.organisationId,
    user_id: user.id,
    action: 'ORG_SUSPENDED',
    resource_table: 'organisations',
    resource_id: input.organisationId
  })

  revalidatePath('/admin/organisations')
  revalidatePath(`/admin/organisations/${input.organisationId}`)
  return { success: true }
}

export const reactivateOrganisation = async (input: z.infer<typeof OrgActionSchema>) => {
  const { user } = await requirePlatformAdmin()
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('organisations')
    .update({ is_suspended: false } as never)
    .eq('id', input.organisationId)

  if (error) throw new Error(error.message)

  await logAction({
    organisation_id: input.organisationId,
    user_id: user.id,
    action: 'ORG_REACTIVATED',
    resource_table: 'organisations',
    resource_id: input.organisationId
  })

  revalidatePath('/admin/organisations')
  revalidatePath(`/admin/organisations/${input.organisationId}`)
  return { success: true }
}
