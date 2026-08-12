export type OrgType = 'civic_collective' | 'ngo' | 'student_union' | 'workers_union' | 'rwa'

export type OrgColor = 'brand' | 'emerald' | 'amber' | 'sky' | 'rose' | 'indigo'

export interface OrgTypeConfig {
  en: string
  hi: string
  color: OrgColor
}

export const ORG_TYPES: Record<OrgType, OrgTypeConfig> = {
  civic_collective: { en: 'Civic Collective', hi: 'नागरिक समूह / मोर्चा', color: 'rose' },
  ngo: { en: 'Registered NGO', hi: 'पंजीकृत स्वयंसेवी संस्था (NGO)', color: 'emerald' },
  student_union: { en: 'Student Union', hi: 'छात्र संघ', color: 'indigo' },
  workers_union: { en: 'Workers Union', hi: 'श्रमिक संघ', color: 'amber' },
  rwa: { en: 'RWA', hi: 'आवासीय कल्याण संघ', color: 'sky' },
}

export function getOrgLabel(orgType: OrgType | string | undefined, lang: 'en' | 'hi' = 'en'): string {
  const type = (orgType || 'ngo') as OrgType
  return ORG_TYPES[type]?.[lang] || ORG_TYPES.ngo[lang]
}

export function getOrgColor(orgType: OrgType | string | undefined): OrgColor {
  const type = (orgType || 'ngo') as OrgType
  return ORG_TYPES[type]?.color || 'brand'
}
