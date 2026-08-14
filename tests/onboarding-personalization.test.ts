import { describe, it, expect } from 'vitest'
import { FOCUS_BLUEPRINTS } from '@/lib/focus-blueprints'
import { OrgType } from '@/lib/org-types'

describe('Universal Focus Blueprints & Personalization Suite', () => {
  it('should define exactly 4 rich focus blueprints for all 5 org types', () => {
    const orgTypes: OrgType[] = ['civic_collective', 'ngo', 'student_union', 'workers_union', 'rwa']

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

  it('should verify student_union blueprints contain elections and mess grievances', () => {
    const studentBps = FOCUS_BLUEPRINTS['student_union']
    const ids = studentBps.map((b) => b.id)
    expect(ids).toContain('campus_elections')
    expect(ids).toContain('hostel_mess')
    expect(ids).toContain('academic_antiragging')
    expect(ids).toContain('student_movement')

    const messBp = studentBps.find((b) => b.id === 'hostel_mess')
    expect(messBp?.recommendedRoles.some((r) => r.value === 'Mess Secretary')).toBe(true)
  })

  it('should verify workers_union blueprints contain CBA and safety inspectorate', () => {
    const unionBps = FOCUS_BLUEPRINTS['workers_union']
    const ids = unionBps.map((b) => b.id)
    expect(ids).toContain('cba_negotiations')
    expect(ids).toContain('safety_inspectorate')
    expect(ids).toContain('gig_informal')
    expect(ids).toContain('cadre_delegate')
  })

  it('should verify rwa blueprints contain estate maintenance and municipal action', () => {
    const rwaBps = FOCUS_BLUEPRINTS['rwa']
    const ids = rwaBps.map((b) => b.id)
    expect(ids).toContain('estate_maintenance')
    expect(ids).toContain('municipal_civic')
    expect(ids).toContain('security_amenities')
    expect(ids).toContain('agm_billing')
  })
})
