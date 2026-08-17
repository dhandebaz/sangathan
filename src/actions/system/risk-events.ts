'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logAction } from '@/lib/audit/log'
import { requirePlatformAdmin } from '@/lib/auth/context'

const UpdateRiskEventSchema = z.object({
  eventId: z.string().uuid(),
  status: z.enum(['investigated', 'resolved', 'dismissed']),
  note: z.string().optional(),
})

export async function getAllRiskEvents() {
  try {
    await requirePlatformAdmin()
    const supabase = createServiceClient()

    try {
      const { data } = await supabase
        .from('risk_events')
        .select('*')
        .order('detected_at', { ascending: false })
        .limit(100)
      return data || []
    } catch {
      const { data } = await supabase
        .from('system_logs')
        .select('*')
        .eq('source', 'risk_engine')
        .order('created_at', { ascending: false })
        .limit(100)
      return (data || []).map(log => ({
        id: log.id,
        entity_type: (log.metadata as Record<string, string>)?.entity_type || 'unknown',
        entity_id: (log.metadata as Record<string, string>)?.entity_id || '',
        risk_type: (log.metadata as Record<string, string>)?.risk_type || 'unknown',
        severity: (log.metadata as Record<string, string>)?.severity || 'low',
        detected_at: log.created_at,
        resolved: false,
        metadata: log.metadata,
      }))
    }
  } catch {
    return []
  }
}

export async function updateRiskEvent(input: z.infer<typeof UpdateRiskEventSchema>) {
  try {
    const result = UpdateRiskEventSchema.safeParse(input)
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || 'Invalid input' }
    }

    await requirePlatformAdmin()

    const authClient = await createClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const supabase = createServiceClient()

    let eventOrgId: string | null = null

    try {
      const { data: eventData } = await supabase
        .from('risk_events')
        .select('organisation_id')
        .eq('id', result.data.eventId)
        .maybeSingle()
      
      if (eventData?.organisation_id) {
        eventOrgId = eventData.organisation_id
      }

      const { error } = await supabase
        .from('risk_events')
        .update({
          resolved: result.data.status === 'resolved',
          metadata: { resolution: result.data.status, note: result.data.note, resolved_by: user.id, resolved_at: new Date().toISOString() },
        })
        .eq('id', result.data.eventId)

      if (error) throw error
    } catch {
      // Fallback for system_logs-based records
    }

    if (!eventOrgId) {
      if (process.env.DEFAULT_ORG_ID) {
        eventOrgId = process.env.DEFAULT_ORG_ID
      } else {
        const { data: firstOrg } = await supabase.from('organisations').select('id').limit(1).maybeSingle()
        eventOrgId = firstOrg?.id || null
      }
    }

    if (eventOrgId) {
      await logAction({
        organisation_id: eventOrgId,
        user_id: user.id,
        action: 'RISK_EVENT_' + result.data.status.toUpperCase(),
        resource_table: 'risk_events',
        resource_id: result.data.eventId,
        details: { note: result.data.note, status: result.data.status },
      })
    }

    revalidatePath('/admin/moderation', 'page')
    return { success: true }
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update risk event' }
  }
}
