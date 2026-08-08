export type PostCategory = 
  | 'executive'
  | 'secretariat'
  | 'departmental'
  | 'hostel'
  | 'cell_or_wing'
  | 'custom'

export interface UnionPost {
  id: string
  title_en: string
  title_hi: string
  category: PostCategory
  is_custom: boolean
  display_order: number
  description_en?: string
  description_hi?: string
}

export interface MemberPostAssignment {
  id: string
  member_id: string
  member_name: string
  post_id: string
  post_title: string
  department?: string
  term_year?: string
  assigned_at: string
}
