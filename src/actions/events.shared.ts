import { createHmac } from 'crypto'
import { z } from 'zod'

export const EventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 chars'),
  description: z.string().optional(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime().optional(),
  location: z.string().optional(),
  event_type: z.enum(['public', 'members', 'volunteer', 'core', 'executive']),
  rsvp_enabled: z.boolean(),
  capacity: z.number().optional(),
})

export const CreateEventSchema = EventSchema.extend({
  organisation_id: z.string().uuid(),
  collaborating_org_ids: z.array(z.string().uuid()).optional(),
})

export const UpdateEventSchema = EventSchema.extend({
  id: z.string().uuid(),
  organisation_id: z.string().uuid(),
  collaborating_org_ids: z.array(z.string().uuid()).optional(),
})

export const RSVPSchema = z.object({
  event_id: z.string().uuid(),
  guest_name: z.string().optional(),
  guest_email: z.string().email().optional(),
})

export function getQrSigningSecret() {
  const secret = process.env.QR_TOKEN_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!secret) {
    throw new Error('QR token signing secret is not configured')
  }

  return secret
}
