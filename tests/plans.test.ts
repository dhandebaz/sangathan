import { describe, it, expect } from 'vitest'
import { getPlanDetails } from '@/lib/plans/config'

describe('Plan Limits & Tier Definitions', () => {
  it('should return default Community plan details when null or undefined is passed', () => {
    const details = getPlanDetails(null)
    expect(details.id).toBe('Community')
    expect(details.maxMembers).toBe(20)
    expect(details.aiEnabled).toBe(false)
    expect(details.priceMonthly).toBe(0)
  })

  it('should return Institution plan details with annual discount and AI enabled', () => {
    const details = getPlanDetails('Institution')
    expect(details.id).toBe('Institution')
    expect(details.maxMembers).toBe(1000)
    expect(details.aiEnabled).toBe(true)
    expect(details.priceMonthly).toBe(1000)
    expect(details.priceYearly).toBe(10000)
  })

  it('should return Federation plan details with coalition tools and white-label included', () => {
    const details = getPlanDetails('Federation')
    expect(details.id).toBe('Federation')
    expect(details.maxMembers).toBe(100000)
    expect(details.whiteLabelIncluded).toBe(true)
    expect(details.aiEnabled).toBe(true)
    expect(details.priceMonthly).toBe(4999)
  })
})
