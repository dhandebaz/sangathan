export type PlanName = 'Community' | 'Institution' | 'Federation'
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
    descriptionEn: 'For small, informal grassroots collectives just getting started.',
    descriptionHi: 'छोटे, अनौपचारिक जमीनी समूहों के लिए।',
    featuresEn: [
      'Up to 20 users total (Members + Volunteers)',
      '1 Organisation space',
      'All core democratic & governance tools',
      'Meetings, Tasks & Subgroups',
      'Elections & Voting engine',
      'Standard community support',
    ],
    featuresHi: [
      'कुल 20 उपयोगकर्ता (सदस्य + स्वयंसेवक)',
      '1 संगठन स्थान',
      'सभी मुख्य लोकतांत्रिक और शासन उपकरण',
      'बैठकें, कार्य और उप-समूह',
      'चुनाव और मतदान इंजन',
      'मानक समुदाय समर्थन',
    ],
  },
  Institution: {
    id: 'Institution',
    name: 'Institution',
    nameHi: 'संस्थान',
    priceMonthly: 1000,
    priceYearly: 10000, // 2 months free
    maxMembers: 1000,
    maxStorageMb: 25000,
    aiEnabled: true,
    maxAiRequestsPerMonth: 1000,
    multiOrg: true,
    whiteLabelIncluded: false,
    descriptionEn: 'For scaling NGOs, active trade unions, and established associations.',
    descriptionHi: 'बढ़ते एनजीओ, सक्रिय ट्रेड यूनियनों और स्थापित संघों के लिए।',
    featuresEn: [
      'Up to 1,000 active members',
      'AI-Powered Intelligence (Minutes, Triage, Grants)',
      'Manage multiple orgs with Admin access',
      'Advanced analytics, custom filters & data export',
      'Automated compliance & audit trails',
      'Priority email & WhatsApp support',
    ],
    featuresHi: [
      '1,000 सक्रिय सदस्यों तक',
      'AI-संचालित बुद्धिमत्ता (कार्यवृत्त, ट्राइएज, अनुदान)',
      'व्यवस्थापक पहुँच के साथ कई संगठनों का प्रबंधन',
      'उन्नत विश्लेषिकी, कस्टम फ़िल्टर और डेटा निर्यात',
      'स्वचालित अनुपालन और ऑडिट ट्रेल्स',
      'प्राथमिकता ईमेल और सहायता',
    ],
  },
  Federation: {
    id: 'Federation',
    name: 'Federation',
    nameHi: 'महासंघ',
    priceMonthly: 4999,
    priceYearly: 49999, // 2 months free
    maxMembers: 100000, // effectively unlimited for mega-unions
    maxStorageMb: 100000,
    aiEnabled: true,
    maxAiRequestsPerMonth: 5000,
    multiOrg: true,
    whiteLabelIncluded: true,
    descriptionEn: 'For state/national union federations, coalitions, and mass movements.',
    descriptionHi: 'राज्य/राष्ट्रीय संघ महासंघों, गठबंधनों और जन आंदोलनों के लिए।',
    featuresEn: [
      '1,000+ Unlimited members across chapters',
      'Cross-organisation coalition & federation tools',
      'Full White-label branding included',
      'Dedicated sovereign database SLA',
      'Highest priority 24/7 dedicated support',
      'Custom onboarding & governance training',
    ],
    featuresHi: [
      'सभी शाखाओं में 1,000+ असीमित सदस्य',
      'अंतर-संगठन गठबंधन और महासंघ उपकरण',
      'पूर्ण व्हाइट-लेबल ब्रांडिंग शामिल',
      'समर्पित संप्रभु डेटाबेस SLA',
      'सर्वोच्च प्राथमिकता 24/7 समर्पित सहायता',
      'कस्टम ऑनबोर्डिंग और प्रशिक्षण',
    ],
  },
}

export const WHITE_LABEL_ADDON = {
  price: 10000,
  nameEn: 'White-label Branding Addon',
  nameHi: 'व्हाइट-लेबल ब्रांडिंग ऐड-ऑन',
  descriptionEn: 'Remove all "Powered by Sangathan" branding and use your custom logo everywhere.',
  descriptionHi: 'सभी "Powered by Sangathan" ब्रांडिंग हटाएं और हर जगह अपना कस्टम लोगो उपयोग करें।',
}

export function getPlanDetails(planName?: string | null): PlanTier {
  const normalized = (planName || 'Community') as PlanName
  return PLAN_TIERS[normalized] || PLAN_TIERS.Community
}
