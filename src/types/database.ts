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
          deleted_at: string | null
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
          deleted_at?: string | null
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
          deleted_at?: string | null
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
          deleted_at: string | null
          legal_hold: boolean
          legal_hold_reason: string | null
          deletion_requested_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          is_suspended?: boolean
          remove_branding?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          legal_hold?: boolean
          legal_hold_reason?: string | null
          deletion_requested_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          is_suspended?: boolean
          remove_branding?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          legal_hold?: boolean
          legal_hold_reason?: string | null
          deletion_requested_at?: string | null
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
          deleted_at: string | null
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
          deleted_at?: string | null
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
          deleted_at?: string | null
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
          deleted_at: string | null
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
          deleted_at?: string | null
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
          deleted_at?: string | null
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
          deleted_at: string | null
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
          deleted_at?: string | null
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
          deleted_at?: string | null
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
          deleted_at: string | null
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
          deleted_at?: string | null
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
          deleted_at?: string | null
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
      system_jobs: {
        Row: {
          id: string
          type: string
          payload: Json
          status: 'pending' | 'processing' | 'completed' | 'failed'
          attempts: number
          max_attempts: number
          last_error: string | null
          locked_until: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: string
          payload?: Json
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          attempts?: number
          max_attempts?: number
          last_error?: string | null
          locked_until?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: string
          payload?: Json
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          attempts?: number
          max_attempts?: number
          last_error?: string | null
          locked_until?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      system_logs: {
        Row: {
          id: string
          level: 'info' | 'warn' | 'error' | 'security' | 'critical'
          source: string
          message: string
          metadata: Json | null
          user_id: string | null
          organisation_id: string | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          level: 'info' | 'warn' | 'error' | 'security' | 'critical'
          source: string
          message: string
          metadata?: Json | null
          user_id?: string | null
          organisation_id?: string | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          level?: 'info' | 'warn' | 'error' | 'security' | 'critical'
          source?: string
          message?: string
          metadata?: Json | null
          user_id?: string | null
          organisation_id?: string | null
          ip_address?: string | null
          created_at?: string
        }
      }
      rate_limits: {
        Row: {
          key: string
          points: number
          window_start: string
          created_at: string
          updated_at: string
        }
        Insert: {
          key: string
          points?: number
          window_start?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          key?: string
          points?: number
          window_start?: string
          created_at?: string
          updated_at?: string
        }
      }
      webhook_events: {
        Row: {
          id: string
          provider: string
          event_id: string
          event_type: string
          payload: Json
          status: 'received' | 'processed' | 'failed' | 'ignored'
          processing_error: string | null
          created_at: string
        }
        Insert: {
          id?: string
          provider: string
          event_id: string
          event_type: string
          payload: Json
          status?: 'received' | 'processed' | 'failed' | 'ignored'
          processing_error?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          provider?: string
          event_id?: string
          event_type?: string
          payload?: Json
          status?: 'received' | 'processed' | 'failed' | 'ignored'
          processing_error?: string | null
          created_at?: string
        }
      }
      system_settings: {
        Row: {
          key: string
          value: Json
          description: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          key: string
          value: Json
          description?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          key?: string
          value?: Json
          description?: string | null
          updated_at?: string
          updated_by?: string | null
        }
      }
      data_requests: {
        Row: {
          id: string
          organisation_id: string | null
          user_id: string | null
          request_type: string
          status: string
          details: Json | null
          processed_at: string | null
          processed_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organisation_id?: string | null
          user_id?: string | null
          request_type: string
          status?: string
          details?: Json | null
          processed_at?: string | null
          processed_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organisation_id?: string | null
          user_id?: string | null
          request_type?: string
          status?: string
          details?: Json | null
          processed_at?: string | null
          processed_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      data_access_logs: {
        Row: {
          id: string
          actor_id: string | null
          organisation_id: string | null
          resource_type: string
          action_type: string
          query_details: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          actor_id?: string | null
          organisation_id?: string | null
          resource_type: string
          action_type: string
          query_details?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          actor_id?: string | null
          organisation_id?: string | null
          resource_type?: string
          action_type?: string
          query_details?: Json | null
          ip_address?: string | null
          created_at?: string
        }
      }
      otp_attempts: {
        Row: {
          id: string
          phone: string
          ip_address: string | null
          success: boolean
          created_at: string
        }
        Insert: {
          id?: string
          phone: string
          ip_address?: string | null
          success?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          phone?: string
          ip_address?: string | null
          success?: boolean
          created_at?: string
        }
      }
      incident_logs: {
        Row: {
          id: string
          severity: string
          title: string
          description: string | null
          status: string
          detected_at: string
          resolved_at: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          severity: string
          title: string
          description?: string | null
          status?: string
          detected_at?: string
          resolved_at?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          severity?: string
          title?: string
          description?: string | null
          status?: string
          detected_at?: string
          resolved_at?: string | null
          metadata?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_organisation_and_admin: {
        Args: {
          p_org_name: string
          p_org_slug: string
          p_user_id: string
          p_full_name: string
          p_email: string
          p_phone: string
          p_firebase_uid: string
        }
        Returns: Json
      }
      increment_rate_limit: {
        Args: {
          key_param: string
        }
        Returns: void
      }
      lock_next_job: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
