import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { requireOrgAdmin } from '@/lib/billing/org-admin'
import { calculateMeteredBill } from '@/lib/plans/config'
import {
  createRzpCustomer,
  createMeterSubscription,
  fetchSubscription,
  getMeterPlanId,
} from '@/lib/billing/subscriptions'

/**
 * Starts metered billing for an org: creates a Razorpay customer +
 * quantity-based subscription (quantity = current billable actives).
 * Client completes the UPI mandate via checkout `subscription_id`;
 * the `subscription.authenticated` webhook activates the Metered plan.
 */
export async function POST(request: Request) {
  try {
    const { orgId } = (await request.json().catch(() => ({}))) as { orgId?: string }
    if (!orgId) return NextResponse.json({ error: 'Missing orgId' }, { status: 400 })

    const auth = await requireOrgAdmin(orgId)
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

    if (!getMeterPlanId()) {
      return NextResponse.json(
        { error: 'Metered billing is not configured yet (RAZORPAY_METER_PLAN_ID). Contact support.' },
        { status: 503 },
      )
    }

    const supabase = createServiceClient()
    const { data: org } = await supabase
      .from('organisations')
      .select('id, name, contact_email, contact_phone, plan_name, capabilities')
      .eq('id', orgId)
      .maybeSingle()
    if (!org) return NextResponse.json({ error: 'Organisation not found' }, { status: 404 })

    const caps = ((org.capabilities as Record<string, unknown>) || {}) as Record<string, unknown>
    const existingSubId = typeof caps.rz_subscription_id === 'string' ? caps.rz_subscription_id : ''

    // Resume path: a live subscription already exists — just report status.
    if (existingSubId) {
      const live = await fetchSubscription(existingSubId)
      if (live.ok && live.data && !['cancelled', 'halted', 'expired'].includes(live.data.status)) {
        return NextResponse.json({ subscriptionId: existingSubId, status: live.data.status, resumed: true })
      }
    }

    // Billable actives right now (status-based until login metering lands in cron).
    const { count } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('organisation_id', orgId)
      .eq('status', 'active')
    const { billableMembers } = calculateMeteredBill(count || 0)
    if (billableMembers < 1) {
      return NextResponse.json(
        { error: 'Your first 5 profiles are free — grow to a 6th active member to start the meter.' },
        { status: 400 },
      )
    }

    // Customer (reuse stored id when present).
    let customerId = typeof caps.rz_customer_id === 'string' ? caps.rz_customer_id : ''
    if (!customerId) {
      const created = await createRzpCustomer({
        name: org.name || 'Sangathan Organisation',
        email: org.contact_email || undefined,
        contact: org.contact_phone || undefined,
        orgId,
      })
      if (!created.ok || !created.data) {
        logger.error('billing', 'Razorpay customer creation failed', { orgId, error: created.error })
        return NextResponse.json(
          { error: created.error || 'Could not start billing (customer).' },
          { status: 502 },
        )
      }
      customerId = created.data.id
      await supabase
        .from('organisations')
        .update({ capabilities: { ...caps, rz_customer_id: customerId } } as never)
        .eq('id', orgId)
    }

    const sub = await createMeterSubscription({ customerId, quantity: billableMembers, orgId })
    if (!sub.ok || !sub.data) {
      logger.error('billing', 'Razorpay subscription creation failed', { orgId, error: sub.error })
      return NextResponse.json({ error: sub.error || 'Could not start billing.' }, { status: 502 })
    }

    await supabase
      .from('organisations')
      .update({
        capabilities: {
          ...caps,
          rz_customer_id: customerId,
          rz_subscription_id: sub.data.id,
          sub_status: 'created',
          sub_status_changed_at: new Date().toISOString(),
        },
      } as never)
      .eq('id', orgId)

    return NextResponse.json({
      subscriptionId: sub.data.id,
      status: sub.data.status,
      quantity: billableMembers,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Subscription start failed'
    logger.error('billing', 'Subscribe route failed', { error: message })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
