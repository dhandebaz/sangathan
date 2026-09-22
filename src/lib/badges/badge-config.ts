import { OrgType } from '@/lib/org-types'

export type BadgeTemplate = 'executive_seal' | 'social_graphic' | 'digital_id' | 'technical_minimalist' | 'tricolor_inquilab'
export type AspectRatio = '1:1' | '9:16' | '16:9' | 'cr80_id'
export type LanguageMode = 'en' | 'hi' | 'bilingual'

export interface OrgArchetypeConfig {
  nameEn: string
  nameHi: string
  ribbonHeaderEn: string
  ribbonHeaderHi: string
  statutoryTagEn: string
  statutoryTagHi: string
  defaultTheme: string
  defaultSymbol: string
  badgeTiers: Array<{ value: string; labelEn: string; labelHi: string }>
  defaultRoles: string[]
}

// 2 Sangathan Org Archetypes configuration
export const ORG_ARCHETYPES: Record<OrgType, OrgArchetypeConfig> = {
  civic_collective: {
    nameEn: 'Civic Collective & Grassroots Movement',
    nameHi: 'नागरिक समूह व जमीनी आंदोलन',
    ribbonHeaderEn: '✦ SANGATHAN VERIFIED CIVIC NETWORK • BAHUJAN QUEER FOUNDATION CERTIFIED ✦',
    ribbonHeaderHi: '✦ संगठन सत्यापित नागरिक नेटवर्क • बीक्यूएफ प्रमाणित ✦',
    statutoryTagEn: 'GRASSROOTS CIVIC ACTION NETWORK • UNREGISTERED COLLECTIVE',
    statutoryTagHi: 'जमीनी नागरिक नेटवर्क • जन सामूहिक पहल',
    defaultTheme: 'tricolor_saffron',
    defaultSymbol: 'scales_of_justice',
    badgeTiers: [
      { value: 'Verified Constitutional & Civic Protector', labelEn: 'Verified Constitutional Protector', labelHi: 'सत्यापित संवैधानिक व नागरिक रक्षक' },
      { value: 'Verified Citizen Science Field Auditor', labelEn: 'Citizen Science Field Auditor', labelHi: 'नागरिक विज्ञान फील्ड ऑडिटर' },
      { value: 'Verified Environmental & Climate Defender', labelEn: 'Environmental & Climate Defender', labelHi: 'पर्यावरण व जलवायु रक्षक' },
      { value: 'Verified RTI & Legal Aid Volunteer', labelEn: 'RTI & Legal Aid Volunteer', labelHi: 'RTI व विधिक सहायता साथी' },
      { value: 'BQF Ground Fellow • Sec 8 Certified', labelEn: 'BQF Ground Fellow (Sec 8)', labelHi: 'BQF जमीनी साथी (धारा 8)' },
      { value: 'Grassroots Campaign Organizer', labelEn: 'Grassroots Campaign Organizer', labelHi: 'जमीनी अभियान संगठक' },
    ],
    defaultRoles: ['Active Member', 'Lead Organizer', 'Field Auditor', 'Legal Defense Coordinator', 'Area Convener', 'Volunteer'],
  },
  ngo: {
    nameEn: 'Registered Non-Governmental Org (NGO)',
    nameHi: 'पंजीकृत स्वयंसेवी संस्था (NGO)',
    ribbonHeaderEn: '✦ REGISTERED NGO • PUBLIC TRUST & TRANSPARENCY NETWORK ✦',
    ribbonHeaderHi: '✦ पंजीकृत गैर-सरकारी संगठन • लोक विश्वास व पारदर्शिता ✦',
    statutoryTagEn: 'SOCIETIES REG. ACT 1860 / SEC 8 NGO • 80G COMPLIANT LEDGER',
    statutoryTagHi: 'सोसाइटी पंजीकरण अधिनियम 1860 / धारा 8 NGO • 80G अनुपालित',
    defaultTheme: 'grassroots_emerald',
    defaultSymbol: 'open_book_sun',
    badgeTiers: [
      { value: 'Certified Humanitarian Volunteer', labelEn: 'Certified Humanitarian Volunteer', labelHi: 'प्रमाणित सेवादार / स्वयंसेवक' },
      { value: '80G Public Transparency & Compliance Officer', labelEn: '80G Transparency & Compliance Officer', labelHi: '80G पारदर्शिता व अनुपालन अधिकारी' },
      { value: 'Field Project Lead & Aid Worker', labelEn: 'Field Project Lead & Aid Worker', labelHi: 'फील्ड प्रोजेक्ट प्रभारी व राहत कर्मी' },
      { value: 'Public Trust & Community Fellow', labelEn: 'Public Trust & Community Fellow', labelHi: 'लोक विश्वास व समुदाय फेलो' },
      { value: 'Disaster Relief Rapid Responder', labelEn: 'Disaster Relief Rapid Responder', labelHi: 'आपदा राहत त्वरित प्रतिक्रिया दल' },
      { value: 'Executive Trustee & Board Member', labelEn: 'Executive Trustee & Board Member', labelHi: 'कार्यकारी ट्रस्टी व बोर्ड सदस्य' },
    ],
    defaultRoles: ['Volunteer', 'Project Coordinator', 'Program Director', 'Field Officer', 'Trustee', 'Executive Director'],
  },
}

