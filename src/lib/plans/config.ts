/**
 * PRICING PLAN v1.0 (locked) — monthly only, no annual, no slabs.
 *
 * - Community (Free, ₹0 forever): 5 profiles/org incl admin, branding on.
 * - Metered (billing on): (active − 5) × ₹11/month GST-inclusive. No base fee,
 *   no plan purchase — adding a UPI autopay mandate starts the meter.
 * - Institution: LEGACY grandfathered tier only (₹1,000 flat + 500 included
 *   while continuously subscribed). Never sold to new orgs.
 * - Whitelabel: ₹999 one-time per org, lifetime, both tiers.
 *
 * "Active" = logged in within the last 60 days (billing engine, Phase 2).
 * Until then, status-based counts apply (can only lower future bills).
 */

export type PlanName = 'Community' | 'Metered' | 'Institution'
export type PlanPeriod = 'monthly' | 'yearly' | 'lifetime' | 'one_time'

export interface PlanTier {
  id: PlanName
  name: string
  nameHi: string
  accessType: 'community' | 'metered' | 'sustainer'
  priceMonthly: number
  /** GST-inclusive. 0 for Community/Metered (metered has no base fee). */
  priceYearly: number
  maxMembers: number // hard cap (Community) / free allowance (Metered) / legacy base (Institution)
  additionalMemberPricePerMonth: number // ₹ per billable active beyond allowance
  maxStorageMb: number
  aiEnabled: boolean
  maxAiRequestsPerMonth: number
  multiOrg: boolean
  whiteLabelIncluded: boolean
  /** True for tiers no longer sold (kept for billing continuity). */
  legacyOnly?: boolean
  descriptionEn: string
  descriptionHi: string
  featuresEn: string[]
  featuresHi: string[]
}

export const FREE_MEMBER_ALLOWANCE = 5
export const METERED_PRICE_PER_ACTIVE = 11
export const WHITELABEL_ONE_TIME_PRICE = 999
export const FREE_MAX_SURVEYS = 3
export const FREE_MAX_RESPONSES_PER_MONTH = 500
export const METERED_MAX_SURVEYS = 50
export const METERED_MAX_RESPONSES_PER_MONTH = 50000
export const FREE_MAX_ORGS_PER_ACCOUNT = 2
export const ACTIVE_LOGIN_WINDOW_DAYS = 60

