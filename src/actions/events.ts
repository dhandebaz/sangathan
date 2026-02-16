'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// --- Schemas ---

const EventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 chars"),
  description: z.string().optional(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime().optional(),
  location: z.string().optional(),
  event_type: z.enum(['public', 'members', 'volunteer', 'core', 'executive']),
  rsvp_enabled: z.boolean(),
  capacity: z.number().optional(),
})

const CreateEventSchema = EventSchema.extend({
  organisation_id: z.string().uuid(),
  collaborating_org_ids: z.array(z.string().uuid()).optional(),
})

const UpdateEventSchema = EventSchema.partial().extend({
  id: z.string().uuid(),
})

const RSVPSchema = z.object({
  event_id: z.string().uuid(),
  guest_name: z.string().optional(),
  guest_email: z.string().email().optional(),
})

const CheckInSchema = z.object({
  event_id: z.string().uuid(),
  token: z.string(), // Signed token containing user_id/rsvp_id
})

// --- Actions ---

export async function createEvent(input: z.infer<typeof CreateEventSchema>) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Unauthorized' }

    // Check permissions
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role, organisation_id')
      .eq('id', user.id)
      .single()

    const profile = profileData

    if (!profile || profile.organisation_id !== input.organisation_id || !['admin', 'editor'].includes(profile.role)) {
      return { success: false, error: 'Permission denied' }
    }

    // Verify collaborations if any
    if (input.collaborating_org_ids && input.collaborating_org_ids.length > 0) {
      const { count } = await supabase
        .from('organisation_links')
        .select('*', { count: 'exact', head: true })
        .or(`and(requester_org_id.eq.${profile.organisation_id},responder_org_id.in.(${input.collaborating_org_ids.join(',')})),and(requester_org_id.in.(${input.collaborating_org_ids.join(',')}),responder_org_id.eq.${profile.organisation_id})`)
        .eq('status', 'active')

      if ((count || 0) < input.collaborating_org_ids.length) {
        return { success: false, error: 'One or more selected organizations are not active partners.' }
      }
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert({
        organisation_id: input.organisation_id,
        title: input.title,
        description: input.description,
        start_time: input.start_time,
        end_time: input.end_time,
        location: input.location,
        event_type: input.event_type as 'public' | 'private' | 'member_only',
        rsvp_enabled: input.rsvp_enabled,
        capacity: input.capacity,
        created_by: user.id,
      })
      .select()
      .single()

    if (error || !event) throw error || new Error('Failed to create event')

    // Insert Joint Events
    if (input.collaborating_org_ids && input.collaborating_org_ids.length > 0) {
      const jointEvents = input.collaborating_org_ids.map((orgId) => ({
        event_id: event.id,
        organisation_id: orgId,
      }))

      const { error: jointError } = await supabase
        .from('joint_events')
        .insert(jointEvents)

      if (jointError) console.error('Joint Event Error:', jointError)
    }

    revalidatePath('/dashboard/events')
    return { success: true }
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'An unexpected error occurred' }
  }
}

