export type OrgType = 'ngo' | 'student_union' | 'workers_union' | 'rwa'

export type OrgColor = 'brand' | 'emerald' | 'amber' | 'sky' | 'rose' | 'indigo'

export interface OrgTypeConfig {
  en: string
  hi: string
  color: OrgColor
}

export const ORG_TYPES: Record<OrgType, OrgTypeConfig> = {
  ngo: { en: 'NGO', hi: 'स्वयंसेवी संस्था', color: 'emerald' },
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
