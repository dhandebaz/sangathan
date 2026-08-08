'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { z } from 'zod'

const CanvassSchema = z.object({
  hostelBlock: z.string().min(2, "Hostel/Block required"),
  cadreLead: z.string().min(2, "Cadre lead required"),
  floorsCovered: z.string().optional(),
  studentResponses: z.string().optional(),
})

const ClassCampaignSchema = z.object({
  department: z.string().min(2, "Department required"),
  courseYear: z.string().min(2, "Course & Year required"),
  scheduledTime: z.string(),
})

const PosterSpotSchema = z.object({
  spotLocation: z.string().min(2, "Spot location required"),
  posterType: z.enum(['handmade_chart', 'handmade_banner', 'cloth_flag']),
})

export async function logH2HCanvassingAction(input: z.infer<typeof CanvassSchema>) {
  try {
    const result = CanvassSchema.safeParse(input)
    if (!result.success) return { success: false, error: result.error.issues[0].message }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const orgId = await getSelectedOrganisationId()
    if (!orgId) return { success: false, error: 'Organisation not found' }

    const adminClient = createServiceClient()
    const { data, error } = await adminClient
      .from('tasks')
      .insert({
        organisation_id: orgId,
        created_by: user.id,
        title: `[H2H CANVASSING] ${result.data.hostelBlock}`,
        description: `Hostel: ${result.data.hostelBlock}\nLead: ${result.data.cadreLead}\nFloors: ${result.data.floorsCovered || 'All'}\nNotes: ${result.data.studentResponses || 'Completed'}`,
        priority: 'medium',
        status: 'completed'
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/[lang]/dashboard/campus-campaigning', 'page')
    return { success: true, data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to log H2H drive'
    return { success: false, error: message }
  }
}

export async function scheduleC2CClassAction(input: z.infer<typeof ClassCampaignSchema>) {
  try {
    const result = ClassCampaignSchema.safeParse(input)
    if (!result.success) return { success: false, error: result.error.issues[0].message }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const orgId = await getSelectedOrganisationId()
    if (!orgId) return { success: false, error: 'Organisation not found' }

    const adminClient = createServiceClient()
    const { data, error } = await adminClient
      .from('events')
      .insert({
        organisation_id: orgId,
        created_by: user.id,
        title: `[C2C CLASS CAMPAIGN] ${result.data.department} (${result.data.courseYear})`,
        description: `Class Campaign intervention planned for ${result.data.department}`,
        start_time: result.data.scheduledTime,
        event_type: 'campaign'
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/[lang]/dashboard/campus-campaigning', 'page')
    return { success: true, data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to schedule C2C campaign'
    return { success: false, error: message }
  }
}

export async function getCampaigningLogs(organisationId: string) {
  try {
    const supabase = await createClient()
    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('organisation_id', organisationId)
      .ilike('title', '[H2H CANVASSING]%')
      .order('created_at', { ascending: false })

    const { data: events } = await supabase
      .from('events')
      .select('*')
      .eq('organisation_id', organisationId)
      .ilike('title', '[C2C CLASS CAMPAIGN]%')
      .order('start_time', { ascending: false })

    return { success: true, tasks: tasks || [], events: events || [] }
  } catch {
    return { success: false, tasks: [], events: [] }
  }
}
