import 'server-only'
import { createServiceClient } from '@/lib/supabase/service'
import {
  PlanName,
  PlanPeriod,
  PlanTier,
  PLAN_TIERS,
  BASE_SUSTAINER_MEMBERS,
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
    return { allowed: true, currentCount: 0, maxAllowed: 20, planName: 'Community' }
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

  const maxAllowed = planName === 'Institution' 
    ? BASE_SUSTAINER_MEMBERS + additionalSlots 
    : tier.maxMembers

  // 2. Fetch Active Members Count from both members table and pending active invites
  const [membersRes, invitesRes] = await Promise.all([
    supabase
      .from('members')
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
      ? `Community Access capacity reached (${activeMembers}/${maxAllowed} member slots used). You can increase your contribution to Sustainer Access (500 member slots included) to expand capacity.`
      : `Sustainer Access capacity reached (${activeMembers}/${maxAllowed} member slots used). You can easily expand your capacity for ₹11/cadre/month in Org Settings & Billing.`

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
      .from('members')
      .select('id', { count: 'exact', head: true })
      .eq('organisation_id', orgId)
      .eq('status', 'active'),
  ])

  const planName = (org?.plan_name || 'Community') as PlanName
  const tier = getPlanDetails(planName)
  const caps = (org?.capabilities as Record<string, unknown>) || {}
  const additionalSlots = typeof caps.additional_member_slots === 'number' ? Math.max(0, caps.additional_member_slots) : 0
  const maxMembers = planName === 'Institution' ? BASE_SUSTAINER_MEMBERS + additionalSlots : tier.maxMembers

  const currentMembers = memberCount || 0
  const memberUsagePercentage = Math.min(100, Math.round((currentMembers / maxMembers) * 100))
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
