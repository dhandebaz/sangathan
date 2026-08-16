import { OrgType } from '@/lib/org-types'

export type LogoStyle = 'circular_seal' | 'modern_crest' | 'movement_shield' | 'official_stamp'

export type ColorTheme = 'sovereign_navy' | 'grassroots_emerald' | 'crimson_flame' | 'ink_monochrome' | 'royal_indigo'

export interface LogoOptions {
  orgName: string
  orgType: OrgType
  tagline?: string
  establishedYear?: string
  stateOrCity?: string
  style: LogoStyle
  colorTheme: ColorTheme
  symbolId?: string
  seed?: number
}

export interface HeraldicSymbol {
  id: string
  name: string
  nameHi: string
  category: OrgType | 'general'
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
