export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      agent_config: {
        Row: {
          auto_classify: boolean
          auto_draft: boolean
          auto_post: boolean
          created_at: string
          cron_interval_minutes: number
          id: string
          ignored_keywords: string[]
          languages: string[]
          priority_keywords: string[]
          sample_replies: Json
          updated_at: string
          user_id: string
          voice_description: string
        }
        Insert: {
          auto_classify?: boolean
          auto_draft?: boolean
          auto_post?: boolean
          created_at?: string
          cron_interval_minutes?: number
          id?: string
          ignored_keywords?: string[]
          languages?: string[]
          priority_keywords?: string[]
          sample_replies?: Json
          updated_at?: string
          user_id: string
          voice_description?: string
        }
        Update: {
          auto_classify?: boolean
          auto_draft?: boolean
          auto_post?: boolean
          created_at?: string
          cron_interval_minutes?: number
          id?: string
          ignored_keywords?: string[]
          languages?: string[]
          priority_keywords?: string[]
          sample_replies?: Json
          updated_at?: string
          user_id?: string
          voice_description?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_config_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_drafts: {
        Row: {
          completion_tokens: number | null
          created_at: string
          draft_text: string
          edited_text: string | null
          id: string
          interaction_id: string
          is_edited: boolean
          model_used: string
          platform_response_id: string | null
          posted_at: string | null
          prompt_tokens: number | null
          status: string
          tone: string
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          completion_tokens?: number | null
          created_at?: string
          draft_text: string
          edited_text?: string | null
          id?: string
          interaction_id: string
          is_edited?: boolean
          model_used?: string
          platform_response_id?: string | null
          posted_at?: string | null
          prompt_tokens?: number | null
          status?: string
          tone: string
          updated_at?: string
          user_id: string
          version?: number
        }
        Update: {
          completion_tokens?: number | null
          created_at?: string
          draft_text?: string
          edited_text?: string | null
          id?: string
          interaction_id?: string
          is_edited?: boolean
          model_used?: string
          platform_response_id?: string | null
          posted_at?: string | null
          prompt_tokens?: number | null
          status?: string
          tone?: string
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "agent_drafts_interaction_id_fkey"
            columns: ["interaction_id"]
            isOneToOne: false
            referencedRelation: "social_interactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_drafts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_runs: {
        Row: {
          completed_at: string | null
          drafts_generated: number
          errors: Json
          id: string
          interactions_classified: number
          interactions_fetched: number
          started_at: string
          status: string
          total_tokens_used: number
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          drafts_generated?: number
          errors?: Json
          id?: string
          interactions_classified?: number
          interactions_fetched?: number
          started_at?: string
          status?: string
          total_tokens_used?: number
          user_id: string
        }
        Update: {
          completed_at?: string | null
          drafts_generated?: number
          errors?: Json
          id?: string
          interactions_classified?: number
          interactions_fetched?: number
          started_at?: string
          status?: string
          total_tokens_used?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_runs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          content: string
          created_at: string
          created_by: string
          deleted_at: string | null
          email_sent_at: string | null
          email_stats: Json | null
          expires_at: string | null
          id: string
          is_pinned: boolean
          organisation_id: string
          scheduled_at: string | null
          title: string
          updated_at: string
          visibility_level: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          deleted_at?: string | null
          email_sent_at?: string | null
          email_stats?: Json | null
          expires_at?: string | null
          id?: string
          is_pinned?: boolean
          organisation_id: string
          scheduled_at?: string | null
          title: string
          updated_at?: string
          visibility_level: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          email_sent_at?: string | null
          email_stats?: Json | null
          expires_at?: string | null
          id?: string
          is_pinned?: boolean
          organisation_id?: string
          scheduled_at?: string | null
          title?: string
          updated_at?: string
          visibility_level?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_activity_summary"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "announcements_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_dashboard_stats"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "announcements_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      appeals: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          organisation_id: string
          reason: string
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          organisation_id: string
          reason: string
          status?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          organisation_id?: string
          reason?: string
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appeals_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_activity_summary"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "appeals_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_dashboard_stats"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "appeals_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          organisation_id: string | null
          resource_id: string | null
          resource_table: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          organisation_id?: string | null
          resource_id?: string | null
          resource_table?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          organisation_id?: string | null
          resource_id?: string | null
          resource_table?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      broadcasts: {
        Row: {
          channel: string
          content: string
          created_at: string | null
          failed_count: number | null
          id: string
          organisation_id: string
          scheduled_for: string | null
          sender_id: string
          sent_count: number | null
          status: string
          target_audience: string
          title: string
          updated_at: string | null
        }
        Insert: {
          channel: string
          content: string
          created_at?: string | null
          failed_count?: number | null
          id?: string
          organisation_id: string
          scheduled_for?: string | null
          sender_id: string
          sent_count?: number | null
          status?: string
          target_audience: string
          title: string
          updated_at?: string | null
        }
        Update: {
          channel?: string
          content?: string
          created_at?: string | null
          failed_count?: number | null
          id?: string
          organisation_id?: string
          scheduled_for?: string | null
          sender_id?: string
          sent_count?: number | null
          status?: string
          target_audience?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "broadcasts_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broadcasts_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          end_date: string | null
          goal_amount: number | null
          id: string
          is_active: boolean | null
          organisation_id: string
          start_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          end_date?: string | null
          goal_amount?: number | null
          id?: string
          is_active?: boolean | null
          organisation_id: string
          start_date: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_date?: string | null
          goal_amount?: number | null
          id?: string
          is_active?: boolean | null
          organisation_id?: string
          start_date?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          campaign_id: string | null
          created_at: string | null
          currency: string | null
          donor_id: string | null
          id: string
          is_anonymous: boolean | null
          notes: string | null
          organisation_id: string
          payment_method: string | null
          status: string
          tax_receipt_issued: boolean | null
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          campaign_id?: string | null
          created_at?: string | null
          currency?: string | null
          donor_id?: string | null
          id?: string
          is_anonymous?: boolean | null
          notes?: string | null
          organisation_id: string
          payment_method?: string | null
          status?: string
          tax_receipt_issued?: boolean | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          campaign_id?: string | null
          created_at?: string | null
          currency?: string | null
          donor_id?: string | null
          id?: string
          is_anonymous?: boolean | null
          notes?: string | null
          organisation_id?: string
          payment_method?: string | null
          status?: string
          tax_receipt_issued?: boolean | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      donors: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          lifetime_value: number | null
          organisation_id: string
          pan_number: string | null
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          lifetime_value?: number | null
          organisation_id: string
          pan_number?: string | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          lifetime_value?: number | null
          organisation_id?: string
          pan_number?: string | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donors_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      event_rsvps: {
        Row: {
          id: string
          event_id: string
          user_id: string | null
          guest_name: string | null
          guest_email: string | null
          status: string
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
          status?: string
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
          status?: string
          checked_in_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      events: {
        Row: {
          capacity: number | null
          created_at: string
          created_by: string
          deleted_at: string | null
          description: string | null
          end_time: string | null
          event_type: string
          id: string
          location: string | null
          organisation_id: string
          rsvp_enabled: boolean
          start_time: string | null
          title: string
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          created_by: string
          deleted_at?: string | null
          description?: string | null
          end_time?: string | null
          event_type: string
          id?: string
          location?: string | null
          organisation_id: string
          rsvp_enabled?: boolean
          start_time?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          description?: string | null
          end_time?: string | null
          event_type?: string
          id?: string
          location?: string | null
          organisation_id?: string
          rsvp_enabled?: boolean
          start_time?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_activity_summary"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "events_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_dashboard_stats"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "events_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      form_submissions: {
        Row: {
          created_at: string | null
          data: Json
          form_id: string
          id: string
          organisation_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data: Json
          form_id: string
          id?: string
          organisation_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json
          form_id?: string
          id?: string
          organisation_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_submissions_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_activity_summary"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "form_submissions_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_dashboard_stats"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "form_submissions_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      forms: {
        Row: {
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          description: string | null
          fields: Json
          id: string
          is_active: boolean | null
          organisation_id: string
          title: string
          updated_at: string | null
          visibility: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          fields?: Json
          id?: string
          is_active?: boolean | null
          organisation_id: string
          title: string
          updated_at?: string | null
          visibility?: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          fields?: Json
          id?: string
          is_active?: boolean | null
          organisation_id?: string
          title?: string
          updated_at?: string | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "forms_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forms_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_activity_summary"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "forms_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_dashboard_stats"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "forms_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_content: {
        Row: {
          completion_tokens: number | null
          content_body: string
          content_type: string
          created_at: string
          id: string
          language: string
          model_used: string
          prompt_tokens: number | null
          published_at: string | null
          published_to: string[] | null
          source_summary: string | null
          source_url: string | null
          status: string
          title: string
          tone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completion_tokens?: number | null
          content_body: string
          content_type: string
          created_at?: string
          id?: string
          language?: string
          model_used?: string
          prompt_tokens?: number | null
          published_at?: string | null
          published_to?: string[] | null
          source_summary?: string | null
          source_url?: string | null
          status?: string
          title: string
          tone: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completion_tokens?: number | null
          content_body?: string
          content_type?: string
          created_at?: string
          id?: string
          language?: string
          model_used?: string
          prompt_tokens?: number | null
          published_at?: string | null
          published_to?: string[] | null
          source_summary?: string | null
          source_url?: string | null
          status?: string
          title?: string
          tone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_content_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      join_requests: {
        Row: {
          created_at: string | null
          id: string
          organisation_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          organisation_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          organisation_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "join_requests_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_activity_summary"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "join_requests_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_dashboard_stats"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "join_requests_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "join_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "join_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      joint_events: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          organisation_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          organisation_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          organisation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "joint_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "joint_events_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_activity_summary"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "joint_events_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_dashboard_stats"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "joint_events_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_attendance: {
        Row: {
          created_at: string | null
          meeting_id: string
          member_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          meeting_id: string
          member_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          meeting_id?: string
          member_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meeting_attendance_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_attendance_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          created_at: string | null
          created_by: string
          date: string
          description: string | null
          end_time: string | null
          id: string
          location: string | null
          meeting_link: string | null
          organisation_id: string
          title: string
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          date: string
          description?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          meeting_link?: string | null
          organisation_id: string
          title: string
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          date?: string
          description?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          meeting_link?: string | null
          organisation_id?: string
          title?: string
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meetings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_activity_summary"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "meetings_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_dashboard_stats"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "meetings_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          approved_at: string | null
          area: string | null
          deleted_at: string | null
          designation: string | null
          engagement_score: number
          id: string
          joined_at: string
          joining_date: string | null
          notes: string | null
          organisation_id: string
          reliability_score: number
          role: string
          status: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          area?: string | null
          deleted_at?: string | null
          designation?: string | null
          engagement_score?: number
          id?: string
          joined_at?: string
          joining_date?: string | null
          notes?: string | null
          organisation_id: string
          reliability_score?: number
          role: string
          status?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          area?: string | null
          deleted_at?: string | null
          designation?: string | null
          engagement_score?: number
          id?: string
          joined_at?: string
          joining_date?: string | null
          notes?: string | null
          organisation_id?: string
          reliability_score?: number
          role?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_activity_summary"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "members_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_dashboard_stats"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "members_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      network_memberships: {
        Row: {
          id: string
          joined_at: string
          network_id: string
          organisation_id: string
          status: string
        }
        Insert: {
          id?: string
          joined_at?: string
          network_id: string
          organisation_id: string
          status: string
        }
        Update: {
          id?: string
          joined_at?: string
          network_id?: string
          organisation_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "network_memberships_network_id_fkey"
            columns: ["network_id"]
            isOneToOne: false
            referencedRelation: "networks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "network_memberships_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_activity_summary"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "network_memberships_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_dashboard_stats"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "network_memberships_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      networks: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
          slug: string
          visibility: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
          slug: string
          visibility: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          slug?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "networks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_queue: {
        Row: {
          created_at: string | null
          id: string
          member_id: string | null
          organisation_id: string | null
          payload: Json
          processed_at: string | null
          status: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          member_id?: string | null
          organisation_id?: string | null
          payload: Json
          processed_at?: string | null
          status?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          member_id?: string | null
          organisation_id?: string | null
          payload?: Json
          processed_at?: string | null
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_queue_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_queue_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_activity_summary"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "notification_queue_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_dashboard_stats"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "notification_queue_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_invites: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          invited_by: string
          organisation_id: string
          role: string
          token: string
          used: boolean | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          invited_by: string
          organisation_id: string
          role: string
          token: string
          used?: boolean | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          invited_by?: string
          organisation_id?: string
          role?: string
          token?: string
          used?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "org_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_invites_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_activity_summary"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "org_invites_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_dashboard_stats"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "org_invites_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      organisation_links: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          requester_org_id: string
          responder_org_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          requester_org_id: string
          responder_org_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          requester_org_id?: string
          responder_org_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organisation_links_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organisation_links_requester_org_id_fkey"
            columns: ["requester_org_id"]
            isOneToOne: false
            referencedRelation: "org_activity_summary"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "organisation_links_requester_org_id_fkey"
            columns: ["requester_org_id"]
            isOneToOne: false
            referencedRelation: "org_dashboard_stats"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "organisation_links_requester_org_id_fkey"
            columns: ["requester_org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organisation_links_responder_org_id_fkey"
            columns: ["responder_org_id"]
            isOneToOne: false
            referencedRelation: "org_activity_summary"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "organisation_links_responder_org_id_fkey"
            columns: ["responder_org_id"]
            isOneToOne: false
            referencedRelation: "org_dashboard_stats"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "organisation_links_responder_org_id_fkey"
            columns: ["responder_org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      organisations: {
        Row: {
          address: string | null
          capabilities: Json | null
          contact_email: string | null
          contact_phone: string | null
          cover_url: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          logo_url: string | null
          membership_policy: string
          name: string
          org_type: string
          public_transparency_enabled: boolean
          slug: string
          social_links: Json | null
          status: string
          updated_at: string
          website: string | null
          plan_name: string | null
          whitelabel_enabled: boolean | null
          registration_status: Database["public"]["Enums"]["registration_status"] | null
          registration_number: string | null
          incorporation_date: string | null
          tax_id: string | null
          darpan_id: string | null
          compliance_documents: Json | null
        }
        Insert: {
          address?: string | null
          capabilities?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          cover_url?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          membership_policy?: string
          name: string
          org_type?: string
          public_transparency_enabled?: boolean
          slug: string
          social_links?: Json | null
          status?: string
          updated_at?: string
          website?: string | null
          plan_name?: string | null
          whitelabel_enabled?: boolean | null
          registration_status?: Database["public"]["Enums"]["registration_status"] | null
          registration_number?: string | null
          incorporation_date?: string | null
          tax_id?: string | null
          darpan_id?: string | null
          compliance_documents?: Json | null
        }
        Update: {
          address?: string | null
          capabilities?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          cover_url?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          membership_policy?: string
          name?: string
          org_type?: string
          public_transparency_enabled?: boolean
          slug?: string
          social_links?: Json | null
          status?: string
          updated_at?: string
          website?: string | null
          plan_name?: string | null
          whitelabel_enabled?: boolean | null
          registration_status?: Database["public"]["Enums"]["registration_status"] | null
          registration_number?: string | null
          incorporation_date?: string | null
          tax_id?: string | null
          darpan_id?: string | null
          compliance_documents?: Json | null
        }
        Relationships: []
      }
      poll_options: {
        Row: {
          display_order: number
          id: string
          label: string
          poll_id: string
        }
        Insert: {
          display_order: number
          id?: string
          label: string
          poll_id: string
        }
        Update: {
          display_order?: number
          id?: string
          label?: string
          poll_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_options_poll_fk"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_votes: {
        Row: {
          id: string
          ip_hash: string | null
          option_id: string
          poll_id: string
          user_id: string
          voted_at: string
        }
        Insert: {
          id?: string
          ip_hash?: string | null
          option_id: string
          poll_id: string
          user_id: string
          voted_at?: string
        }
        Update: {
          id?: string
          ip_hash?: string | null
          option_id?: string
          poll_id?: string
          user_id?: string
          voted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_option_poll_fk"
            columns: ["option_id", "poll_id"]
            isOneToOne: false
            referencedRelation: "poll_options"
            referencedColumns: ["id", "poll_id"]
          },
          {
            foreignKeyName: "poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poll_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          end_time: string | null
          final_results: Json | null
          id: string
          is_public: boolean | null
          organisation_id: string
          quorum_percentage: number | null
          start_time: string | null
          status: string
          title: string
          type: string | null
          updated_at: string
          visibility_level: string | null
          voting_method: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          end_time?: string | null
          final_results?: Json | null
          id?: string
          is_public?: boolean | null
          organisation_id: string
          quorum_percentage?: number | null
          start_time?: string | null
          status: string
          title: string
          type?: string | null
          updated_at?: string
          visibility_level?: string | null
          voting_method: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          end_time?: string | null
          final_results?: Json | null
          id?: string
          is_public?: boolean | null
          organisation_id?: string
          quorum_percentage?: number | null
          start_time?: string | null
          status?: string
          title?: string
          type?: string | null
          updated_at?: string
          visibility_level?: string | null
          voting_method?: string
        }
        Relationships: [
          {
            foreignKeyName: "polls_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "polls_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_activity_summary"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "polls_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_dashboard_stats"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "polls_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          approved_at: string | null
          created_at: string
          deleted_at: string | null
          email: string
          engagement_score: number | null
          full_name: string | null
          global_status: string
          id: string
          is_platform_admin: boolean
          organisation_id: string | null
          phone: string | null
          phone_verified: boolean | null
          role: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          engagement_score?: number | null
          full_name?: string | null
          global_status?: string
          id: string
          is_platform_admin?: boolean
          organisation_id?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          role?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          engagement_score?: number | null
          full_name?: string | null
          global_status?: string
          id?: string
          is_platform_admin?: boolean
          organisation_id?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          role?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_activity_summary"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "profiles_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_dashboard_stats"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "profiles_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limits: {
        Row: {
          key: string
          points: number
          updated_at: string | null
          window_start: string
        }
        Insert: {
          key: string
          points?: number
          updated_at?: string | null
          window_start?: string
        }
        Update: {
          key?: string
          points?: number
          updated_at?: string | null
          window_start?: string
        }
        Relationships: []
      }
      signup_attempts: {
        Row: {
          attempted_at: string | null
          email: string | null
          id: string
          ip_address: string | null
        }
        Insert: {
          attempted_at?: string | null
          email?: string | null
          id?: string
          ip_address?: string | null
        }
        Update: {
          attempted_at?: string | null
          email?: string | null
          id?: string
          ip_address?: string | null
        }
        Relationships: []
      }
      social_accounts: {
        Row: {
          access_token_encrypted: string
          connected_at: string
          id: string
          is_active: boolean
          platform: string
          platform_user_id: string
          platform_username: string | null
          refresh_token_encrypted: string | null
          scopes: string[] | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token_encrypted: string
          connected_at?: string
          id?: string
          is_active?: boolean
          platform: string
          platform_user_id: string
          platform_username?: string | null
          refresh_token_encrypted?: string | null
          scopes?: string[] | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token_encrypted?: string
          connected_at?: string
          id?: string
          is_active?: boolean
          platform?: string
          platform_user_id?: string
          platform_username?: string | null
          refresh_token_encrypted?: string | null
          scopes?: string[] | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      social_interactions: {
        Row: {
          author_avatar_url: string | null
          author_handle: string
          author_name: string | null
          content: string
          created_at: string
          fetched_at: string
          id: string
          interaction_type: string
          media_urls: string[] | null
          parent_post_url: string | null
          platform: string
          platform_created_at: string | null
          platform_post_id: string
          priority: string
          sentiment: string
          sentiment_confidence: number | null
          social_account_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author_avatar_url?: string | null
          author_handle: string
          author_name?: string | null
          content: string
          created_at?: string
          fetched_at?: string
          id?: string
          interaction_type: string
          media_urls?: string[] | null
          parent_post_url?: string | null
          platform: string
          platform_created_at?: string | null
          platform_post_id: string
          priority?: string
          sentiment?: string
          sentiment_confidence?: number | null
          social_account_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author_avatar_url?: string | null
          author_handle?: string
          author_name?: string | null
          content?: string
          created_at?: string
          fetched_at?: string
          id?: string
          interaction_type?: string
          media_urls?: string[] | null
          parent_post_url?: string | null
          platform?: string
          platform_created_at?: string | null
          platform_post_id?: string
          priority?: string
          sentiment?: string
          sentiment_confidence?: number | null
          social_account_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_interactions_social_account_id_fkey"
            columns: ["social_account_id"]
            isOneToOne: false
            referencedRelation: "social_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_jobs: {
        Row: {
          attempts: number
          created_at: string | null
          id: string
          last_error: string | null
          locked_until: string | null
          max_attempts: number
          payload: Json
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          attempts?: number
          created_at?: string | null
          id?: string
          last_error?: string | null
          locked_until?: string | null
          max_attempts?: number
          payload?: Json
          status?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          attempts?: number
          created_at?: string | null
          id?: string
          last_error?: string | null
          locked_until?: string | null
          max_attempts?: number
          payload?: Json
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string | null
          level: string
          message: string
          metadata: Json | null
          organisation_id: string | null
          source: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          level: string
          message: string
          metadata?: Json | null
          organisation_id?: string | null
          source: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          level?: string
          message?: string
          metadata?: Json | null
          organisation_id?: string | null
          source?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_logs_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_activity_summary"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "system_logs_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_dashboard_stats"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "system_logs_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      task_assignments: {
        Row: {
          accepted: boolean
          assigned_at: string
          completed_at: string | null
          id: string
          member_id: string
          task_id: string
        }
        Insert: {
          accepted?: boolean
          assigned_at?: string
          completed_at?: string | null
          id?: string
          member_id: string
          task_id: string
        }
        Update: {
          accepted?: boolean
          assigned_at?: string
          completed_at?: string | null
          id?: string
          member_id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_assignments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_assignments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string
          created_by: string
          deleted_at: string | null
          description: string | null
          due_date: string | null
          id: string
          organisation_id: string
          priority: string
          status: string
          title: string
          updated_at: string
          visibility_level: string
        }
        Insert: {
          created_at?: string
          created_by: string
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          organisation_id: string
          priority: string
          status: string
          title: string
          updated_at?: string
          visibility_level: string
        }
        Update: {
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          organisation_id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
          visibility_level?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_activity_summary"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "tasks_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_dashboard_stats"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "tasks_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      grants: {
        Row: {
          id: string
          organisation_id: string
          title: string
          amount: number
          status: string
          deadline: string | null
          created_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          organisation_id: string
          title: string
          amount: number
          status?: string
          deadline?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          organisation_id?: string
          title?: string
          amount?: number
          status?: string
          deadline?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grants_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          }
        ]
      }
      cba_documents: {
        Row: {
          id: string
          organisation_id: string
          title: string
          file_url: string
          status: string
          valid_from: string | null
          valid_until: string | null
          created_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          organisation_id: string
          title: string
          file_url: string
          status?: string
          valid_from?: string | null
          valid_until?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          organisation_id?: string
          title?: string
          file_url?: string
          status?: string
          valid_from?: string | null
          valid_until?: string | null
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cba_documents_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          }
        ]
      }
      visitors: {
        Row: {
          id: string
          organisation_id: string
          name: string
          phone: string | null
          purpose: string
          expected_time: string | null
          status: string
          logged_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          organisation_id: string
          name: string
          phone?: string | null
          purpose: string
          expected_time?: string | null
          status?: string
          logged_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          organisation_id?: string
          name?: string
          phone?: string | null
          purpose?: string
          expected_time?: string | null
          status?: string
          logged_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visitors_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          }
        ]
      }
      tickets: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string
          id: string
          organisation_id: string
          priority: string
          status: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description: string
          id?: string
          organisation_id: string
          priority?: string
          status?: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string
          id?: string
          organisation_id?: string
          priority?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_activity_summary"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "tickets_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "org_dashboard_stats"
            referencedColumns: ["organisation_id"]
          },
          {
            foreignKeyName: "tickets_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_events: {
        Row: {
          created_at: string | null
          event_id: string
          event_type: string
          id: string
          payload: Json
          processing_error: string | null
          provider: string
          status: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          event_type: string
          id?: string
          payload: Json
          processing_error?: string | null
          provider: string
          status?: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          event_type?: string
          id?: string
          payload?: Json
          processing_error?: string | null
          provider?: string
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      org_activity_summary: {
        Row: {
          organisation_id: string | null
          total_engagement: number | null
          total_events: number | null
          total_members: number | null
          total_polls: number | null
          total_tasks: number | null
        }
        Relationships: []
      }
      org_dashboard_stats: {
        Row: {
          active_polls: number | null
          open_tasks: number | null
          organisation_id: string | null
          total_events: number | null
          total_members: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      can_assign_role: {
        Args: { acting_role: string; target_role: string }
        Returns: boolean
      }
      cleanup_orphan_users: { Args: never; Returns: undefined }
      create_organisation_and_admin: {
        Args: {
          p_email: string
          p_full_name: string
          p_org_name: string
          p_org_slug: string
          p_org_type?: string
          p_phone: string
          p_user_id: string
        }
        Returns: Json
      }
      create_organisation_with_admin: {
        Args: { org_name: string; org_slug: string }
        Returns: string
      }
      get_my_organisation_id: { Args: never; Returns: string }
      get_verification_status: { Args: { user_id: string }; Returns: Json }
      has_visibility_access: {
        Args: { member_role: string; visibility: string }
        Returns: boolean
      }
      increment_rate_limit: { Args: { key_param: string }; Returns: undefined }
      is_platform_admin: { Args: never; Returns: boolean }
      lock_next_job: { Args: never; Returns: Json }
      set_selected_organisation: {
        Args: { p_organisation_id: string }
        Returns: undefined
      }
    }
    Enums: {
      registration_status: "registered" | "unregistered" | "in_progress"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