export const PLAN_TIERS: Record<PlanName, PlanTier> = {
  Community: {
    id: 'Community',
    name: 'Community Access',
    nameHi: 'सामुदायिक पहुंच (Community Access)',
    accessType: 'community',
    priceMonthly: 0,
    priceYearly: 0,
    maxMembers: FREE_MEMBER_ALLOWANCE,
    additionalMemberPricePerMonth: 0,
    maxStorageMb: 2048,
    aiEnabled: false,
    maxAiRequestsPerMonth: 0,
    multiOrg: false,
    whiteLabelIncluded: false,
    descriptionEn:
      'Free forever for grassroots groups up to 5 members. All core democratic tools, surveys and field-data included — this free tier is the trial.',
    descriptionHi:
      '5 सदस्यों तक के जमीनी समूहों के लिए हमेशा मुफ्त। सभी मुख्य लोकतांत्रिक उपकरण, सर्वेक्षण व फील्ड-डेटा सहित — यही मुफ्त ट्रायल है।',
    featuresEn: [
      'Up to 5 member profiles included (admin counted)',
      'All core democratic & governance tools (no feature gates)',
      'Voting engine & anonymous secret ballots',
      'Surveys (3 active) + field-data tools (air, water, waste logs)',
      'Donation records + 80G-ready receipts, registers, parcha studio',
      'Public petitions, transparency page & verified badges',
      'Meetings, tasks, events (2/month) & subgroup modules',
      'Open participation for public supporters, voters & petition signers (fair-use)',
    ],
    featuresHi: [
      '5 सदस्य प्रोफाइल शामिल (एडमिन सहित)',
      'सभी मुख्य लोकतांत्रिक व शासन उपकरण (कोई फीचर रोक नहीं)',
      'मतदान इंजन और गोपनीय गुप्त मतदान',
      'सर्वेक्षण (3 सक्रिय) + फील्ड-डेटा उपकरण (हवा, पानी, कचरा लॉग)',
      'दान रिकॉर्ड + 80G-तैयार रसीदें, रजिस्टर, पर्चा स्टूडियो',
      'सार्वजनिक याचिकाएं, पारदर्शिता पेज व सत्यापित बैज',
      'बैठकें, कार्य, कार्यक्रम (2/माह) व उप-समूह मॉड्यूल',
      'सार्वजनिक समर्थकों, मतदाताओं व याचिका हस्ताक्षरकर्ताओं की खुली भागीदारी (उचित उपयोग)',
    ],
  },
  Metered: {
    id: 'Metered',
    name: 'Metered Billing',
    nameHi: 'उपयोग-आधारित बिलिंग (Metered Billing)',
    accessType: 'metered',
    priceMonthly: 0,
    priceYearly: 0,
    maxMembers: FREE_MEMBER_ALLOWANCE,
    additionalMemberPricePerMonth: METERED_PRICE_PER_ACTIVE,
    maxStorageMb: 10240,
    aiEnabled: true,
    maxAiRequestsPerMonth: 1000,
    multiOrg: true,
    whiteLabelIncluded: false,
    descriptionEn:
      'No base fee, no plan to buy. Just (active members − 5) × ₹11/month, counted month-end. Pause anytime.',
    descriptionHi:
      'कोई बेस फीस नहीं, कोई प्लान खरीदना नहीं। सिर्फ (सक्रिय सदस्य − 5) × ₹11/माह, माह-अंत गणना। कभी भी रोकें।',
    featuresEn: [
      'Everything in Community Access, uncapped profiles',
      '(Active members − 5) × ₹11/month, billed month-end (e.g. 30 members = ₹275)',
      'Sangathan AI Intelligence Suite (Minutes, Triage, Grants & Analysis, quota-bound)',
      'Plugins & integrations (Canva first, rolling out) — paying orgs only',
      'Surveys (50 active) + 50,000 responses/month',
      'Advanced analytics, custom filters & full data export',
      'Priority email & onboarding assistance',
      'Pause billing anytime — data stays, meter stops',
    ],
    featuresHi: [
      'सामुदायिक पहुंच की सभी सुविधाएं, बिना प्रोफाइल सीमा',
      '(सक्रिय सदस्य − 5) × ₹11/माह, माह-अंत बिलिंग (जैसे 30 सदस्य = ₹275)',
      'संगठन AI सुइट (कार्यवृत्त, ट्राइएज, अनुदान व विश्लेषण, कोटा सहित)',
      'प्लगइन्स व इंटीग्रेशन (पहले Canva, जल्द आ रहा) — सिर्फ भुगतान करने वाले संगठन',
      'सर्वेक्षण (50 सक्रिय) + 50,000 प्रत्युत्तर/माह',
      'उन्नत विश्लेषण, कस्टम फ़िल्टर व पूर्ण डेटा निर्यात',
      'प्राथमिकता ईमेल व ऑनबोर्डिंग सहायता',
      'बिलिंग कभी भी रोकें — डेटा रहेगा, मीटर रुकेगा',
    ],
  },
  Institution: {
    id: 'Institution',
    name: 'Sustainer Access',
    nameHi: 'संरक्षक पहुंच (Sustainer Access)',
    accessType: 'sustainer',
    priceMonthly: 1000,
    priceYearly: 10000,
    maxMembers: 500, // legacy base, grandfathered only
    additionalMemberPricePerMonth: 11,
    maxStorageMb: 50000,
    aiEnabled: true,
    maxAiRequestsPerMonth: 1000,
    multiOrg: true,
    whiteLabelIncluded: false,
    legacyOnly: true,
    descriptionEn:
      'Legacy grandfathered tier (no longer sold). ₹1,000/month flat with 500 active cadres included while continuously subscribed.',
    descriptionHi:
      'पुरानी सुरक्षित श्रेणी (अब बेची नहीं जाती)। निरंतर सदस्यता पर ₹1,000/माह फ्लट, 500 सक्रिय काडर सहित।',
    featuresEn: [
      '500 active cadre & member slots included (Scale at ₹11/cadre/mo)',
      'Sangathan AI Intelligence Suite (Minutes, Triage, Grants & Analysis)',
      'Multi-chapter / Multi-collective management with Admin controls',
      'Advanced analytics, custom filters & full data export',
      'Automated compliance, audit logs & statutory registers',
      'Priority email & organizational onboarding assistance',
    ],
    featuresHi: [
      '500 सक्रिय काडर और सदस्य स्लॉट शामिल (₹11/काडर/माह पर विस्तार योग्य)',
      'संगठन AI बुद्धिमत्ता सुइट (कार्यवृत्त, ट्राइएज, अनुदान और विश्लेषण)',
      'व्यवस्थापक नियंत्रण के साथ बहु-शाखा / बहु-सामूहिक प्रबंधन',
      'उन्नत विश्लेषण, कस्टम फ़िल्टर और पूर्ण डेटा निर्यात',
      'स्वचालित अनुपालन, ऑडिट लॉग और वैधानिक रजिस्टर',
      'प्राथमिकता ईमेल और संगठनात्मक ऑनबोर्डिंग सहायता',
    ],
  },
}

