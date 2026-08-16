import { ColorPalette, ColorTheme, HeraldicSymbol } from './types'
import { OrgType } from '@/lib/org-types'

export const COLOR_PALETTES: Record<ColorTheme, ColorPalette> = {
  sovereign_navy: {
    id: 'sovereign_navy',
    name: 'Sovereign Navy & Gold',
    nameHi: 'सम्प्रभु नेवी व स्वर्ण',
    primary: '#0f172a',
    secondary: '#1e293b',
    accent: '#d97706',
    background: '#ffffff',
    textLight: '#ffffff',
    textDark: '#0f172a',
  },
  grassroots_emerald: {
    id: 'grassroots_emerald',
    name: 'Grassroots Emerald',
    nameHi: 'जमीनी पन्ना हरा',
    primary: '#064e3b',
    secondary: '#047857',
    accent: '#10b981',
    background: '#ffffff',
    textLight: '#ffffff',
    textDark: '#064e3b',
  },
  royal_indigo: {
    id: 'royal_indigo',
    name: 'Constitutional Indigo',
    nameHi: 'संवैधानिक इंडिगो',
    primary: '#1e1b4b',
    secondary: '#3730a3',
    accent: '#6366f1',
    background: '#ffffff',
    textLight: '#ffffff',
    textDark: '#1e1b4b',
  },
  crimson_flame: {
    id: 'crimson_flame',
    name: 'Movement Crimson',
    nameHi: 'आंदोलन गहरा लाल',
    primary: '#881337',
    secondary: '#be123c',
    accent: '#f43f5e',
    background: '#ffffff',
    textLight: '#ffffff',
    textDark: '#881337',
  },
  ink_monochrome: {
    id: 'ink_monochrome',
    name: 'Official Ink Monochrome',
    nameHi: 'आधिकारिक स्याही मोनोक्रोम',
    primary: '#09090b',
    secondary: '#27272a',
    accent: '#52525b',
    background: '#ffffff',
    textLight: '#ffffff',
    textDark: '#09090b',
  },
}

