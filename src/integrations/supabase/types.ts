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
      classifieds: {
        Row: {
          category: string
          contact_info: string
          created_at: string
          description: string
          id: number
          image_url: string | null
          location: string
          price: number
          status: Database["public"]["Enums"]["classified_status"] | null
          tenant_id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          contact_info: string
          created_at?: string
          description: string
          id?: number
          image_url?: string | null
          location?: string
          price: number
          status?: Database["public"]["Enums"]["classified_status"] | null
          tenant_id: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          contact_info?: string
          created_at?: string
          description?: string
          id?: number
          image_url?: string | null
          location?: string
          price?: number
          status?: Database["public"]["Enums"]["classified_status"] | null
          tenant_id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classifieds_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: number
          ride_id: number
          sender_id: string
          sender_name: string
          tenant_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: number
          ride_id: number
          sender_id: string
          sender_name: string
          tenant_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: number
          ride_id?: number
          sender_id?: string
          sender_name?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          home_latitude: number | null
          home_location: string | null
          home_longitude: number | null
          id: string
          office_latitude: number | null
          office_location: string | null
          office_longitude: number | null
          tenant_id: string
          tenant_role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          home_latitude?: number | null
          home_location?: string | null
          home_longitude?: number | null
          id: string
          office_latitude?: number | null
          office_location?: string | null
          office_longitude?: number | null
          tenant_id: string
          tenant_role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          home_latitude?: number | null
          home_location?: string | null
          home_longitude?: number | null
          id?: string
          office_latitude?: number | null
          office_location?: string | null
          office_longitude?: number | null
          tenant_id?: string
          tenant_role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      ride_requests: {
        Row: {
          created_at: string
          id: number
          is_recurring: boolean | null
          recurring_days: number[] | null
          recurring_until: string | null
          requester_id: string
          requester_name: string
          ride_id: number
          seats_requested: number
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_recurring?: boolean | null
          recurring_days?: number[] | null
          recurring_until?: string | null
          requester_id: string
          requester_name: string
          ride_id: number
          seats_requested?: number
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          is_recurring?: boolean | null
          recurring_days?: number[] | null
          recurring_until?: string | null
          requester_id?: string
          requester_name?: string
          ride_id?: number
          seats_requested?: number
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ride_requests_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      rides: {
        Row: {
          created_at: string
          departure_date: string
          departure_time: string
          distance: string | null
          driver_id: string
          driver_name: string
          from_latitude: number | null
          from_location: string
          from_longitude: number | null
          id: number
          is_recurring: boolean | null
          recurring_days: number[] | null
          recurring_until: string | null
          ride_status: string
          seats_available: number
          tenant_id: string
          to_latitude: number | null
          to_location: string
          to_longitude: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          departure_date: string
          departure_time: string
          distance?: string | null
          driver_id: string
          driver_name: string
          from_latitude?: number | null
          from_location: string
          from_longitude?: number | null
          id?: number
          is_recurring?: boolean | null
          recurring_days?: number[] | null
          recurring_until?: string | null
          ride_status?: string
          seats_available: number
          tenant_id: string
          to_latitude?: number | null
          to_location: string
          to_longitude?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          departure_date?: string
          departure_time?: string
          distance?: string | null
          driver_id?: string
          driver_name?: string
          from_latitude?: number | null
          from_location?: string
          from_longitude?: number | null
          id?: number
          is_recurring?: boolean | null
          recurring_days?: number[] | null
          recurring_until?: string | null
          ride_status?: string
          seats_available?: number
          tenant_id?: string
          to_latitude?: number | null
          to_location?: string
          to_longitude?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rides_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_locations: {
        Row: {
          latitude: number
          longitude: number
          ride_id: number
          updated_at: string | null
          user_id: string
          user_type: string
        }
        Insert: {
          latitude: number
          longitude: number
          ride_id: number
          updated_at?: string | null
          user_id: string
          user_type: string
        }
        Update: {
          latitude?: number
          longitude?: number
          ride_id?: number
          updated_at?: string | null
          user_id?: string
          user_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_locations_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_secret: {
        Args: {
          secret_name: string
        }
        Returns: string
      }
      get_user_tenant_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      classified_status: "active" | "sold" | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
