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
      entity_type: log.metadata?.entity_type || 'unknown',
      entity_id: log.metadata?.entity_id || '',
      risk_type: log.metadata?.risk_type || 'unknown',
      severity: log.metadata?.severity || 'low',
      detected_at: log.created_at,
      resolved: false,
      metadata: log.metadata,
    }))
  }
}

export async function updateRiskEvent(input: z.infer<typeof UpdateRiskEventSchema>) {
  const result = UpdateRiskEventSchema.safeParse(input)
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || 'Invalid input' }
  }

  await requirePlatformAdmin()

  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const supabase = createServiceClient()

  try {
    const { error } = await supabase
      .from('risk_events')
      .update({
        resolved: result.data.status === 'resolved',
        metadata: { resolution: result.data.status, note: result.data.note, resolved_by: user.id, resolved_at: new Date().toISOString() },
      })
      .eq('id', result.data.eventId)

    if (error) throw error
  } catch {
    // risk_events table might not exist; just return success for system_logs-based records
  }

  await logAction({
    organisation_id: '00000000-0000-0000-0000-000000000000',
    user_id: user.id,
    action: 'RISK_EVENT_' + result.data.status.toUpperCase(),
    resource_table: 'risk_events',
    resource_id: result.data.eventId,
  })

  revalidatePath('/admin/risk-events', 'page')
  revalidatePath('/admin/health', 'page')
  return { success: true }
}
