export type Role =
  | 'viewer'
  | 'member'
  | 'general'
  | 'volunteer'
  | 'core'
  | 'executive'
  | 'editor'
  | 'admin'

export type MembershipStatus = 'active' | 'inactive' | 'pending' | 'rejected' | 'removed'

export interface Organization {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  created_at: string
  updated_at: string
}

export interface MembershipContext {
  id: string
  organisationId: string
  role: Role
  status: MembershipStatus
}

export interface UserContext {
  user: {
    id: string
    email: string
  }
  organizationId: string
  role: Role
  memberships: MembershipContext[]
}

export type ActionResponse<T = null> = {
  success: boolean
  data?: T
  error?: string
}
