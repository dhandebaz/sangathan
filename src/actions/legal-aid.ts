'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { z } from 'zod'

const SosSchema = z.object({
  studentName: z.string().min(2, "Student name required"),
  location: z.string().min(2, "Location required"),
  detentionReason: z.string().optional(),
  contactPhone: z.string().min(8, "Contact phone required"),
})

const AntiRaggingSchema = z.object({
  hostelOrDept: z.string().min(2, "Hostel or Department required"),
  incidentDetails: z.string().min(10, "Details required"),
  isAnonymous: z.boolean().default(true),
})

export async function triggerLegalSosAction(input: z.infer<typeof SosSchema>) {
  try {
    const result = SosSchema.safeParse(input)
    if (!result.success) return { success: false, error: result.error.issues[0].message }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const orgId = await getSelectedOrganisationId()
    if (!orgId) return { success: false, error: 'Organisation not found' }

    const adminClient = createServiceClient()
    const { data, error } = await adminClient
      .from('tickets')
      .insert({
        organisation_id: orgId,
        created_by: user.id,
        title: `[EMERGENCY DETENTION SOS] ${result.data.studentName} at ${result.data.location}`,
        description: `Student: ${result.data.studentName}\nPhone: ${result.data.contactPhone}\nLocation: ${result.data.location}\nDetails:\n${result.data.detentionReason || 'Detained during protest'}`,
        status: 'open',
        priority: 'high',
        type: 'grievance'
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/[lang]/dashboard/legal-aid', 'page')
    return { success: true, data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to trigger SOS'
    return { success: false, error: message }
  }
}

export async function submitAntiRaggingAction(input: z.infer<typeof AntiRaggingSchema>) {
  try {
    const result = AntiRaggingSchema.safeParse(input)
    if (!result.success) return { success: false, error: result.error.issues[0].message }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const orgId = await getSelectedOrganisationId()
    if (!orgId) return { success: false, error: 'Organisation not found' }

    const adminClient = createServiceClient()
    const { data, error } = await adminClient
      .from('tickets')
      .insert({
        organisation_id: orgId,
        created_by: user.id,
        title: `[UGC ANTI-RAGGING COMPLAINT] ${result.data.hostelOrDept}`,
        description: `Location/Hostel: ${result.data.hostelOrDept}\nFiling Type: ${result.data.isAnonymous ? 'Anonymous Student' : 'Identified Member'}\n\nIncident Details:\n${result.data.incidentDetails}`,
        status: 'open',
        priority: 'high',
        type: 'grievance'
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/[lang]/dashboard/legal-aid', 'page')
    return { success: true, data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to file anti-ragging complaint'
    return { success: false, error: message }
  }
}

export async function getLegalLogs(organisationId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('organisation_id', organisationId)
      .or('title.ilike.[EMERGENCY DETENTION SOS]%,title.ilike.[UGC ANTI-RAGGING COMPLAINT]%')
      .order('created_at', { ascending: false })

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('tickets')
        .select('*')
        .eq('organisation_id', organisationId)
        .or('title.ilike.[EMERGENCY DETENTION SOS]%,title.ilike.[UGC ANTI-RAGGING COMPLAINT]%')
        .order('created_at', { ascending: false })

      if (!fallback.error) return { success: true, logs: fallback.data || [] }
      return { success: false, logs: [] }
    }

    return { success: true, logs: data || [] }
  } catch {
    return { success: false, logs: [] }
  }
}