// 8 Rich Movement Themes (Light, Crisp & High-Contrast)
export const BADGE_THEMES = [
  {
    id: 'tricolor_saffron',
    name: 'Constitution Tricolor (Saffron & Emerald)',
    nameHi: 'संविधान तिरंगा (केसरिया व हरा)',
    bgGradient: ['#FFFBF5', '#F0FDF4'],
    cardBg: 'rgba(255, 255, 255, 0.98)',
    accent: '#D97706',
    accentLight: '#F59E0B',
    badgeBg: '#15803D',
    textColor: '#0F172A',
    subTextColor: '#475569',
    cardBorder: '#CBD5E1',
    pillBg: 'rgba(217, 119, 6, 0.1)',
    pillBorder: '#D97706',
  },
  {
    id: 'sovereign_navy',
    name: 'Democratic Navy & Gold',
    nameHi: 'लोकतांत्रिक नेवी व स्वर्ण',
    bgGradient: ['#F8FAFC', '#EFF6FF'],
    cardBg: 'rgba(255, 255, 255, 0.98)',
    accent: '#2563EB',
    accentLight: '#60A5FA',
    badgeBg: '#1D4ED8',
    textColor: '#0F172A',
    subTextColor: '#475569',
    cardBorder: '#CBD5E1',
    pillBg: 'rgba(37, 99, 235, 0.1)',
    pillBorder: '#2563EB',
  },
  {
    id: 'grassroots_emerald',
    name: 'Grassroots Forest & Mint (NGO / Eco)',
    nameHi: 'जमीनी वन हरा व मिंट (एनजीओ)',
    bgGradient: ['#F0FDF4', '#ECFDF5'],
    cardBg: 'rgba(255, 255, 255, 0.98)',
    accent: '#059669',
    accentLight: '#34D399',
    badgeBg: '#047857',
    textColor: '#064E3B',
    subTextColor: '#047857',
    cardBorder: '#A7F3D0',
    pillBg: 'rgba(5, 150, 105, 0.1)',
    pillBorder: '#059669',
  },
  {
    id: 'inquilab_crimson',
    name: 'Inquilab Crimson & Terracotta (Workers)',
    nameHi: 'इंकलाब लाल व टेराकोटा (मजदूर)',
    bgGradient: ['#FFF1F2', '#FFE4E6'],
    cardBg: 'rgba(255, 255, 255, 0.98)',
    accent: '#E11D48',
    accentLight: '#FB7185',
    badgeBg: '#BE123C',
    textColor: '#881337',
    subTextColor: '#9F1239',
    cardBorder: '#FECDD3',
    pillBg: 'rgba(225, 29, 72, 0.1)',
    pillBorder: '#E11D48',
  },
  {
    id: 'royal_indigo',
    name: 'Constitutional Indigo & Azure (Student)',
    nameHi: 'संवैधानिक इंडिगो व आसमानी (छात्र)',
    bgGradient: ['#EEF2FF', '#E0E7FF'],
    cardBg: 'rgba(255, 255, 255, 0.98)',
    accent: '#4F46E5',
    accentLight: '#818CF8',
    badgeBg: '#4338CA',
    textColor: '#1E1B4B',
    subTextColor: '#3730A3',
    cardBorder: '#C7D2FE',
    pillBg: 'rgba(79, 70, 229, 0.1)',
    pillBorder: '#4F46E5',
  },
  {
    id: 'earth_terracotta',
    name: 'Earth Terracotta & Raw Amber',
    nameHi: 'धरती माटी व अंबर',
    bgGradient: ['#FFFBEB', '#FEF3C7'],
    cardBg: 'rgba(255, 255, 255, 0.98)',
    accent: '#D97706',
    accentLight: '#FBBF24',
    badgeBg: '#B45309',
    textColor: '#78350F',
    subTextColor: '#92400E',
    cardBorder: '#FDE68A',
    pillBg: 'rgba(217, 119, 6, 0.1)',
    pillBorder: '#D97706',
  },
  {
    id: 'technical_slate',
    name: 'Clean Technical Slate & Cyan',
    nameHi: 'तकनीकी स्लेट व स्यान',
    bgGradient: ['#F8FAFC', '#F1F5F9'],
    cardBg: 'rgba(255, 255, 255, 0.98)',
    accent: '#0284C7',
    accentLight: '#38BDF8',
    badgeBg: '#0369A1',
    textColor: '#0F172A',
    subTextColor: '#64748B',
    cardBorder: '#CBD5E1',
    pillBg: 'rgba(2, 132, 199, 0.1)',
    pillBorder: '#0284C7',
  },
  {
    id: 'ink_monochrome',
    name: 'Official Ink & Photostat Monochrome',
    nameHi: 'आधिकारिक स्याही मोनोक्रोम (फोटोस्टेट)',
    bgGradient: ['#FFFFFF', '#F8FAFC'],
    cardBg: 'rgba(255, 255, 255, 1)',
    accent: '#18181B',
    accentLight: '#3F3F46',
    badgeBg: '#27272A',
    textColor: '#09090B',
    subTextColor: '#52525B',
    cardBorder: '#E4E4E7',
    pillBg: 'rgba(24, 24, 27, 0.08)',
    pillBorder: '#18181B',
  },
]
