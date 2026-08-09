export type PlanName = 'Community' | 'Institution'
export type PlanPeriod = 'monthly' | 'yearly' | 'lifetime'

export interface PlanTier {
  id: PlanName
  name: string
  nameHi: string
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

export const PLAN_TIERS: Record<PlanName, PlanTier> = {
  Community: {
    id: 'Community',
    name: 'Community',
    nameHi: 'समुदाय',
    priceMonthly: 0,
    priceYearly: 0,
    maxMembers: 20,
    maxStorageMb: 500,
    aiEnabled: false,
    maxAiRequestsPerMonth: 0,
    multiOrg: false,
    whiteLabelIncluded: false,
    descriptionEn: 'Free forever for grassroots collectives, independent student cells, and local community groups.',
    descriptionHi: 'जमीनी स्तर के समूहों, स्वतंत्र छात्र इकाइयों और स्थानीय सामुदायिक समूहों के लिए हमेशा के लिए मुफ्त।',
    featuresEn: [
      'Up to 20 users total (Members + Volunteers)',
      '1 Organisation space',
      'All core democratic & governance tools',
      'Voting engine & anonymous elections',
      'Coalition & Federation tools (संयुक्त मोर्चा)',
      'Meetings, Tasks & Subgroups',
      'Public Petitions & Verified Member Badges',
      'Standard community support',
    ],
    featuresHi: [
      'कुल 20 उपयोगकर्ता (सदस्य + स्वयंसेवक)',
      '1 संगठन स्थान',
      'सभी मुख्य लोकतांत्रिक और शासन उपकरण',
      'मतदान इंजन और गोपनीय चुनाव',
      'गठबंधन और महासंघ उपकरण (संयुक्त मोर्चा)',
      'बैठकें, कार्य और उप-समूह',
      'सार्वजनिक याचिकाएं और सत्यापित सदस्य बैज',
      'मानक समुदाय समर्थन',
    ],
  },
  Institution: {
    id: 'Institution',
    name: 'Institution',
    nameHi: 'संस्थान',
    priceMonthly: 1000,
    priceYearly: 10000, // 2 months free
    maxMembers: 100000, // Unlimited
    maxStorageMb: 50000,
    aiEnabled: true,
    maxAiRequestsPerMonth: 1000,
    multiOrg: true,
    whiteLabelIncluded: false,
    descriptionEn: 'Solidarity cost-sharing for scaling NGOs, registered trade unions, and established associations.',
    descriptionHi: 'बढ़ते एनजीओ, पंजीकृत ट्रेड यूनियनों और स्थापित संघों के लिए एकजुटता लागत-साझाकरण।',
    featuresEn: [
      'Unlimited users & members',
      'AI Intelligence Suite (Minutes, Triage, Grants via Llama 3.3 70B)',
      'Manage multiple orgs with Admin access',
      'Advanced analytics, custom filters & full data export',
      'Automated compliance & audit trails',
      'Cross-subsidizes free server hosting for grassroots groups',
      'Priority email & chat support',
    ],
    featuresHi: [
      'असीमित उपयोगकर्ता और सदस्य',
      'AI बुद्धिमत्ता सुइट (कार्यवृत्त, ट्राइएज, अनुदान ड्राफ्टिंग)',
      'व्यवस्थापक पहुँच के साथ कई संगठनों का प्रबंधन',
      'उन्नत विश्लेषिकी, कस्टम फ़िल्टर और पूर्ण डेटा निर्यात',
      'स्वचालित अनुपालन और ऑडिट ट्रेल्स',
      'जमीनी समूहों के लिए सर्वर होस्टिंग को निधि देता है',
      'प्राथमिकता ईमेल और सहायता',
    ],
  },
}

export const WHITE_LABEL_ADDON = {
  price: 10000,
  nameEn: 'White-label Branding Addon',
  nameHi: 'व्हाइट-लेबल ब्रांडिंग ऐड-ऑन',
  descriptionEn: 'Remove all "Powered by Sangathan" branding and use your custom logo and emblem everywhere.',
  descriptionHi: 'सभी "Powered by Sangathan" ब्रांडिंग हटाएं और हर जगह अपना कस्टम लोगो और प्रतीक उपयोग करें।',
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

