import 'server-only'

/**
 * Razorpay Subscriptions (recurring UPI autopay / mandates) via REST.
 *
 * Metered billing = ONE quantity-based subscription per org:
 *   plan amount ₹11 (paise 1100) × quantity (billable actives), monthly.
 * The meter cron updates quantity month-end; Razorpay handles mandates,
 * retries (dunning), pause/resume natively.
 *
 * Setup (one-time, human): create a quantity-based Plan of ₹11/monthly in the
 * Razorpay Dashboard (or via createMeterPlan below) and set RAZORPAY_METER_PLAN_ID.
 * The Razorpay account must have Subscriptions + UPI Autopay enabled, else all
 * calls below fail closed with the provider's message surfaced to the UI.
 */

const RAZORPAY_API = 'https://api.razorpay.com/v1'

export interface RzpResult<T> {
  ok: boolean
  data?: T
  error?: string
}

function getCreds(): { keyId: string; keySecret: string } {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_API_KEY || ''
  const keySecret = process.env.RAZORPAY_KEY_SECRET || ''
  if (!keyId || !keySecret) throw new Error('Razorpay credentials missing')
  return { keyId, keySecret }
}

async function rzpFetch<T>(path: string, method: string, body?: unknown): Promise<RzpResult<T>> {
  let creds: { keyId: string; keySecret: string }
  try {
    creds = getCreds()
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Gateway configuration error' }
  }
  const auth = Buffer.from(`${creds.keyId}:${creds.keySecret}`).toString('base64')
  try {
    const res = await fetch(`${RAZORPAY_API}${path}`, {
      method,
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown> & { error?: { description?: string } }
    if (!res.ok) {
      return { ok: false, error: json.error?.description || `Razorpay error (${res.status})` }
    }
    return { ok: true, data: json as T }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Razorpay request failed' }
  }
}

export interface RzpPlan {
  id: string
  item?: { amount?: number; currency?: string }
}

export interface RzpSubscription {
  id: string
  status: string
  short_url?: string
  quantity?: number
  plan_id?: string
  customer_id?: string
  current_start?: number
  current_end?: number
  charge_at?: number
}

export interface RzpCustomer {
  id: string
}

/** One-time setup helper: creates the ₹11/monthly quantity plan. Run manually, store ID in RAZORPAY_METER_PLAN_ID. */
export async function createMeterPlan(): Promise<RzpResult<RzpPlan>> {
  return rzpFetch<RzpPlan>('/plans', 'POST', {
    period: 'monthly',
    interval: 1,
    item: { name: 'Sangathan Metered — per active member', amount: 1100, currency: 'INR' },
    notes: { initiative: 'Sangathan (Bahujan Queer Foundation)', purpose: 'Metered billing plan' },
  })
}

export function getMeterPlanId(): string {
  return process.env.RAZORPAY_METER_PLAN_ID || ''
}

export async function createRzpCustomer(params: {
  name: string
  email?: string
  contact?: string
  orgId: string
}): Promise<RzpResult<RzpCustomer>> {
  return rzpFetch<RzpCustomer>('/customers', 'POST', {
    name: params.name.slice(0, 100),
    email: params.email || undefined,
    contact: params.contact || undefined,
    notes: { orgId: params.orgId, initiative: 'Sangathan' },
  })
}

export async function createMeterSubscription(params: {
  customerId: string
  quantity: number
  orgId: string
}): Promise<RzpResult<RzpSubscription>> {
  const planId = getMeterPlanId()
  if (!planId) return { ok: false, error: 'Meter plan not configured (RAZORPAY_METER_PLAN_ID)' }
  if (params.quantity < 1) return { ok: false, error: 'Quantity must be at least 1' }
  return rzpFetch<RzpSubscription>('/subscriptions', 'POST', {
    plan_id: planId,
    customer_id: params.customerId,
    quantity: params.quantity,
    total_count: 120, // ~10 years; effectively indefinite, renewed/extended before expiry
    notes: { orgId: params.orgId, purpose: 'Sangathan metered billing' },
  })
}

export async function updateSubscriptionQuantity(
  subscriptionId: string,
  quantity: number,
): Promise<RzpResult<RzpSubscription>> {
  if (quantity < 1) return { ok: false, error: 'Quantity must be at least 1' }
  return rzpFetch<RzpSubscription>(`/subscriptions/${subscriptionId}`, 'PATCH', { quantity })
}

export async function pauseSubscription(subscriptionId: string): Promise<RzpResult<RzpSubscription>> {
  return rzpFetch<RzpSubscription>(`/subscriptions/${subscriptionId}/pause`, 'POST', {})
}

export async function resumeSubscription(subscriptionId: string): Promise<RzpResult<RzpSubscription>> {
  return rzpFetch<RzpSubscription>(`/subscriptions/${subscriptionId}/resume`, 'POST', {})
}

export async function cancelSubscription(
  subscriptionId: string,
  atCycleEnd = true,
): Promise<RzpResult<RzpSubscription>> {
  return rzpFetch<RzpSubscription>(`/subscriptions/${subscriptionId}/cancel`, 'POST', {
    cancel_at_cycle_end: atCycleEnd ? 1 : 0,
  })
}

export async function fetchSubscription(subscriptionId: string): Promise<RzpResult<RzpSubscription>> {
  return rzpFetch<RzpSubscription>(`/subscriptions/${subscriptionId}`, 'GET')
}
