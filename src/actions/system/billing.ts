'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logAction } from '@/lib/audit/log'
import { requirePlatformAdmin } from '@/lib/auth/context'

const UpdatePlanSchema = z.object({
  organisationId: z.string().uuid(),
  planName: z.string().min(1),
})

export async function setOrganisationPlan(input: z.infer<typeof UpdatePlanSchema>) {
  const result = UpdatePlanSchema.safeParse(input)
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || 'Invalid input' }
  }

  await requirePlatformAdmin()

  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const supabase = createServiceClient()

  const { error } = await supabase
    .from('organisations')
    .update({ plan_name: result.data.planName })
    .eq('id', result.data.organisationId)

  if (error) return { success: false, error: error.message }

  await logAction({
    organisation_id: result.data.organisationId,
    user_id: user.id,
    action: 'ORG_PLAN_CHANGED',
    resource_table: 'organisations',
    resource_id: result.data.organisationId,
    details: { plan: result.data.planName },
  })

  revalidatePath('/admin/billing', 'page')
  return { success: true }
}

export async function getAllBillingPlans() {
  await requirePlatformAdmin()
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('billing_plans')
    .select('*, organisations(name, slug)')
    .order('created_at', { ascending: false })
    .limit(100)
  return data || []
}

export async function getOrganisationBilling(organisationId: string) {
  await requirePlatformAdmin()
  const supabase = createServiceClient()
  const { data: plans } = await supabase
    .from('billing_plans')
    .select('*')
    .eq('organisation_id', organisationId)
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*, units(unit_number)')
    .eq('organisation_id', organisationId)
    .order('created_at', { ascending: false })
    .limit(50)
  return { plans: plans || [], invoices: invoices || [] }
}
