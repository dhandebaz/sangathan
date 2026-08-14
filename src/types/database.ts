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
          send_email: boolean | null
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
          send_email?: boolean | null
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
          send_email?: boolean | null
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
          resolution_note: string | null
          resolved_at: string | null
          resolved_by: string | null
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
          resolution_note?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
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
          resolution_note?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
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
          actor_member_id: string | null
          created_at: string
          details: Json | null
          id: string
          organisation_id: string
          resource_id: string
          resource_table: string
        }
        Insert: {
          action: string
          actor_member_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          organisation_id: string
          resource_id: string
          resource_table: string
        }
        Update: {
          action?: string
          actor_member_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          organisation_id?: string
          resource_id?: string
          resource_table?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_member_id_fkey"
            columns: ["actor_member_id"]
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
      authority_contacts: {
        Row: {
          address: string | null
          authority_name: string
          created_at: string | null
          department: string
          designation: string | null
          email: string | null
          id: string
          is_active: boolean | null
          jurisdiction: string | null
          organisation_id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          authority_name: string
          created_at?: string | null
          department: string
          designation?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          jurisdiction?: string | null
          organisation_id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          authority_name?: string
          created_at?: string | null
          department?: string
          designation?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          jurisdiction?: string | null
          organisation_id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "authority_contacts_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      batch_maintenance_runs: {
        Row: {
          billing_month: string
          created_at: string | null
          created_by: string | null
          due_date: string
          id: string
          organisation_id: string
          rate_amount: number
          rate_type: string
          total_invoiced_amount: number
          total_units_billed: number
        }
        Insert: {
          billing_month: string
          created_at?: string | null
          created_by?: string | null
          due_date: string
          id?: string
          organisation_id: string
          rate_amount: number
          rate_type: string
          total_invoiced_amount: number
          total_units_billed: number
        }
        Update: {
          billing_month?: string
          created_at?: string | null
          created_by?: string | null
          due_date?: string
          id?: string
          organisation_id?: string
          rate_amount?: number
          rate_type?: string
          total_invoiced_amount?: number
          total_units_billed?: number
        }
        Relationships: [
          {
            foreignKeyName: "batch_maintenance_runs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batch_maintenance_runs_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_plans: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          frequency: string | null
          id: string
          is_active: boolean | null
          name: string
          organisation_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          organisation_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          organisation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_plans_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          organisation_id: string
          plan_name: string
          plan_period: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          organisation_id: string
          plan_name: string
          plan_period?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          organisation_id?: string
          plan_name?: string
          plan_period?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_transactions_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_channel_configs: {
        Row: {
          channel: string
          created_at: string | null
          credentials: Json
          id: string
          is_enabled: boolean | null
          last_error: string | null
          last_synced_at: string | null
          organisation_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          channel: string
          created_at?: string | null
          credentials?: Json
          id?: string
          is_enabled?: boolean | null
          last_error?: string | null
          last_synced_at?: string | null
          organisation_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          channel?: string
          created_at?: string | null
          credentials?: Json
          id?: string
          is_enabled?: boolean | null
          last_error?: string | null
          last_synced_at?: string | null
          organisation_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bot_channel_configs_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_outbound_messages: {
        Row: {
          channel: string
          created_at: string | null
          error_message: string | null
          id: string
          message_text: string
          metadata: Json | null
          organisation_id: string
          provider_message_id: string | null
          recipient_id: string
          recipient_name: string | null
          sent_at: string | null
          status: string
        }
        Insert: {
          channel: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          message_text: string
          metadata?: Json | null
          organisation_id: string
          provider_message_id?: string | null
          recipient_id: string
          recipient_name?: string | null
          sent_at?: string | null
          status?: string
        }
        Update: {
          channel?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          message_text?: string
          metadata?: Json | null
          organisation_id?: string
          provider_message_id?: string | null
          recipient_id?: string
          recipient_name?: string | null
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "bot_outbound_messages_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_qr_pairing_sessions: {
        Row: {
          created_at: string | null
          device_info: Json | null
          expires_at: string
          id: string
          organisation_id: string
          pairing_numeric_code: string | null
          qr_code_data: string
          session_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          device_info?: Json | null
          expires_at: string
          id?: string
          organisation_id: string
          pairing_numeric_code?: string | null
          qr_code_data: string
          session_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          device_info?: Json | null
          expires_at?: string
          id?: string
          organisation_id?: string
          pairing_numeric_code?: string | null
          qr_code_data?: string
          session_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bot_qr_pairing_sessions_organisation_id_fkey"
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
          created_by: string | null
          goal_description: string
          id: string
          organisation_id: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          goal_description: string
          id?: string
          organisation_id: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          goal_description?: string
          id?: string
          organisation_id?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_expenses: {
        Row: {
          amount: number
          candidate_id: string
          created_at: string | null
          election_id: string
          expense_date: string
          id: string
          is_lyngdoh_compliant: boolean | null
          item_description: string
          receipt_url: string | null
          vendor_name: string | null
        }
        Insert: {
          amount: number
          candidate_id: string
          created_at?: string | null
          election_id: string
          expense_date?: string
          id?: string
          is_lyngdoh_compliant?: boolean | null
          item_description: string
          receipt_url?: string | null
          vendor_name?: string | null
        }
        Update: {
          amount?: number
          candidate_id?: string
          created_at?: string | null
          election_id?: string
          expense_date?: string
          id?: string
          is_lyngdoh_compliant?: boolean | null
          item_description?: string
          receipt_url?: string | null
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_expenses_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_expenses_election_id_fkey"
            columns: ["election_id"]
            isOneToOne: false
            referencedRelation: "elections"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          created_at: string | null
          id: string
          manifesto_text: string | null
          position_id: string
          profile_id: string
          votes_count: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          manifesto_text?: string | null
          position_id: string
          profile_id: string
          votes_count?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          manifesto_text?: string | null
          position_id?: string
          profile_id?: string
          votes_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "candidates_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "election_positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidates_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cba_clauses: {
        Row: {
          cba_id: string
          clause_number: string
          created_at: string | null
          current_clause_text: string
          id: string
          management_counter_offer: string | null
          organisation_id: string
          status: string
          topic: string
          union_demand_text: string
          updated_at: string | null
        }
        Insert: {
          cba_id: string
          clause_number: string
          created_at?: string | null
          current_clause_text: string
          id?: string
          management_counter_offer?: string | null
          organisation_id: string
          status?: string
          topic: string
          union_demand_text: string
          updated_at?: string | null
        }
        Update: {
          cba_id?: string
          clause_number?: string
          created_at?: string | null
          current_clause_text?: string
          id?: string
          management_counter_offer?: string | null
          organisation_id?: string
          status?: string
          topic?: string
          union_demand_text?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cba_clauses_cba_id_fkey"
            columns: ["cba_id"]
            isOneToOne: false
            referencedRelation: "cba_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cba_clauses_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      cba_documents: {
        Row: {
          created_at: string | null
          created_by: string | null
          file_url: string
          id: string
          organisation_id: string
          status: string
          title: string
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          file_url: string
          id?: string
          organisation_id: string
          status?: string
          title: string
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          file_url?: string
          id?: string
          organisation_id?: string
          status?: string
          title?: string
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cba_documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cba_documents_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_items: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          document_name: string | null
          document_size: number | null
          document_url: string | null
          due_date: string | null
          id: string
          notes: string | null
          organisation_id: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          document_name?: string | null
          document_size?: number | null
          document_url?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          organisation_id: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          document_name?: string | null
          document_size?: number | null
          document_url?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          organisation_id?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_items_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      data_requests: {
        Row: {
          created_at: string | null
          details: Json | null
          id: string
          organisation_id: string | null
          processed_at: string | null
          processed_by: string | null
          request_type: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: string
          organisation_id?: string | null
          processed_at?: string | null
          processed_by?: string | null
          request_type: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: string
          organisation_id?: string | null
          processed_at?: string | null
          processed_by?: string | null
          request_type?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_requests_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      domestic_staff: {
        Row: {
          aadhar_last4: string | null
          created_at: string | null
          flat_units: string[]
          full_name: string
          id: string
          organisation_id: string
          pass_code: string
          phone: string
          photo_url: string | null
          police_verified: boolean | null
          role: string
          status: string
          updated_at: string | null
        }
        Insert: {
          aadhar_last4?: string | null
          created_at?: string | null
          flat_units?: string[]
          full_name: string
          id?: string
          organisation_id: string
          pass_code: string
          phone: string
          photo_url?: string | null
          police_verified?: boolean | null
          role: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          aadhar_last4?: string | null
          created_at?: string | null
          flat_units?: string[]
          full_name?: string
          id?: string
          organisation_id?: string
          pass_code?: string
          phone?: string
          photo_url?: string | null
          police_verified?: boolean | null
          role?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "domestic_staff_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_subscriptions: {
        Row: {
          amount: number
          campaign_id: string | null
          created_at: string | null
          currency: string | null
          donor_id: string
          frequency: Database["public"]["Enums"]["recurring_frequency"]
          id: string
          next_payment_date: string
          organisation_id: string
          payment_method_details: Json | null
          status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string | null
        }
        Insert: {
          amount: number
          campaign_id?: string | null
          created_at?: string | null
          currency?: string | null
          donor_id: string
          frequency: Database["public"]["Enums"]["recurring_frequency"]
          id?: string
          next_payment_date: string
          organisation_id: string
          payment_method_details?: Json | null
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string | null
        }
        Update: {
          amount?: number
          campaign_id?: string | null
          created_at?: string | null
          currency?: string | null
          donor_id?: string
          frequency?: Database["public"]["Enums"]["recurring_frequency"]
          id?: string
          next_payment_date?: string
          organisation_id?: string
          payment_method_details?: Json | null
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_subscriptions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_subscriptions_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_subscriptions_organisation_id_fkey"
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
          last_name: string | null
          lifetime_value: number | null
          organisation_id: string
          pan_number: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name?: string | null
          lifetime_value?: number | null
          organisation_id: string
          pan_number?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string | null
          lifetime_value?: number | null
          organisation_id?: string
          pan_number?: string | null
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
      election_booth_tallies: {
        Row: {
          booth_name: string
          candidate_id: string
          created_at: string | null
          election_id: string
          id: string
          position_id: string
          recorded_by: string | null
          round_number: number
          votes_count: number
        }
        Insert: {
          booth_name: string
          candidate_id: string
          created_at?: string | null
          election_id: string
          id?: string
          position_id: string
          recorded_by?: string | null
          round_number?: number
          votes_count?: number
        }
        Update: {
          booth_name?: string
          candidate_id?: string
          created_at?: string | null
          election_id?: string
          id?: string
          position_id?: string
          recorded_by?: string | null
          round_number?: number
          votes_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "election_booth_tallies_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "election_booth_tallies_election_id_fkey"
            columns: ["election_id"]
            isOneToOne: false
            referencedRelation: "elections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "election_booth_tallies_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "election_positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "election_booth_tallies_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      election_positions: {
        Row: {
          created_at: string | null
          election_id: string
          id: string
          max_votes_per_voter: number
          title: string
        }
        Insert: {
          created_at?: string | null
          election_id: string
          id?: string
          max_votes_per_voter?: number
          title: string
        }
        Update: {
          created_at?: string | null
          election_id?: string
          id?: string
          max_votes_per_voter?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "election_positions_election_id_fkey"
            columns: ["election_id"]
            isOneToOne: false
            referencedRelation: "elections"
            referencedColumns: ["id"]
          },
        ]
      }
      election_voters: {
        Row: {
          election_id: string
          id: string
          profile_id: string
          voted_at: string | null
        }
        Insert: {
          election_id: string
          id?: string
          profile_id: string
          voted_at?: string | null
        }
        Update: {
          election_id?: string
          id?: string
          profile_id?: string
          voted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "election_voters_election_id_fkey"
            columns: ["election_id"]
            isOneToOne: false
            referencedRelation: "elections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "election_voters_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      elections: {
        Row: {
          created_at: string | null
          description: string | null
          end_time: string
          id: string
          organisation_id: string
          start_time: string
          status: Database["public"]["Enums"]["election_status"]
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_time: string
          id?: string
          organisation_id: string
          start_time: string
          status?: Database["public"]["Enums"]["election_status"]
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_time?: string
          id?: string
          organisation_id?: string
          start_time?: string
          status?: Database["public"]["Enums"]["election_status"]
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "elections_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      event_rsvps: {
        Row: {
          checked_in_at: string | null
          created_at: string | null
          event_id: string
          guest_email: string | null
          guest_name: string | null
          id: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          checked_in_at?: string | null
          created_at?: string | null
          event_id: string
          guest_email?: string | null
          guest_name?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          checked_in_at?: string | null
          created_at?: string | null
          event_id?: string
          guest_email?: string | null
          guest_name?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
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
          },
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
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      facilities: {
        Row: {
          capacity: number | null
          created_at: string | null
          description: string | null
          hourly_rate: number | null
          id: string
          name: string
          organisation_id: string
          status: Database["public"]["Enums"]["facility_status"]
          updated_at: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          hourly_rate?: number | null
          id?: string
          name: string
          organisation_id: string
          status?: Database["public"]["Enums"]["facility_status"]
          updated_at?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          hourly_rate?: number | null
          id?: string
          name?: string
          organisation_id?: string
          status?: Database["public"]["Enums"]["facility_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "facilities_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      facility_bookings: {
        Row: {
          created_at: string | null
          end_time: string
          facility_id: string
          id: string
          notes: string | null
          organisation_id: string
          profile_id: string
          start_time: string
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_time: string
          facility_id: string
          id?: string
          notes?: string | null
          organisation_id: string
          profile_id: string
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_time?: string
          facility_id?: string
          id?: string
          notes?: string | null
          organisation_id?: string
          profile_id?: string
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "facility_bookings_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facility_bookings_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facility_bookings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      grant_expenses: {
        Row: {
          amount: number
          budget_line_item: string
          created_at: string | null
          expense_date: string
          grant_id: string
          id: string
          milestone_id: string | null
          notes: string | null
          organisation_id: string
          receipt_url: string | null
          vendor_name: string | null
        }
        Insert: {
          amount: number
          budget_line_item: string
          created_at?: string | null
          expense_date?: string
          grant_id: string
          id?: string
          milestone_id?: string | null
          notes?: string | null
          organisation_id: string
          receipt_url?: string | null
          vendor_name?: string | null
        }
        Update: {
          amount?: number
          budget_line_item?: string
          created_at?: string | null
          expense_date?: string
          grant_id?: string
          id?: string
          milestone_id?: string | null
          notes?: string | null
          organisation_id?: string
          receipt_url?: string | null
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grant_expenses_grant_id_fkey"
            columns: ["grant_id"]
            isOneToOne: false
            referencedRelation: "grants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grant_expenses_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "grant_milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grant_expenses_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      grant_milestones: {
        Row: {
          created_at: string | null
          deliverables: string | null
          disbursed_at: string | null
          grant_id: string
          id: string
          organisation_id: string
          status: string
          target_date: string | null
          title: string
          tranche_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deliverables?: string | null
          disbursed_at?: string | null
          grant_id: string
          id?: string
          organisation_id: string
          status?: string
          target_date?: string | null
          title: string
          tranche_amount?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deliverables?: string | null
          disbursed_at?: string | null
          grant_id?: string
          id?: string
          organisation_id?: string
          status?: string
          target_date?: string | null
          title?: string
          tranche_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grant_milestones_grant_id_fkey"
            columns: ["grant_id"]
            isOneToOne: false
            referencedRelation: "grants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grant_milestones_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      grants: {
        Row: {
          amount: number
          created_at: string | null
          created_by: string | null
          deadline: string | null
          id: string
          organisation_id: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          created_by?: string | null
          deadline?: string | null
          id?: string
          organisation_id: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          created_by?: string | null
          deadline?: string | null
          id?: string
          organisation_id?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grants_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grants_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_mess_audits: {
        Row: {
          action_taken: string | null
          created_at: string | null
          created_by: string | null
          hostel_name: string
          id: string
          inspection_type: string
          meal_type: string | null
          organisation_id: string
          photo_url: string | null
          rating: number | null
          remarks: string | null
          roll_number: string | null
          status: string
          student_name: string | null
          updated_at: string | null
        }
        Insert: {
          action_taken?: string | null
          created_at?: string | null
          created_by?: string | null
          hostel_name: string
          id?: string
          inspection_type?: string
          meal_type?: string | null
          organisation_id: string
          photo_url?: string | null
          rating?: number | null
          remarks?: string | null
          roll_number?: string | null
          status?: string
          student_name?: string | null
          updated_at?: string | null
        }
        Update: {
          action_taken?: string | null
          created_at?: string | null
          created_by?: string | null
          hostel_name?: string
          id?: string
          inspection_type?: string
          meal_type?: string | null
          organisation_id?: string
          photo_url?: string | null
          rating?: number | null
          remarks?: string | null
          roll_number?: string | null
          status?: string
          student_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hostel_mess_audits_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_mess_audits_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_logs: {
        Row: {
          description: string | null
          detected_at: string | null
          id: string
          metadata: Json | null
          resolved_at: string | null
          severity: string
          status: string
          title: string
        }
        Insert: {
          description?: string | null
          detected_at?: string | null
          id?: string
          metadata?: Json | null
          resolved_at?: string | null
          severity: string
          status?: string
          title: string
        }
        Update: {
          description?: string | null
          detected_at?: string | null
          id?: string
          metadata?: Json | null
          resolved_at?: string | null
          severity?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          billing_period_end: string | null
          billing_period_start: string | null
          created_at: string | null
          currency: string | null
          due_date: string | null
          id: string
          notes: string | null
          organisation_id: string | null
          paid_at: string | null
          plan_id: string | null
          status: string | null
          transaction_id: string | null
          type: string | null
          unit_id: string | null
        }
        Insert: {
          amount: number
          billing_period_end?: string | null
          billing_period_start?: string | null
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          organisation_id?: string | null
          paid_at?: string | null
          plan_id?: string | null
          status?: string | null
          transaction_id?: string | null
          type?: string | null
          unit_id?: string | null
        }
        Update: {
          amount?: number
          billing_period_end?: string | null
          billing_period_start?: string | null
          created_at?: string | null
          currency?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          organisation_id?: string | null
          paid_at?: string | null
          plan_id?: string | null
          status?: string | null
          transaction_id?: string | null
          type?: string | null
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "billing_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          created_at: string | null
          id: string
          job_id: string
          notes: string | null
          profile_id: string
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id: string
          notes?: string | null
          profile_id: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string
          notes?: string | null
          profile_id?: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          created_at: string | null
          description: string | null
          employer_name: string
          id: string
          location: string | null
          organisation_id: string
          positions_available: number
          skills_required: string[] | null
          start_date: string | null
          status: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at: string | null
          wage_rate: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          employer_name: string
          id?: string
          location?: string | null
          organisation_id: string
          positions_available?: number
          skills_required?: string[] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at?: string | null
          wage_rate?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          employer_name?: string
          id?: string
          location?: string | null
          organisation_id?: string
          positions_available?: number
          skills_required?: string[] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          title?: string
          updated_at?: string | null
          wage_rate?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_postings_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
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
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          area: string | null
          created_at: string | null
          designation: string | null
          email: string | null
          full_name: string
          id: string
          joining_date: string | null
          notes: string | null
          organisation_id: string
          phone: string | null
          role: string
          status: string
          updated_at: string | null
        }
        Insert: {
          area?: string | null
          created_at?: string | null
          designation?: string | null
          email?: string | null
          full_name: string
          id?: string
          joining_date?: string | null
          notes?: string | null
          organisation_id: string
          phone?: string | null
          role?: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          area?: string | null
          created_at?: string | null
          designation?: string | null
          email?: string | null
          full_name?: string
          id?: string
          joining_date?: string | null
          notes?: string | null
          organisation_id?: string
          phone?: string | null
          role?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "members_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_dues: {
        Row: {
          amount: number
          created_at: string | null
          due_date: string
          id: string
          member_profile_id: string
          notes: string | null
          organisation_id: string
          plan_id: string | null
          status: Database["public"]["Enums"]["due_status"]
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          due_date: string
          id?: string
          member_profile_id: string
          notes?: string | null
          organisation_id: string
          plan_id?: string | null
          status?: Database["public"]["Enums"]["due_status"]
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          due_date?: string
          id?: string
          member_profile_id?: string
          notes?: string | null
          organisation_id?: string
          plan_id?: string | null
          status?: Database["public"]["Enums"]["due_status"]
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "membership_dues_member_profile_id_fkey"
            columns: ["member_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_dues_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_dues_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "billing_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_dues_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
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
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_documents: {
        Row: {
          access_level: string
          category: string
          created_at: string
          description: string | null
          file_name: string
          file_size: number
          file_url: string
          id: string
          mime_type: string
          organisation_id: string
          tags: string[] | null
          title: string
          updated_at: string
          uploaded_by: string | null
          uploader_name: string | null
        }
        Insert: {
          access_level?: string
          category?: string
          created_at?: string
          description?: string | null
          file_name: string
          file_size?: number
          file_url: string
          id?: string
          mime_type?: string
          organisation_id: string
          tags?: string[] | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
          uploader_name?: string | null
        }
        Update: {
          access_level?: string
          category?: string
          created_at?: string
          description?: string | null
          file_name?: string
          file_size?: number
          file_url?: string
          id?: string
          mime_type?: string
          organisation_id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
          uploader_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "org_documents_organisation_id_fkey"
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
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_system: boolean | null
          name: string
          organisation_id: string
          permissions: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          name: string
          organisation_id: string
          permissions?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          name?: string
          organisation_id?: string
          permissions?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "org_roles_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_subgroup_members: {
        Row: {
          joined_at: string | null
          profile_id: string
          role: string
          subgroup_id: string
        }
        Insert: {
          joined_at?: string | null
          profile_id: string
          role?: string
          subgroup_id: string
        }
        Update: {
          joined_at?: string | null
          profile_id?: string
          role?: string
          subgroup_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_subgroup_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_subgroup_members_subgroup_id_fkey"
            columns: ["subgroup_id"]
            isOneToOne: false
            referencedRelation: "org_subgroups"
            referencedColumns: ["id"]
          },
        ]
      }
      org_subgroups: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          organisation_id: string
          parent_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          organisation_id: string
          parent_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          organisation_id?: string
          parent_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "org_subgroups_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_subgroups_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "org_subgroups"
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
            referencedRelation: "organisations"
            referencedColumns: ["id"]
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
          billing_email: string | null
          broadcast_restricted: boolean | null
          capabilities: Json | null
          compliance_documents: Json | null
          contact_email: string | null
          contact_phone: string | null
          cover_url: string | null
          created_at: string
          created_by: string | null
          darpan_id: string | null
          deleted_at: string | null
          description: string | null
          id: string
          incorporation_date: string | null
          legal_hold: boolean | null
          legal_hold_reason: string | null
          logo_url: string | null
          membership_policy: string
          monthly_dues: number | null
          name: string
          org_type: string
          plan_expires_at: string | null
          plan_name: string | null
          plan_period: string | null
          plan_status: string | null
          public_transparency_enabled: boolean
          registration_number: string | null
          registration_status:
            | Database["public"]["Enums"]["registration_status"]
            | null
          risk_score: number | null
          slug: string
          social_links: Json | null
          status: string
          tax_id: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          billing_email?: string | null
          broadcast_restricted?: boolean | null
          capabilities?: Json | null
          compliance_documents?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          darpan_id?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          incorporation_date?: string | null
          legal_hold?: boolean | null
          legal_hold_reason?: string | null
          logo_url?: string | null
          membership_policy?: string
          monthly_dues?: number | null
          name: string
          org_type?: string
          plan_expires_at?: string | null
          plan_name?: string | null
          plan_period?: string | null
          plan_status?: string | null
          public_transparency_enabled?: boolean
          registration_number?: string | null
          registration_status?:
            | Database["public"]["Enums"]["registration_status"]
            | null
          risk_score?: number | null
          slug: string
          social_links?: Json | null
          status?: string
          tax_id?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          billing_email?: string | null
          broadcast_restricted?: boolean | null
          capabilities?: Json | null
          compliance_documents?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          darpan_id?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          incorporation_date?: string | null
          legal_hold?: boolean | null
          legal_hold_reason?: string | null
          logo_url?: string | null
          membership_policy?: string
          monthly_dues?: number | null
          name?: string
          org_type?: string
          plan_expires_at?: string | null
          plan_name?: string | null
          plan_period?: string | null
          plan_status?: string | null
          public_transparency_enabled?: boolean
          registration_number?: string | null
          registration_status?:
            | Database["public"]["Enums"]["registration_status"]
            | null
          risk_score?: number | null
          slug?: string
          social_links?: Json | null
          status?: string
          tax_id?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organisations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_actions: {
        Row: {
          action_type: string
          created_at: string | null
          created_by: string | null
          id: string
          metadata: Json | null
          reason: string | null
          severity: string | null
          target_org_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          metadata?: Json | null
          reason?: string | null
          severity?: string | null
          target_org_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          metadata?: Json | null
          reason?: string | null
          severity?: string | null
          target_org_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_actions_target_org_id_fkey"
            columns: ["target_org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
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
          eligible_count: number | null
          end_time: string | null
          final_results: Json | null
          id: string
          is_public: boolean | null
          organisation_id: string
          proposal_id: string | null
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
          eligible_count?: number | null
          end_time?: string | null
          final_results?: Json | null
          id?: string
          is_public?: boolean | null
          organisation_id: string
          proposal_id?: string | null
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
          eligible_count?: number | null
          end_time?: string | null
          final_results?: Json | null
          id?: string
          is_public?: boolean | null
          organisation_id?: string
          proposal_id?: string | null
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
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "polls_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          profile_id: string
          role_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          profile_id: string
          role_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          profile_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_roles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "org_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          approved_at: string | null
          area: string | null
          created_at: string
          deleted_at: string | null
          designation: string | null
          display_name: string | null
          email: string
          engagement_score: number | null
          full_name: string | null
          global_status: string
          id: string
          is_platform_admin: boolean
          is_primary_admin: boolean | null
          joining_date: string | null
          monthly_dues: number | null
          notes: string | null
          onboarding_completed: boolean | null
          organisation_id: string | null
          phone: string | null
          phone_verified: boolean | null
          role: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          area?: string | null
          created_at?: string
          deleted_at?: string | null
          designation?: string | null
          display_name?: string | null
          email: string
          engagement_score?: number | null
          full_name?: string | null
          global_status?: string
          id: string
          is_platform_admin?: boolean
          is_primary_admin?: boolean | null
          joining_date?: string | null
          monthly_dues?: number | null
          notes?: string | null
          onboarding_completed?: boolean | null
          organisation_id?: string | null
          phone?: string | null
          phone_verified?: boolean | null
          role?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          area?: string | null
          created_at?: string
          deleted_at?: string | null
          designation?: string | null
          display_name?: string | null
          email?: string
          engagement_score?: number | null
          full_name?: string | null
          global_status?: string
          id?: string
          is_platform_admin?: boolean
          is_primary_admin?: boolean | null
          joining_date?: string | null
          monthly_dues?: number | null
          notes?: string | null
          onboarding_completed?: boolean | null
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
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          proposal_id: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          proposal_id: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          proposal_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposal_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposal_comments_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          content: string
          created_at: string | null
          created_by: string
          id: string
          organisation_id: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          organisation_id: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          organisation_id?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limits: {
        Row: {
          created_at: string | null
          key: string
          points: number
          updated_at: string | null
          window_start: string
        }
        Insert: {
          created_at?: string | null
          key: string
          points?: number
          updated_at?: string | null
          window_start?: string
        }
        Update: {
          created_at?: string | null
          key?: string
          points?: number
          updated_at?: string | null
          window_start?: string
        }
        Relationships: []
      }
      risk_events: {
        Row: {
          detected_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json | null
          resolved: boolean | null
          resolved_at: string | null
          risk_type: string
          severity: string | null
        }
        Insert: {
          detected_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          risk_type: string
          severity?: string | null
        }
        Update: {
          detected_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          risk_type?: string
          severity?: string | null
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
      society_assets: {
        Row: {
          amc_expiry_date: string
          amc_start_date: string | null
          annual_amc_cost: number | null
          asset_name: string
          category: string
          created_at: string | null
          id: string
          last_service_date: string | null
          location_block: string | null
          next_service_due: string
          organisation_id: string
          status: string
          statutory_noc_expiry: string | null
          updated_at: string | null
          vendor_name: string
          vendor_phone: string | null
        }
        Insert: {
          amc_expiry_date: string
          amc_start_date?: string | null
          annual_amc_cost?: number | null
          asset_name: string
          category: string
          created_at?: string | null
          id?: string
          last_service_date?: string | null
          location_block?: string | null
          next_service_due: string
          organisation_id: string
          status?: string
          statutory_noc_expiry?: string | null
          updated_at?: string | null
          vendor_name: string
          vendor_phone?: string | null
        }
        Update: {
          amc_expiry_date?: string
          amc_start_date?: string | null
          annual_amc_cost?: number | null
          asset_name?: string
          category?: string
          created_at?: string | null
          id?: string
          last_service_date?: string | null
          location_block?: string | null
          next_service_due?: string
          organisation_id?: string
          status?: string
          statutory_noc_expiry?: string | null
          updated_at?: string | null
          vendor_name?: string
          vendor_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "society_assets_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      strike_roster: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          organisation_id: string
          picket_date: string
          plant_location: string
          relief_disbursed: number | null
          shift_name: string
          steward_in_charge: string | null
          strike_name: string
          workers_present: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          organisation_id: string
          picket_date?: string
          plant_location: string
          relief_disbursed?: number | null
          shift_name: string
          steward_in_charge?: string | null
          strike_name: string
          workers_present?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          organisation_id?: string
          picket_date?: string
          plant_location?: string
          relief_disbursed?: number | null
          shift_name?: string
          steward_in_charge?: string | null
          strike_name?: string
          workers_present?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "strike_roster_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strike_roster_steward_in_charge_fkey"
            columns: ["steward_in_charge"]
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
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_receipts: {
        Row: {
          amount: number
          created_at: string | null
          donation_id: string
          donor_id: string
          donor_pan: string | null
          financial_year: string
          id: string
          organisation_id: string
          pdf_url: string | null
          receipt_date: string
          receipt_number: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          donation_id: string
          donor_id: string
          donor_pan?: string | null
          financial_year: string
          id?: string
          organisation_id: string
          pdf_url?: string | null
          receipt_date?: string
          receipt_number: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          donation_id?: string
          donor_id?: string
          donor_pan?: string | null
          financial_year?: string
          id?: string
          organisation_id?: string
          pdf_url?: string | null
          receipt_date?: string
          receipt_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_receipts_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: true
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_receipts_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_receipts_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_verification: {
        Row: {
          colony_name: string | null
          creation_time: string | null
          energy_exertion: number | null
          id: number
          last_access: string | null
          pin_code: string | null
          tenant_name: string
          updated_at: string | null
          validated: boolean | null
          verification_date: string | null
          verification_hash: string | null
        }
        Insert: {
          colony_name?: string | null
          creation_time?: string | null
          energy_exertion?: number | null
          id?: number
          last_access?: string | null
          pin_code?: string | null
          tenant_name: string
          updated_at?: string | null
          validated?: boolean | null
          verification_date?: string | null
          verification_hash?: string | null
        }
        Update: {
          colony_name?: string | null
          creation_time?: string | null
          energy_exertion?: number | null
          id?: number
          last_access?: string | null
          pin_code?: string | null
          tenant_name?: string
          updated_at?: string | null
          validated?: boolean | null
          verification_date?: string | null
          verification_hash?: string | null
        }
        Relationships: []
      }
      tickets: {
        Row: {
          ai_analysis: Json | null
          assigned_to: string | null
          authority_id: string | null
          created_at: string | null
          created_by: string | null
          delivered_at: string | null
          delivery_method: string | null
          description: string
          id: string
          organisation_id: string
          printed_at: string | null
          priority: string
          sla_due_at: string | null
          status: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          assigned_to?: string | null
          authority_id?: string | null
          created_at?: string | null
          created_by?: string | null
          delivered_at?: string | null
          delivery_method?: string | null
          description: string
          id?: string
          organisation_id: string
          printed_at?: string | null
          priority?: string
          sla_due_at?: string | null
          status?: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          assigned_to?: string | null
          authority_id?: string | null
          created_at?: string | null
          created_by?: string | null
          delivered_at?: string | null
          delivery_method?: string | null
          description?: string
          id?: string
          organisation_id?: string
          printed_at?: string | null
          priority?: string
          sla_due_at?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_authority_id_fkey"
            columns: ["authority_id"]
            isOneToOne: false
            referencedRelation: "authority_contacts"
            referencedColumns: ["id"]
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
      trade_disputes: {
        Row: {
          created_at: string | null
          dispute_nature: string
          dispute_ref: string
          employer_name: string
          id: string
          lead_shop_steward_id: string | null
          next_hearing_date: string | null
          organisation_id: string
          settlement_terms: string | null
          stage: string
          status: string
          summary: string
          updated_at: string | null
          worker_count: number | null
        }
        Insert: {
          created_at?: string | null
          dispute_nature: string
          dispute_ref: string
          employer_name: string
          id?: string
          lead_shop_steward_id?: string | null
          next_hearing_date?: string | null
          organisation_id: string
          settlement_terms?: string | null
          stage?: string
          status?: string
          summary: string
          updated_at?: string | null
          worker_count?: number | null
        }
        Update: {
          created_at?: string | null
          dispute_nature?: string
          dispute_ref?: string
          employer_name?: string
          id?: string
          lead_shop_steward_id?: string | null
          next_hearing_date?: string | null
          organisation_id?: string
          settlement_terms?: string | null
          stage?: string
          status?: string
          summary?: string
          updated_at?: string | null
          worker_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trade_disputes_lead_shop_steward_id_fkey"
            columns: ["lead_shop_steward_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_disputes_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          metadata: Json | null
          organisation_id: string
          reference_id: string | null
          status: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          organisation_id: string
          reference_id?: string | null
          status?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          organisation_id?: string
          reference_id?: string | null
          status?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          area_sqft: number | null
          block_building: string | null
          created_at: string | null
          id: string
          organisation_id: string
          owner_profile_id: string | null
          status: Database["public"]["Enums"]["unit_status"]
          tenant_profile_id: string | null
          unit_number: string
          updated_at: string | null
        }
        Insert: {
          area_sqft?: number | null
          block_building?: string | null
          created_at?: string | null
          id?: string
          organisation_id: string
          owner_profile_id?: string | null
          status?: Database["public"]["Enums"]["unit_status"]
          tenant_profile_id?: string | null
          unit_number: string
          updated_at?: string | null
        }
        Update: {
          area_sqft?: number | null
          block_building?: string | null
          created_at?: string | null
          id?: string
          organisation_id?: string
          owner_profile_id?: string | null
          status?: Database["public"]["Enums"]["unit_status"]
          tenant_profile_id?: string | null
          unit_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "units_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "units_owner_profile_id_fkey"
            columns: ["owner_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "units_tenant_profile_id_fkey"
            columns: ["tenant_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      visitors: {
        Row: {
          created_at: string | null
          expected_time: string | null
          id: string
          logged_by: string | null
          name: string
          organisation_id: string
          phone: string | null
          purpose: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          expected_time?: string | null
          id?: string
          logged_by?: string | null
          name: string
          organisation_id: string
          phone?: string | null
          purpose: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          expected_time?: string | null
          id?: string
          logged_by?: string | null
          name?: string
          organisation_id?: string
          phone?: string | null
          purpose?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visitors_logged_by_fkey"
            columns: ["logged_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visitors_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_certificates: {
        Row: {
          certificate_number: string
          citation_text: string | null
          created_at: string | null
          id: string
          issue_date: string
          issued_by: string | null
          organisation_id: string
          pdf_url: string | null
          service_hours_recognized: number
          verification_hash: string
          volunteer_profile_id: string
        }
        Insert: {
          certificate_number: string
          citation_text?: string | null
          created_at?: string | null
          id?: string
          issue_date?: string
          issued_by?: string | null
          organisation_id: string
          pdf_url?: string | null
          service_hours_recognized?: number
          verification_hash: string
          volunteer_profile_id: string
        }
        Update: {
          certificate_number?: string
          citation_text?: string | null
          created_at?: string | null
          id?: string
          issue_date?: string
          issued_by?: string | null
          organisation_id?: string
          pdf_url?: string | null
          service_hours_recognized?: number
          verification_hash?: string
          volunteer_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_certificates_issued_by_fkey"
            columns: ["issued_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteer_certificates_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteer_certificates_volunteer_profile_id_fkey"
            columns: ["volunteer_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      [_ in never]: never
    }
    Functions: {
      admin_list_users: {
        Args: never
        Returns: {
          email: string
          full_name: string
          id: string
          is_platform_admin: boolean
          organisation_count: number
          status: string
        }[]
      }
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
          p_registration_status?: string
          p_user_id: string
        }
        Returns: Json
      }
      create_organisation_with_admin: {
        Args: { org_name: string; org_slug: string }
        Returns: string
      }
      get_auth_org_id: { Args: never; Returns: string }
      get_my_organisation_id: { Args: never; Returns: string }
      get_system_role_permissions: {
        Args: { role_name: string }
        Returns: Json
      }
      get_verification_status: { Args: { user_id: string }; Returns: Json }
      has_visibility_access: {
        Args: { member_role: string; visibility: string }
        Returns: boolean
      }
      increment_rate_limit: { Args: { key_param: string }; Returns: undefined }
      is_platform_admin: { Args: never; Returns: boolean }
      lock_next_job: { Args: never; Returns: Json }
      purge_old_audit_logs: {
        Args: { retention_days?: number }
        Returns: number
      }
      seed_compliance_items: {
        Args: { p_org_id: string; p_org_type: string }
        Returns: undefined
      }
      seed_system_roles: { Args: { p_org_id: string }; Returns: undefined }
      set_selected_organisation: {
        Args: { p_organisation_id: string }
        Returns: undefined
      }
    }
    Enums: {
      application_status: "applied" | "dispatched" | "rejected" | "completed"
      booking_status: "pending" | "approved" | "rejected" | "cancelled"
      due_status: "pending" | "paid" | "overdue" | "waived"
      election_status: "upcoming" | "active" | "completed" | "cancelled"
      facility_status: "available" | "maintenance" | "closed"
      job_status: "open" | "filled" | "cancelled" | "completed"
      recurring_frequency: "monthly" | "quarterly" | "annual"
      registration_status: "registered" | "unregistered" | "in_progress"
      subscription_status: "active" | "paused" | "cancelled" | "past_due"
      unit_status: "occupied" | "vacant" | "under_construction"
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
    Enums: {
      application_status: ["applied", "dispatched", "rejected", "completed"],
      booking_status: ["pending", "approved", "rejected", "cancelled"],
      due_status: ["pending", "paid", "overdue", "waived"],
      election_status: ["upcoming", "active", "completed", "cancelled"],
      facility_status: ["available", "maintenance", "closed"],
      job_status: ["open", "filled", "cancelled", "completed"],
      recurring_frequency: ["monthly", "quarterly", "annual"],
      registration_status: ["registered", "unregistered", "in_progress"],
      subscription_status: ["active", "paused", "cancelled", "past_due"],
      unit_status: ["occupied", "vacant", "under_construction"],
    },
  },
} as const
