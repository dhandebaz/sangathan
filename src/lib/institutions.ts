import institutionsData from '@/lib/data/indian-institutions.json'
import type { Institution } from '@/types/institutions'

export function getAllInstitutions(): Institution[] {
  return institutionsData as Institution[]
}

export function getInstitutionById(id: string): Institution | undefined {
  return (institutionsData as Institution[]).find(inst => inst.id === id)
}

export function searchInstitutions(query: string): Institution[] {
  const q = query.toLowerCase().trim()
  if (!q) return institutionsData as Institution[]
  
  return (institutionsData as Institution[]).filter(inst => 
    inst.name.toLowerCase().includes(q) ||
    inst.short_name?.toLowerCase().includes(q) ||
    inst.city.toLowerCase().includes(q) ||
    inst.state.toLowerCase().includes(q)
  )
}
