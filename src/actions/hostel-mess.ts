'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { z } from 'zod'

const MessRatingSchema = z.object({
  hostelName: z.string().min(2, "Hostel name is required"),
  mealType: z.enum(['breakfast', 'lunch', 'snacks', 'dinner']),
  rating: z.number().min(1).max(5),
  comments: z.string().optional(),
})

const HostelAllotmentSchema = z.object({
  hostelName: z.string().min(2),
  studentName: z.string().min(2),
  rollNumber: z.string().min(2),
  issueType: z.enum(['delayed_allotment', 'illegal_occupancy', 'sanitation_failure', 'water_electricity']),
  description: z.string().min(5),
})

export async function submitMessRatingAction(input: z.infer<typeof MessRatingSchema>) {
  try {
    const result = MessRatingSchema.safeParse(input)
    if (!result.success) return { success: false, error: result.error.issues[0].message }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const orgId = await getSelectedOrganisationId()
    if (!orgId) return { success: false, error: 'Organisation not found' }

    // Save mess rating as ticket/audit row in Supabase
    const { data, error } = await supabase
      .from('tickets')
      .insert({
        organisation_id: orgId,
        created_by: user.id,
        title: `[MESS RATING] ${result.data.hostelName} - ${result.data.mealType} (${result.data.rating}/5★)`,
        description: `Hostel: ${result.data.hostelName}\nMeal: ${result.data.mealType}\nRating: ${result.data.rating}/5\nComments: ${result.data.comments || 'None'}`,
        status: 'open',
        priority: result.data.rating <= 2 ? 'high' : 'medium',
        type: 'grievance'
      })
      .select()
      .single()

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('tickets')
        .insert({
          organisation_id: orgId,
          created_by: user.id,
          title: `[MESS RATING] ${result.data.hostelName} - ${result.data.mealType} (${result.data.rating}/5★)`,
          description: `Hostel: ${result.data.hostelName}\nMeal: ${result.data.mealType}\nRating: ${result.data.rating}/5\nComments: ${result.data.comments || 'None'}`,
          status: 'open',
          priority: result.data.rating <= 2 ? 'high' : 'medium',
          type: 'grievance'
        })
        .select()
        .single()

      if (fallback.error) throw fallback.error
    }

    revalidatePath('/[lang]/dashboard/hostel-mess', 'page')
    return { success: true, data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to submit rating'
    return { success: false, error: message }
  }
}

export async function reportHostelIssueAction(input: z.infer<typeof HostelAllotmentSchema>) {
  try {
    const result = HostelAllotmentSchema.safeParse(input)
    if (!result.success) return { success: false, error: result.error.issues[0].message }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const orgId = await getSelectedOrganisationId()
    if (!orgId) return { success: false, error: 'Organisation not found' }

    const { data, error } = await supabase
      .from('tickets')
      .insert({
        organisation_id: orgId,
        created_by: user.id,
        title: `[HOSTEL ISSUE] ${result.data.hostelName} - ${result.data.issueType.replace('_', ' ').toUpperCase()}`,
        description: `Student: ${result.data.studentName} (${result.data.rollNumber})\nHostel: ${result.data.hostelName}\nIssue: ${result.data.issueType}\n\nDetails:\n${result.data.description}`,
        status: 'open',
        priority: 'high',
        type: 'grievance'
      })
      .select()
      .single()

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('tickets')
        .insert({
          organisation_id: orgId,
          created_by: user.id,
          title: `[HOSTEL ISSUE] ${result.data.hostelName} - ${result.data.issueType.replace('_', ' ').toUpperCase()}`,
          description: `Student: ${result.data.studentName} (${result.data.rollNumber})\nHostel: ${result.data.hostelName}\nIssue: ${result.data.issueType}\n\nDetails:\n${result.data.description}`,
          status: 'open',
          priority: 'high',
          type: 'grievance'
        })
        .select()
        .single()

      if (fallback.error) throw fallback.error
    }

    revalidatePath('/[lang]/dashboard/hostel-mess', 'page')
    return { success: true, data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to submit hostel issue'
    return { success: false, error: message }
  }
}

export async function getHostelMessLogs(organisationId: string) {
  try {
    const supabase = await createClient()
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
