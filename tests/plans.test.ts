import { describe, it, expect } from 'vitest'
import { getPlanDetails, WHITE_LABEL_ADDON } from '@/lib/plans/config'

describe('Plan Limits & Civic Tier Definitions', () => {
  it('should return default Community plan details when null or undefined is passed', () => {
    const details = getPlanDetails(null)
    expect(details.id).toBe('Community')
    expect(details.maxMembers).toBe(20)
    expect(details.aiEnabled).toBe(false)
    expect(details.priceMonthly).toBe(0)
  })

  it('should return Institution plan details with annual discount, AI enabled, and unlimited members', () => {
    const details = getPlanDetails('Institution')
    expect(details.id).toBe('Institution')
    expect(details.maxMembers).toBe(100000)
    expect(details.aiEnabled).toBe(true)
    expect(details.priceMonthly).toBe(1000)
    expect(details.priceYearly).toBe(10000)
  })

  it('should verify white-label addon details', () => {
    expect(WHITE_LABEL_ADDON.price).toBe(10000)
  })
})
