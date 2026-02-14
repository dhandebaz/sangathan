import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'

// Verify Sender signature if available (Sender.net might not sign, but good to check IP or shared secret)
// For now we just log the payload.

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    const eventType = payload.type || 'unknown'
    const email = payload.data?.email || 'unknown'

    // Log the event
    logger.info('email', `Webhook received: ${eventType} for ${email}`, { payload })

    // Store in audit logs or separate email_events table
    // For now, let's just log to console as requested
    
    // Check for bounces/complaints
    if (eventType === 'hard_bounce' || eventType === 'spam_complaint') {
      const supabase = createServiceClient()
      // Mark user as bounced/suppressed if we have a table for it
      // await supabase.from('email_suppressions').insert({ email, reason: eventType })
      logger.warn('email', `Suppression event: ${eventType} for ${email}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('email', 'Webhook processing failed', { error })
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
