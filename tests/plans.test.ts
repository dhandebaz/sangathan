import { describe, it, expect } from 'vitest'
import { getPlanDetails, WHITE_LABEL_ADDON, COMMUNITY_CONTRIBUTION_PRESETS } from '@/lib/plans/config'

describe('Plan Limits & Civic Tier Definitions', () => {
  it('should return default Community Access plan details when null or undefined is passed', () => {
    const details = getPlanDetails(null)
    expect(details.id).toBe('Community')
    expect(details.name).toBe('Community Access')
    expect(details.accessType).toBe('community')
    expect(details.maxMembers).toBe(20)
    expect(details.aiEnabled).toBe(false)
    expect(details.priceMonthly).toBe(0)
    expect(COMMUNITY_CONTRIBUTION_PRESETS).toContain(5)
    expect(COMMUNITY_CONTRIBUTION_PRESETS).toContain(500)
  })

  it('should return Sustainer Access plan details with suggested contribution, AI enabled, and unlimited members', () => {
    const details = getPlanDetails('Institution')
    expect(details.id).toBe('Institution')
    expect(details.name).toBe('Sustainer Access')
    expect(details.accessType).toBe('sustainer')
    expect(details.maxMembers).toBe(100000)
    expect(details.aiEnabled).toBe(true)
    expect(details.suggestedContributionMonthly).toBe(1000)
    expect(details.suggestedContributionYearly).toBe(10000)
  })

  it('should verify custom emblem addon details', () => {
    expect(WHITE_LABEL_ADDON.price).toBe(10000)
    expect(WHITE_LABEL_ADDON.nameEn).toContain('Custom Emblem')
  })
})
