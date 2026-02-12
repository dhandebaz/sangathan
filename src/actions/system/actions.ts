import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/service'
import { createClient } from '@/lib/supabase/server'
import { logAction } from '@/lib/audit/log'

// --- Middleware/Auth Helper for System Admin ---
async function checkSuperAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) throw new Error('Unauthorized')
  
  const superAdmins = process.env.SUPER_ADMIN_EMAILS?.split(',') || []
  if (!superAdmins.includes(user.email)) throw new Error('Unauthorized: System Admin only')
  
  return user
}

// --- Schemas ---

const OrgActionSchema = z.object({
  organisationId: z.string().uuid(),
})

// --- Actions ---

export const suspendOrganisation = async (input: z.infer<typeof OrgActionSchema>) => {
  const user = await checkSuperAdmin()
  const supabase = createServiceClient()

  // 1. Update Org Status
  // Assuming we added `is_suspended` column. If not, we need to add it to schema.
  // I will assume it exists or I will try to update it.
  const { error } = await supabase
    .from('organisations')
    .update({ is_suspended: true })
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
  const user = await checkSuperAdmin()
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('organisations')
    .update({ is_suspended: false })
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
