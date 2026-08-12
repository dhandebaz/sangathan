export type PlanName = 'Community' | 'Institution'
export type PlanPeriod = 'monthly' | 'yearly' | 'lifetime' | 'one_time'

export interface PlanTier {
  id: PlanName
  name: string
  nameHi: string
  accessType: 'community' | 'sustainer'
  suggestedContributionMonthly: number
  suggestedContributionYearly: number
  priceMonthly: number
  priceYearly: number
  maxMembers: number
  maxStorageMb: number
  aiEnabled: boolean
  maxAiRequestsPerMonth: number
  multiOrg: boolean
  whiteLabelIncluded: boolean
  descriptionEn: string
  descriptionHi: string
  featuresEn: string[]
  featuresHi: string[]
}

export const COMMUNITY_CONTRIBUTION_PRESETS = [5, 10, 50, 100, 500] as const

export const PLAN_TIERS: Record<PlanName, PlanTier> = {
  Community: {
    id: 'Community',
    name: 'Community Access',
    nameHi: 'सामुदायिक पहुंच (Community Access)',
    accessType: 'community',
    suggestedContributionMonthly: 0,
    suggestedContributionYearly: 0,
    priceMonthly: 0,
    priceYearly: 0,
    maxMembers: 20,
    maxStorageMb: 500,
    aiEnabled: false,
    maxAiRequestsPerMonth: 0,
    multiOrg: false,
    whiteLabelIncluded: false,
    descriptionEn: 'Voluntary one-time contribution of your choice. Built for grassroots collectives, civic campaigns, independent student cells, and mutual-aid groups.',
    descriptionHi: 'आपकी पसंद का एकमुश्त स्वैच्छिक योगदान। जमीनी नागरिक समूहों, छात्र इकाइयों, अभियानों और आपसी-सहायता समूहों के लिए निर्मित।',
    featuresEn: [
      'Up to 20 active member & volunteer slots',
      'Dedicated collective organizing workspace',
      'All core democratic & governance tools',
      'Voting engine & anonymous secret ballots',
      'Coalition & Federation tools (Joint Front)',
      'Meetings, Tasks & Subgroup modules',
      'Public Petitions & Verified Member Badges',
      'Direct peer & community support',
    ],
    featuresHi: [
      '20 सक्रिय सदस्य और स्वयंसेवक स्लॉट तक',
      'समर्पित सामूहिक संगठनात्मक कार्यक्षेत्र',
      'सभी मुख्य लोकतांत्रिक और शासन उपकरण',
      'मतदान इंजन और गोपनीय गुप्त मतदान',
      'गठबंधन और महासंघ उपकरण (संयुक्त मोर्चा)',
      'बैठकें, कार्य और उप-समूह मॉड्यूल',
      'सार्वजनिक याचिकाएं और सत्यापित सदस्य बैज',
      'प्रत्यक्ष सामुदायिक सहायता',
    ],
  },
  Institution: {
    id: 'Institution',
    name: 'Sustainer Access',
    nameHi: 'संरक्षक पहुंच (Sustainer Access)',
    accessType: 'sustainer',
    suggestedContributionMonthly: 1000,
    suggestedContributionYearly: 10000, // 2 months subsidized
    priceMonthly: 1000,
    priceYearly: 10000,
    maxMembers: 100000, // Unlimited
    maxStorageMb: 50000,
    aiEnabled: true,
    maxAiRequestsPerMonth: 1000,
    multiOrg: true,
    whiteLabelIncluded: false,
    descriptionEn: 'Suggested ₹1,000/month (Pay what you can). For scaling NGOs, registered unions, and established associations sustaining civic infrastructure.',
    descriptionHi: 'सुझाया गया योगदान: ₹1,000/माह (क्षमता अनुसार योगदान करें)। बढ़ते एनजीओ, पंजीकृत संघों और नागरिक बुनियादी ढांचे को बनाए रखने वाले संस्थानों के लिए।',
    featuresEn: [
      'Unlimited members & cadre capacity',
      'Sangathan AI Intelligence Suite (Minutes, Triage, Grants & Analysis)',
      'Multi-chapter / Multi-collective management with Admin controls',
      'Advanced analytics, custom filters & full data export',
      'Automated compliance, audit logs & statutory registers',
      'Cross-subsidizes secure server infrastructure for smaller collectives',
      'Priority email & organizational onboarding assistance',
    ],
    featuresHi: [
      'असीमित सदस्य और काडर क्षमता',
      'संगठन AI बुद्धिमत्ता सुइट (कार्यवृत्त, ट्राइएज, अनुदान और विश्लेषण)',
      'व्यवस्थापक नियंत्रण के साथ बहु-शाखा / बहु-सामूहिक प्रबंधन',
      'उन्नत विश्लेषिकी, कस्टम फ़िल्टर और पूर्ण डेटा निर्यात',
      'स्वचालित अनुपालन, ऑडिट लॉग और वैधानिक रजिस्टर',
      'छोटे नागरिक समूहों के लिए सुरक्षित सर्वर बुनियादी ढांचे को निधि देता है',
      'प्राथमिकता ईमेल और संगठनात्मक ऑनबोर्डिंग सहायता',
    ],
  },
}

export const WHITE_LABEL_ADDON = {
  price: 10000,
  nameEn: 'Custom Emblem & Identity Addon',
  nameHi: 'कस्टम प्रतीक और पहचान ऐड-ऑन',
  descriptionEn: 'Replace default platform attribution with your collective’s official emblem and identity across member badges, forms, and letterheads.',
  descriptionHi: 'सदस्य बैज, फॉर्म और लेटरहेड पर अपने सामूहिक के आधिकारिक प्रतीक और पहचान को प्राथमिकता दें।',
}

export function getPlanDetails(planName?: string | null): PlanTier {
  const normalized = (planName || 'Community') as PlanName
  return PLAN_TIERS[normalized] || PLAN_TIERS.Community
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
  memberUsagePercentage: number
  isNearMemberLimit: boolean
  isAtMemberLimit: boolean
}

