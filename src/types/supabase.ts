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
      asset: {
        Row: {
          id: string
          workspace_id: string
          program_id: string
          name: string
          asset_type: string
          asset_url: string | null
          discovered_at: string | null
          last_tested_at: string | null
          notes_md: string | null
          context_tags: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          program_id: string
          name: string
          asset_type: string
          asset_url?: string | null
          discovered_at?: string | null
          last_tested_at?: string | null
          notes_md?: string | null
          context_tags?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          program_id?: string
          name?: string
          asset_type?: string
          asset_url?: string | null
          discovered_at?: string | null
          last_tested_at?: string | null
          notes_md?: string | null
          context_tags?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      asset_behaviour: {
        Row: {
          instance_id: string
          workspace_id: string
          asset_id: string
          behav_tmpl_id: string
          snapshot: Json | null
          context_tags: Json | null
          notes: string | null
          created_at: string
        }
        Insert: {
          instance_id?: string
          workspace_id: string
          asset_id: string
          behav_tmpl_id: string
          snapshot?: Json | null
          context_tags?: Json | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          instance_id?: string
          workspace_id?: string
          asset_id?: string
          behav_tmpl_id?: string
          snapshot?: Json | null
          context_tags?: Json | null
          notes?: string | null
          created_at?: string
        }
      }
      asset_functionality: {
        Row: {
          instance_id: string
          workspace_id: string
          asset_id: string
          func_tmpl_id: string
          snapshot: Json | null
          context_tags: Json | null
          notes: string | null
          created_at: string
        }
        Insert: {
          instance_id?: string
          workspace_id: string
          asset_id: string
          func_tmpl_id: string
          snapshot?: Json | null
          context_tags?: Json | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          instance_id?: string
          workspace_id?: string
          asset_id?: string
          func_tmpl_id?: string
          snapshot?: Json | null
          context_tags?: Json | null
          notes?: string | null
          created_at?: string
        }
      }
      asset_technology: {
        Row: {
          instance_id: string
          workspace_id: string
          asset_id: string
          tech_tmpl_id: string
          snapshot: Json | null
          context_tags: Json | null
          notes: string | null
          created_at: string
        }
        Insert: {
          instance_id?: string
          workspace_id: string
          asset_id: string
          tech_tmpl_id: string
          snapshot?: Json | null
          context_tags?: Json | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          instance_id?: string
          workspace_id?: string
          asset_id?: string
          tech_tmpl_id?: string
          snapshot?: Json | null
          context_tags?: Json | null
          notes?: string | null
          created_at?: string
        }
      }
      atomic_vuln: {
        Row: {
          id: string
          workspace_id: string
          title: string
          flaw_type: string | null
          technology: string | null
          steps_md: string | null
          chainable: boolean
          chain_to_id: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          title: string
          flaw_type?: string | null
          technology?: string | null
          steps_md?: string | null
          chainable?: boolean
          chain_to_id?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          title?: string
          flaw_type?: string | null
          technology?: string | null
          steps_md?: string | null
          chainable?: boolean
          chain_to_id?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      audit_log: {
        Row: {
          id: string
          workspace_id: string | null
          actor_user_id: string
          action: string
          resource: string
          resource_id: string
          timestamp: string
          ip_address: string
        }
        Insert: {
          id?: string
          workspace_id?: string | null
          actor_user_id: string
          action: string
          resource: string
          resource_id: string
          timestamp?: string
          ip_address: string
        }
        Update: {
          id?: string
          workspace_id?: string | null
          actor_user_id?: string
          action?: string
          resource?: string
          resource_id?: string
          timestamp?: string
          ip_address?: string
        }
      }
      behaviour_template: {
        Row: {
          id: string
          workspace_id: string
          version: string
          name: string
          description: string | null
          context_tags: Json | null
          created_by: string | null
          created_at: string
          modified_by: string | null
          modified_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          version: string
          name: string
          description?: string | null
          context_tags?: Json | null
          created_by?: string | null
          created_at?: string
          modified_by?: string | null
          modified_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          version?: string
          name?: string
          description?: string | null
          context_tags?: Json | null
          created_by?: string | null
          created_at?: string
          modified_by?: string | null
          modified_at?: string
        }
      }
      bounty_tier: {
        Row: {
          id: string
          program_id: string
          amount: number
          currency_code: string
          reward_type: string | null
        }
        Insert: {
          id?: string
          program_id: string
          amount: number
          currency_code: string
          reward_type?: string | null
        }
        Update: {
          id?: string
          program_id?: string
          amount?: number
          currency_code?: string
          reward_type?: string | null
        }
      }
      entity_tag: {
        Row: {
          tag_id: string
          entity: string
          entity_id: string
        }
        Insert: {
          tag_id: string
          entity: string
          entity_id: string
        }
        Update: {
          tag_id?: string
          entity?: string
          entity_id?: string
        }
      }
      functionality_template: {
        Row: {
          id: string
          workspace_id: string
          version: string
          name: string
          category: string | null
          description: string | null
          common_endpoints: string | null
          notes: string | null
          diagram_md: string | null
          common_vectors: string | null
          created_by: string | null
          created_at: string
          modified_by: string | null
          modified_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          version: string
          name: string
          category?: string | null
          description?: string | null
          common_endpoints?: string | null
          notes?: string | null
          diagram_md?: string | null
          common_vectors?: string | null
          created_by?: string | null
          created_at?: string
          modified_by?: string | null
          modified_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          version?: string
          name?: string
          category?: string | null
          description?: string | null
          common_endpoints?: string | null
          notes?: string | null
          diagram_md?: string | null
          common_vectors?: string | null
          created_by?: string | null
          created_at?: string
          modified_by?: string | null
          modified_at?: string
        }
      }
      gadget: {
        Row: {
          id: string
          workspace_id: string
          name: string
          description: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          description?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          description?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      gadget_playbook: {
        Row: {
          gadget_id: string
          playbook_id: string
        }
        Insert: {
          gadget_id: string
          playbook_id: string
        }
        Update: {
          gadget_id?: string
          playbook_id?: string
        }
      }
      logic_flaw: {
        Row: {
          id: string
          workspace_id: string
          title: string
          steps_md: string | null
          chainable: boolean
          chain_to_id: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          title: string
          steps_md?: string | null
          chainable?: boolean
          chain_to_id?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          title?: string
          steps_md?: string | null
          chainable?: boolean
          chain_to_id?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      methodology: {
        Row: {
          id: string
          workspace_id: string
          vuln_class_id: string
          category_id: string
          name: string
          description: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          vuln_class_id: string
          category_id: string
          name: string
          description?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          vuln_class_id?: string
          category_id?: string
          name?: string
          description?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      methodology_category: {
        Row: {
          id: string
          workspace_id: string
          name: string
          descr: string | null
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          descr?: string | null
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          descr?: string | null
        }
      }
      methodology_revision: {
        Row: {
          id: string
          workspace_id: string
          methodology_id: string
          version: string
          changes_md: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          methodology_id: string
          version: string
          changes_md?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          methodology_id?: string
          version?: string
          changes_md?: string | null
          created_at?: string
        }
      }
      payload: {
        Row: {
          id: string
          workspace_id: string
          technique_id: string
          name: string
          content: string
          description: string | null
          context_tags: Json | null
          efficacy_score: number | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          technique_id: string
          name: string
          content: string
          description?: string | null
          context_tags?: Json | null
          efficacy_score?: number | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          technique_id?: string
          name?: string
          content?: string
          description?: string | null
          context_tags?: Json | null
          efficacy_score?: number | null
          created_by?: string | null
          created_at?: string
        }
      }
      platform: {
        Row: {
          id: string
          workspace_id: string
          name: string
          platform_url: string | null
          description: string | null
          logo_url: string | null
          popularity_rank: number | null
          report_template: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          platform_url?: string | null
          description?: string | null
          logo_url?: string | null
          popularity_rank?: number | null
          report_template?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          platform_url?: string | null
          description?: string | null
          logo_url?: string | null
          popularity_rank?: number | null
          report_template?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      playbook: {
        Row: {
          id: string
          workspace_id: string
          methodology_id: string
          name: string
          description: string | null
          content_md: string | null
          diagram_md: string | null
          context_tags: Json | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          methodology_id: string
          name: string
          description?: string | null
          content_md?: string | null
          diagram_md?: string | null
          context_tags?: Json | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          methodology_id?: string
          name?: string
          description?: string | null
          content_md?: string | null
          diagram_md?: string | null
          context_tags?: Json | null
          created_by?: string | null
          created_at?: string
        }
      }
      playbook_functionality: {
        Row: {
          playbook_id: string
          func_tmpl_id: string
        }
        Insert: {
          playbook_id: string
          func_tmpl_id: string
        }
        Update: {
          playbook_id?: string
          func_tmpl_id?: string
        }
      }
      playbook_technique: {
        Row: {
          playbook_id: string
          technique_id: string
        }
        Insert: {
          playbook_id: string
          technique_id: string
        }
        Update: {
          playbook_id?: string
          technique_id?: string
        }
      }
      playbook_technology: {
        Row: {
          playbook_id: string
          tech_tmpl_id: string
        }
        Insert: {
          playbook_id: string
          tech_tmpl_id: string
        }
        Update: {
          playbook_id?: string
          tech_tmpl_id?: string
        }
      }
      program: {
        Row: {
          id: string
          workspace_id: string
          platform_id: string
          name: string
          description: string | null
          program_url: string | null
          status: Database["public"]["Enums"]["program_status_enum"]
          launch_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          platform_id: string
          name: string
          description?: string | null
          program_url?: string | null
          status?: Database["public"]["Enums"]["program_status_enum"]
          launch_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          platform_id?: string
          name?: string
          description?: string | null
          program_url?: string | null
          status?: Database["public"]["Enums"]["program_status_enum"]
          launch_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      program_scope_type: {
        Row: {
          program_id: string
          scope_type_id: string
        }
        Insert: {
          program_id: string
          scope_type_id: string
        }
        Update: {
          program_id?: string
          scope_type_id?: string
        }
      }
      role: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
      }
      scope_type: {
        Row: {
          id: string
          workspace_id: string
          name: string
          description: string | null
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          description?: string | null
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          description?: string | null
        }
      }
      tag: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
      }
      technique: {
        Row: {
          id: string
          workspace_id: string
          name: string
          entry_point: string | null
          tags: Json | null
          description: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          entry_point?: string | null
          tags?: Json | null
          description?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          entry_point?: string | null
          tags?: Json | null
          description?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      technique_functionality: {
        Row: {
          technique_id: string
          func_tmpl_id: string
        }
        Insert: {
          technique_id: string
          func_tmpl_id: string
        }
        Update: {
          technique_id?: string
          func_tmpl_id?: string
        }
      }
      technology_template: {
        Row: {
          id: string
          workspace_id: string
          version: string
          name: string
          vendor: string | null
          category: string | null
          doc_url: string | null
          description: string | null
          created_by: string | null
          created_at: string
          modified_by: string | null
          modified_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          version: string
          name: string
          vendor?: string | null
          category?: string | null
          doc_url?: string | null
          description?: string | null
          created_by?: string | null
          created_at?: string
          modified_by?: string | null
          modified_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          version?: string
          name?: string
          vendor?: string | null
          category?: string | null
          doc_url?: string | null
          description?: string | null
          created_by?: string | null
          created_at?: string
          modified_by?: string | null
          modified_at?: string
        }
      }
      user: {
        Row: {
          id: string
          email: string
          password_hash: string
          full_name: string | null
          created_at: string
          last_login: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          full_name?: string | null
          created_at?: string
          last_login?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          full_name?: string | null
          created_at?: string
          last_login?: string | null
          is_active?: boolean
        }
      }
      user_role: {
        Row: {
          user_id: string
          role_id: string
        }
        Insert: {
          user_id: string
          role_id: string
        }
        Update: {
          user_id?: string
          role_id?: string
        }
      }
      vuln_class: {
        Row: {
          id: string
          workspace_id: string
          name: string
          severity: Database["public"]["Enums"]["vuln_class_severity_enum"]
          description: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          severity: Database["public"]["Enums"]["vuln_class_severity_enum"]
          description?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          severity?: Database["public"]["Enums"]["vuln_class_severity_enum"]
          description?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      workspace: {
        Row: {
          id: string
          name: string
          description: string | null
          created_by: string
          created_at: string
          is_public: boolean
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_by: string
          created_at?: string
          is_public?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_by?: string
          created_at?: string
          is_public?: boolean
        }
      }
      workspace_member: {
        Row: {
          workspace_id: string
          user_id: string
          role_id: string
        }
        Insert: {
          workspace_id: string
          user_id: string
          role_id: string
        }
        Update: {
          workspace_id?: string
          user_id?: string
          role_id?: string
        }
      }
      workspace_share: {
        Row: {
          id: string
          workspace_id: string
          shared_with: string
          access_level: string
          shared_by: string
          shared_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          workspace_id: string
          shared_with: string
          access_level: string
          shared_by: string
          shared_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          workspace_id?: string
          shared_with?: string
          access_level?: string
          shared_by?: string
          shared_at?: string
          expires_at?: string | null
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
      program_status_enum: "Active" | "Paused" | "Ended"
      vuln_class_severity_enum: "Low" | "Medium" | "High" | "Critical"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}