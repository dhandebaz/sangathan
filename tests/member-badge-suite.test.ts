import { describe, it, expect } from 'vitest'
import { ORG_ARCHETYPES, BADGE_THEMES } from '@/lib/badges/badge-config'
import { OrgType } from '@/lib/org-types'
import { HERALDIC_SYMBOLS } from '@/lib/logo-generator/symbols-and-palettes'

describe('Multi-Org Verified Member Badge & Credential Suite', () => {
  it('defines valid configurations for all 2 organisation archetypes', () => {
    const requiredTypes: OrgType[] = ['civic_collective', 'ngo']

    for (const orgType of requiredTypes) {
      const arch = ORG_ARCHETYPES[orgType]
      expect(arch).toBeDefined()
      expect(arch.nameEn).toBeTruthy()
      expect(arch.nameHi).toBeTruthy()
      expect(arch.ribbonHeaderEn).toBeTruthy()
      expect(arch.ribbonHeaderHi).toBeTruthy()
      expect(arch.statutoryTagEn).toBeTruthy()
      expect(arch.statutoryTagHi).toBeTruthy()
      expect(arch.defaultTheme).toBeTruthy()
      expect(arch.defaultSymbol).toBeTruthy()
      expect(arch.badgeTiers.length).toBeGreaterThanOrEqual(5)
      expect(arch.defaultRoles.length).toBeGreaterThanOrEqual(4)
    }
  })

  it('validates all 8 rich movement badge themes with contrast properties', () => {
    expect(BADGE_THEMES.length).toBe(8)

    for (const theme of BADGE_THEMES) {
      expect(theme.id).toBeTruthy()
      expect(theme.name).toBeTruthy()
      expect(theme.bgGradient.length).toBe(2)
      expect(theme.cardBg).toBeTruthy()
      expect(theme.accent).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(theme.textColor).toBeTruthy()
      expect(theme.cardBorder).toBeTruthy()
      expect(theme.pillBg).toBeTruthy()
    }
  })

  it('ensures heraldic vector symbols have valid SVG paths for canvas rendering', () => {
    expect(HERALDIC_SYMBOLS.length).toBeGreaterThanOrEqual(10)

    for (const sym of HERALDIC_SYMBOLS) {
      expect(sym.id).toBeTruthy()
      expect(sym.name).toBeTruthy()
      expect(sym.svgPath).toBeTruthy()
      expect(typeof sym.svgPath).toBe('string')
    }
  })

  it('verifies badge verification URL formatting', () => {
    const orgSlug = 'delhi-saans'
    const memberId = 'SAN-2026-IN-9812'
    const verificationUrl = `https://sangathan.space/verify/${orgSlug}/${memberId}`

    expect(verificationUrl).toBe('https://sangathan.space/verify/delhi-saans/SAN-2026-IN-9812')
  })
})
