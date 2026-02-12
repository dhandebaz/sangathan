export type Role = 'admin' | 'editor' | 'viewer'

export interface Organization {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string // references auth.users.id
  email: string
  full_name: string | null
  organization_id: string
  role: Role
  created_at: string
  updated_at: string
}

export interface UserContext {
  user: {
    id: string
    email: string
  }
  organizationId: string
  role: Role
}

export type ActionResponse<T = null> = {
  success: boolean
  data?: T
  error?: string
}
