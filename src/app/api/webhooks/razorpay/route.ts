import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-razorpay-signature')
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Configuration or Signature missing' }, { status: 401 })
  }

  const body = await request.text()
  
  // 1. Verify Signature
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex')
  
  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }
  
  const event = JSON.parse(body)
  const supabase = createServiceClient()
  
  // 2. Process Event
  try {
    const subId = event.payload?.subscription?.entity?.id
    
    if (!subId) {
        return NextResponse.json({ received: true }) // Ignore non-sub events
    }

    if (event.event === 'subscription.activated') {
       await (supabase.from('supporter_subscriptions') as any)
         .update({
           status: 'active',
           updated_at: new Date().toISOString()
         })
         .eq('razorpay_subscription_id', subId)
    }
    
    else if (event.event === 'subscription.charged') {
       // Extend validity
       const nextCharge = event.payload.subscription.entity.charge_at_timestamp 
       // Razorpay sends unix timestamp (seconds)
       const currentPeriodEnd = nextCharge ? new Date(nextCharge * 1000).toISOString() : new Date(Date.now() + 30*24*60*60*1000).toISOString()

       await (supabase.from('supporter_subscriptions') as any)
         .update({
           status: 'active',
           current_period_end: currentPeriodEnd,
           updated_at: new Date().toISOString()
         })
         .eq('razorpay_subscription_id', subId)
    }
    
    else if (event.event === 'subscription.cancelled' || event.event === 'subscription.halted') {
       await (supabase.from('supporter_subscriptions') as any)
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
