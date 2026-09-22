export type OrgType = 'civic_collective' | 'ngo'

export type OrgColor = 'brand' | 'emerald' | 'amber' | 'sky' | 'rose' | 'indigo'

export interface OrgTypeConfig {
  en: string
  hi: string
  color: OrgColor
  governingLaw?: { en: string; hi: string }
  registrarAuthority?: { en: string; hi: string }
}

export const ORG_TYPES: Record<OrgType, OrgTypeConfig> = {
  civic_collective: { 
    en: 'Civic Collective', 
    hi: 'नागरिक समूह / मोर्चा', 
    color: 'rose',
    governingLaw: { en: 'None (informal collective)', hi: 'कोई नहीं (अनौपचारिक सामूहिक)' }
  },
  ngo: { 
    en: 'Registered NGO', 
    hi: 'पंजीकृत स्वयंसेवी संस्था (NGO)', 
    color: 'emerald',
    governingLaw: { en: 'Societies Registration Act 1860 / Indian Trusts Act 1882 / Companies Act 2013 (S.8)', hi: 'सोसाइटी पंजीकरण अधिनियम 1860 / भारतीय ट्रस्ट अधिनियम 1882 / कंपनी अधिनियम 2013 (धारा 8)' },
    registrarAuthority: { en: 'Registrar of Societies / Sub-Registrar / MCA', hi: 'सोसाइटी रजिस्ट्रार / उप-पंजीयक / MCA' }
  },
}

export function getOrgLabel(orgType: OrgType | string | undefined, lang: 'en' | 'hi' = 'en'): string {
  const type = (orgType || 'ngo') as OrgType
  return ORG_TYPES[type]?.[lang] || ORG_TYPES.ngo[lang]
}

export function getOrgColor(orgType: OrgType | string | undefined): OrgColor {
  const type = (orgType || 'ngo') as OrgType
  return ORG_TYPES[type]?.color || 'brand'
}
