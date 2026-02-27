import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-razorpay-signature')
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Configuration or Signature missing' }, { status: 401 })
  }

  let body: string
  try {
    body = await request.text()
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read request body' }, { status: 400 })
  }
  
  // 1. Verify Signature
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex')
  
  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }
  
  let event: any
  try {
    event = JSON.parse(body)
  } catch (err) {
    console.error('JSON Parse Error:', err)
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const supabase = createServiceClient()
  
  // 2. Process Event
  try {
    const subId = event.payload?.subscription?.entity?.id
    
    if (!subId) {
        return NextResponse.json({ received: true }) // Ignore non-sub events
    }

    if (event.event === 'subscription.activated') {
       await supabase.from('supporter_subscriptions')
         .update({
           status: 'active',
           updated_at: new Date().toISOString()
         })
         .eq('razorpay_subscription_id', subId)
    }
    
    else if (event.event === 'subscription.charged') {
       // Extend validity
       const entity = event.payload.subscription.entity
       // Use charge_at (next charge date) or current_end as the validity period
       const nextCharge = entity.charge_at_timestamp || entity.current_end
       
       if (nextCharge) {
         // Razorpay sends unix timestamp (seconds)
         const currentPeriodEnd = new Date(nextCharge * 1000).toISOString()

         await supabase.from('supporter_subscriptions')
           .update({
             status: 'active',
             current_period_end: currentPeriodEnd,
             updated_at: new Date().toISOString()
           })
           .eq('razorpay_subscription_id', subId)
       } else {
           console.warn(`Webhook ${event.id}: Missing charge_at/current_end for subscription ${subId}. Skipping update to prevent incorrect date fallback.`)
           // Removed hardcoded 30-day fallback to prevent incorrect plan intervals.
       }
    }
    
    else if (event.event === 'subscription.cancelled' || event.event === 'subscription.halted') {
       await supabase.from('supporter_subscriptions')
         .update({
           status: 'cancelled',
           updated_at: new Date().toISOString()
         })
         .eq('razorpay_subscription_id', subId)
    }

  } catch (err) {
    console.error('Webhook Processing Error:', err)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
  
  return NextResponse.json({ received: true })
}
