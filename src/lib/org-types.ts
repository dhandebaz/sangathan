export type OrgType = 'civic_collective' | 'ngo' | 'student_union' | 'workers_union' | 'rwa'

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
  student_union: { 
    en: 'Student Union', 
    hi: 'छात्र संघ', 
    color: 'indigo',
    governingLaw: { en: 'University Statutes / UGC Guidelines / Lyngdoh Committee Mandate', hi: 'विश्वविद्यालय नियम / UGC दिशानिर्देश / लिंगदोह समिति आदेश' },
    registrarAuthority: { en: 'University Administration / DSW', hi: 'विश्वविद्यालय प्रशासन / DSW' }
  },
  workers_union: { 
    en: 'Workers Union', 
    hi: 'श्रमिक संघ', 
    color: 'amber',
    governingLaw: { en: 'Trade Unions Act, 1926', hi: 'ट्रेड यूनियन अधिनियम, 1926' },
    registrarAuthority: { en: 'Registrar of Trade Unions (State Labour Dept)', hi: 'ट्रेड यूनियन रजिस्ट्रार (राज्य श्रम विभाग)' }
  },
  rwa: { 
    en: 'RWA', 
    hi: 'आवासीय कल्याण संघ', 
    color: 'sky',
    governingLaw: { en: 'Societies Registration Act 1860 / State Cooperative & Apartment Acts', hi: 'सोसाइटी पंजीकरण अधिनियम 1860 / राज्य सहकारी व अपार्टमेंट अधिनियम' },
    registrarAuthority: { en: 'Registrar of Societies / Cooperative Registrar', hi: 'सोसाइटी रजिस्ट्रार / सहकारी रजिस्ट्रार' }
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
