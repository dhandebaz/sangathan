import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { logAction } from '@/lib/audit/log'
import {
  verifyRazorpayWebhookSignature,
  extractOrgId,
  type RzpPaymentEntity,
  type RzpSubscriptionEntity,
} from '@/lib/billing/razorpay-webhook'

interface RzpWebhookPayload {
  event: string
  payload: {
    subscription?: { entity: RzpSubscriptionEntity }
    payment?: { entity: RzpPaymentEntity }
  }
}

async function setSubState(
  supabase: ReturnType<typeof createServiceClient>,
  orgId: string,
  patch: Record<string, unknown>,
  auditAction: string,
  extra: Record<string, string | number | boolean | null | undefined> = {},
) {
  const { data: org } = await supabase
    .from('organisations')
    .select('capabilities')
    .eq('id', orgId)
    .maybeSingle()
  const caps = ((org?.capabilities as Record<string, unknown>) || {}) as Record<string, unknown>
  await supabase
    .from('organisations')
    .update({
      capabilities: {
        ...caps,
        ...patch,
        sub_status_changed_at: new Date().toISOString(),
      },
    } as never)
    .eq('id', orgId)
  await logAction({
    organisation_id: orgId,
    action: auditAction,
    resource_table: 'organisations',
    resource_id: orgId,
    details: Object.fromEntries(Object.entries(extra).filter(([, v]) => v !== undefined)) as Record<
      string,
      string | number | boolean | null
    >,
  })
}

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  const signature = request.headers.get('x-razorpay-signature')
  let raw = ''
  try {
    raw = await request.text()
  } catch {
    return NextResponse.json({ error: 'Bad body' }, { status: 400 })
  }

  if (!verifyRazorpayWebhookSignature(raw, signature, secret)) {
    logger.warn('webhook_razorpay', 'Invalid webhook signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: RzpWebhookPayload
  try {
    payload = JSON.parse(raw) as RzpWebhookPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const orgId = extractOrgId(payload)
  const sub = payload.payload.subscription?.entity
  const payment = payload.payload.payment?.entity

  logger.info('webhook_razorpay', 'Event received', {
    event: payload.event,
    orgId,
    subscriptionId: sub?.id,
  })

  try {
    switch (payload.event) {
      case 'subscription.authenticated': {
        // Mandate approved → Metered goes live.
        if (!orgId || !sub) break
        const { data: current } = await supabase
          .from('organisations')
          .select('capabilities')
          .eq('id', orgId)
          .maybeSingle()
        const currentCaps = ((current?.capabilities as Record<string, unknown>) || {}) as Record<string, unknown>
        await supabase
          .from('organisations')
          .update({
            plan_name: 'Metered',
            plan_status: 'active',
            plan_period: 'monthly',
            capabilities: {
              ...currentCaps,
              ai_features: true,
              advanced_analytics: true,
              rz_subscription_id: sub.id,
              sub_status: 'active',
              sub_status_changed_at: new Date().toISOString(),
            },
          } as never)
          .eq('id', orgId)
        await logAction({
          organisation_id: orgId,
          action: 'METERED_BILLING_ACTIVATED',
          resource_table: 'organisations',
          resource_id: orgId,
          details: { subscription_id: sub.id },
        })
        break
      }

      case 'subscription.charged': {
        // Monthly autopay debit succeeded → ledger row (invoice derived from it).
        if (!orgId || !payment) break
        const amountRs = Math.round(((payment.amount || 0) / 100) * 100) / 100
        const { data: existing } = await supabase
          .from('billing_transactions')
          .select('id')
          .eq('razorpay_payment_id', payment.id)
          .maybeSingle()
        if (!existing) {
          await supabase.from('billing_transactions').insert({
            organisation_id: orgId,
            amount: amountRs,
            currency: payment.currency || 'INR',
            plan_name: 'Metered Access',
            plan_period: 'monthly',
            razorpay_payment_id: payment.id,
            status: 'completed',
          })
        }
        await setSubState(supabase, orgId, { sub_status: 'active' }, 'SUBSCRIPTION_CHARGED', {
          subscription_id: sub?.id,
          payment_id: payment.id,
          amount: amountRs,
        })
        break
      }

      case 'subscription.halted': {
        // Autopay failing repeatedly → past-due (grace: access continues).
        if (!orgId) break
        await setSubState(supabase, orgId, { sub_status: 'past_due' }, 'SUBSCRIPTION_PAST_DUE', {
          subscription_id: sub?.id,
        })
        break
      }

      case 'subscription.paused': {
        if (!orgId) break
        await setSubState(
          supabase,
          orgId,
          { sub_status: 'paused', subscription_paused_at: new Date().toISOString() },
          'SUBSCRIPTION_PAUSED',
          { subscription_id: sub?.id },
        )
        break
      }

      case 'subscription.resumed': {
        if (!orgId) break
        await setSubState(supabase, orgId, { sub_status: 'active' }, 'SUBSCRIPTION_RESUMED', {
          subscription_id: sub?.id,
        })
        break
      }

      case 'subscription.cancelled': {
        if (!orgId) break
        await setSubState(supabase, orgId, { sub_status: 'cancelled' }, 'SUBSCRIPTION_CANCELLED', {
          subscription_id: sub?.id,
        })
        break
      }

      case 'payment.failed': {
        // Razorpay retries subscription debits automatically (built-in dunning).
        logger.warn('webhook_razorpay', 'Payment failed (provider will retry)', {
          orgId,
          paymentId: payment?.id,
        })
        break
      }

      default:
        break
    }
  } catch (err) {
    logger.error('webhook_razorpay', 'Event handling failed', {
      event: payload.event,
      error: err instanceof Error ? err.message : err,
    })
    // Return 200 so Razorpay doesn't hammer retries for our bug; the failure is logged + alertable.
    return NextResponse.json({ received: true, handled: false })
  }

  return NextResponse.json({ received: true })
}
