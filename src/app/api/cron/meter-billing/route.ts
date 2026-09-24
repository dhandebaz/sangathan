import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'
import { captureException } from '@/lib/sentry'
import { validateCronRequest } from '@/lib/cron-auth'
import { sendAgentMail } from '@/lib/agentmail'
import { logAction } from '@/lib/audit/log'
import { calculateMeteredBill } from '@/lib/plans/config'
import { updateSubscriptionQuantity, cancelSubscription } from '@/lib/billing/subscriptions'

const ACTIVE_WINDOW_MS = 60 * 24 * 60 * 60 * 1000 // 60-day login rule
const PAST_DUE_GRACE_MS = 30 * 24 * 60 * 60 * 1000

interface Caps {
  rz_subscription_id?: string
  sub_status?: string
  sub_status_changed_at?: string
  last_metered_count?: number
  [key: string]: unknown
}

/** All auth users mapped by id (paginated once per run). */
async function buildSignInMap(
  supabase: ReturnType<typeof createServiceClient>,
): Promise<Map<string, string | null>> {
  const map = new Map<string, string | null>()
  const perPage = 1000
  for (let page = 1; page <= 300; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })
    if (error) throw new Error(`listUsers failed: ${error.message}`)
    for (const u of data.users) map.set(u.id, u.last_sign_in_at || null)
    if (data.users.length < perPage) break
  }
  return map
}

export async function GET(request: NextRequest) {
  const auth = await validateCronRequest(request)
  if (!auth.ok) return auth.response

  const supabase = createServiceClient()
  const processed: string[] = []
  const errors: { orgId: string; error: string }[] = []
  const now = Date.now()

  try {
    const signInMap = await buildSignInMap(supabase)

    // All metered orgs (paginated).
    const orgs: { id: string; name: string; capabilities: unknown }[] = []
    const pageSize = 200
    for (let page = 0; ; page++) {
      const { data, error } = await supabase
        .from('organisations')
        .select('id, name, capabilities')
        .eq('plan_name', 'Metered')
        .range(page * pageSize, (page + 1) * pageSize - 1)
      if (error) throw new Error(`org list failed: ${error.message}`)
      if (!data || data.length === 0) break
      orgs.push(...data)
      if (data.length < pageSize) break
    }

    for (const org of orgs) {
      try {
        const caps = ((org.capabilities as Caps) || {}) as Caps
        const subId = caps.rz_subscription_id || ''
        const subStatus = caps.sub_status || 'none'

        // Past-due beyond grace → soft landing back to Community (data intact, never kicked).
        if (subStatus === 'past_due') {
          const changedAt = caps.sub_status_changed_at ? new Date(caps.sub_status_changed_at).getTime() : 0
          if (now - changedAt > PAST_DUE_GRACE_MS) {
            await supabase
              .from('organisations')
              .update({
                plan_name: 'Community',
                plan_status: 'active',
                capabilities: { ...caps, ai_features: false, advanced_analytics: false },
              } as never)
              .eq('id', org.id)
            await logAction({
              organisation_id: org.id,
              action: 'METERED_REVERTED_TO_COMMUNITY',
              resource_table: 'organisations',
              resource_id: org.id,
              details: { reason: 'past_due beyond 30-day grace' },
            })
            processed.push(`${org.id}:reverted`)
            continue
          }
        }

        // Only live subscriptions get quantity syncs.
        if (!subId || subStatus !== 'active') {
          processed.push(`${org.id}:skipped(${subStatus || 'no-sub'})`)
          continue
        }

        // Member ids → login-based actives.
        const { data: members } = await supabase
          .from('profiles')
          .select('id')
          .eq('organisation_id', org.id)
          .eq('status', 'active')
        const actives = (members || []).filter((m) => {
          const last = signInMap.get(m.id)
          return last ? now - new Date(last).getTime() <= ACTIVE_WINDOW_MS : false
        }).length

        const { billableMembers, monthlyTotal } = calculateMeteredBill(actives)

        // Meter hit zero (org shrank to ≤5 actives) → cancel mandate, back to
        // Community automatically. Never charge ₹11 for nothing.
        if (billableMembers < 1) {
          await cancelSubscription(subId, true)
          await supabase
            .from('organisations')
            .update({
              plan_name: 'Community',
              plan_status: 'active',
              capabilities: {
                ...caps,
                ai_features: false,
                advanced_analytics: false,
                sub_status: 'cancelled',
                sub_status_changed_at: new Date().toISOString(),
                last_metered_count: actives,
                last_metered_at: new Date().toISOString(),
              },
            } as never)
            .eq('id', org.id)
          await logAction({
            organisation_id: org.id,
            action: 'METERED_AUTO_DOWNGRADED',
            resource_table: 'organisations',
            resource_id: org.id,
            details: { actives, subscription_id: subId },
          })
          processed.push(`${org.id}:auto-downgraded`)
          continue
        }

        const qty = await updateSubscriptionQuantity(subId, billableMembers)
        if (!qty.ok) throw new Error(qty.error || 'quantity update failed')

        await supabase
          .from('organisations')
          .update({
            capabilities: {
              ...caps,
              last_metered_count: actives,
              last_metered_at: new Date().toISOString(),
            },
          } as never)
          .eq('id', org.id)

        // Notify org admins (email best-effort; meter never blocks on it).
        const { data: admins } = await supabase
          .from('profiles')
          .select('email')
          .eq('organisation_id', org.id)
          .eq('status', 'active')
          .in('role', ['admin', 'second_admin', 'executive'])
          .limit(10)
        const emails = (admins || []).map((a) => a.email).filter(Boolean) as string[]
        if (emails.length > 0) {
          await sendAgentMail({
            to: emails,
            subject: `Sangathan meter: ${actives} actives → ₹${monthlyTotal.toLocaleString('en-IN')}/mo for ${org.name}`,
            text:
              `Monthly meter run for ${org.name}:\n` +
              `Active members (60-day login): ${actives}\n` +
              `Billable beyond 5 free: ${billableMembers}\n` +
              `Estimated bill: ₹${monthlyTotal.toLocaleString('en-IN')}/month (GST-inclusive)\n\n` +
              `Archive dormant members to lower next month's count. Pause billing anytime from Billing — data always stays.`,
            orgId: org.id,
            tags: ['billing', 'meter'],
          })
        }

        processed.push(`${org.id}:${actives}/${billableMembers}/₹${monthlyTotal}`)
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        errors.push({ orgId: org.id, error: message })
        logger.error('cron_meter', 'Meter run failed for org', { orgId: org.id, error: message })
      }
    }

    return NextResponse.json({ success: true, processed: processed.length, errors, detail: processed })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown meter error'
    logger.error('cron_meter', `Meter cron failed: ${message}`, {}, err)
    captureException(err, { source: 'cron_meter' })
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
