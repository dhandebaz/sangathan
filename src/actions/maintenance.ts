'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { logAction } from '@/lib/audit/log'

// --- Schemas ---

const CreateUnitSchema = z.object({
  unit_number: z.string().min(1),
  block_building: z.string().optional(),
  area_sqft: z.coerce.number().positive().optional(),
  status: z.enum(['occupied', 'vacant', 'under_construction']).default('occupied'),
  owner_profile_id: z.string().uuid().optional(),
  tenant_profile_id: z.string().uuid().optional(),
})

const CreateInvoiceSchema = z.object({
  unit_id: z.string().uuid(),
  type: z.enum(['maintenance', 'special_levy', 'penalty']),
  amount: z.coerce.number().positive(),
  billing_period_start: z.string().date().optional(),
  billing_period_end: z.string().date().optional(),
  due_date: z.string().date(),
  notes: z.string().optional(),
})

const UpdateInvoiceStatusSchema = z.object({
  invoice_id: z.string().uuid(),
  status: z.enum(['draft', 'pending', 'paid', 'partially_paid', 'overdue', 'cancelled']),
  transaction_id: z.string().uuid().optional(),
})

// --- Actions ---

export const createUnit = createSafeAction(
  CreateUnitSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { data: unit, error } = await supabase
      .from('units')
      .insert({
        organisation_id: context.organizationId,
        unit_number: input.unit_number,
        block_building: input.block_building,
        area_sqft: input.area_sqft,
        status: input.status,
        owner_profile_id: input.owner_profile_id,
        tenant_profile_id: input.tenant_profile_id,
      } as never)
      .select('id')
      .single()

    if (error || !unit) {
      if (error?.code === '23505') {
        return { error: 'A unit with this number already exists in this block.' }
      }
      logger.error('unit_create', 'Failed to create unit', { error: error?.message })
      return { error: 'Failed to create unit' }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'UNIT_CREATED',
      resource_table: 'units',
      resource_id: unit.id,
      details: { unit_number: input.unit_number }
    })

    revalidatePath('/', 'layout')
    return { success: true, unitId: unit.id }
  },
  { allowedRoles: ['admin', 'editor'] }
)

export const createInvoice = createSafeAction(
  CreateInvoiceSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert({
        organisation_id: context.organizationId,
        unit_id: input.unit_id,
        type: input.type,
        amount: input.amount,
        billing_period_start: input.billing_period_start,
        billing_period_end: input.billing_period_end,
        due_date: input.due_date,
        notes: input.notes,
        status: 'pending',
      } as never)
      .select('id')
      .single()

    if (error || !invoice) {
      logger.error('invoice_create', 'Failed to create invoice', { error: error?.message })
      return { error: 'Failed to create invoice' }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'INVOICE_CREATED',
      resource_table: 'invoices',
      resource_id: invoice.id,
      details: { amount: input.amount, unit_id: input.unit_id }
    })

    revalidatePath('/', 'layout')
    return { success: true, invoiceId: invoice.id }
  },
  { allowedRoles: ['admin', 'editor', 'executive'] }
)

export const updateInvoiceStatus = createSafeAction(
  UpdateInvoiceStatusSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from('invoices')
      .update({
        status: input.status,
        transaction_id: input.transaction_id,
      } as never)
      .eq('id', input.invoice_id)
      .eq('organisation_id', context.organizationId)

    if (error) {
      logger.error('invoice_update', 'Failed to update invoice status', { error: error.message })
      return { error: 'Failed to update invoice status' }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'INVOICE_UPDATED',
      resource_table: 'invoices',
      resource_id: input.invoice_id,
      details: { status: input.status }
    })

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { allowedRoles: ['admin', 'editor', 'executive'] }
)