export const WHITE_LABEL_ADDON = {
  price: WHITELABEL_ONE_TIME_PRICE,
  nameEn: 'Whitelabel for Life',
  nameHi: 'लाइफटाइम व्हाइट-लेबल',
  descriptionEn:
    'One-time payment. Removes "Powered by Sangathan" branding and puts your emblem first across public pages, events, letters and badges — forever. Buyable on Free and Metered.',
  descriptionHi:
    'एकमुश्त भुगतान। सार्वजनिक पेजों, कार्यक्रमों, पत्रों व बैज से "Powered by Sangathan" हटाकर आपका प्रतीक पहले — हमेशा के लिए। मुफ्त और मीटर वाली दोनों श्रेणियों पर खरीद योग्य।',
}

/** Legacy one-time voluntary presets (kept for supporter page; not part of plan pricing). */
export const COMMUNITY_CONTRIBUTION_PRESETS = [5, 10, 50, 100, 500] as const

/** @deprecated Legacy Sustainer base (500). Kept for grandfathered billing only. */
export const BASE_SUSTAINER_MEMBERS = 500
/** Price per billable active member per month (metered overflow + legacy overage). */
export const ADDITIONAL_MEMBER_PRICE_PER_MONTH = METERED_PRICE_PER_ACTIVE

export function getPlanDetails(planName?: string | null): PlanTier {
  const normalized = (planName || 'Community') as PlanName
  return PLAN_TIERS[normalized] || PLAN_TIERS.Community
}

/**
 * Metered bill: (active members − free allowance) × ₹11. No base fee.
 * Examples: 5 → ₹0 · 26 → ₹231 · 30 → ₹275 · 50 → ₹495 · 100 → ₹1,045.
 */
export function calculateMeteredBill(activeMembers: number): {
  billableMembers: number
  monthlyTotal: number
} {
  const billableMembers = Math.max(0, Math.floor(activeMembers) - FREE_MEMBER_ALLOWANCE)
  return {
    billableMembers,
    monthlyTotal: billableMembers * METERED_PRICE_PER_ACTIVE,
  }
}

/**
 * @deprecated Legacy Sustainer calc (₹1,000 base + 500 included). Grandfathered billing only.
 */
export function calculateSustainerPricing(
  memberCount: number,
  billingCycle: 'monthly' | 'yearly' = 'monthly'
): {
  baseMembers: number
  extraMembers: number
  basePrice: number
  extraPrice: number
  totalPrice: number
  monthlyEquivalent: number
} {
  const baseMembers = BASE_SUSTAINER_MEMBERS // 500
  const extraMembers = Math.max(0, memberCount - baseMembers)

  if (billingCycle === 'yearly') {
    const basePrice = PLAN_TIERS.Institution.priceYearly // 10,000
    const extraPrice = extraMembers * ADDITIONAL_MEMBER_PRICE_PER_MONTH * 10
    const totalPrice = basePrice + extraPrice
    return {
      baseMembers,
      extraMembers,
      basePrice,
      extraPrice,
      totalPrice,
      monthlyEquivalent: Math.round(totalPrice / 12),
    }
  }

  const basePrice = PLAN_TIERS.Institution.priceMonthly // 1,000
  const extraPrice = extraMembers * ADDITIONAL_MEMBER_PRICE_PER_MONTH
  const totalPrice = basePrice + extraPrice
  return {
    baseMembers,
    extraMembers,
    basePrice,
    extraPrice,
    totalPrice,
    monthlyEquivalent: totalPrice,
  }
}

export interface OrgPlanUsage {
  planName: PlanName
  planTier: PlanTier
  planPeriod: PlanPeriod
  planExpiresAt: string | null
  planStatus: string
  whitelabelEnabled: boolean
  memberCount: number
  maxMembers: number
  additionalSlots: number
  memberUsagePercentage: number
  isNearMemberLimit: boolean
  isAtMemberLimit: boolean
  /** Metered only: actives beyond the free allowance. */
  billableMembers?: number
  /** Metered only: estimated monthly bill in ₹. */
  estimatedMonthlyBill?: number
}
