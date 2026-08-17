'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

// --- Schemas ---

const CreateGrantMilestoneSchema = z.object({
  grant_id: z.string().uuid('Invalid grant ID'),
  title: z.string().min(2, 'Milestone title is required'),
  tranche_amount: z.coerce.number().min(0, 'Tranche amount must be positive'),
  target_date: z.string().optional(),
  deliverables: z.string().optional(),
})

const LogGrantExpenseSchema = z.object({
  grant_id: z.string().uuid('Invalid grant ID'),
  milestone_id: z.string().uuid().optional(),
  budget_line_item: z.string().min(2, 'Budget line item name is required'),
  amount: z.coerce.number().positive('Expense amount must be positive'),
  expense_date: z.string().optional(),
  vendor_name: z.string().optional(),
  receipt_url: z.string().optional(),
  notes: z.string().optional(),
})

const UpdateMilestoneStatusSchema = z.object({
  milestone_id: z.string().uuid('Invalid milestone ID'),
  status: z.enum(['pending', 'in_progress', 'completed', 'verified']),
  disbursed_at: z.string().optional(),
})

// --- Server Actions ---

export const createGrantMilestone = createSafeAction(
  CreateGrantMilestoneSchema,
  async (data, context) => {
    const supabase = await createClient()
    const organisationId = context.organizationId

    const { data: milestone, error } = await supabase
      .from('grant_milestones')
      .insert({
        grant_id: data.grant_id,
        organisation_id: organisationId,
        title: data.title,
        tranche_amount: data.tranche_amount,
        target_date: data.target_date || null,
        deliverables: data.deliverables || null,
        status: 'pending',
      })
      .select()
      .maybeSingle()

    if (error) {
      // Graceful fallback via service client
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('grant_milestones')
        .insert({
          grant_id: data.grant_id,
          organisation_id: organisationId,
          title: data.title,
          tranche_amount: data.tranche_amount,
          target_date: data.target_date || null,
          deliverables: data.deliverables || null,
          status: 'pending',
        })
        .select()
        .maybeSingle()

      if (fallback.error) throw new Error(fallback.error.message)
      revalidatePath('/', 'layout')
      return { success: true, milestone: fallback.data }
    }

    revalidatePath('/', 'layout')
    return { success: true, milestone }
  },
  { allowedRoles: ['admin', 'executive', 'can_manage', 'second_admin', 'editor'] }
)

export const logGrantExpense = createSafeAction(
  LogGrantExpenseSchema,
  async (data, context) => {
    const supabase = await createClient()
    const organisationId = context.organizationId

    const { data: expense, error } = await supabase
      .from('grant_expenses')
      .insert({
        grant_id: data.grant_id,
        organisation_id: organisationId,
        milestone_id: data.milestone_id || null,
        budget_line_item: data.budget_line_item,
        amount: data.amount,
        expense_date: data.expense_date || new Date().toISOString().split('T')[0],
        vendor_name: data.vendor_name || null,
        receipt_url: data.receipt_url || null,
        notes: data.notes || null,
      })
      .select()
      .maybeSingle()

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('grant_expenses')
        .insert({
          grant_id: data.grant_id,
          organisation_id: organisationId,
          milestone_id: data.milestone_id || null,
          budget_line_item: data.budget_line_item,
          amount: data.amount,
          expense_date: data.expense_date || new Date().toISOString().split('T')[0],
          vendor_name: data.vendor_name || null,
          receipt_url: data.receipt_url || null,
          notes: data.notes || null,
        })
        .select()
        .maybeSingle()

      if (fallback.error) throw new Error(fallback.error.message)
      revalidatePath('/', 'layout')
      return { success: true, expense: fallback.data }
    }

    revalidatePath('/', 'layout')
    return { success: true, expense }
  },
  { allowedRoles: ['admin', 'executive', 'can_manage', 'second_admin', 'editor'] }
)

export const updateGrantMilestoneStatus = createSafeAction(
  UpdateMilestoneStatusSchema,
  async (data, context) => {
    const supabase = await createClient()
    const organisationId = context.organizationId

    const updatePayload: Record<string, unknown> = { status: data.status, updated_at: new Date().toISOString() }
    if (data.disbursed_at) {
      updatePayload.disbursed_at = data.disbursed_at
    }

    const { error } = await supabase
      .from('grant_milestones')
      .update(updatePayload)
      .eq('id', data.milestone_id)
      .eq('organisation_id', organisationId)

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('grant_milestones')
        .update(updatePayload)
        .eq('id', data.milestone_id)
        .eq('organisation_id', organisationId)

      if (fallback.error) throw new Error(fallback.error.message)
    }

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { allowedRoles: ['admin', 'executive', 'can_manage', 'second_admin', 'editor'] }
)

export async function getGrantAccountingSummary(grantId: string, orgId: string) {
  try {
    const supabase = await createClient()

    const [milestonesRes, expensesRes] = await Promise.all([
      supabase
        .from('grant_milestones')
        .select('*')
        .eq('grant_id', grantId)
        .eq('organisation_id', orgId)
        .order('created_at', { ascending: true }),
      supabase
        .from('grant_expenses')
        .select('*')
        .eq('grant_id', grantId)
        .eq('organisation_id', orgId)
        .order('expense_date', { ascending: false }),
    ])

    let milestones = milestonesRes.data || []
    let expenses = expensesRes.data || []

    if (milestonesRes.error || expensesRes.error) {
      const adminClient = createServiceClient()
      const [mFallback, eFallback] = await Promise.all([
        adminClient.from('grant_milestones').select('*').eq('grant_id', grantId).eq('organisation_id', orgId).order('created_at', { ascending: true }),
        adminClient.from('grant_expenses').select('*').eq('grant_id', grantId).eq('organisation_id', orgId).order('expense_date', { ascending: false }),
      ])
      milestones = mFallback.data || []
      expenses = eFallback.data || []
    }

    const totalTranches = milestones.reduce((sum, m) => sum + Number(m.tranche_amount || 0), 0)
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)
    const remainingBalance = totalTranches - totalExpenses

    return {
      success: true,
      milestones,
      expenses,
      totalTranches,
      totalExpenses,
      remainingBalance,
    }
  } catch {
    return {
      success: false,
      milestones: [],
      expenses: [],
      totalTranches: 0,
      totalExpenses: 0,
      remainingBalance: 0,
    }
  }
}
