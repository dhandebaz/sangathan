'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { logAction } from '@/lib/audit/log'

// --- Schemas ---

const PreApproveVisitorSchema = z.object({
  visitor_name: z.string().min(2),
  purpose: z.string().optional(),
  expected_arrival: z.string().datetime(),
  unit_number: z.string().optional(),
})

const CheckInVisitorSchema = z.object({
  visitor_id: z.string().uuid(),
})

const CheckOutVisitorSchema = z.object({
  visitor_id: z.string().uuid(),
})

// --- Actions ---

export const preApproveVisitor = createSafeAction(
  PreApproveVisitorSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { data: visitor, error } = await supabase
      .from('visitors')
      .insert({
        organisation_id: context.organizationId,
        host_profile_id: context.user.id,
        visitor_name: input.visitor_name,
        purpose: input.purpose,
        expected_arrival: input.expected_arrival,
        status: 'expected',
        metadata: input.unit_number ? { unit_number: input.unit_number } : {}
      } as never)
      .select('id')
      .single()

    if (error || !visitor) {
      logger.error('visitor_preapprove', 'Failed to pre-approve visitor', { error: error?.message })
      return { error: 'Failed to pre-approve visitor' }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'VISITOR_PRE_APPROVED',
      resource_table: 'visitors',
      resource_id: visitor.id,
      details: { visitor_name: input.visitor_name }
    })

    revalidatePath('/', 'layout')
    return { success: true, visitorId: visitor.id }
  },
  // Members can pre-approve their own visitors
  { allowedRoles: ['admin', 'editor', 'executive', 'member'] }
)

export const checkInVisitor = createSafeAction(
  CheckInVisitorSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from('visitors')
      .update({
        status: 'checked_in',
        actual_arrival: new Date().toISOString()
      } as never)
      .eq('id', input.visitor_id)
      .eq('organisation_id', context.organizationId)

    if (error) {
      logger.error('visitor_checkin', 'Failed to check-in visitor', { error: error.message })
      return { error: 'Failed to check-in visitor' }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'VISITOR_CHECKED_IN',
      resource_table: 'visitors',
      resource_id: input.visitor_id
    })

    revalidatePath('/', 'layout')
    return { success: true }
  },
  // Guards/Editors/Admins
  { allowedRoles: ['admin', 'editor', 'executive'] } 
)

export const checkOutVisitor = createSafeAction(
  CheckOutVisitorSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from('visitors')
      .update({
        status: 'checked_out',
        actual_departure: new Date().toISOString()
      } as never)
      .eq('id', input.visitor_id)
      .eq('organisation_id', context.organizationId)

    if (error) {
      logger.error('visitor_checkout', 'Failed to check-out visitor', { error: error.message })
      return { error: 'Failed to check-out visitor' }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'VISITOR_CHECKED_OUT',
      resource_table: 'visitors',
      resource_id: input.visitor_id
    })

    revalidatePath('/', 'layout')
    return { success: true }
  },
  // Guards/Editors/Admins
  { allowedRoles: ['admin', 'editor', 'executive'] } 
)
