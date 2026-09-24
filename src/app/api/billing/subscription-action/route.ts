import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { logAction } from '@/lib/audit/log'
import { requireOrgAdmin } from '@/lib/billing/org-admin'
import {
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
  fetchSubscription,
} from '@/lib/billing/subscriptions'

/**
 * Pause / resume / cancel / status for the org's metered subscription.
 * Pause stops the meter (cron skips paused); data is never touched.
 */
export async function POST(request: Request) {
  try {
    const { orgId, action } = (await request.json().catch(() => ({}))) as {
      orgId?: string
      action?: 'pause' | 'resume' | 'cancel' | 'status'
    }
    if (!orgId || !action) return NextResponse.json({ error: 'Missing orgId/action' }, { status: 400 })

    const auth = await requireOrgAdmin(orgId)
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

    const supabase = createServiceClient()
    const { data: org } = await supabase
      .from('organisations')
      .select('capabilities')
      .eq('id', orgId)
      .maybeSingle()
    const caps = ((org?.capabilities as Record<string, unknown>) || {}) as Record<string, unknown>
    const subId = typeof caps.rz_subscription_id === 'string' ? caps.rz_subscription_id : ''
    if (!subId) return NextResponse.json({ error: 'No subscription found for this organisation' }, { status: 404 })

    if (action === 'status') {
      const live = await fetchSubscription(subId)
      if (!live.ok) return NextResponse.json({ error: live.error }, { status: 502 })
      return NextResponse.json({ subscriptionId: subId, status: live.data?.status || 'unknown' })
    }

    const result =
      action === 'pause'
        ? await pauseSubscription(subId)
        : action === 'resume'
          ? await resumeSubscription(subId)
          : await cancelSubscription(subId, true)

    if (!result.ok) {
      logger.error('billing', 'Subscription action failed', { orgId, action, error: result.error })
      return NextResponse.json({ error: result.error }, { status: 502 })
    }

    const newStatus =
      action === 'pause' ? 'paused' : action === 'resume' ? 'active' : 'cancelled'
    await supabase
      .from('organisations')
      .update({
        capabilities: {
          ...caps,
          sub_status: newStatus,
          sub_status_changed_at: new Date().toISOString(),
          ...(action === 'pause' ? { subscription_paused_at: new Date().toISOString() } : {}),
        },
      } as never)
      .eq('id', orgId)

    await logAction({
      organisation_id: orgId,
      user_id: auth.userId,
      action: `SUBSCRIPTION_${action.toUpperCase()}`,
      resource_table: 'organisations',
      resource_id: orgId,
      details: { subscription_id: subId },
    })

    return NextResponse.json({ subscriptionId: subId, status: result.data?.status || newStatus })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Subscription action failed'
    logger.error('billing', 'Subscription action route failed', { error: message })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
