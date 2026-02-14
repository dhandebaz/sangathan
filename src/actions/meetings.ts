'use server'

import { createClient } from '@/lib/supabase/server'
import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { logAction } from '@/lib/audit/log'

// --- Schemas ---

const CreateMeetingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 chars"),
  description: z.string().optional(),
  date: z.string().datetime(),
  location: z.string().optional(),
  attendee_ids: z.array(z.string().uuid()).optional(),
})

const MarkAttendanceSchema = z.object({
  meetingId: z.string().uuid(),
  memberId: z.string().uuid(),
  status: z.enum(['present', 'absent', 'excused'])
})

const DeleteMeetingSchema = z.object({
  meetingId: z.string().uuid()
})

// --- Actions ---

export const createMeeting = createSafeAction(
  CreateMeetingSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { data: meeting, error } = await supabase
      .from('meetings')
      .insert({
        organisation_id: context.organizationId,
        title: input.title,
        description: input.description,
        date: input.date,
        location: input.location,
        created_by: context.user.id
      } as any)
      .select('id')
      .single()

    if (error) throw new Error(error.message)

    // Bulk insert attendees
    if (input.attendee_ids && input.attendee_ids.length > 0) {
      const attendees = input.attendee_ids.map(id => ({
        meeting_id: meeting.id,
        member_id: id,
        status: 'absent' // Default
      }))

      const { error: attError } = await supabase
        .from('meeting_attendance')
        .insert(attendees)
      
      if (attError) console.error('Attendance Insert Error:', attError)
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'MEETING_CREATED',
      resource_table: 'meetings',
      resource_id: meeting.id,
      details: { title: input.title }
    })

    revalidatePath('/dashboard/meetings')
    return { meetingId: meeting.id }
  },
  { allowedRoles: ['admin', 'editor'] }
)

export const markAttendance = createSafeAction(
  MarkAttendanceSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from('meeting_attendance')
      .upsert({
        meeting_id: input.meetingId,
        member_id: input.memberId,
        status: input.status
      } as any, { onConflict: 'meeting_id, member_id' })

    if (error) throw new Error(error.message)

    revalidatePath(`/dashboard/meetings/${input.meetingId}`)
    return { success: true }
  },
  { allowedRoles: ['admin', 'editor'] }
)

export const deleteMeeting = createSafeAction(
  DeleteMeetingSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', input.meetingId)
      .eq('organisation_id', context.organizationId)

    if (error) throw new Error(error.message)

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'MEETING_DELETED',
      resource_table: 'meetings',
      resource_id: input.meetingId,
      details: {}
    })

    revalidatePath('/dashboard/meetings')
    return { success: true }
  },
  { allowedRoles: ['admin'] }
)
