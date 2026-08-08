export type InstitutionType = 
  | 'central_university'
  | 'state_university'
  | 'deemed_university'
  | 'iit'
  | 'nit'
  | 'iiit'
  | 'iim'
  | 'aiims'
  | 'nlu'
  | 'autonomous_college'
  | 'polytechnic'
  | 'government_college'

export type UnionGovernanceStatus = 
  | 'official_union_permitted'
  | 'independent_collectives_only'
  | 'nominated_council'
  | 'banned_or_restricted'

export interface Institution {
  id: string
  name: string
  short_name?: string
  state: string
  city: string
  type: InstitutionType
  union_status: UnionGovernanceStatus
  website?: string
  established_year?: number
}

export type CollectiveType =
  | 'official_union'
  | 'independent_collective'
  | 'department_association'
  | 'student_front'
  | 'hostel_committee'
