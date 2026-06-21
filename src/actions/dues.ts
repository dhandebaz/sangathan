'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const createBillingPlanSchema = z.object({
  name: z.string().min(1, 'Plan name is required'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('INR'),
  frequency: z.enum(['monthly', 'quarterly', 'annual', 'one_time']).default('monthly'),
})

export const createBillingPlan = createSafeAction(
  createBillingPlanSchema,
  async (data, context) => {
    const supabase = await createClient();
    const organisationId = context.organizationId;
    const profileId = context.user.id;
    const { data: plan, error } = await supabase
      .from('billing_plans')
      .insert({
        organisation_id: organisationId,
        ...data,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    
    revalidatePath('/[lang]/dashboard/dues', 'page')
    return { success: true, plan }
  }
)

const generateDuesSchema = z.object({
  plan_id: z.string().uuid('Invalid plan ID'),
  due_date: z.string(), // YYYY-MM-DD
  notes: z.string().optional(),
})

export const generateDuesForMembers = createSafeAction(
  generateDuesSchema,
  async (data, context) => {
    const supabase = await createClient();
    const organisationId = context.organizationId;
    const profileId = context.user.id;
    // 1. Get the plan to get the amount
    const { data: plan, error: planError } = await supabase
      .from('billing_plans')
      .select('amount')
      .eq('id', data.plan_id)
      .eq('organisation_id', organisationId)
      .single()
      
    if (planError || !plan) throw new Error('Billing plan not found')

    // 2. Get all active members for this organisation
    const { data: members, error: membersError } = await supabase
      .from('profiles')
      .select('id')
      .eq('organisation_id', organisationId)
      .eq('status', 'active')
      
    if (membersError) throw new Error(membersError.message)
    if (!members || members.length === 0) throw new Error('No active members found to bill')

    // 3. Generate dues
    const duesToInsert = members.map(m => ({
      organisation_id: organisationId,
      member_profile_id: m.id,
      plan_id: data.plan_id,
      amount: plan.amount,
      due_date: data.due_date,
      notes: data.notes,
      status: 'pending' as const
    }))

    const { error: insertError } = await supabase
      .from('membership_dues')
      .insert(duesToInsert)
      
    if (insertError) throw new Error(insertError.message)
    
    revalidatePath('/[lang]/dashboard/dues', 'page')
    return { success: true, count: duesToInsert.length }
  }
)

const markDuePaidSchema = z.object({
  due_id: z.string().uuid(),
  transaction_id: z.string().optional(),
})

export const markDueAsPaid = createSafeAction(
  markDuePaidSchema,
  async (data, context) => {
    const supabase = await createClient();
    const organisationId = context.organizationId;
    const profileId = context.user.id;
    const { error } = await supabase
      .from('membership_dues')
      .update({ status: 'paid', transaction_id: data.transaction_id })
      .eq('id', data.due_id)
      .eq('organisation_id', organisationId)

    if (error) throw new Error(error.message)
    
    revalidatePath('/[lang]/dashboard/dues', 'page')
    return { success: true }
  }
)
