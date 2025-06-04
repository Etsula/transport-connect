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
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
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
