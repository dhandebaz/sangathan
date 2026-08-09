'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const createChandaRoundSchema = z.object({
  month: z.string().min(1, 'Month is required'),
  year: z.string().min(1, 'Year is required'),
  amount_per_house: z.number().positive('Amount must be positive'),
  purpose: z.string().min(1, 'Purpose is required'),
})

export const createChandaRound = createSafeAction(
  createChandaRoundSchema,
  async (data, context) => {
    const supabase = await createClient()
    const organisationId = context.organizationId
    
    // 1. Create a billing plan representing this Chanda Round
    const planName = `${data.purpose} Chanda - ${data.month} ${data.year}`
    const { data: plan, error: planError } = await supabase
      .from('billing_plans')
      .insert({
        organisation_id: organisationId,
        name: planName,
        amount: data.amount_per_house,
        currency: 'INR',
        frequency: 'one_time'
      })
      .select()
      .single()

    if (planError || !plan) throw new Error(planError?.message || 'Failed to create round')

    // 2. Get all active members for this organisation
    const { data: members, error: membersError } = await supabase
      .from('profiles')
      .select('id')
      .eq('organisation_id', organisationId)
      .eq('status', 'active')
      
    if (membersError) throw new Error(membersError.message)
    if (!members || members.length === 0) return { success: true, count: 0, plan }

    // 3. Generate dues for all active members
    // We prefix notes with [CHANDA] to identify these dues if needed later
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 15) // Default due date 15 days from now

    const duesToInsert = members.map(m => ({
      organisation_id: organisationId,
      member_profile_id: m.id,
      plan_id: plan.id,
      amount: plan.amount,
      due_date: dueDate.toISOString().split('T')[0],
      notes: `[CHANDA] ${data.purpose} collection`,
      status: 'pending' as const
    }))

    const { error: insertError } = await supabase
      .from('membership_dues')
      .insert(duesToInsert)
      
    if (insertError) throw new Error(insertError.message)
    
    revalidatePath('/[lang]/dashboard/chanda', 'page')
    return { success: true, count: duesToInsert.length, plan }
  }
)

const markChandaCashPaidSchema = z.object({
  due_id: z.string().uuid('Invalid due ID'),
  collector_name: z.string().optional(),
})

export const markChandaCashPaid = createSafeAction(
  markChandaCashPaidSchema,
  async (data, context) => {
    const supabase = await createClient()
    const organisationId = context.organizationId
    
    const notesPrefix = '[CHANDA] Payment: Cash'
    const finalNotes = data.collector_name 
      ? `${notesPrefix} | Collected by: ${data.collector_name}` 
      : notesPrefix

    const { error } = await supabase
      .from('membership_dues')
      .update({ 
        status: 'paid',
        notes: finalNotes 
      })
      .eq('id', data.due_id)
      .eq('organisation_id', organisationId)

    if (error) throw new Error(error.message)
    
    revalidatePath('/[lang]/dashboard/chanda', 'page')
    return { success: true }
  }
)
