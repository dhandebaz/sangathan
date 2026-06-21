'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const createFacilitySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  capacity: z.number().optional(),
  hourly_rate: z.number().optional(),
})

export const createFacility = createSafeAction(
  'create_facility',
  createFacilitySchema,
  async (data, { supabase, organisationId }) => {
    const { error } = await supabase
      .from('facilities')
      .insert({
        organisation_id: organisationId,
        ...data,
      })

    if (error) throw new Error(error.message)
    revalidatePath('/[lang]/dashboard/facilities', 'page')
    return { success: true }
  }
)

const bookFacilitySchema = z.object({
  facility_id: z.string().uuid(),
  start_time: z.string(),
  end_time: z.string(),
  notes: z.string().optional(),
})

export const bookFacility = createSafeAction(
  'book_facility',
  bookFacilitySchema,
  async (data, { supabase, organisationId, profileId }) => {
    // Check for conflicting bookings
    const { data: conflicts } = await supabase
      .from('facility_bookings')
      .select('id')
      .eq('facility_id', data.facility_id)
      .neq('status', 'rejected')
      .neq('status', 'cancelled')
      .or(`and(start_time.lte.${data.end_time},end_time.gte.${data.start_time})`)

    if (conflicts && conflicts.length > 0) {
      throw new Error('This facility is already booked during the selected time.')
    }

    const { error } = await supabase
      .from('facility_bookings')
      .insert({
        organisation_id: organisationId,
        facility_id: data.facility_id,
        profile_id: profileId,
        start_time: new Date(data.start_time).toISOString(),
        end_time: new Date(data.end_time).toISOString(),
        notes: data.notes,
        status: 'pending' // Admin needs to approve
      })

    if (error) throw new Error(error.message)
    revalidatePath('/[lang]/dashboard/facilities', 'page')
    return { success: true }
  }
)

const updateBookingStatusSchema = z.object({
  booking_id: z.string().uuid(),
  status: z.enum(['approved', 'rejected', 'cancelled'])
})

export const updateBookingStatus = createSafeAction(
  'update_booking_status',
  updateBookingStatusSchema,
  async (data, { supabase, organisationId }) => {
    const { error } = await supabase
      .from('facility_bookings')
      .update({ status: data.status })
      .eq('id', data.booking_id)
      .eq('organisation_id', organisationId)

    if (error) throw new Error(error.message)
    revalidatePath('/[lang]/dashboard/facilities', 'page')
    return { success: true }
  }
)