export const HERALDIC_SYMBOLS: HeraldicSymbol[] = [
  // Civic Collective
  {
    id: 'flame_of_freedom',
    name: 'Torch of Liberty',
    nameHi: 'स्वतंत्रता की मशाल',
    category: 'civic_collective',
    svgPath: 'M12 2c.5 2.5-1 4.5-2 6-1 1.5-1.5 3-1 4.5.5 1.5 2 2.5 3 2.5s2.5-1 3-2.5c.5-1.5 0-3-1-4.5-1-1.5-2.5-3.5-2-6z M8 16h8l-1.5 6h-5z',
  },
  {
    id: 'scales_of_justice',
    name: 'Scales of Rights (Art. 19)',
    nameHi: 'अधिकार व न्याय तराजू',
    category: 'civic_collective',
    svgPath: 'M12 3v18M6 8l-3 6h6l-3-6zm12 0l-3 6h6l-3-6zM3 8h18M9 21h6',
  },
  {
    id: 'banyan_tree',
    name: 'Banyan Tree of People',
    nameHi: 'लोक बरगद वृक्ष',
    category: 'civic_collective',
    svgPath: 'M12 22v-8m0 0c-3 0-6-2-6-5a6 6 0 0 1 12 0c0 3-3 5-6 5zm-3 8c0-3-2-5-2-7m8 7c0-3 2-5 2-7',
  },
  // NGO
  {
    id: 'dharma_wheel',
    name: 'Ashoka Chakra Motif',
    nameHi: 'धर्म चक्र प्रतीक',
    category: 'ngo',
    svgPath: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 3a7 7 0 1 1-7 7 7 7 0 0 1 7-7zm0 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0-5v4m0 12v4M2 12h4m12 0h4m-3.1-6.9l-2.8 2.8m-8.2 8.2l-2.8 2.8m0-13.8l2.8 2.8m8.2 8.2l2.8 2.8',
  },
  {
    id: 'helping_hands',
    name: 'Helping Hands & Compassion',
    nameHi: 'सेवा व सहकार हस्त',
    category: 'ngo',
    svgPath: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  },
  {
    id: 'open_book_sun',
    name: 'Light of Knowledge',
    nameHi: 'ज्ञान व चेतना प्रकाश',
    category: 'ngo',
    svgPath: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v15H6.5a2.5 2.5 0 0 0-2.5 2.5z M12 6v6m-3-3h6',
  },
  // Student Union
  {
    id: 'quill_and_torch',
    name: 'Quill & Torch of Truth',
    nameHi: 'कलम व चेतना मशाल',
    category: 'student_union',
    svgPath: 'M12 2l3 7-3 2-3-2 3-7zm-4 11h8v7l-4 2-4-2v-7zm2-2h4v2h-4v-2z',
  },
  {
    id: 'academic_star',
    name: 'Student Star of Progress',
    nameHi: 'छात्र प्रगति नक्षत्र',
    category: 'student_union',
    svgPath: 'M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z M12 7l1 3h3l-2.5 2 1 3-2.5-2-2.5 2 1-3-2.5-2h3z',
  },
  // Workers Union
  {
    id: 'industrial_gear',
    name: 'Unity Gear of Labor',
    nameHi: 'श्रम व एकता चक्र (गियर)',
    category: 'workers_union',
    svgPath: 'M12 8a4 4 0 1 0 4 4 4 4 0 0 0-4-4zm8.6 3.1l-1.8-.4a8 8 0 0 0-.8-1.9l1.1-1.5a1 1 0 0 0-.1-1.3l-1.4-1.4a1 1 0 0 0-1.3-.1l-1.5 1.1a8 8 0 0 0-1.9-.8l-.4-1.8A1 1 0 0 0 11.5 2h-2a1 1 0 0 0-1 .9l-.4 1.8a8 8 0 0 0-1.9.8L4.7 4.4a1 1 0 0 0-1.3.1L2 5.9a1 1 0 0 0-.1 1.3l1.1 1.5a8 8 0 0 0-.8 1.9l-1.8.4A1 1 0 0 0 0 12.1v2a1 1 0 0 0 .9 1l1.8.4a8 8 0 0 0 .8 1.9l-1.1 1.5a1 1 0 0 0 .1 1.3l1.4 1.4a1 1 0 0 0 1.3.1l1.5-1.1a8 8 0 0 0 1.9.8l.4 1.8a1 1 0 0 0 1 .9h2a1 1 0 0 0 1-.9l.4-1.8a8 8 0 0 0 1.9-.8l1.5 1.1a1 1 0 0 0 1.3-.1l1.4-1.4a1 1 0 0 0 .1-1.3l-1.1-1.5a8 8 0 0 0 .8-1.9l1.8-.4a1 1 0 0 0 .9-1v-2a1 1 0 0 0-.9-1z',
  },
  {
    id: 'clasped_hands',
    name: 'Solidarity Hands',
    nameHi: 'एकजुटता व संगठन हस्त',
    category: 'workers_union',
    svgPath: 'M16 11V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v4h-1V1a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v10H6V5a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v12a7 7 0 0 0 7 7h6a7 7 0 0 0 7-7v-6a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v1h-1z',
  },
  // RWA
  {
    id: 'community_housing',
    name: 'Colony & Community Shield',
    nameHi: 'आवासीय व समुदाय ढाल',
    category: 'rwa',
    svgPath: 'M12 2L2 7v7c0 5.5 4.3 10.7 10 12 5.7-1.3 10-6.5 10-12V7l-10-5zm0 4.5l6 4.5v6.5h-4v-4h-4v4H6V11l6-4.5z',
  },
  {
    id: 'protective_roof',
    name: 'Safe Haven & Prosperity Tree',
    nameHi: 'सुरक्षा छत्र व शांति वृक्ष',
    category: 'rwa',
    svgPath: 'M3 11l9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11zm9-3a3 3 0 0 0-3 3c0 2 3 5 3 5s3-3 3-5a3 3 0 0 0-3-3zm0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2z',
  },
]

export function getSymbolsForOrgType(orgType: OrgType): HeraldicSymbol[] {
  const specific = HERALDIC_SYMBOLS.filter((s) => s.category === orgType)
  if (specific.length > 0) return specific
  return HERALDIC_SYMBOLS
}
