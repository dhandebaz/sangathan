import crypto from 'crypto'

/**
 * Pure Razorpay webhook signature verifier (HMAC-SHA256 of the RAW body).
 * Kept dependency-free so tests can cover it.
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string | null,
  secret: string | undefined,
): boolean {
  if (!rawBody || !signature || !secret) return false
  try {
    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
    const a = Buffer.from(expected, 'utf8')
    const b = Buffer.from(signature, 'utf8')
    if (a.length !== b.length) return false
    return crypto.timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export type RzpWebhookEventName =
  | 'subscription.authenticated'
  | 'subscription.charged'
  | 'subscription.halted'
  | 'subscription.cancelled'
  | 'subscription.paused'
  | 'subscription.resumed'
  | 'payment.failed'

export interface RzpSubscriptionEntity {
  id: string
  status?: string
  quantity?: number
  plan_id?: string
  customer_id?: string
  notes?: { orgId?: string }
}

export interface RzpPaymentEntity {
  id: string
  order_id?: string
  amount?: number // paise
  currency?: string
  notes?: { orgId?: string }
  subscription_id?: string
}

export function extractOrgId(payload: {
  event?: string
  payload?: {
    subscription?: { entity?: RzpSubscriptionEntity }
    payment?: { entity?: RzpPaymentEntity }
  }
}): string | null {
  return (
    payload.payload?.subscription?.entity?.notes?.orgId ||
    payload.payload?.payment?.entity?.notes?.orgId ||
    null
  )
}
