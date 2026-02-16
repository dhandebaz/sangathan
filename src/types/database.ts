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
          status: 'active' | 'pending' | 'rejected' | 'removed'
          approved_at: string | null
          engagement_score: number
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
          status?: 'active' | 'pending' | 'rejected' | 'removed'
          approved_at?: string | null
          engagement_score?: number
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
          status?: 'active' | 'pending' | 'rejected' | 'removed'
          approved_at?: string | null
          engagement_score?: number
        }
        Relationships: []
      }
      organisations: {
        Row: {
          id: string
          name: string
          slug: string
          is_suspended: boolean
          remove_branding: boolean
          public_transparency_enabled: boolean
          risk_score: number
          status: 'active' | 'warning' | 'suspended' | 'under_review'
          broadcast_restricted: boolean
          capabilities: Json
          created_at: string
          updated_at: string
          deleted_at: string | null
          legal_hold: boolean
          legal_hold_reason: string | null
          deletion_requested_at: string | null
          membership_policy: 'open_auto' | 'admin_approval' | 'invite_only'
        }
        Insert: {
          id?: string
          name: string
          slug: string
          is_suspended?: boolean
          remove_branding?: boolean
          public_transparency_enabled?: boolean
          risk_score?: number
          status?: 'active' | 'warning' | 'suspended' | 'under_review'
          broadcast_restricted?: boolean
          capabilities?: Json
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          legal_hold?: boolean
          legal_hold_reason?: string | null
          deletion_requested_at?: string | null
          membership_policy?: 'open_auto' | 'admin_approval' | 'invite_only'
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          is_suspended?: boolean
          remove_branding?: boolean
          public_transparency_enabled?: boolean
          risk_score?: number
          status?: 'active' | 'warning' | 'suspended' | 'under_review'
          broadcast_restricted?: boolean
          capabilities?: Json
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
          legal_hold?: boolean
          legal_hold_reason?: string | null
          deletion_requested_at?: string | null
          membership_policy?: 'open_auto' | 'admin_approval' | 'invite_only'
        }
        Relationships: []
      }
      donations: {
        Row: {
          id: string
          organisation_id: string
          donor_name: string
          amount: number
          date: string
          payment_method: 'cash' | 'upi' | 'bank_transfer' | 'other'
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
          payment_method: 'cash' | 'upi' | 'bank_transfer' | 'other'
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
          payment_method?: 'cash' | 'upi' | 'bank_transfer' | 'other'
          upi_reference?: string | null
          notes?: string | null
          verified_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      meetings: {
        Row: {
          id: string
          organisation_id: string
          title: string
          description: string | null
          date: string
          location: string | null
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
          date: string
          location?: string | null
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
          date?: string
          location?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: []
      }
      meeting_attendance: {
        Row: {
          id: string
          organisation_id: string
          meeting_id: string
          member_id: string
          status: 'present' | 'absent' | 'excused'
          created_at: string
        }
        Insert: {
          id?: string
          organisation_id?: string
          meeting_id: string
          member_id: string
          status: 'present' | 'absent' | 'excused'
          created_at?: string
        }
        Update: {
          id?: string
          organisation_id?: string
          meeting_id?: string
          member_id?: string
          status?: 'present' | 'absent' | 'excused'
          created_at?: string
        }
        Relationships: []
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
        Relationships: []
      }
      form_submissions: {
        Row: {
          id: string
          form_id: string
          organisation_id: string
          user_id: string | null
          data: Json
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          form_id: string
          organisation_id: string
          user_id?: string | null
          data: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          form_id?: string
          organisation_id?: string
          user_id?: string | null
          data?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
      }
      data_requests: {
        Row: {
          id: string
          organisation_id: string | null
          user_id: string
          request_type: 'export' | 'deletion'
          status: 'pending' | 'processing' | 'completed' | 'failed'
          details: Json | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          organisation_id?: string | null
          user_id: string
          request_type: 'export' | 'deletion'
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          details?: Json | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          organisation_id?: string | null
          user_id?: string
          request_type?: 'export' | 'deletion'
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          details?: Json | null
          created_at?: string
          completed_at?: string | null
        }
        Relationships: []
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
        Relationships: []
      }
      otp_attempts: {
        Row: {
          id: string
          phone: string
          ip_address: string
          attempted_at: string
        }
        Insert: {
          id?: string
          phone: string
          ip_address: string
          attempted_at?: string
        }
        Update: {
          id?: string
          phone?: string
          ip_address?: string
          attempted_at?: string
        }
        Relationships: []
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
        Relationships: []
      }
      announcements: {
        Row: {
          id: string
          organisation_id: string
          title: string
          content: string
          visibility_level: 'public' | 'members' | 'volunteer' | 'core' | 'executive'
          is_pinned: boolean
          send_email: boolean
          scheduled_at: string | null
          expires_at: string | null
          created_by: string | null
          created_at: string
          updated_at: string
          email_sent_at: string | null
          email_stats: Json
        }
        Insert: {
          id?: string
          organisation_id: string
          title: string
          content: string
          visibility_level?: 'public' | 'members' | 'volunteer' | 'core' | 'executive'
          is_pinned?: boolean
          send_email?: boolean
          scheduled_at?: string | null
          expires_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          email_sent_at?: string | null
          email_stats?: Json
        }
        Update: {
          id?: string
          organisation_id?: string
          title?: string
          content?: string
          visibility_level?: 'public' | 'members' | 'volunteer' | 'core' | 'executive'
          is_pinned?: boolean
          send_email?: boolean
          scheduled_at?: string | null
          expires_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          email_sent_at?: string | null
          email_stats?: Json
        }
        Relationships: []
      }
      announcement_views: {
        Row: {
          id: string
          announcement_id: string
          user_id: string
          viewed_at: string
        }
        Insert: {
          id?: string
          announcement_id: string
          user_id: string
          viewed_at?: string
        }
        Update: {
          id?: string
          announcement_id?: string
          user_id?: string
          viewed_at?: string
        }
        Relationships: []
      }
      risk_events: {
        Row: {
          id: string
          entity_type: 'org' | 'user' | 'member' | 'event'
          entity_id: string
          risk_type: string
          severity: 'low' | 'medium' | 'high'
          metadata: Json | null
          detected_at: string
          status: 'pending' | 'investigated' | 'resolved' | 'dismissed'
        }
        Insert: {
          id?: string
          entity_type: 'org' | 'user' | 'member' | 'event'
          entity_id: string
          risk_type: string
          severity: 'low' | 'medium' | 'high'
          metadata?: Json | null
          detected_at?: string
          status?: 'pending' | 'investigated' | 'resolved' | 'dismissed'
        }
        Update: {
          id?: string
          entity_type?: 'org' | 'user' | 'member' | 'event'
          entity_id?: string
          risk_type?: string
          severity?: 'low' | 'medium' | 'high'
          metadata?: Json | null
          detected_at?: string
          status?: 'pending' | 'investigated' | 'resolved' | 'dismissed'
        }
        Relationships: [
          {
            foreignKeyName: "organisation_links_requester_org_id_fkey"
            columns: ["requester_org_id"]
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organisation_links_responder_org_id_fkey"
            columns: ["responder_org_id"]
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          }
        ]
      }
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
        Relationships: []
      }
      broadcasts: {
        Row: {
          id: string
          organisation_id: string
          title: string
          content: string
          type: 'email' | 'sms' | 'push' | 'app'
          target_roles: string[]
          status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
          scheduled_at: string | null
          sent_at: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organisation_id: string
          title: string
          content: string
          type: 'email' | 'sms' | 'push' | 'app'
          target_roles: string[]
          status?: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
          scheduled_at?: string | null
          sent_at?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organisation_id?: string
          title?: string
          content?: string
          type?: 'email' | 'sms' | 'push' | 'app'
          target_roles?: string[]
          status?: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
          scheduled_at?: string | null
          sent_at?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      broadcast_recipients: {
        Row: {
          id: string
          broadcast_id: string
          user_id: string
          status: 'pending' | 'sent' | 'failed' | 'read'
          error_message: string | null
          sent_at: string | null
          read_at: string | null
        }
        Insert: {
          id?: string
          broadcast_id: string
          user_id: string
          status?: 'pending' | 'sent' | 'failed' | 'read'
          error_message?: string | null
          sent_at?: string | null
          read_at?: string | null
        }
        Update: {
          id?: string
          broadcast_id?: string
          user_id?: string
          status?: 'pending' | 'sent' | 'failed' | 'read'
          error_message?: string | null
          sent_at?: string | null
          read_at?: string | null
        }
        Relationships: []
      }
      polls: {
        Row: {
          id: string
          organisation_id: string
          title: string
          description: string | null
          type: 'informal' | 'formal'
          visibility_level: 'members' | 'volunteer' | 'core' | 'executive'
          voting_method: 'anonymous' | 'identifiable'
          quorum_percentage: number | null
          end_time: string | null
          status: 'active' | 'closed' | 'cancelled'
          created_by: string
          created_at: string
          updated_at: string
          is_public: boolean
        }
        Insert: {
          id?: string
          organisation_id: string
          title: string
          description?: string | null
          type: 'informal' | 'formal'
          visibility_level: 'members' | 'volunteer' | 'core' | 'executive'
          voting_method: 'anonymous' | 'identifiable'
          quorum_percentage?: number | null
          end_time?: string | null
          status?: 'active' | 'closed' | 'cancelled'
          created_by: string
          created_at?: string
          updated_at?: string
          is_public?: boolean
        }
        Update: {
          id?: string
          organisation_id?: string
          title?: string
          description?: string | null
          type?: 'informal' | 'formal'
          visibility_level?: 'members' | 'volunteer' | 'core' | 'executive'
          voting_method?: 'anonymous' | 'identifiable'
          quorum_percentage?: number | null
          end_time?: string | null
          status?: 'active' | 'closed' | 'cancelled'
          created_by?: string
          created_at?: string
          updated_at?: string
          is_public?: boolean
        }
        Relationships: []
      }
      poll_options: {
        Row: {
          id: string
          poll_id: string
          label: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          label: string
          display_order: number
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          label?: string
          display_order?: number
          created_at?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          id: string
          user_id: string
          endpoint: string
          p256dh: string
          auth: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          endpoint: string
          p256dh: string
          auth: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          endpoint?: string
          p256dh?: string
          auth?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      poll_votes: {
        Row: {
          id: string
          poll_id: string
          option_id: string
          user_id: string | null
          ip_hash: string
          voter_metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          option_id: string
          user_id?: string | null
          ip_hash: string
          voter_metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          option_id?: string
          user_id?: string | null
          ip_hash?: string
          voter_metadata?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      platform_actions: {
        Row: {
          id: string
          action_type: string
          target_org_id: string | null
          target_user_id: string | null
          severity: string
          reason: string
          details: Json | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          action_type: string
          target_org_id?: string | null
          target_user_id?: string | null
          severity: string
          reason: string
          details?: Json | null
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          action_type?: string
          target_org_id?: string | null
          target_user_id?: string | null
          severity?: string
          reason?: string
          details?: Json | null
          created_by?: string
          created_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          id: string
          organisation_id: string
          title: string
          description: string | null
          status: 'open' | 'in_progress' | 'completed' | 'archived'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          visibility_level: 'members' | 'volunteer' | 'core' | 'executive'
          due_date: string | null
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
          status?: 'open' | 'in_progress' | 'completed' | 'archived'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          visibility_level?: 'members' | 'volunteer' | 'core' | 'executive'
          due_date?: string | null
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
          status?: 'open' | 'in_progress' | 'completed' | 'archived'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          visibility_level?: 'members' | 'volunteer' | 'core' | 'executive'
          due_date?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: []
      }
      task_assignments: {
        Row: {
          id: string
          task_id: string
          member_id: string
          assigned_by: string
          assigned_at: string
          accepted: boolean
        }
        Insert: {
          id?: string
          task_id: string
          member_id: string
          assigned_by: string
          assigned_at?: string
          accepted?: boolean
        }
        Update: {
          id?: string
          task_id?: string
          member_id?: string
          assigned_by?: string
          assigned_at?: string
          accepted?: boolean
        }
        Relationships: []
      }
      task_logs: {
        Row: {
          id: string
          task_id: string
          member_id: string
          action: string
          hours_logged: number | null
          note: string | null
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          member_id: string
          action: string
          hours_logged?: number | null
          note?: string | null
          details?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          member_id?: string
          action?: string
          hours_logged?: number | null
          note?: string | null
          details?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      networks: {
        Row: {
          id: string
          name: string
          description: string | null
          slug: string
          visibility: 'public' | 'private'
          created_by: string
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          slug: string
          visibility?: 'public' | 'private'
          created_by: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          slug?: string
          visibility?: 'public' | 'private'
          created_by?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: []
      }
      network_admins: {
        Row: {
          id: string
          network_id: string
          user_id: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          network_id: string
          user_id: string
          role: string
          created_at?: string
        }
        Update: {
          id?: string
          network_id?: string
          user_id?: string
          role?: string
          created_at?: string
        }
        Relationships: []
      }
      network_memberships: {
        Row: {
          id: string
          network_id: string
          organisation_id: string
          status: 'pending' | 'active' | 'rejected' | 'suspended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          network_id: string
          organisation_id: string
          status?: 'pending' | 'active' | 'rejected' | 'suspended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          network_id?: string
          organisation_id?: string
          status?: 'pending' | 'active' | 'rejected' | 'suspended'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      members: {
        Row: {
          id: string
          organisation_id: string
          full_name: string
          email: string | null
          phone: string | null
          membership_number: string | null
          status: 'active' | 'inactive' | 'pending'
          metadata: Json | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          organisation_id: string
          full_name: string
          email?: string | null
          phone?: string | null
          membership_number?: string | null
          status?: 'active' | 'inactive' | 'pending'
          metadata?: Json | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          organisation_id?: string
          full_name?: string
          email?: string | null
          phone?: string | null
          membership_number?: string | null
          status?: 'active' | 'inactive' | 'pending'
          metadata?: Json | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: []
      }
      appeals: {
        Row: {
          id: string
          organisation_id: string
          created_by: string
          type: string
          reason: string
          supporting_docs_url: string | null
          status: 'pending' | 'under_review' | 'approved' | 'rejected'
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organisation_id: string
          created_by: string
          type: string
          reason: string
          supporting_docs_url?: string | null
          status?: 'pending' | 'under_review' | 'approved' | 'rejected'
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organisation_id?: string
          created_by?: string
          type?: string
          reason?: string
          supporting_docs_url?: string | null
          status?: 'pending' | 'under_review' | 'approved' | 'rejected'
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      organisation_links: {
        Row: {
          id: string
          requester_org_id: string
          responder_org_id: string
          status: 'pending' | 'active' | 'rejected'
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          requester_org_id: string
          responder_org_id: string
          status?: 'pending' | 'active' | 'rejected'
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          requester_org_id?: string
          responder_org_id?: string
          status?: 'pending' | 'active' | 'rejected'
          created_by?: string
          created_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          id: string
          organisation_id: string
          title: string
          description: string | null
          start_time: string
          end_time: string
          location: string | null
          event_type: 'public' | 'members' | 'volunteer' | 'core' | 'executive'
          rsvp_enabled: boolean
          capacity: number | null
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
          start_time: string
          end_time: string
          location?: string | null
          event_type?: 'public' | 'members' | 'volunteer' | 'core' | 'executive'
          rsvp_enabled?: boolean
          capacity?: number | null
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
          start_time?: string
          end_time?: string
          location?: string | null
          event_type?: 'public' | 'members' | 'volunteer' | 'core' | 'executive'
          rsvp_enabled?: boolean
          capacity?: number | null
          created_by?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: []
      }
      joint_events: {
        Row: {
          id: string
          event_id: string
          organisation_id: string
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          organisation_id: string
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          organisation_id?: string
          created_at?: string
        }
        Relationships: []
      }
      event_rsvps: {
        Row: {
          id: string
          event_id: string
          user_id: string | null
          guest_name: string | null
          guest_email: string | null
          status: 'registered' | 'attended' | 'cancelled'
          metadata: Json | null
          checked_in_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id?: string | null
          guest_name?: string | null
          guest_email?: string | null
          status?: 'registered' | 'attended' | 'cancelled'
          metadata?: Json | null
          checked_in_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string | null
          guest_name?: string | null
          guest_email?: string | null
          status?: 'registered' | 'attended' | 'cancelled'
          metadata?: Json | null
          checked_in_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
          status?: string
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
        Relationships: []
      }
    }
    Views: Record<string, never>
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
        Returns: {
          id: string
          type: string
          payload: Json
          status: string
          attempts: number
          max_attempts: number
          last_error: string | null
          locked_until: string | null
          created_at: string
          updated_at: string
        }
      }
      get_auth_org_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
