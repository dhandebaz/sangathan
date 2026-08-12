import 'server-only'
import { createServiceClient } from '@/lib/supabase/service'
import {
  PlanName,
  PlanPeriod,
  PlanTier,
  PLAN_TIERS,
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

  // 1. Fetch Org Plan
  const { data: org } = await supabase
    .from('organisations')
    .select('plan_name')
    .eq('id', orgId)
    .single()

  const planName = (org?.plan_name || 'Community') as PlanName
  const tier = getPlanDetails(planName)

  // 2. Fetch Active Members Count from both members table and active profiles
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

  if (totalAllocated + additionalCount > tier.maxMembers) {
    const isCommunity = planName === 'Community'
    const errorMsg = isCommunity
      ? `Community Access capacity reached (${activeMembers}/${tier.maxMembers} member slots used). You can increase your contribution to Sustainer Access to expand member capacity and help sustain the platform for smaller collectives.`
      : `${tier.name} capacity reached (${activeMembers}/${tier.maxMembers} member slots used). Please contact support to expand capacity for your organization.`

    return {
      allowed: false,
      currentCount: totalAllocated,
      maxAllowed: tier.maxMembers,
      planName,
      error: errorMsg,
    }
  }

  return {
    allowed: true,
    currentCount: totalAllocated,
    maxAllowed: tier.maxMembers,
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
      memberUsagePercentage: 0,
      isNearMemberLimit: false,
      isAtMemberLimit: false,
    }
  }

  const [{ data: org }, { count: memberCount }] = await Promise.all([
    supabase
      .from('organisations')
      .select('plan_name, plan_period, plan_expires_at, plan_status, whitelabel_enabled')
      .eq('id', orgId)
      .single(),
    supabase
      .from('members')
      .select('id', { count: 'exact', head: true })
      .eq('organisation_id', orgId)
      .eq('status', 'active'),
  ])

  const planName = (org?.plan_name || 'Community') as PlanName
  const tier = getPlanDetails(planName)
  const currentMembers = memberCount || 0
  const maxMembers = tier.maxMembers
  const memberUsagePercentage = Math.min(100, Math.round((currentMembers / maxMembers) * 100))
  const isNearMemberLimit = memberUsagePercentage >= 80 && planName === 'Community'
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
    memberUsagePercentage,
    isNearMemberLimit,
    isAtMemberLimit,
  }
}
