import { NextResponse } from 'next/server'
import { verifyWebhookRequest, webhookErrorResponse } from '@/lib/webhook-verify'
import { logger } from '@/lib/logger'

export async function POST(request: Request) {
  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET || process.env.GITHUB_WEBHOOK_SECRET
    if (!secret) {
      logger.warn('webhook', 'Payments webhook called but no webhook secret configured')
      return webhookErrorResponse(500, 'Webhook not configured')
    }

    const { body, valid, response } = await verifyWebhookRequest(request, 'generic')

    if (!valid || response) {
      return response || webhookErrorResponse(401, 'Unauthorized')
    }

    const payload = JSON.parse(body)

    logger.info('webhook', 'Payment webhook processed', {
      provider: payload.provider || 'unknown',
      event: payload.event || payload.type || 'unknown',
    })

    return NextResponse.json({ received: true })
  } catch {
    logger.error('webhook', 'Payment webhook failed')
    return webhookErrorResponse(400, 'Invalid payload')
  }
}
