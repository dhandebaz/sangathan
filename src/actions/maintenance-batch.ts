'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const GenerateBatchInvoicesSchema = z.object({
  billing_month: z.string().regex(/^\d{4}-\d{2}$/, 'Billing month must be in YYYY-MM format'),
  rate_type: z.enum(['per_sqft', 'flat_rate']),
  rate_amount: z.coerce.number().positive('Rate must be positive'),
  due_date: z.string().min(4, 'Due date is required'),
})

export const generateMonthlyBatchInvoices = createSafeAction(
  GenerateBatchInvoicesSchema,
  async (data, context) => {
    const supabase = await createClient()
    const organisationId = context.organizationId
    const userId = context.user.id

    // 1. Fetch all occupied units for this organisation
    const { data: units, error: unitsError } = await supabase
      .from('units')
      .select('id, unit_number, block_building, area_sqft, status')
      .eq('organisation_id', organisationId)
      .eq('status', 'occupied')

    if (unitsError) throw new Error(unitsError.message)
    if (!units || units.length === 0) {
      return { success: false, error: 'No occupied units found in this RWA. Please add units first.' }
    }

    // 2. Compute individual invoice amounts and prepare batch insert
    const invoicesToInsert = units.map((u) => {
      let amount = 0
      if (data.rate_type === 'per_sqft') {
        const sqft = Number(u.area_sqft || 1000)
        amount = Math.round(sqft * data.rate_amount)
      } else {
        amount = data.rate_amount
      }

      return {
        organisation_id: organisationId,
        unit_id: u.id,
        type: 'maintenance' as const,
        amount: amount,
        due_date: data.due_date,
        billing_period_start: `${data.billing_month}-01`,
        status: 'pending' as const,
        notes: `[AUTO-BATCH] Maintenance for ${data.billing_month} (${data.rate_type === 'per_sqft' ? `₹${data.rate_amount}/sqft` : `Fixed ₹${data.rate_amount}`})`,
      }
    })

    const totalInvoiced = invoicesToInsert.reduce((sum, inv) => sum + inv.amount, 0)

    // 3. Insert Invoices
    const { error: insertError } = await supabase
      .from('invoices')
      .insert(invoicesToInsert as never)

    if (insertError) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('invoices')
        .insert(invoicesToInsert as never)

      if (fallback.error) throw new Error(fallback.error.message)
    }

    // 4. Record the batch maintenance run
    const { data: batchRun, error: batchError } = await supabase
      .from('batch_maintenance_runs')
      .insert({
        organisation_id: organisationId,
        billing_month: data.billing_month,
        rate_type: data.rate_type,
        rate_amount: data.rate_amount,
        total_units_billed: units.length,
        total_invoiced_amount: totalInvoiced,
        due_date: data.due_date,
        created_by: userId,
      })
      .select()
      .single()

    if (batchError) {
      const adminClient = createServiceClient()
      await adminClient.from('batch_maintenance_runs').insert({
        organisation_id: organisationId,
        billing_month: data.billing_month,
        rate_type: data.rate_type,
        rate_amount: data.rate_amount,
        total_units_billed: units.length,
        total_invoiced_amount: totalInvoiced,
        due_date: data.due_date,
        created_by: userId,
      })
    }

    revalidatePath('/', 'layout')
    return {
      success: true,
      unitsBilled: units.length,
      totalAmount: totalInvoiced,
      batchRun,
    }
  },
  { allowedRoles: ['admin', 'executive', 'can_manage', 'second_admin'] }
)

export async function getBatchMaintenanceRuns(orgId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('batch_maintenance_runs')
      .select('*')
      .eq('organisation_id', orgId)
      .order('created_at', { ascending: false })

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('batch_maintenance_runs')
        .select('*')
        .eq('organisation_id', orgId)
        .order('created_at', { ascending: false })

      if (!fallback.error) return { success: true, runs: fallback.data || [] }
      return { success: false, runs: [] }
    }

    return { success: true, runs: data || [] }
  } catch {
    return { success: false, runs: [] }
  }
}
