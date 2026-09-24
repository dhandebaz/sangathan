import 'server-only'
import { createServiceClient } from '@/lib/supabase/service'
import {
  PlanName,
  PlanPeriod,
  PlanTier,
  PLAN_TIERS,
  BASE_SUSTAINER_MEMBERS,
  FREE_MEMBER_ALLOWANCE,
  METERED_PRICE_PER_ACTIVE,
  calculateMeteredBill,
  getPlanDetails,
  OrgPlanUsage,
} from './config'

export * from './config'

export interface MemberLimitCheckResult {
  allowed: boolean
  currentCount: number
  maxAllowed: number
  planName: PlanName
  error?: string
}

/**
 * Checks if adding the specified count of members would exceed the organisation's plan limit.
 *
 * - Community: hard cap at FREE_MEMBER_ALLOWANCE (5). Block with upgrade prompt.
 * - Metered: NO cap — always allowed; billing meter counts (actives − 5) × ₹11.
 * - Institution (legacy): 500 + additional slots (grandfathered billing).
 */
export async function checkMemberLimit(
  orgId: string,
  additionalCount = 1,
): Promise<MemberLimitCheckResult> {
  let supabase
  try {
    supabase = createServiceClient()
  } catch (err) {
    console.error('Plan limit check error: Service client unavailable', err)
    return { allowed: true, currentCount: 0, maxAllowed: FREE_MEMBER_ALLOWANCE, planName: 'Community' }
  }

  // 1. Fetch Org Plan and Capabilities
  const { data: org } = await supabase
    .from('organisations')
    .select('plan_name, capabilities')
    .eq('id', orgId)
    .maybeSingle()

  const planName = (org?.plan_name || 'Community') as PlanName
  const tier = getPlanDetails(planName)
  const caps = (org?.capabilities as Record<string, unknown>) || {}
  const additionalSlots = typeof caps.additional_member_slots === 'number' ? Math.max(0, caps.additional_member_slots) : 0

  // Metered plans have no member cap — the meter handles billing.
  if (planName === 'Metered') {
    return { allowed: true, currentCount: 0, maxAllowed: Number.POSITIVE_INFINITY, planName }
  }

  const maxAllowed = planName === 'Institution'
    ? BASE_SUSTAINER_MEMBERS + additionalSlots
    : tier.maxMembers

  // 2. Fetch Active Members Count from both members table and pending active invites
  const [membersRes, invitesRes] = await Promise.all([
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('organisation_id', orgId)
      .eq('status', 'active'),
    supabase
      .from('org_invites')
      .select('id', { count: 'exact', head: true })
      .eq('organisation_id', orgId)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString()),
  ])

  const activeMembers = membersRes.count || 0
  const pendingInvites = invitesRes.count || 0
  const totalAllocated = activeMembers + pendingInvites

  if (totalAllocated + additionalCount > maxAllowed) {
    const isCommunity = planName === 'Community'
    const errorMsg = isCommunity
      ? `Free Community capacity reached (${activeMembers}/${maxAllowed} profiles used). Add UPI autopay billing to grow — (active members − ${FREE_MEMBER_ALLOWANCE}) × ₹${METERED_PRICE_PER_ACTIVE}/month, counted month-end. No base fee, pause anytime.`
      : `Sustainer capacity reached (${activeMembers}/${maxAllowed} member slots used). This is a grandfathered plan — contact support to move to metered billing.`

    return {
      allowed: false,
      currentCount: totalAllocated,
      maxAllowed,
      planName,
      error: errorMsg,
    }
  }

  return {
    allowed: true,
    currentCount: totalAllocated,
    maxAllowed,
    planName,
  }
}

export async function getOrgPlanUsage(orgId: string): Promise<OrgPlanUsage> {
  let supabase
  try {
    supabase = createServiceClient()
  } catch {
    const tier = PLAN_TIERS.Community
    return {
      planName: 'Community',
      planTier: tier,
      planPeriod: 'monthly',
      planExpiresAt: null,
      planStatus: 'active',
      whitelabelEnabled: false,
      memberCount: 0,
      maxMembers: tier.maxMembers,
      additionalSlots: 0,
      memberUsagePercentage: 0,
      isNearMemberLimit: false,
      isAtMemberLimit: false,
    }
  }

  const [{ data: org }, { count: memberCount }] = await Promise.all([
    supabase
      .from('organisations')
      .select('plan_name, plan_period, plan_expires_at, plan_status, whitelabel_enabled, capabilities')
      .eq('id', orgId)
      .maybeSingle(),
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('organisation_id', orgId)
      .eq('status', 'active'),
  ])

  const planName = (org?.plan_name || 'Community') as PlanName
  const tier = getPlanDetails(planName)
  const caps = (org?.capabilities as Record<string, unknown>) || {}
  const additionalSlots = typeof caps.additional_member_slots === 'number' ? Math.max(0, caps.additional_member_slots) : 0

  const currentMembers = memberCount || 0

  // Metered: no cap; report billable members + estimated bill instead of a usage %.
  if (planName === 'Metered') {
    const { billableMembers, monthlyTotal } = calculateMeteredBill(currentMembers)
    return {
      planName,
      planTier: tier,
      planPeriod: (org?.plan_period || 'monthly') as PlanPeriod,
      planExpiresAt: org?.plan_expires_at || null,
      planStatus: org?.plan_status || 'active',
      whitelabelEnabled: org?.whitelabel_enabled ?? false,
      memberCount: currentMembers,
      maxMembers: Number.POSITIVE_INFINITY,
      additionalSlots,
      memberUsagePercentage: 0,
      isNearMemberLimit: false,
      isAtMemberLimit: false,
      billableMembers,
      estimatedMonthlyBill: monthlyTotal,
    }
  }

  const maxMembers = planName === 'Institution' ? BASE_SUSTAINER_MEMBERS + additionalSlots : tier.maxMembers

  const memberUsagePercentage = maxMembers === 0 ? 100 : Math.min(100, Math.round((currentMembers / maxMembers) * 100))
  const isNearMemberLimit = memberUsagePercentage >= 80
  const isAtMemberLimit = currentMembers >= maxMembers

  return {
    planName,
    planTier: tier,
    planPeriod: (org?.plan_period || 'monthly') as PlanPeriod,
    planExpiresAt: org?.plan_expires_at || null,
    planStatus: org?.plan_status || 'active',
    whitelabelEnabled: org?.whitelabel_enabled ?? false,
    memberCount: currentMembers,
    maxMembers,
    additionalSlots,
    memberUsagePercentage,
    isNearMemberLimit,
    isAtMemberLimit,
  }
}
