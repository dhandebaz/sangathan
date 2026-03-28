import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import crypto from 'crypto'

interface RazorpayWebhookEvent {
  id?: string
  event?: string
  payload?: {
    subscription?: {
      entity?: {
        id?: string
        charge_at_timestamp?: number
        current_end?: number
      }
    }
  }
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-razorpay-signature')
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Configuration or Signature missing' }, { status: 401 })
  }

  let body: string
  try {
    body = await request.text()
  } catch {
    return NextResponse.json({ error: 'Failed to read request body' }, { status: 400 })
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex')

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: RazorpayWebhookEvent
  try {
    event = JSON.parse(body) as RazorpayWebhookEvent
  } catch (error) {
    console.error('JSON Parse Error:', error)
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const supabase = createServiceClient()

  try {
    const subId = event.payload?.subscription?.entity?.id

    if (!subId) {
      return NextResponse.json({ received: true })
    }

    if (event.event === 'subscription.activated') {
      await supabase
        .from('supporter_subscriptions')
        .update({
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('razorpay_subscription_id', subId)
    } else if (event.event === 'subscription.charged') {
      const entity = event.payload?.subscription?.entity
      const nextCharge = entity?.charge_at_timestamp || entity?.current_end

      if (nextCharge) {
        const currentPeriodEnd = new Date(nextCharge * 1000).toISOString()

        await supabase
          .from('supporter_subscriptions')
          .update({
            status: 'active',
            current_period_end: currentPeriodEnd,
            updated_at: new Date().toISOString(),
          })
          .eq('razorpay_subscription_id', subId)
      } else {
        console.warn(
          `Webhook ${event.id}: Missing charge_at/current_end for subscription ${subId}. Skipping update to prevent incorrect date fallback.`
        )
      }
    } else if (event.event === 'subscription.cancelled' || event.event === 'subscription.halted') {
      await supabase
        .from('supporter_subscriptions')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('razorpay_subscription_id', subId)
    }
  } catch (error) {
    console.error('Webhook Processing Error:', error)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
