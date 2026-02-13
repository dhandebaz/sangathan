export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          organisation_id: string | null
          full_name: string | null
          email: string
          role: string
          phone: string | null
          phone_verified: boolean
          firebase_uid: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          organisation_id?: string | null
          full_name?: string | null
          email: string
          role?: string
          phone?: string | null
          phone_verified?: boolean
          firebase_uid?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organisation_id?: string | null
          full_name?: string | null
          email?: string
          role?: string
          phone?: string | null
          phone_verified?: boolean
          firebase_uid?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      organisations: {
        Row: {
          id: string
          name: string
          slug: string
          is_suspended: boolean
          remove_branding: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          is_suspended?: boolean
          remove_branding?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          is_suspended?: boolean
          remove_branding?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      donations: {
        Row: {
          id: string
          organisation_id: string
          donor_name: string
          amount: number
          date: string
          payment_method: string
          upi_reference: string | null
          notes: string | null
          verified_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organisation_id: string
          donor_name: string
          amount: number
          date: string
          payment_method: string
          upi_reference?: string | null
          notes?: string | null
          verified_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organisation_id?: string
          donor_name?: string
          amount?: number
          date?: string
          payment_method?: string
          upi_reference?: string | null
          notes?: string | null
          verified_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      members: {
        Row: {
          id: string
          organisation_id: string
          full_name: string
          phone: string
          role: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organisation_id: string
          full_name: string
          phone: string
          role?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organisation_id?: string
          full_name?: string
          phone?: string
          role?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      meetings: {
        Row: {
          id: string
          organisation_id: string
          title: string
          date: string
          time: string
          location: string | null
          notes: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organisation_id: string
          title: string
          date: string
          time: string
          location?: string | null
          notes?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organisation_id?: string
          title?: string
          date?: string
          time?: string
          location?: string | null
          notes?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      meeting_attendance: {
        Row: {
          id: string
          organisation_id: string
          meeting_id: string
          member_id: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          organisation_id: string
          meeting_id: string
          member_id: string
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          organisation_id?: string
          meeting_id?: string
          member_id?: string
          status?: string
          created_at?: string
        }
      }
      forms: {
        Row: {
          id: string
          organisation_id: string
          title: string
          description: string | null
          fields: Json
          is_published: boolean
          is_active: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organisation_id: string
          title: string
          description?: string | null
          fields?: Json
          is_published?: boolean
          is_active?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organisation_id?: string
          title?: string
          description?: string | null
          fields?: Json
          is_published?: boolean
          is_active?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      form_submissions: {
        Row: {
          id: string
          form_id: string
          organisation_id: string
          data: Json
          created_at: string
        }
        Insert: {
          id?: string
          form_id: string
          organisation_id: string
          data: Json
          created_at?: string
        }
        Update: {
          id?: string
          form_id?: string
          organisation_id?: string
          data?: Json
          created_at?: string
        }
      }
      supporter_subscriptions: {
        Row: {
          id: string
          organisation_id: string
          razorpay_subscription_id: string
          razorpay_plan_id: string
          status: string
          amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organisation_id: string
          razorpay_subscription_id: string
          razorpay_plan_id: string
          status: string
          amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organisation_id?: string
          razorpay_subscription_id?: string
          razorpay_plan_id?: string
          status?: string
          amount?: number
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          organisation_id: string
          actor_id: string | null
          action: string
          resource_table: string
          resource_id: string
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          organisation_id: string
          actor_id?: string | null
          action: string
          resource_table: string
          resource_id: string
          details?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          organisation_id?: string
          actor_id?: string | null
          action?: string
          resource_table?: string
          resource_id?: string
          details?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
