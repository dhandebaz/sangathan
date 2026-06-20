'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { logAction } from '@/lib/audit/log'
import { triageTicketContent } from '@/actions/ai/triage'

// --- Schemas ---

export const CreateTicketSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.enum(['grievance', 'complaint', 'maintenance', 'ai_activation']),
  priority: z.enum(['low', 'medium', 'high']).optional(), // Optional since triage can determine it
})

export const UpdateTicketSchema = z.object({
  ticketId: z.string().uuid("Invalid ticket ID"),
  status: z.enum(['open', 'in_progress', 'resolved']),
})

export const DeleteTicketSchema = z.object({
  ticketId: z.string().uuid("Invalid ticket ID"),
})

// --- Actions ---

export const createTicket = createSafeAction(
  CreateTicketSchema,
  async (input, context) => {
    const supabase = await createClient()

    // Triage ticket content to get tags and severity
    const triageResult = await triageTicketContent(input.description, context.organizationId)
    const finalPriority = input.priority || triageResult.severity

    const { data, error } = await supabase
      .from('tickets')
      .insert({
        organisation_id: context.organizationId,
        created_by: context.user.id,
        title: input.title,
        description: input.description,
        type: input.type,
        priority: finalPriority,
        status: 'open',
        tags: triageResult.tags, // Save AI/fallback tags
      })
      .select('id')
      .single()

    if (error || !data) {
      logger.error('ticket_create', 'Failed to create ticket', { error: error?.message })
      return { error: 'Failed to create ticket' }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'TICKET_CREATED',
      resource_table: 'tickets',
      resource_id: data.id,
      details: { title: input.title, type: input.type }
    })

    if (input.type === 'complaint') {
      revalidatePath('/', 'layout')
    } else if (input.type === 'grievance') {
      revalidatePath('/', 'layout')
    } else if (input.type === 'maintenance') {
      revalidatePath('/', 'layout')
    } else if (input.type === 'ai_activation') {
      revalidatePath('/', 'layout')
    }

    return { success: true, ticketId: data.id }
  },
  { actionName: 'createTicket' }
)

export const updateTicketStatus = createSafeAction(
  UpdateTicketSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { data: ticket } = await supabase
      .from('tickets')
      .select('type')
      .eq('id', input.ticketId)
      .single()

    const { error } = await supabase
      .from('tickets')
      .update({ status: input.status })
      .eq('id', input.ticketId)
      .eq('organisation_id', context.organizationId)

    if (error) {
      logger.error('ticket_update', 'Failed to update ticket', { error: error.message })
      return { error: 'Failed to update ticket' }
    }

    if (ticket) {
      if (ticket.type === 'complaint') {
        revalidatePath('/', 'layout')
      } else if (ticket.type === 'grievance') {
        revalidatePath('/', 'layout')
      } else if (ticket.type === 'maintenance') {
        revalidatePath('/', 'layout')
      }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'TICKET_STATUS_UPDATED',
      resource_table: 'tickets',
      resource_id: input.ticketId,
      details: { status: input.status }
    })

    return { success: true }
  },
  { allowedRoles: ['admin', 'editor'], actionName: 'updateTicketStatus' }
)

export const deleteTicket = createSafeAction(
  DeleteTicketSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { data: ticket } = await supabase
      .from('tickets')
      .select('type')
      .eq('id', input.ticketId)
      .single()

    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', input.ticketId)
      .eq('organisation_id', context.organizationId)

    if (error) {
      logger.error('ticket_delete', 'Failed to delete ticket', { error: error.message })
      return { error: 'Failed to delete ticket' }
    }

    if (ticket) {
      if (ticket.type === 'complaint') {
        revalidatePath('/', 'layout')
      } else if (ticket.type === 'grievance') {
        revalidatePath('/', 'layout')
      } else if (ticket.type === 'maintenance') {
        revalidatePath('/', 'layout')
      }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'TICKET_DELETED',
      resource_table: 'tickets',
      resource_id: input.ticketId
    })

    return { success: true }
  },
  { allowedRoles: ['admin', 'editor'], actionName: 'deleteTicket' }
)
