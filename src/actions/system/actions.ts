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

  const { error } = await supabase
    .from('organisations')
    .update({ is_suspended: true } as never)
    .eq('id', input.organisationId)

  if (error) throw new Error(error.message)

  await logAction({
    organisation_id: input.organisationId,
    user_id: user.id,
    action: 'ORG_SUSPENDED',
    resource_table: 'organisations',
    resource_id: input.organisationId,
  })

  revalidatePath('/admin/organisations')
  revalidatePath(`/admin/organisations/${input.organisationId}`)
  return { success: true }
}

export const reactivateOrganisation = async (input: z.infer<typeof OrgActionSchema>) => {
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
    resource_id: input.organisationId,
  })

  revalidatePath('/admin/organisations')
  revalidatePath(`/admin/organisations/${input.organisationId}`)
  return { success: true }
}
