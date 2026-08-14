'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const MessRatingSchema = z.object({
  hostelName: z.string().min(2, "Hostel name is required"),
  mealType: z.enum(['breakfast', 'lunch', 'snacks', 'dinner']),
  rating: z.coerce.number().min(1).max(5),
  comments: z.string().optional(),
  photoUrl: z.string().optional(),
})

const HostelAllotmentSchema = z.object({
  hostelName: z.string().min(2),
  studentName: z.string().min(2),
  rollNumber: z.string().min(2),
  issueType: z.enum(['delayed_allotment', 'illegal_occupancy', 'sanitation_failure', 'water_electricity']),
  description: z.string().min(5),
})

export const submitMessRatingAction = createSafeAction(
  MessRatingSchema,
  async (input, context) => {
    const supabase = await createClient()
    const orgId = context.organizationId
    const userId = context.user.id

    // 1. Insert into dedicated hostel_mess_audits table
    const { data: audit, error: auditError } = await supabase
      .from('hostel_mess_audits')
      .insert({
        organisation_id: orgId,
        hostel_name: input.hostelName,
        inspection_type: 'mess_quality',
        meal_type: input.mealType,
        rating: input.rating,
        remarks: input.comments || null,
        photo_url: input.photoUrl || null,
        status: input.rating <= 2 ? 'escalated_to_warden' : 'open',
        created_by: userId,
      })
      .select()
      .single()

    if (!auditError && audit) {
      revalidatePath('/[lang]/dashboard/hostel-mess', 'page')
      return { success: true, data: audit }
    }

    // 2. Fallback to tickets table
    const adminClient = createServiceClient()
    const { data, error } = await adminClient
      .from('tickets')
      .insert({
        organisation_id: orgId,
        created_by: userId,
        title: `[MESS RATING] ${input.hostelName} - ${input.mealType} (${input.rating}/5★)`,
        description: `Hostel: ${input.hostelName}\nMeal: ${input.mealType}\nRating: ${input.rating}/5\nComments: ${input.comments || 'None'}`,
        status: 'open',
        priority: input.rating <= 2 ? 'high' : 'medium',
        type: 'grievance'
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    revalidatePath('/[lang]/dashboard/hostel-mess', 'page')
    return { success: true, data }
  }
)

export const reportHostelIssueAction = createSafeAction(
  HostelAllotmentSchema,
  async (input, context) => {
    const supabase = await createClient()
    const orgId = context.organizationId
    const userId = context.user.id

    // 1. Insert into hostel_mess_audits
    const { data: audit, error: auditError } = await supabase
      .from('hostel_mess_audits')
      .insert({
        organisation_id: orgId,
        hostel_name: input.hostelName,
        inspection_type: 'room_allotment',
        student_name: input.studentName,
        roll_number: input.rollNumber,
        remarks: `[${input.issueType}] ${input.description}`,
        status: 'open',
        created_by: userId,
      })
      .select()
      .single()

    if (!auditError && audit) {
      revalidatePath('/[lang]/dashboard/hostel-mess', 'page')
      return { success: true, data: audit }
    }

    // 2. Fallback to tickets
    const adminClient = createServiceClient()
    const { data, error } = await adminClient
      .from('tickets')
      .insert({
        organisation_id: orgId,
        created_by: userId,
        title: `[HOSTEL ISSUE] ${input.hostelName} - ${input.issueType.replace('_', ' ').toUpperCase()}`,
        description: `Student: ${input.studentName} (${input.rollNumber})\nHostel: ${input.hostelName}\nIssue: ${input.issueType}\n\nDetails:\n${input.description}`,
        status: 'open',
        priority: 'high',
        type: 'grievance'
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    revalidatePath('/[lang]/dashboard/hostel-mess', 'page')
    return { success: true, data }
  }
)

export async function getHostelMessLogs(organisationId: string) {
  try {
    const supabase = await createClient()

    // Try fetching from dedicated audits table first
    const { data: audits, error: auditError } = await supabase
      .from('hostel_mess_audits')
      .select('*')
      .eq('organisation_id', organisationId)
      .order('created_at', { ascending: false })

    if (!auditError && audits && audits.length > 0) {
      return { success: true, logs: audits }
    }

    // Fallback to tickets table
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('organisation_id', organisationId)
      .or('title.ilike.[MESS RATING]%,title.ilike.[HOSTEL ISSUE]%')
      .order('created_at', { ascending: false })

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('tickets')
        .select('*')
        .eq('organisation_id', organisationId)
        .or('title.ilike.[MESS RATING]%,title.ilike.[HOSTEL ISSUE]%')
        .order('created_at', { ascending: false })

      if (!fallback.error) return { success: true, logs: fallback.data || [] }
      return { success: false, logs: [] }
    }

    return { success: true, logs: data || [] }
  } catch {
    return { success: false, logs: [] }
  }
}
