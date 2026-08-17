import { OrgType } from '@/lib/org-types'

export type LogoStyle =
  | 'circular_seal'
  | 'modern_crest'
  | 'movement_shield'
  | 'official_stamp'
  | 'hexagon_insignia'
  | 'vintage_laurel'
  | 'minimal_monogram'

export type ColorTheme =
  | 'sovereign_navy'
  | 'grassroots_emerald'
  | 'royal_indigo'
  | 'crimson_flame'
  | 'earth_terracotta'
  | 'inquilab_saffron'
  | 'forest_gold'
  | 'ink_monochrome'

export type CenterType = 'symbol' | 'monogram'
export type FontStyle = 'sans' | 'serif' | 'slab'
export type RingStyle = 'double_ring' | 'stars_ring' | 'dotted_ring' | 'clean_solid'

export interface LogoOptions {
  orgName: string
  orgType: OrgType
  tagline?: string
  establishedYear?: string
  stateOrCity?: string
  style: LogoStyle
  colorTheme: ColorTheme
  symbolId?: string
  centerType?: CenterType
  fontStyle?: FontStyle
  ringStyle?: RingStyle
  customInitials?: string
  seed?: number
}

export type SymbolCategory =
  | 'justice_rights'
  | 'liberty_resistance'
  | 'knowledge_youth'
  | 'labor_industry'
  | 'environment_land'
  | 'community_solidarity'

export interface HeraldicSymbol {
  id: string
  name: string
  nameHi: string
  category: OrgType | 'general'
  themeCategory?: SymbolCategory
  keywords?: string[]
  svgPath: string
}

export interface ColorPalette {
  id: ColorTheme
  name: string
  nameHi: string
  primary: string
  secondary: string
  accent: string
  background: string
  textLight: string
  textDark: string
}

export interface SmartAnalysisResult {
  detectedTheme: string
  monogram: string
  recommendedSymbols: string[]
  recommendedThemes: ColorTheme[]
  recommendedStyles: LogoStyle[]
  suggestedTaglinesEn: string[]
  suggestedTaglinesHi: string[]
  presets: Array<{
    id: string
    title: string
    titleHi: string
    desc: string
    style: LogoStyle
    colorTheme: ColorTheme
    symbolId: string
    centerType: CenterType
    tagline: string
  }>
}

