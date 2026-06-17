import { NextResponse } from 'next/server'
import { verifyWebhookRequest, webhookErrorResponse } from '@/lib/webhook-verify'
import { logger } from '@/lib/logger'

export async function POST(request: Request) {
  const { body, valid, response } = await verifyWebhookRequest(request, 'stripe')

  if (!valid || response) {
    return response || webhookErrorResponse(401, 'Unauthorized')
  }

  try {
    const event = JSON.parse(body)

    switch (event.type) {
      case 'payment_intent.succeeded':
        logger.info('webhook', 'Payment succeeded', { id: event.id })
        break
      case 'payment_intent.payment_failed':
        logger.warn('webhook', 'Payment failed', { id: event.id })
        break
      default:
        logger.info('webhook', `Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    logger.error('webhook', 'Failed to process webhook', { error: message })
    return webhookErrorResponse(400, 'Invalid payload')
  }
}
