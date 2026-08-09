import statesDistrictsData from '@/lib/data/india-states-districts.json'

export interface StateData {
  code: string
  name: string
  nameHi: string
  type: 'state' | 'union_territory'
  districts: string[]
}

export function getAllStates(): StateData[] {
  return statesDistrictsData as StateData[]
}

export function getStateByCode(code: string): StateData | undefined {
  return (statesDistrictsData as StateData[]).find(
    (s) => s.code.toLowerCase() === code.toLowerCase()
  )
}

export function getStateByName(name: string): StateData | undefined {
  const norm = name.toLowerCase().trim()
  return (statesDistrictsData as StateData[]).find(
    (s) => s.name.toLowerCase() === norm || s.nameHi.toLowerCase() === norm
  )
}

export function getDistrictsByState(stateCodeOrName: string): string[] {
  if (!stateCodeOrName) return []
  const norm = stateCodeOrName.toLowerCase().trim()
  const found = (statesDistrictsData as StateData[]).find(
    (s) =>
      s.code.toLowerCase() === norm ||
      s.name.toLowerCase() === norm ||
      s.nameHi.toLowerCase() === norm
  )
  return found ? found.districts : []
}

export function searchStates(query: string): StateData[] {
  const q = query.toLowerCase().trim()
  if (!q) return getAllStates()
  return (statesDistrictsData as StateData[]).filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.nameHi.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q)
  )
}

export function searchDistricts(
  query: string,
  stateFilter?: string
): Array<{ state: string; stateCode: string; district: string }> {
  const q = query.toLowerCase().trim()
  const results: Array<{ state: string; stateCode: string; district: string }> = []

  const statesToSearch = stateFilter
    ? (statesDistrictsData as StateData[]).filter(
        (s) =>
          s.code.toLowerCase() === stateFilter.toLowerCase() ||
          s.name.toLowerCase() === stateFilter.toLowerCase()
      )
    : (statesDistrictsData as StateData[])

  for (const s of statesToSearch) {
    for (const d of s.districts) {
      if (!q || d.toLowerCase().includes(q)) {
        results.push({
          state: s.name,
          stateCode: s.code,
          district: d,
        })
      }
    }
  }

  return results
}
