'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { logAction } from '@/lib/audit/log'

export const AssignTicketSchema = z.object({
  ticketId: z.string().uuid(),
  assigneeId: z.string().uuid().nullable(),
})

export const SetTicketSLASchema = z.object({
  ticketId: z.string().uuid(),
  dueAt: z.string().datetime().nullable(),
})

export const assignTicket = createSafeAction(
  AssignTicketSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from('tickets')
      .update({ assigned_to: input.assigneeId, updated_at: new Date().toISOString() })
      .eq('id', input.ticketId)
      .eq('organisation_id', context.organizationId)

    if (error) return { error: error.message }

    revalidatePath('/', 'layout')

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'TICKET_ASSIGNED',
      resource_table: 'tickets',
      resource_id: input.ticketId,
      details: { assigned_to: input.assigneeId }
    })

    return { success: true }
  },
  { allowedRoles: ['admin', 'editor'], actionName: 'assignTicket' }
)

export const setTicketSLA = createSafeAction(
  SetTicketSLASchema,
  async (input, context) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from('tickets')
      .update({ sla_due_at: input.dueAt, updated_at: new Date().toISOString() })
      .eq('id', input.ticketId)
      .eq('organisation_id', context.organizationId)

    if (error) return { error: error.message }

    revalidatePath('/', 'layout')

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'TICKET_SLA_SET',
      resource_table: 'tickets',
      resource_id: input.ticketId,
      details: { sla_due_at: input.dueAt }
    })

    return { success: true }
  },
  { allowedRoles: ['admin', 'editor'], actionName: 'setTicketSLA' }
)
