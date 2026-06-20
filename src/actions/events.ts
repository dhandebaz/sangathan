'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { createHmac } from 'crypto'
import { z } from 'zod'
import { EventSchema, RSVPSchema, getQrSigningSecret } from './events.shared'

const CreateEventSchema = EventSchema.extend({
  collaborating_org_ids: z.array(z.string().uuid()).optional(),
})

const UpdateEventSchema = EventSchema.extend({
  id: z.string().uuid(),
  collaborating_org_ids: z.array(z.string().uuid()).optional(),
})

const CheckInSchema = z.object({
  qrData: z.string(),
})

// --- Create Event ---

export const createEvent = createSafeAction(
  CreateEventSchema,
  async (input, context) => {
    const supabase = await createClient()

    if (input.collaborating_org_ids?.length) {
      const { count } = await supabase
        .from('organisation_links')
        .select('*', { count: 'exact', head: true })
        .or(
          `and(requester_org_id.eq.${context.organizationId},responder_org_id.in.(${input.collaborating_org_ids.join(',')})),and(requester_org_id.in.(${input.collaborating_org_ids.join(',')}),responder_org_id.eq.${context.organizationId})`,
        )
        .eq('status', 'active')

      if ((count || 0) < input.collaborating_org_ids.length) {
        return { error: 'One or more selected organizations are not active partners.' }
      }
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert({
        organisation_id: context.organizationId,
        title: input.title,
        description: input.description,
        start_time: input.start_time,
        end_time: input.end_time,
        location: input.location,
        event_type: input.event_type,
        rsvp_enabled: input.rsvp_enabled,
        capacity: input.capacity,
        created_by: context.user.id,
      })
      .select()
      .single()

    if (error || !event) {
      return { error: error?.message || 'Failed to create event' }
    }

    if (input.collaborating_org_ids?.length) {
      const jointEvents = input.collaborating_org_ids.map((orgId) => ({
        event_id: event.id,
        organisation_id: orgId,
      }))
      await supabase.from('joint_events').insert(jointEvents)
    }

    await context.logAction({
      action: 'EVENT_CREATED',
      resourceTable: 'events',
      resourceId: event.id,
      details: { title: input.title },
    })

    revalidatePath('/', 'layout')
    return { success: true, eventId: event.id }
  },
  { allowedRoles: ['admin', 'editor'], actionName: 'create_event' },
)

// --- Update Event ---

export const updateEvent = createSafeAction(
  UpdateEventSchema,
  async (input, context) => {
    const supabase = await createClient()

    if (input.collaborating_org_ids?.length) {
      const { count } = await supabase
        .from('organisation_links')
        .select('*', { count: 'exact', head: true })
        .or(
          `and(requester_org_id.eq.${context.organizationId},responder_org_id.in.(${input.collaborating_org_ids.join(',')})),and(requester_org_id.in.(${input.collaborating_org_ids.join(',')}),responder_org_id.eq.${context.organizationId})`,
        )
        .eq('status', 'active')

      if ((count || 0) < input.collaborating_org_ids.length) {
        return { error: 'One or more selected organizations are not active partners.' }
      }
    }

    const { error } = await supabase
      .from('events')
      .update({
        title: input.title,
        description: input.description,
        start_time: input.start_time,
        end_time: input.end_time,
        location: input.location,
        event_type: input.event_type,
        rsvp_enabled: input.rsvp_enabled,
        capacity: input.capacity,
      })
      .eq('id', input.id)
      .eq('organisation_id', context.organizationId)

    if (error) {
      return { error: error.message || 'Failed to update event' }
    }

    await supabase.from('joint_events').delete().eq('event_id', input.id)

    if (input.collaborating_org_ids?.length) {
      const jointEvents = input.collaborating_org_ids.map((orgId) => ({
        event_id: input.id,
        organisation_id: orgId,
      }))
      await supabase.from('joint_events').insert(jointEvents)
    }

    await context.logAction({
      action: 'EVENT_UPDATED',
      resourceTable: 'events',
      resourceId: input.id,
      details: { title: input.title },
    })

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { allowedRoles: ['admin', 'editor'], actionName: 'update_event' },
)

// --- RSVP (hybrid: public + authenticated) ---

export async function rsvpToEvent(input: z.infer<typeof RSVPSchema>) {
  try {
    const result = RSVPSchema.safeParse(input)
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || 'Invalid RSVP data' }
    }

    const data = result.data
    const supabase = await createClient()
    const supabaseAdmin = createServiceClient()

    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('id', data.event_id)
      .single()

    if (eventError || !event) return { success: false, error: 'Event not found' }
    if (!event.rsvp_enabled) return { success: false, error: 'RSVP is not enabled for this event' }

    if (event.capacity) {
      const { count } = await supabaseAdmin
        .from('event_rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', data.event_id)
        .eq('status', 'registered')

      if ((count || 0) >= event.capacity) {
        return { success: false, error: 'Event is full' }
      }
    }

    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id

    if (event.event_type !== 'public') {
      if (!userId) return { success: false, error: 'Login required for this event' }

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role, status, organisation_id')
        .eq('id', userId)
        .single()

      if (!profile || profile.status !== 'active') {
        return { success: false, error: 'You must be an active member to join' }
      }

      let isAllowedOrg = profile.organisation_id === event.organisation_id

      if (!isAllowedOrg) {
        const { data: joint } = await supabaseAdmin
          .from('joint_events')
          .select('id')
          .eq('event_id', event.id)
          .eq('organisation_id', profile.organisation_id)
          .single()

        if (joint) isAllowedOrg = true
      }

      if (!isAllowedOrg) {
        return { success: false, error: 'You are not a member of the hosting or collaborating organisations.' }
      }

      const roleHierarchy = { viewer: 0, member: 1, general: 1, volunteer: 2, core: 3, executive: 4, editor: 5, admin: 6 } as const
      const requiredRole = event.event_type
      const userLevel = roleHierarchy[profile.role as keyof typeof roleHierarchy] || 0
      const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 1

      if (requiredRole !== 'members' && userLevel < requiredLevel) {
        return { success: false, error: `This event is restricted to ${requiredRole} members.` }
      }
    } else {
      if (!userId && (!data.guest_email || !data.guest_name)) {
        return { success: false, error: 'Name and Email are required for guests' }
      }
    }

    if (userId) {
      const { data: existing } = await supabaseAdmin
        .from('event_rsvps')
        .select('id')
        .eq('event_id', data.event_id)
        .eq('user_id', userId)
        .single()

      if (existing) return { success: false, error: 'Already registered' }
    } else if (data.guest_email) {
      const { data: existing } = await supabaseAdmin
        .from('event_rsvps')
        .select('id')
        .eq('event_id', data.event_id)
        .eq('guest_email', data.guest_email)
        .single()

      if (existing) return { success: false, error: 'Email already registered' }
    }

    const { error: insertError } = await supabaseAdmin
      .from('event_rsvps')
      .insert({
        event_id: data.event_id,
        user_id: userId || null,
        guest_name: userId ? null : data.guest_name,
        guest_email: userId ? null : data.guest_email,
        status: 'registered',
      })

    if (insertError) throw insertError

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}

// --- QR Utilities ---

export async function generateQRData(eventId: string, userId?: string, rsvpId?: string) {
  const secret = getQrSigningSecret()
  const payload = JSON.stringify({ e: eventId, u: userId, r: rsvpId, t: Date.now() })
  const signature = createHmac('sha256', secret).update(payload).digest('hex')
  return `${payload}.${signature}`
}

export const verifyAndCheckIn = createSafeAction(
  CheckInSchema,
  async (input, context) => {
    const [payloadStr, signature] = input.qrData.split('.')
    if (!payloadStr || !signature) return { error: 'Invalid QR Format' }

    const secret = getQrSigningSecret()
    const expectedSig = createHmac('sha256', secret).update(payloadStr).digest('hex')
    if (signature !== expectedSig) return { error: 'Invalid Signature' }

    const payload = JSON.parse(payloadStr)
    const { e: eventId, u: userId, r: rsvpId } = payload

    const supabaseAdmin = createServiceClient()

    const { data: event } = await supabaseAdmin
      .from('events')
      .select('organisation_id')
      .eq('id', eventId)
      .single()

    if (!event || event.organisation_id !== context.organizationId) {
      return { error: 'You are not allowed to check in attendees for this event' }
    }

    let query = supabaseAdmin.from('event_rsvps').select('id, status').eq('event_id', eventId)
    if (userId) query = query.eq('user_id', userId)
    else if (rsvpId) query = query.eq('id', rsvpId)
    else return { error: 'Invalid Token Data' }

    const { data: rsvp, error } = await query.single()

    if (error || !rsvp) return { error: 'RSVP not found' }
    if (rsvp.status === 'attended') return { error: 'Already checked in' }
    if (rsvp.status === 'cancelled') return { error: 'RSVP was cancelled' }

    await supabaseAdmin
      .from('event_rsvps')
      .update({ status: 'attended', checked_in_at: new Date().toISOString() })
      .eq('id', rsvp.id)

    await context.logAction({
      action: 'EVENT_CHECK_IN',
      resourceTable: 'event_rsvps',
      resourceId: rsvp.id,
      details: { eventId },
    })

    return { success: true }
  },
  { allowedRoles: ['admin', 'editor', 'executive'], actionName: 'event_check_in' },
)
