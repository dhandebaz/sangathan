import { OrgType } from '@/lib/org-types'
import { SmartAnalysisResult, ColorTheme, LogoStyle, CenterType } from './types'

/**
 * Intelligent analyzer that inspects the organization's name, type, and location
 * to recommend customized heraldic symbols, color palettes, styles, taglines, and presets.
 */
export function analyzeOrganizationIdentity(
  orgName: string = '',
  orgType: OrgType = 'civic_collective',
  stateOrCity: string = 'India'
): SmartAnalysisResult {
  const lowerName = orgName.toLowerCase().trim()
  const words = orgName
    .replace(/[^a-zA-Z0-9\u0900-\u097F\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)

  // 1. Generate Clean Monogram (1 to 3 letters)
  let monogram = words
    .map((w) => w[0]?.toUpperCase())
    .slice(0, 3)
    .join('')
  if (!monogram || monogram.length === 0) monogram = 'ORG'

  // 2. Keyword Classification
  const isJustice = /(nyay|justice|adhikar|right|vidhi|samvidhan|legal|kanoon|court|haq)/i.test(lowerName)
  const isResistance = /(fauj|sena|dal|force|morcha|sangharsh|inquilab|kranti|front|brigade|andolan)/i.test(lowerName)
  const isAgrarian = /(kisan|krishi|farm|agri|khet|gram|rural|bhoomi|fasal|annadata)/i.test(lowerName)
  const isLabor = /(shram|mazdoor|worker|labor|labour|union|trade|karmachari|kamgar|sangh)/i.test(lowerName)
  const isYouthStudent = /(chhatra|student|vidyarthi|yuva|youth|campus|university|college|shiksha|academy|parishad)/i.test(lowerName)
  const isEnvironment = /(jal|jungle|zameen|paryavaran|green|earth|eco|forest|nature|vriksh|climate)/i.test(lowerName)
  const isSevaWelfare = /(seva|kalyan|welfare|samaj|trust|sahayata|foundation|care|vikas|help|sahodari)/i.test(lowerName)
  const isHousingCommunity = /(rwa|society|colony|niwas|apartment|enclave|resident|vihar|nagar|housing)/i.test(lowerName)
  const isWomenEmpowerment = /(mahila|nari|stree|women|shakti|behan|matri)/i.test(lowerName)

  // 3. Recommended Themes & Symbols
  let detectedTheme = 'Civic Sovereign'
  const recommendedSymbols: string[] = []
  const recommendedThemes: ColorTheme[] = []
  const recommendedStyles: LogoStyle[] = []
  const suggestedTaglinesEn: string[] = []
  const suggestedTaglinesHi: string[] = []

  if (isJustice) {
    detectedTheme = 'Constitutional Justice & Rights'
    recommendedSymbols.push('scales_of_justice', 'ashoka_pillar', 'constitution_book', 'flame_of_freedom')
    recommendedThemes.push('royal_indigo', 'sovereign_navy', 'ink_monochrome')
    recommendedStyles.push('circular_seal', 'vintage_laurel', 'movement_shield')
    suggestedTaglinesEn.push(
      'JUSTICE, EQUALITY & DIGNITY',
      'CONSTITUTIONAL DEMOCRACY & RIGHTS',
      'TRUTH, LIBERTY & EQUALITY',
      'DEFENDING CITIZEN SOVEREIGNTY'
    )
    suggestedTaglinesHi.push(
      'न्याय, समानता व संवैधानिक अधिकार',
      'सत्यमेव जयते • लोक संप्रभुता',
      'अधिकार और नागरिक गरिमा',
      'संवैधानिक न्याय रक्षा'
    )
  }

  if (isResistance || isLabor) {
    detectedTheme = isLabor ? 'Workers Solidarity & Labor Unity' : 'Peoples Movement & Resistance'
    recommendedSymbols.push('solidarity_fist', 'industrial_gear', 'flame_of_freedom', 'clasped_hands', 'movement_torch')
    recommendedThemes.push('crimson_flame', 'inquilab_saffron', 'sovereign_navy')
    recommendedStyles.push('movement_shield', 'hexagon_insignia', 'circular_seal')
    suggestedTaglinesEn.push(
      'UNITY, STRENGTH & DIGNITY',
      'WORKERS OF THE WORLD UNITE',
      'SOLIDARITY & RESISTANCE',
      'INQUILAB ZINDABAD • PEOPLE POWER'
    )
    suggestedTaglinesHi.push(
      'एकता, संघर्ष व स्वाभिमान',
      'मजदूर किसान एकता जिंदाबाद',
      'इंकलाब जिंदाबाद • लोक शक्ति',
      'संगठन ही शक्ति है'
    )
  }

  if (isAgrarian || isEnvironment) {
    detectedTheme = isAgrarian ? 'Agrarian Sovereignty & Earth' : 'Ecological & Land Rights'
    recommendedSymbols.push('wheat_stalks', 'banyan_tree', 'river_leaf', 'sun_mountains')
    recommendedThemes.push('grassroots_emerald', 'forest_gold', 'earth_terracotta')
    recommendedStyles.push('vintage_laurel', 'circular_seal', 'modern_crest')
    suggestedTaglinesEn.push(
      'JAL JANGAL ZAMEEN',
      'SOVEREIGNTY OF THE SOIL',
      'EARTH, COMMUNITY & SUSTENANCE',
      'PROTECTING OUR COMMON HERITAGE'
    )
    suggestedTaglinesHi.push(
      'जल, जंगल, ज़मीन और संप्रभुता',
      'किसान बचाओ • धरती बचाओ',
      'प्रकृति, माटी और लोक संपदा',
      'अन्नदाता की सुरक्षा व सम्मान'
    )
  }

  if (isYouthStudent) {
    detectedTheme = 'Student Democracy & Youth Power'
    recommendedSymbols.push('quill_and_torch', 'academic_star', 'open_book_sun', 'rising_sun_youth')
    recommendedThemes.push('royal_indigo', 'crimson_flame', 'sovereign_navy')
    recommendedStyles.push('modern_crest', 'hexagon_insignia', 'circular_seal')
    suggestedTaglinesEn.push(
      'EDUCATION, LIBERTY & EQUALITY',
      'STUDENT POWER • CIVIC ACTION',
      'KNOWLEDGE FOR LIBERATION',
      'DEMOCRATIC CAMPUS FOR ALL'
    )
    suggestedTaglinesHi.push(
      'शिक्षा, संघर्ष व सामाजिक न्याय',
      'छात्र एकता जिंदाबाद',
      'ज्ञान, चेतना और स्वतंत्रता',
      'सशक्त युवा • समर्थ राष्ट्र'
    )
  }

  if (isSevaWelfare || isWomenEmpowerment) {
    detectedTheme = isWomenEmpowerment ? 'Nari Shakti & Equal Rights' : 'Public Welfare & Social Action'
    recommendedSymbols.push('helping_hands', 'dharma_wheel', 'people_unity_circle', 'flame_of_freedom')
    recommendedThemes.push('grassroots_emerald', 'royal_indigo', 'inquilab_saffron')
    recommendedStyles.push('vintage_laurel', 'modern_crest', 'circular_seal')
    suggestedTaglinesEn.push(
      'SERVICE, EQUALITY & COMPASSION',
      'EMPOWERMENT THROUGH SOLIDARITY',
      'COMMUNITY WELFARE & UPLIFTMENT',
      'DIGNITY FOR EVERY CITIZEN'
    )
    suggestedTaglinesHi.push(
      'सेवा, सहकार और सामाजिक उत्थान',
      'नारी शक्ति • समता और स्वाभिमान',
      'सर्वे भवन्तु सुखिनः',
      'समानता और जन कल्याण'
    )
  }

  if (isHousingCommunity || orgType === 'rwa') {
    detectedTheme = 'Colony & Community Governance'
    recommendedSymbols.push('community_housing', 'protective_roof', 'scales_of_justice', 'banyan_tree')
    recommendedThemes.push('sovereign_navy', 'forest_gold', 'grassroots_emerald')
    recommendedStyles.push('circular_seal', 'modern_crest', 'official_stamp')
    suggestedTaglinesEn.push(
      'COMMUNITY, SAFETY & HARMONY',
      'TRANSPARENT RESIDENT GOVERNANCE',
      'SAFE, GREEN & PROGRESSIVE RESIDENTS',
      'COLLECTIVE NEIGHBORHOOD WELFARE'
    )
    suggestedTaglinesHi.push(
      'एकता, सुरक्षा और सामुदायिक सौहार्द',
      'पारदर्शी नागरिक कल्याण समिति',
      'स्वच्छ, हरित और सुरक्षित समाज',
      'निवासी एकता जिंदाबाद'
    )
  }

  // Fallbacks if no specific keywords matched
  if (recommendedSymbols.length === 0) {
    if (orgType === 'ngo') {
      detectedTheme = 'Civic Welfare & Non-Profit Mission'
      recommendedSymbols.push('dharma_wheel', 'helping_hands', 'open_book_sun', 'banyan_tree')
      recommendedThemes.push('sovereign_navy', 'grassroots_emerald', 'royal_indigo')
      recommendedStyles.push('circular_seal', 'vintage_laurel', 'modern_crest')
    } else if (orgType === 'student_union') {
      detectedTheme = 'Student Movement & Campus Rights'
      recommendedSymbols.push('quill_and_torch', 'academic_star', 'flame_of_freedom', 'solidarity_fist')
      recommendedThemes.push('royal_indigo', 'crimson_flame', 'sovereign_navy')
      recommendedStyles.push('modern_crest', 'hexagon_insignia', 'circular_seal')
    } else if (orgType === 'workers_union') {
      detectedTheme = 'Labor Federation & Worker Power'
      recommendedSymbols.push('industrial_gear', 'clasped_hands', 'solidarity_fist', 'flame_of_freedom')
      recommendedThemes.push('crimson_flame', 'sovereign_navy', 'inquilab_saffron')
      recommendedStyles.push('movement_shield', 'circular_seal', 'hexagon_insignia')
    } else {
      detectedTheme = 'Democratic Civic Collective'
      recommendedSymbols.push('flame_of_freedom', 'scales_of_justice', 'banyan_tree', 'solidarity_fist')
      recommendedThemes.push('sovereign_navy', 'royal_indigo', 'grassroots_emerald', 'crimson_flame')
      recommendedStyles.push('circular_seal', 'movement_shield', 'vintage_laurel', 'modern_crest')
    }

    suggestedTaglinesEn.push(
      'DEMOCRATIC CITIZEN SOVEREIGNTY',
      'UNITY, LIBERTY & EQUALITY',
      'FOR PEOPLE, JUSTICE & TRUTH',
      'ACCOUNTABLE COLLECTIVE ACTION'
    )
    suggestedTaglinesHi.push(
      'लोकतांत्रिक संप्रभुता व न्याय',
      'एकता, स्वतंत्रता व समता',
      'जनता के हित में समर्पित',
      'पारदर्शी नागरिक संगठन'
    )
  }

  // Ensure default fallbacks have at least 4 items
  const allThemes: ColorTheme[] = [
    'sovereign_navy',
    'royal_indigo',
    'grassroots_emerald',
    'crimson_flame',
    'earth_terracotta',
    'inquilab_saffron',
    'forest_gold',
    'ink_monochrome',
  ]
  const allStyles: LogoStyle[] = [
    'circular_seal',
    'movement_shield',
    'modern_crest',
    'vintage_laurel',
    'hexagon_insignia',
    'official_stamp',
    'minimal_monogram',
  ]

  for (const t of allThemes) {
    if (!recommendedThemes.includes(t)) recommendedThemes.push(t)
  }
  for (const s of allStyles) {
    if (!recommendedStyles.includes(s)) recommendedStyles.push(s)
  }

  // 4. Generate 4 Smart Complete Presets
  const presets = [
    {
      id: 'statutory_seal',
      title: 'Statutory Circular Seal',
      titleHi: 'संवैधानिक गोल मोहर',
      desc: 'Official double-ring medallion for letterheads and statutory memorandums',
      style: (recommendedStyles[0] || 'circular_seal') as LogoStyle,
      colorTheme: (recommendedThemes[0] || 'sovereign_navy') as ColorTheme,
      symbolId: recommendedSymbols[0] || 'scales_of_justice',
      centerType: 'symbol' as CenterType,
      tagline: suggestedTaglinesEn[0] || 'DEMOCRATIC SOVEREIGNTY',
    },
    {
      id: 'heraldic_shield',
      title: 'Movement Defense Shield',
      titleHi: 'आंदोलन रक्षा शील्ड',
      desc: 'Bold heraldic badge for flags, banners, protests and member identity',
      style: 'movement_shield' as LogoStyle,
      colorTheme: (recommendedThemes[1] || 'crimson_flame') as ColorTheme,
      symbolId: recommendedSymbols[1] || recommendedSymbols[0] || 'flame_of_freedom',
      centerType: 'symbol' as CenterType,
      tagline: suggestedTaglinesEn[1] || 'UNITY, STRENGTH & DIGNITY',
    },
    {
      id: 'vintage_laurel_emblem',
      title: 'Laurel of Honor & Truth',
      titleHi: 'सम्मान व सत्य पुष्पचक्र',
      desc: 'Classical prestige wreath emblem suitable for formal certificates & registries',
      style: 'vintage_laurel' as LogoStyle,
      colorTheme: (recommendedThemes[2] || 'royal_indigo') as ColorTheme,
      symbolId: recommendedSymbols[2] || recommendedSymbols[0] || 'banyan_tree',
      centerType: 'symbol' as CenterType,
      tagline: suggestedTaglinesEn[2] || 'TRUTH & CITIZEN SOVEREIGNTY',
    },
    {
      id: 'modern_geometric_monogram',
      title: 'Modern Monogram Crest',
      titleHi: 'आधुनिक मोनोग्राम क्रेस्ट',
      desc: 'Minimalist geometric identity with bold initials and clean digital styling',
      style: 'modern_crest' as LogoStyle,
      colorTheme: (recommendedThemes[3] || 'grassroots_emerald') as ColorTheme,
      symbolId: recommendedSymbols[0] || 'ashoka_pillar',
      centerType: 'monogram' as CenterType,
      tagline: suggestedTaglinesEn[0] || 'CIVIC POWER • SANGATHAN',
    },
  ]

  return {
    detectedTheme,
    monogram,
    recommendedSymbols,
    recommendedThemes,
    recommendedStyles,
    suggestedTaglinesEn,
    suggestedTaglinesHi,
    presets,
  }
}
