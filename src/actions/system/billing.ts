'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logAction } from '@/lib/audit/log'
import { requirePlatformAdmin } from '@/lib/auth/context'

const UpdatePlanSchema = z.object({
  organisationId: z.string().uuid(),
  planName: z.enum(['Community', 'Metered', 'Institution']),
  planPeriod: z.enum(['monthly', 'yearly', 'lifetime']).optional(),
})

export async function setOrganisationPlan(input: z.infer<typeof UpdatePlanSchema>) {
  try {
    const result = UpdatePlanSchema.safeParse(input)
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || 'Invalid input' }
    }

    await requirePlatformAdmin()

    const authClient = await createClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const supabase = createServiceClient()

    // Fetch current capabilities
    const { data: org } = await supabase
      .from('organisations')
      .select('capabilities')
      .eq('id', result.data.organisationId)
      .maybeSingle()

    const currentCaps = (org?.capabilities as Record<string, boolean>) || {}
    const isPayingTier = result.data.planName === 'Institution' || result.data.planName === 'Metered'

    const updatedCapabilities = {
      ...currentCaps,
      ai_features: isPayingTier,
      advanced_analytics: isPayingTier,
    }

    const updates: Record<string, unknown> = {
      plan_name: result.data.planName,
      plan_status: 'active',
      capabilities: updatedCapabilities,
    }
    if (result.data.planPeriod) {
      updates.plan_period = result.data.planPeriod
    }

    const { error } = await supabase
      .from('organisations')
      .update(updates as never)
      .eq('id', result.data.organisationId)

    if (error) return { success: false, error: error.message }

    await logAction({
      organisation_id: result.data.organisationId,
      user_id: user.id,
      action: 'ORG_PLAN_CHANGED',
      resource_table: 'organisations',
      resource_id: result.data.organisationId,
      details: {
        plan: result.data.planName,
        capabilities: updatedCapabilities,
      },
    })

    revalidatePath('/admin/billing', 'page')
    return { success: true }
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update plan' }
  }
}

export async function getAllBillingTransactions() {
  try {
    await requirePlatformAdmin()
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('billing_transactions')
      .select('*, organisations(name, slug)')
      .order('created_at', { ascending: false })
      .limit(100)
    return data || []
  } catch {
    return []
  }
}

export async function getAllOrganisationsPlanOverview() {
  try {
    await requirePlatformAdmin()
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('organisations')
      .select('id, name, slug, org_type, plan_name, plan_period, plan_status, plan_expires_at, whitelabel_enabled, created_at')
      .order('created_at', { ascending: false })
    return data || []
  } catch {
    return []
  }
}

