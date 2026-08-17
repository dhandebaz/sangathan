'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'

const EmergencySosSchema = z.object({
  activist_name: z.string().min(2, 'Name required'),
  contact_phone: z.string().min(8, 'Valid phone required'),
  location_name: z.string().min(2, 'Location name required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  police_station: z.string().optional(),
  detainee_count: z.number().min(1).default(1),
  situation_details: z.string().min(5, 'Details required'),
  severity: z.enum(['moderate', 'urgent', 'critical', 'life_safety']).default('critical'),
})

export const triggerEmergencySosAction = createSafeAction(
  EmergencySosSchema,
  async (validated, context) => {
    const orgId = context.organizationId
    if (!orgId) throw new Error('Organisation not found')

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const adminClient = createServiceClient()

    // 1. Insert into emergency_sos_alerts
    const { data: alert, error: alertErr } = await adminClient
      .from('emergency_sos_alerts')
      .insert({
        organisation_id: orgId,
        triggered_by: user?.id || null,
        activist_name: validated.activist_name,
        contact_phone: validated.contact_phone,
        location_name: validated.location_name,
        latitude: validated.latitude || null,
        longitude: validated.longitude || null,
        police_station: validated.police_station || null,
        detainee_count: validated.detainee_count,
        situation_details: validated.situation_details,
        severity: validated.severity,
        status: 'alerted',
      })
      .select()
      .maybeSingle()

    if (alertErr) throw alertErr

    // 2. Also log a high priority emergency ticket
    await adminClient.from('tickets').insert({
      organisation_id: orgId,
      title: `[EMERGENCY SOS ALERT] ${validated.activist_name} at ${validated.location_name}`,
      description: `🚨 EMERGENCY PROTEST/DETENTION ALERT\nActivist: ${validated.activist_name} (${validated.contact_phone})\nLocation: ${validated.location_name}\nPolice Station: ${validated.police_station || 'Unspecified'}\nDetainees: ${validated.detainee_count}\nGPS: ${validated.latitude || 'N/A'}, ${validated.longitude || 'N/A'}\n\nSituation:\n${validated.situation_details}`,
      status: 'open',
      priority: 'high',
      type: 'grievance',
    })

    revalidatePath('/[lang]/dashboard/emergency-sos', 'page')
    return alert
  }
)

export async function dispatchAdvocateAction(alertId: string, advocateName: string, advocatePhone: string, barCouncilNo?: string) {
  try {
    const { requireRole } = await import('@/lib/auth/context')
    const ctx = await requireRole(['admin', 'executive'])
    if (!ctx) throw new Error('Unauthorized')

    const adminClient = createServiceClient()

    // 1. Record dispatch
    const { data, error } = await adminClient
      .from('emergency_advocate_dispatches')
      .insert({
        alert_id: alertId,
        advocate_name: advocateName,
        advocate_phone: advocatePhone,
        bar_council_no: barCouncilNo || null,
        status: 'en_route',
      })
      .select()
      .maybeSingle()

    if (error) throw error

    // 2. Update alert status
    await adminClient
      .from('emergency_sos_alerts')
      .update({ status: 'legal_dispatched' })
      .eq('id', alertId)

    revalidatePath('/[lang]/dashboard/emergency-sos', 'page')
    return { success: true, data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to dispatch advocate'
    return { success: false, error: message }
  }
}

export async function updateSosStatusAction(alertId: string, status: string) {
  try {
    const { requireRole } = await import('@/lib/auth/context')
    const ctx = await requireRole(['admin', 'executive'])
    if (!ctx) throw new Error('Unauthorized')

    const adminClient = createServiceClient()
    const updatePayload: Record<string, any> = { status }
    if (status === 'resolved') {
      updatePayload.resolved_at = new Date().toISOString()
    }

    const { error } = await adminClient
      .from('emergency_sos_alerts')
      .update(updatePayload)
      .eq('id', alertId)

    if (error) throw error
    revalidatePath('/[lang]/dashboard/emergency-sos', 'page')
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update SOS status'
    return { success: false, error: message }
  }
}

export async function getEmergencySosAlerts(orgId: string) {
  try {
    const { requireRole } = await import('@/lib/auth/context')
    const ctx = await requireRole(['admin', 'executive'])
    if (!ctx || ctx.organizationId !== orgId) throw new Error('Unauthorized')

    const adminClient = createServiceClient()
    const { data, error } = await adminClient
      .from('emergency_sos_alerts')
      .select('*, dispatches:emergency_advocate_dispatches(*)')
      .eq('organisation_id', orgId)
      .order('created_at', { ascending: false })
      .limit(30)

    if (error) throw error
    return data || []
  } catch {
    return []
  }
}
