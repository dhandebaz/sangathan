'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { logAction } from '@/lib/audit/log'

// --- Schemas ---

const CreateSubscriptionSchema = z.object({
  utr: z.string().min(6, "UTR/Reference number must be at least 6 characters")
})

const ToggleBrandingSchema = z.object({
  removeBranding: z.boolean(),
})

// --- Actions ---

export const createSubscription = createSafeAction(
  CreateSubscriptionSchema,
  async (input, context) => {
    const supabase = await createClient()

    type SubscriptionStatusRow = {
      id: string
      status: string
    }

    const { data: existing } = (await supabase
      .from('supporter_subscriptions')
      .select('id, status')
      .eq('organisation_id', context.organizationId)
      .in('status', ['active', 'created'])
      .maybeSingle()) as { data: SubscriptionStatusRow | null }

    if (existing && existing.status === 'active') {
      throw new Error('Subscription is already active.')
    }

    // Create Pending Manual Subscription
    const subId = `manual_upi_${context.organizationId}_${Date.now()}`

    const { error } = await supabase
      .from('supporter_subscriptions')
      .insert({
        organisation_id: context.organizationId,
        subscription_id: input.utr,
        plan_id: 'manual_upi',
        status: 'pending',
        amount: 99.0,
      } as never)

    if (error) throw new Error(error.message)

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'SUBSCRIPTION_INITIATED',
      resource_table: 'supporter_subscriptions',
      resource_id: subId
    })

    return { subscriptionId: subId, shortUrl: null }
  },
  { allowedRoles: ['admin'] }
)

export const toggleBranding = createSafeAction(
  ToggleBrandingSchema,
  async (input, context) => {
    const supabase = await createClient()

    type ActiveSubscriptionRow = {
      status: string
    }

    const { data: sub } = (await supabase
      .from('supporter_subscriptions')
      .select('status')
      .eq('organisation_id', context.organizationId)
      .eq('status', 'active')
      .maybeSingle()) as { data: ActiveSubscriptionRow | null }

    if (!sub) {
      throw new Error('Active Supporter Subscription required to remove branding.')
    }

    const { error } = await supabase
      .from('organisations')
      .update({ remove_branding: input.removeBranding } as never)
      .eq('id', context.organizationId)

    if (error) throw new Error(error.message)

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'BRANDING_TOGGLED',
      resource_table: 'organisations',
      resource_id: context.organizationId,
      details: { remove_branding: input.removeBranding }
    })

    revalidatePath('/dashboard/supporter')
    return { success: true }
  },
  { allowedRoles: ['admin'] }
)