export async function rsvpToEvent(input: z.infer<typeof RSVPSchema>) {
  try {
    const supabase = await createClient()
    const supabaseAdmin = createServiceClient() // Use admin for public inserts/checks if needed

    // 1. Get Event Details
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('id', input.event_id)
      .single()

    if (eventError || !event) return { success: false, error: 'Event not found' }

    if (!event.rsvp_enabled) return { success: false, error: 'RSVP is not enabled for this event' }

    // Check Capacity
    if (event.capacity) {
      const { count } = await supabaseAdmin
        .from('event_rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', input.event_id)
        .eq('status', 'registered')

      if ((count || 0) >= event.capacity) {
        return { success: false, error: 'Event is full' }
      }
    }

    // 2. Determine User
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id
    const guestName = input.guest_name
    const guestEmail = input.guest_email

    // 3. Check Permissions based on Event Type
    if (event.event_type !== 'public') {
      if (!userId) return { success: false, error: 'Login required for this event' }

      // Check Profile Role
      // Fetch profile AND check if their org is allowed
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role, status, organisation_id')
        .eq('id', userId)
        .single()

      if (!profile || profile.status !== 'active') {
        return { success: false, error: 'You must be an active member to join' }
      }

      let isAllowedOrg = profile.organisation_id === event.organisation_id

      // Check joint events if not primary org
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

      const roleHierarchy = { 'viewer': 0, 'member': 1, 'general': 1, 'volunteer': 2, 'core': 3, 'executive': 4, 'editor': 5, 'admin': 6 }
      const requiredRole = event.event_type // 'members', 'volunteer', 'core', 'executive'

      const userLevel = roleHierarchy[profile.role as keyof typeof roleHierarchy] || 0
      const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 1 // default to member level

      if (requiredRole !== 'members' && userLevel < requiredLevel) {
        return { success: false, error: `This event is restricted to ${requiredRole} members.` }
      }
    } else {
      // Public Event
      if (!userId && (!guestEmail || !guestName)) {
        return { success: false, error: 'Name and Email are required for guests' }
      }
    }

    // 4. Create RSVP
    // Check existing
    if (userId) {
      const { data: existing } = await supabaseAdmin
        .from('event_rsvps')
        .select('id')
        .eq('event_id', input.event_id)
        .eq('user_id', userId)
        .single()

      if (existing) return { success: false, error: 'Already registered' }
    } else if (input.guest_email) {
      const { data: existing } = await supabaseAdmin
        .from('event_rsvps')
        .select('id')
        .eq('event_id', input.event_id)
        .eq('guest_email', input.guest_email)
        .single()

      if (existing) return { success: false, error: 'Email already registered' }
    }

    const { error: insertError } = await supabaseAdmin
      .from('event_rsvps')
      .insert({
        event_id: input.event_id,
        user_id: userId || null,
        guest_name: userId ? null : input.guest_name,
        guest_email: userId ? null : input.guest_email,
        status: 'registered'
      })

    if (insertError) throw insertError

    revalidatePath(`/events/${input.event_id}`)
    return { success: true }

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}

// Helper to sign QR data
import { createHmac } from 'crypto'

export async function generateQRData(eventId: string, userId?: string, rsvpId?: string) {
  const secret = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'fallback-secret'
  const payload = JSON.stringify({ e: eventId, u: userId, r: rsvpId, t: Date.now() })
  const signature = createHmac('sha256', secret).update(payload).digest('hex')
  return `${payload}.${signature}`
}

export async function verifyAndCheckIn(input: { qrData: string, scannedByUserId: string }) {
  try {
    const [payloadStr, signature] = input.qrData.split('.')
    if (!payloadStr || !signature) return { success: false, error: 'Invalid QR Format' }

    // Verify Signature
    const secret = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'fallback-secret'
    const expectedSig = createHmac('sha256', secret).update(payloadStr).digest('hex')

    if (signature !== expectedSig) return { success: false, error: 'Invalid Signature' }

    const payload = JSON.parse(payloadStr)
    const { e: eventId, u: userId, r: rsvpId } = payload

    const supabaseAdmin = createServiceClient()

    // Find RSVP
    let query = supabaseAdmin.from('event_rsvps').select('id, status').eq('event_id', eventId)
    if (userId) query = query.eq('user_id', userId)
    else if (rsvpId) query = query.eq('id', rsvpId)
    else return { success: false, error: 'Invalid Token Data' }

    const { data: rsvp, error } = await query.single()

    if (error || !rsvp) return { success: false, error: 'RSVP not found' }

    if (rsvp.status === 'attended') return { success: false, error: 'Already checked in' }
    if (rsvp.status === 'cancelled') return { success: false, error: 'RSVP was cancelled' }

    // Mark Attended
    await supabaseAdmin
      .from('event_rsvps')
      .update({ status: 'attended', checked_in_at: new Date().toISOString() })
      .eq('id', rsvp.id)

    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}
