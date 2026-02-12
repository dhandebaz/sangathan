import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { razorpay } from '@/lib/razorpay'
import { logAction } from '@/lib/audit/log'

// --- Schemas ---

const CreateSubscriptionSchema = z.object({}) // No input needed, fixed plan

const ToggleBrandingSchema = z.object({
  removeBranding: z.boolean(),
})

// --- Actions ---

export const createSubscription = createSafeAction(
  CreateSubscriptionSchema,
  async (input, context) => {
    const supabase = await createClient()

    // 1. Check if already active
    const { data: existing } = await supabase
      .from('supporter_subscriptions')
      .select('id, status')
      .eq('organisation_id', context.organizationId)
      .in('status', ['active', 'created'])
      .maybeSingle()

    if (existing && existing.status === 'active') {
      throw new Error('Subscription is already active.')
    }

    // 2. Create Razorpay Subscription
    // Plan ID should be in Env or Config. Hardcoding a placeholder for now or using ENV.
    const planId = process.env.RAZORPAY_PLAN_ID
    if (!planId) throw new Error('Subscription Plan ID not configured.')

    const sub = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: 120, // 10 years max
      quantity: 1,
      customer_notify: 1,
      notes: {
        organisation_id: context.organizationId,
        user_id: context.user.id
      }
    })

    // 3. Store in DB (Status: created)
    const { error } = await supabase
      .from('supporter_subscriptions')
      .insert({
        organisation_id: context.organizationId,
        razorpay_subscription_id: sub.id,
        razorpay_plan_id: sub.plan_id,
        status: 'created',
        amount: 99.00 // Fixed amount for now
      })

    if (error) throw new Error(error.message)

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'SUBSCRIPTION_INITIATED',
      resource_table: 'supporter_subscriptions',
      resource_id: sub.id
    })

    return { subscriptionId: sub.id, shortUrl: sub.short_url }
  },
  { allowedRoles: ['admin'] }
)

export const toggleBranding = createSafeAction(
  ToggleBrandingSchema,
  async (input, context) => {
    const supabase = await createClient()

    // 1. Verify Active Subscription
    const { data: sub } = await supabase
      .from('supporter_subscriptions')
      .select('status')
      .eq('organisation_id', context.organizationId)
      .eq('status', 'active')
      .maybeSingle()

    if (!sub) {
      throw new Error('Active Supporter Subscription required to remove branding.')
    }

    // 2. Update Organisation
    const { error } = await supabase
      .from('organisations')
      .update({ remove_branding: input.removeBranding })
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
