import { describe, it, expect } from 'vitest'
import {
  getAllStates,
  getStateByCode,
  getStateByName,
  getDistrictsByState,
  searchStates,
  searchDistricts,
} from '@/lib/geo/india'
import {
  NGO_SDG_SECTORS,
  CIVIC_ACTION_AREAS,
} from '@/lib/data/org-master-data'

describe('National Indian Geographical Engine', () => {
  it('should load all 28 states and 8 union territories (36 total)', () => {
    const states = getAllStates()
    expect(states.length).toBe(36)
  })

  it('should retrieve accurate state details by ISO code', () => {
    const delhi = getStateByCode('IN-DL')
    expect(delhi).toBeDefined()
    expect(delhi?.name).toBe('Delhi (NCT)')
    expect(delhi?.districts).toContain('New Delhi')
    expect(delhi?.districts.length).toBe(11)

    const maharashtra = getStateByCode('IN-MH')
    expect(maharashtra).toBeDefined()
    expect(maharashtra?.name).toBe('Maharashtra')
    expect(maharashtra?.districts).toContain('Pune')
  })

  it('should retrieve state by English or Hindi name', () => {
    const up = getStateByName('Uttar Pradesh')
    expect(up?.code).toBe('IN-UP')

    const biharHi = getStateByName('बिहार')
    expect(biharHi?.code).toBe('IN-BR')
    expect(biharHi?.districts).toContain('Patna')
  })

  it('should retrieve districts for a given state code or name', () => {
    const karnatakaDistricts = getDistrictsByState('IN-KA')
    expect(karnatakaDistricts).toContain('Bengaluru Urban')
    expect(karnatakaDistricts.length).toBeGreaterThanOrEqual(30)
  })

  it('should search districts across the entire country', () => {
    const results = searchDistricts('Varanasi')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].stateCode).toBe('IN-UP')
  })
})

describe('Domain-Specific Master Reference Taxonomies', () => {
  it('should provide UN SDG mappings for NGOs', () => {
    expect(NGO_SDG_SECTORS.length).toBeGreaterThanOrEqual(10)
    expect(NGO_SDG_SECTORS.find((s) => s.code === 'SDG-1')).toBeDefined()
  })

  it('should provide Civic Collective ground action areas', () => {
    expect(CIVIC_ACTION_AREAS.length).toBeGreaterThanOrEqual(5)
    expect(CIVIC_ACTION_AREAS.find((a) => a.code === 'CIVIC-AIR')).toBeDefined()
  })
})
