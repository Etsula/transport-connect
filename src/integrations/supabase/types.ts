export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agent_locations: {
        Row: {
          address: string
          area: string
          city: string
          country: string
          created_at: string
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
        }
        Insert: {
          address: string
          area: string
          city: string
          country: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
        }
        Update: {
          address?: string
          area?: string
          city?: string
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
        }
        Relationships: []
      }
      agents: {
        Row: {
          agent_name: string
          agent_type: string
          business_id: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          location_id: string | null
          rating: number | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_name: string
          agent_type: string
          business_id?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          location_id?: string | null
          rating?: number | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_name?: string
          agent_type?: string
          business_id?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          location_id?: string | null
          rating?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agents_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_agent_location"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "agent_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          permissions: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          permissions?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          permissions?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      bids: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          shipment_id: string
          status: string | null
          transporter_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          shipment_id: string
          status?: string | null
          transporter_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          shipment_id?: string
          status?: string | null
          transporter_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bids_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bids_transporter_id_fkey"
            columns: ["transporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_structures: {
        Row: {
          base_commission: number | null
          commission_percentage: number
          created_at: string
          id: string
          is_active: boolean | null
          min_deliveries_required: number | null
          min_rating_required: number | null
          referral_level: number
          user_type: string
        }
        Insert: {
          base_commission?: number | null
          commission_percentage: number
          created_at?: string
          id?: string
          is_active?: boolean | null
          min_deliveries_required?: number | null
          min_rating_required?: number | null
          referral_level: number
          user_type: string
        }
        Update: {
          base_commission?: number | null
          commission_percentage?: number
          created_at?: string
          id?: string
          is_active?: boolean | null
          min_deliveries_required?: number | null
          min_rating_required?: number | null
          referral_level?: number
          user_type?: string
        }
        Relationships: []
      }
      conditional_tracking: {
        Row: {
          activated_at: string
          activated_by: string | null
          deactivated_at: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          shipment_id: string | null
          tracking_level: string
          trigger_reason: string | null
          user_id: string
        }
        Insert: {
          activated_at?: string
          activated_by?: string | null
          deactivated_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          shipment_id?: string | null
          tracking_level?: string
          trigger_reason?: string | null
          user_id: string
        }
        Update: {
          activated_at?: string
          activated_by?: string | null
          deactivated_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          shipment_id?: string | null
          tracking_level?: string
          trigger_reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      delivery_charges: {
        Row: {
          base_price: number
          created_at: string
          destination_area: string
          distance_price: number | null
          id: string
          origin_area: string
          package_type: string
          updated_at: string
          urgent_fee: number | null
          weight_price: number | null
        }
        Insert: {
          base_price: number
          created_at?: string
          destination_area: string
          distance_price?: number | null
          id?: string
          origin_area: string
          package_type: string
          updated_at?: string
          urgent_fee?: number | null
          weight_price?: number | null
        }
        Update: {
          base_price?: number
          created_at?: string
          destination_area?: string
          distance_price?: number | null
          id?: string
          origin_area?: string
          package_type?: string
          updated_at?: string
          urgent_fee?: number | null
          weight_price?: number | null
        }
        Relationships: []
      }
      disputes: {
        Row: {
          against_user: string
          created_at: string
          description: string | null
          id: string
          raised_by: string
          reason: string
          resolution: string | null
          resolved_at: string | null
          resolved_by: string | null
          shipment_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          against_user: string
          created_at?: string
          description?: string | null
          id?: string
          raised_by: string
          reason: string
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          shipment_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          against_user?: string
          created_at?: string
          description?: string | null
          id?: string
          raised_by?: string
          reason?: string
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          shipment_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      document_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          required_for_countries: string[] | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          required_for_countries?: string[] | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          required_for_countries?: string[] | null
        }
        Relationships: []
      }
      gdpr_requests: {
        Row: {
          created_at: string
          download_url: string | null
          expires_at: string | null
          id: string
          processed_at: string | null
          request_type: string
          requested_at: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          download_url?: string | null
          expires_at?: string | null
          id?: string
          processed_at?: string | null
          request_type: string
          requested_at?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          download_url?: string | null
          expires_at?: string | null
          id?: string
          processed_at?: string | null
          request_type?: string
          requested_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      international_capabilities: {
        Row: {
          created_at: string
          customs_license_expiry: string | null
          customs_license_number: string | null
          id: string
          supports_international: boolean | null
          transporter_id: string | null
          updated_at: string
          verification_documents: Json | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
          verified_countries: string[] | null
        }
        Insert: {
          created_at?: string
          customs_license_expiry?: string | null
          customs_license_number?: string | null
          id?: string
          supports_international?: boolean | null
          transporter_id?: string | null
          updated_at?: string
          verification_documents?: Json | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          verified_countries?: string[] | null
        }
        Update: {
          created_at?: string
          customs_license_expiry?: string | null
          customs_license_number?: string | null
          id?: string
          supports_international?: boolean | null
          transporter_id?: string | null
          updated_at?: string
          verification_documents?: Json | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          verified_countries?: string[] | null
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string | null
          quantity: number | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          invoice_id?: string | null
          quantity?: number | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string | null
          quantity?: number | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          currency: string | null
          due_date: string | null
          id: string
          invoice_number: string
          paid_at: string | null
          status: string | null
          tax_amount: number | null
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          paid_at?: string | null
          status?: string | null
          tax_amount?: number | null
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          paid_at?: string | null
          status?: string | null
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      message_reports: {
        Row: {
          created_at: string
          id: string
          message_id: string
          reason: string
          reporter_id: string
          shipment_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          reason: string
          reporter_id: string
          shipment_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          reason?: string
          reporter_id?: string
          shipment_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reports_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "shipment_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_reports_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          related_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          related_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      offline_maps: {
        Row: {
          bounds_east: number
          bounds_north: number
          bounds_south: number
          bounds_west: number
          downloaded_at: string
          file_size_mb: number | null
          id: string
          is_active: boolean | null
          last_accessed: string | null
          region_name: string
          user_id: string
        }
        Insert: {
          bounds_east: number
          bounds_north: number
          bounds_south: number
          bounds_west: number
          downloaded_at?: string
          file_size_mb?: number | null
          id?: string
          is_active?: boolean | null
          last_accessed?: string | null
          region_name: string
          user_id: string
        }
        Update: {
          bounds_east?: number
          bounds_north?: number
          bounds_south?: number
          bounds_west?: number
          downloaded_at?: string
          file_size_mb?: number | null
          id?: string
          is_active?: boolean | null
          last_accessed?: string | null
          region_name?: string
          user_id?: string
        }
        Relationships: []
      }
      package_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          max_height: number | null
          max_length: number | null
          max_weight: number | null
          max_width: number | null
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          max_height?: number | null
          max_length?: number | null
          max_weight?: number | null
          max_width?: number | null
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          max_height?: number | null
          max_length?: number | null
          max_weight?: number | null
          max_width?: number | null
          name?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          created_at: string
          details: Json
          id: string
          is_active: boolean | null
          is_default: boolean | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          details: Json
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          details?: Json
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payments_escrow: {
        Row: {
          created_at: string
          escrowed_at: string | null
          id: string
          payment_method: string | null
          payment_status: string | null
          platform_commission: number
          released_at: string | null
          shipment_id: string | null
          shipper_id: string | null
          total_amount: number
          transaction_id: string | null
          transporter_id: string | null
          transporter_payout: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          escrowed_at?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          platform_commission: number
          released_at?: string | null
          shipment_id?: string | null
          shipper_id?: string | null
          total_amount: number
          transaction_id?: string | null
          transporter_id?: string | null
          transporter_payout: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          escrowed_at?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          platform_commission?: number
          released_at?: string | null
          shipment_id?: string | null
          shipper_id?: string | null
          total_amount?: number
          transaction_id?: string | null
          transporter_id?: string | null
          transporter_payout?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_escrow_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_metrics: {
        Row: {
          agent_id: string | null
          average_rating: number | null
          commission_earned: number | null
          created_at: string
          id: string
          metric_type: string
          metric_value: number
          period_end: string
          period_start: string
          successful_deliveries: number | null
          total_deliveries: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_id?: string | null
          average_rating?: number | null
          commission_earned?: number | null
          created_at?: string
          id?: string
          metric_type: string
          metric_value: number
          period_end: string
          period_start: string
          successful_deliveries?: number | null
          total_deliveries?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_id?: string | null
          average_rating?: number | null
          commission_earned?: number | null
          created_at?: string
          id?: string
          metric_type?: string
          metric_value?: number
          period_end?: string
          period_start?: string
          successful_deliveries?: number | null
          total_deliveries?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "performance_metrics_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          id: string
          phone: string | null
          updated_at: string
          user_type: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          id: string
          phone?: string | null
          updated_at?: string
          user_type: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_type?: string
        }
        Relationships: []
      }
      referral_chains: {
        Row: {
          average_rating: number | null
          can_refer: boolean | null
          chain_id: string
          chain_level: number
          created_at: string
          current_referrals: number | null
          id: string
          is_qualified: boolean | null
          max_referrals: number | null
          qualification_date: string | null
          referred_by_code: string | null
          referrer_id: string | null
          total_deliveries: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          average_rating?: number | null
          can_refer?: boolean | null
          chain_id: string
          chain_level: number
          created_at?: string
          current_referrals?: number | null
          id?: string
          is_qualified?: boolean | null
          max_referrals?: number | null
          qualification_date?: string | null
          referred_by_code?: string | null
          referrer_id?: string | null
          total_deliveries?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          average_rating?: number | null
          can_refer?: boolean | null
          chain_id?: string
          chain_level?: number
          created_at?: string
          current_referrals?: number | null
          id?: string
          is_qualified?: boolean | null
          max_referrals?: number | null
          qualification_date?: string | null
          referred_by_code?: string | null
          referrer_id?: string | null
          total_deliveries?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean | null
          user_id: string | null
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          user_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      referral_payouts: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          id: string
          paypal_batch_id: string | null
          paypal_payout_id: string | null
          processed_at: string | null
          referral_id: string | null
          referrer_id: string | null
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          id?: string
          paypal_batch_id?: string | null
          paypal_payout_id?: string | null
          processed_at?: string | null
          referral_id?: string | null
          referrer_id?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          id?: string
          paypal_batch_id?: string | null
          paypal_payout_id?: string | null
          processed_at?: string | null
          referral_id?: string | null
          referrer_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_payouts_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_qualifications: {
        Row: {
          created_at: string
          id: string
          is_highly_rated: boolean | null
          last_qualification_check: string | null
          min_deliveries: number
          min_rating: number
          qualification_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_highly_rated?: boolean | null
          last_qualification_check?: string | null
          min_deliveries?: number
          min_rating?: number
          qualification_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_highly_rated?: boolean | null
          last_qualification_check?: string | null
          min_deliveries?: number
          min_rating?: number
          qualification_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          commission_amount: number
          commission_duration_months: number | null
          commission_percentage: number | null
          created_at: string
          first_transaction_date: string | null
          id: string
          referral_code: string
          referral_type: string
          referred_user_id: string | null
          referrer_id: string | null
          signup_date: string | null
          status: string | null
          total_earnings: number | null
          updated_at: string
        }
        Insert: {
          commission_amount: number
          commission_duration_months?: number | null
          commission_percentage?: number | null
          created_at?: string
          first_transaction_date?: string | null
          id?: string
          referral_code: string
          referral_type: string
          referred_user_id?: string | null
          referrer_id?: string | null
          signup_date?: string | null
          status?: string | null
          total_earnings?: number | null
          updated_at?: string
        }
        Update: {
          commission_amount?: number
          commission_duration_months?: number | null
          commission_percentage?: number | null
          created_at?: string
          first_transaction_date?: string | null
          id?: string
          referral_code?: string
          referral_type?: string
          referred_user_id?: string | null
          referrer_id?: string | null
          signup_date?: string | null
          status?: string | null
          total_earnings?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      regional_access: {
        Row: {
          access_level: string
          country_code: string
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          is_active: boolean | null
          max_chain_distance: number | null
          region: string | null
          user_id: string
        }
        Insert: {
          access_level: string
          country_code: string
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          max_chain_distance?: number | null
          region?: string | null
          user_id: string
        }
        Update: {
          access_level?: string
          country_code?: string
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          max_chain_distance?: number | null
          region?: string | null
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          reviewed_id: string
          reviewer_id: string
          shipment_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          reviewed_id: string
          reviewer_id: string
          shipment_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          reviewed_id?: string
          reviewer_id?: string
          shipment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_reviewed_id_fkey"
            columns: ["reviewed_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      route_waypoints: {
        Row: {
          completed_at: string | null
          created_at: string
          distance_to_next: number | null
          estimated_time_minutes: number | null
          id: string
          instruction: string | null
          is_completed: boolean | null
          latitude: number
          longitude: number
          sequence_order: number
          shipment_id: string
          transporter_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          distance_to_next?: number | null
          estimated_time_minutes?: number | null
          id?: string
          instruction?: string | null
          is_completed?: boolean | null
          latitude: number
          longitude: number
          sequence_order: number
          shipment_id: string
          transporter_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          distance_to_next?: number | null
          estimated_time_minutes?: number | null
          id?: string
          instruction?: string | null
          is_completed?: boolean | null
          latitude?: number
          longitude?: number
          sequence_order?: number
          shipment_id?: string
          transporter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "route_waypoints_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      shipment_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          sender_id: string
          sender_type: string
          shipment_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          sender_id: string
          sender_type: string
          shipment_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          sender_id?: string
          sender_type?: string
          shipment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipment_messages_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      shipment_tracking: {
        Row: {
          created_at: string
          id: string
          latitude: number | null
          location: string | null
          longitude: number | null
          notes: string | null
          shipment_id: string
          status: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          notes?: string | null
          shipment_id: string
          status: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          notes?: string | null
          shipment_id?: string
          status?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipment_tracking_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          budget: number | null
          created_at: string
          customs_description: string | null
          customs_value: number | null
          delivery_location: string
          delivery_urgency: string | null
          description: string | null
          destination_country: string | null
          dimensions: string | null
          document_types: string[] | null
          id: string
          is_international: boolean | null
          origin_country: string | null
          package_type: string | null
          pickup_location: string
          required_vehicle_type: string | null
          requires_documents: boolean | null
          shipper_id: string
          shipping_carrier: string | null
          status: string | null
          title: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          budget?: number | null
          created_at?: string
          customs_description?: string | null
          customs_value?: number | null
          delivery_location: string
          delivery_urgency?: string | null
          description?: string | null
          destination_country?: string | null
          dimensions?: string | null
          document_types?: string[] | null
          id?: string
          is_international?: boolean | null
          origin_country?: string | null
          package_type?: string | null
          pickup_location: string
          required_vehicle_type?: string | null
          requires_documents?: boolean | null
          shipper_id: string
          shipping_carrier?: string | null
          status?: string | null
          title: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          budget?: number | null
          created_at?: string
          customs_description?: string | null
          customs_value?: number | null
          delivery_location?: string
          delivery_urgency?: string | null
          description?: string | null
          destination_country?: string | null
          dimensions?: string | null
          document_types?: string[] | null
          id?: string
          is_international?: boolean | null
          origin_country?: string | null
          package_type?: string | null
          pickup_location?: string
          required_vehicle_type?: string | null
          requires_documents?: boolean | null
          shipper_id?: string
          shipping_carrier?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_shipper_id_fkey"
            columns: ["shipper_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_carriers: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          service_level: string | null
          supports_international: boolean | null
          tracking_available: boolean | null
          transit_time_days: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          service_level?: string | null
          supports_international?: boolean | null
          tracking_available?: boolean | null
          transit_time_days?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          service_level?: string | null
          supports_international?: boolean | null
          tracking_available?: boolean | null
          transit_time_days?: number | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      tracking_audit: {
        Row: {
          access_reason: string | null
          access_type: string
          accessed_by: string | null
          created_at: string
          data_accessed: Json | null
          id: string
          ip_address: unknown | null
          shipment_id: string | null
          user_id: string
        }
        Insert: {
          access_reason?: string | null
          access_type: string
          accessed_by?: string | null
          created_at?: string
          data_accessed?: Json | null
          id?: string
          ip_address?: unknown | null
          shipment_id?: string | null
          user_id: string
        }
        Update: {
          access_reason?: string | null
          access_type?: string
          accessed_by?: string | null
          created_at?: string
          data_accessed?: Json | null
          id?: string
          ip_address?: unknown | null
          shipment_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tracking_consent_log: {
        Row: {
          consent_given: boolean
          consent_type: string
          created_at: string
          id: string
          ip_address: unknown | null
          shipment_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          consent_given: boolean
          consent_type: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          shipment_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          consent_given?: boolean
          consent_type?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          shipment_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          id: string
          net_amount: number
          paypal_capture_id: string | null
          paypal_order_id: string | null
          paypal_status: string | null
          platform_commission: number
          referral_commission: number | null
          shipment_id: string | null
          status: string | null
          transaction_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          id?: string
          net_amount: number
          paypal_capture_id?: string | null
          paypal_order_id?: string | null
          paypal_status?: string | null
          platform_commission: number
          referral_commission?: number | null
          shipment_id?: string | null
          status?: string | null
          transaction_type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          id?: string
          net_amount?: number
          paypal_capture_id?: string | null
          paypal_order_id?: string | null
          paypal_status?: string | null
          platform_commission?: number
          referral_commission?: number | null
          shipment_id?: string | null
          status?: string | null
          transaction_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      transporter_locations: {
        Row: {
          accuracy: number | null
          id: string
          is_tracking: boolean | null
          latitude: number
          longitude: number
          shipment_id: string | null
          timestamp: string | null
          transporter_id: string
          updated_at: string | null
        }
        Insert: {
          accuracy?: number | null
          id?: string
          is_tracking?: boolean | null
          latitude: number
          longitude: number
          shipment_id?: string | null
          timestamp?: string | null
          transporter_id: string
          updated_at?: string | null
        }
        Update: {
          accuracy?: number | null
          id?: string
          is_tracking?: boolean | null
          latitude?: number
          longitude?: number
          shipment_id?: string | null
          timestamp?: string | null
          transporter_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transporter_locations_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      transporter_vehicles: {
        Row: {
          created_at: string
          hazardous_materials: boolean | null
          id: string
          insurance_valid_until: string | null
          max_height: number | null
          max_length: number | null
          max_volume: number | null
          max_weight: number | null
          max_width: number | null
          refrigerated: boolean | null
          transporter_id: string
          updated_at: string
          vehicle_registration: string | null
          vehicle_type: string
        }
        Insert: {
          created_at?: string
          hazardous_materials?: boolean | null
          id?: string
          insurance_valid_until?: string | null
          max_height?: number | null
          max_length?: number | null
          max_volume?: number | null
          max_weight?: number | null
          max_width?: number | null
          refrigerated?: boolean | null
          transporter_id: string
          updated_at?: string
          vehicle_registration?: string | null
          vehicle_type: string
        }
        Update: {
          created_at?: string
          hazardous_materials?: boolean | null
          id?: string
          insurance_valid_until?: string | null
          max_height?: number | null
          max_length?: number | null
          max_volume?: number | null
          max_weight?: number | null
          max_width?: number | null
          refrigerated?: boolean | null
          transporter_id?: string
          updated_at?: string
          vehicle_registration?: string | null
          vehicle_type?: string
        }
        Relationships: []
      }
      travelers: {
        Row: {
          available_capacity_kg: number | null
          created_at: string
          current_rating: number | null
          destination_country: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          next_travel_date: string | null
          origin_country: string | null
          total_deliveries: number | null
          travel_routes: Json | null
          updated_at: string
          user_id: string
          verification_documents: Json | null
        }
        Insert: {
          available_capacity_kg?: number | null
          created_at?: string
          current_rating?: number | null
          destination_country?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          next_travel_date?: string | null
          origin_country?: string | null
          total_deliveries?: number | null
          travel_routes?: Json | null
          updated_at?: string
          user_id: string
          verification_documents?: Json | null
        }
        Update: {
          available_capacity_kg?: number | null
          created_at?: string
          current_rating?: number | null
          destination_country?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          next_travel_date?: string | null
          origin_country?: string | null
          total_deliveries?: number | null
          travel_routes?: Json | null
          updated_at?: string
          user_id?: string
          verification_documents?: Json | null
        }
        Relationships: []
      }
      user_privacy_settings: {
        Row: {
          allow_extended_tracking: boolean | null
          allow_location_tracking: boolean | null
          created_at: string
          data_retention_days: number | null
          emergency_tracking_consent: boolean | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          allow_extended_tracking?: boolean | null
          allow_location_tracking?: boolean | null
          created_at?: string
          data_retention_days?: number | null
          emergency_tracking_consent?: boolean | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          allow_extended_tracking?: boolean | null
          allow_location_tracking?: boolean | null
          created_at?: string
          data_retention_days?: number | null
          emergency_tracking_consent?: boolean | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      verification: {
        Row: {
          created_at: string
          documents: Json | null
          id: string
          rejection_reason: string | null
          status: string
          updated_at: string
          user_id: string
          verification_date: string | null
        }
        Insert: {
          created_at?: string
          documents?: Json | null
          id?: string
          rejection_reason?: string | null
          status?: string
          updated_at?: string
          user_id: string
          verification_date?: string | null
        }
        Update: {
          created_at?: string
          documents?: Json | null
          id?: string
          rejection_reason?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          verification_date?: string | null
        }
        Relationships: []
      }
      webhooks: {
        Row: {
          business_id: string
          created_at: string
          events: string[]
          id: string
          is_active: boolean | null
          last_triggered_at: string | null
          secret: string
          url: string
        }
        Insert: {
          business_id: string
          created_at?: string
          events: string[]
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          secret: string
          url: string
        }
        Update: {
          business_id?: string
          created_at?: string
          events?: string[]
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          secret?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_enable_enhanced_tracking: {
        Args: { target_user_id: string; reason: string }
        Returns: boolean
      }
      generate_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_referral_chain_distance: {
        Args: { target_user_id: string; source_user_id: string }
        Returns: number
      }
      update_referral_qualifications: {
        Args: { user_id: string }
        Returns: boolean
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
