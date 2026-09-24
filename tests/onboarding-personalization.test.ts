import { describe, it, expect } from 'vitest'
import { FOCUS_BLUEPRINTS } from '@/lib/focus-blueprints'
import { OrgType } from '@/lib/org-types'

describe('Universal Focus Blueprints & Personalization Suite', () => {
  it('should define exactly 4 rich focus blueprints for all 2 org types', () => {
    const orgTypes: OrgType[] = ['civic_collective', 'ngo']

    orgTypes.forEach((type) => {
      const blueprints = FOCUS_BLUEPRINTS[type]
      expect(blueprints).toBeDefined()
      expect(blueprints.length).toBe(4)

      blueprints.forEach((bp) => {
        expect(bp.id).toBeTruthy()
        expect(bp.titleEn).toBeTruthy()
        expect(bp.titleHi).toBeTruthy()
        expect(bp.descEn).toBeTruthy()
        expect(bp.descHi).toBeTruthy()
        expect(bp.recommendedRoles.length).toBeGreaterThanOrEqual(3)
        bp.recommendedRoles.forEach((role) => {
          expect(role.value).toBeTruthy()
          expect(role.labelEn).toBeTruthy()
          expect(role.labelHi).toBeTruthy()
        })
      })
    })
  })

  it('should verify civic_collective blueprints contain citizen science and colony action', () => {
    const collectiveBps = FOCUS_BLUEPRINTS['civic_collective']
    const ids = collectiveBps.map((b) => b.id)
    expect(ids).toContain('colony_civic')
    expect(ids).toContain('citizen_science')
    expect(ids).toContain('legal_defense')
    expect(ids).toContain('mass_campaigns')

    const citizenScience = collectiveBps.find((b) => b.id === 'citizen_science')
    expect(citizenScience?.recommendedRoles.some((r) => r.value === 'Lead Researcher')).toBe(true)
  })

  it('should verify ngo blueprints contain welfare relief and policy advocacy', () => {
    const ngoBps = FOCUS_BLUEPRINTS['ngo']
    const ids = ngoBps.map((b) => b.id)
    expect(ids).toContain('welfare_relief')
    expect(ids).toContain('policy_advocacy')
    expect(ids).toContain('community_shg')
    expect(ids).toContain('animal_green')

    const reliefBp = ngoBps.find((b) => b.id === 'welfare_relief')
    expect(reliefBp?.recommendedRoles.some((r) => r.value === 'Program Director')).toBe(true)
  })
})