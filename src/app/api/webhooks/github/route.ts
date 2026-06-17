import { NextResponse } from 'next/server'
import { verifyWebhookRequest, webhookErrorResponse } from '@/lib/webhook-verify'
import { logger } from '@/lib/logger'

export async function POST(request: Request) {
  const { body, valid, response } = await verifyWebhookRequest(request, 'github')

  if (!valid || response) {
    return response || webhookErrorResponse(401, 'Unauthorized')
  }

  try {
    const event = JSON.parse(body)
    const eventType = request.headers.get('x-github-event') || 'unknown'

    logger.info('webhook', `GitHub ${eventType} event`, {
      action: event.action,
      repository: event.repository?.full_name,
    })

    return NextResponse.json({ received: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    logger.error('webhook', 'Failed to process GitHub webhook', { error: message })
    return webhookErrorResponse(400, 'Invalid payload')
  }
}
