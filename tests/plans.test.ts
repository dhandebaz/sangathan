import { describe, it, expect } from 'vitest'
import {
  getPlanDetails,
  WHITE_LABEL_ADDON,
  COMMUNITY_CONTRIBUTION_PRESETS,
  FREE_MEMBER_ALLOWANCE,
  METERED_PRICE_PER_ACTIVE,
  WHITELABEL_ONE_TIME_PRICE,
  calculateMeteredBill,
} from '@/lib/plans/config'

describe('Plan Limits & Pricing v1.0 (metered, monthly-only)', () => {
  it('should return default Community plan with 5 free profiles and no AI', () => {
    const details = getPlanDetails(null)
    expect(details.id).toBe('Community')
    expect(details.name).toBe('Community Access')
    expect(details.accessType).toBe('community')
    expect(details.maxMembers).toBe(5)
    expect(details.aiEnabled).toBe(false)
    expect(details.priceMonthly).toBe(0)
    expect(details.priceYearly).toBe(0)
    expect(COMMUNITY_CONTRIBUTION_PRESETS).toContain(5)
    expect(COMMUNITY_CONTRIBUTION_PRESETS).toContain(500)
  })

  it('should define the Metered tier with no base fee and ₹11 per billable active', () => {
    const details = getPlanDetails('Metered')
    expect(details.id).toBe('Metered')
    expect(details.accessType).toBe('metered')
    expect(details.priceMonthly).toBe(0)
    expect(details.priceYearly).toBe(0)
    expect(details.additionalMemberPricePerMonth).toBe(11)
    expect(details.aiEnabled).toBe(true)
    expect(details.legacyOnly).toBeFalsy()
  })

  it('should keep the Institution tier as legacy-only with its 500 base', () => {
    const details = getPlanDetails('Institution')
    expect(details.id).toBe('Institution')
    expect(details.legacyOnly).toBe(true)
    expect(details.maxMembers).toBe(500)
    expect(details.priceMonthly).toBe(1000)
  })

  it('should price the whitelabel addon as a ₹999 one-time payment', () => {
    expect(WHITE_LABEL_ADDON.price).toBe(999)
    expect(WHITE_LABEL_ADDON.price).toBe(WHITELABEL_ONE_TIME_PRICE)
    expect(WHITE_LABEL_ADDON.nameEn).toContain('Whitelabel')
  })

  it('should calculate metered bills as (actives − 5) × ₹11 with no base fee', () => {
    expect(FREE_MEMBER_ALLOWANCE).toBe(5)
    expect(METERED_PRICE_PER_ACTIVE).toBe(11)
    expect(calculateMeteredBill(0)).toEqual({ billableMembers: 0, monthlyTotal: 0 })
    expect(calculateMeteredBill(5)).toEqual({ billableMembers: 0, monthlyTotal: 0 })
    expect(calculateMeteredBill(6)).toEqual({ billableMembers: 1, monthlyTotal: 11 })
    expect(calculateMeteredBill(26)).toEqual({ billableMembers: 21, monthlyTotal: 231 })
    expect(calculateMeteredBill(30)).toEqual({ billableMembers: 25, monthlyTotal: 275 })
    expect(calculateMeteredBill(50)).toEqual({ billableMembers: 45, monthlyTotal: 495 })
    expect(calculateMeteredBill(100)).toEqual({ billableMembers: 95, monthlyTotal: 1045 })
  })
})
