import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

type WebhookProvider = 'stripe' | 'github' | 'generic'

interface WebhookConfig {
  secret: string
  tolerance?: number
  signatureHeader?: string
}

const WEBHOOK_CONFIGS: Record<string, WebhookConfig> = {
  stripe: {
    secret: process.env.STRIPE_WEBHOOK_SECRET || '',
    tolerance: 300,
    signatureHeader: 'stripe-signature',
  },
  github: {
    secret: process.env.GITHUB_WEBHOOK_SECRET || '',
    signatureHeader: 'x-hub-signature-256',
  },
}

export async function verifyWebhookSignature(
  body: string,
  signatureHeader: string | null,
  provider: WebhookProvider
): Promise<{ valid: boolean; error?: string }> {
  if (!signatureHeader) {
    return { valid: false, error: 'Missing signature header' }
  }

  const config = WEBHOOK_CONFIGS[provider]
  if (!config || !config.secret) {
    return { valid: false, error: 'Webhook not configured' }
  }

  try {
    switch (provider) {
      case 'stripe': {
        const { default: Stripe } = await import('stripe')
        const stripe = new Stripe(config.secret, { apiVersion: '2025-02-24.acacia' as never })
        const event = stripe.webhooks.constructEvent(
          body,
          signatureHeader,
          config.secret
        )
        return { valid: !!event }
      }

      case 'github': {
        const enc = new TextEncoder()
        const key = await crypto.subtle.importKey(
          'raw',
          enc.encode(config.secret),
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['verify']
        )
        const expected = signatureHeader.startsWith('sha256=')
          ? signatureHeader.slice(7)
          : signatureHeader
        const actualBytes = await crypto.subtle.sign('HMAC', key, enc.encode(body))
        const actual = Array.from(new Uint8Array(actualBytes))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('')

        if (actual !== expected) {
          return { valid: false, error: 'Signature mismatch' }
        }
        return { valid: true }
      }

      default: {
        const enc = new TextEncoder()
        const key = await crypto.subtle.importKey(
          'raw',
          enc.encode(config.secret),
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['verify']
        )
        const expected = signatureHeader
        const actualBytes = await crypto.subtle.sign('HMAC', key, enc.encode(body))
        const actual = Array.from(new Uint8Array(actualBytes))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('')

        if (actual !== expected) {
          return { valid: false, error: 'Signature mismatch' }
        }
        return { valid: true }
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    logger.warn('webhook', `Signature verification failed for ${provider}`, { error: message })
    return { valid: false, error: message }
  }
}

export function webhookErrorResponse(status: number, message: string) {
  logger.warn('webhook', `Rejected webhook: ${message}`)
  return NextResponse.json({ error: message }, { status })
}

export async function verifyWebhookRequest(
  request: Request,
  provider: WebhookProvider
): Promise<{ body: string; valid: boolean; response?: NextResponse }> {
  const body = await request.text()
  const signatureHeader = request.headers.get(WEBHOOK_CONFIGS[provider]?.signatureHeader || '')

  const { valid, error } = await verifyWebhookSignature(body, signatureHeader, provider)

  if (!valid) {
    return {
      body,
      valid: false,
      response: webhookErrorResponse(401, error || 'Invalid signature'),
    }
  }

  return { body, valid: true }
}
