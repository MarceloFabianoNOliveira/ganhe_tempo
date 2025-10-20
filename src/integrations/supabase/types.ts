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
      categories: {
        Row: {
          description: string | null
          id: string
          laundry_id: string
          name: string
        }
        Insert: {
          description?: string | null
          id: string
          laundry_id: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          laundry_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_laundry_id_fkey"
            columns: ["laundry_id"]
            isOneToOne: false
            referencedRelation: "laundries"
            referencedColumns: ["id"]
          },
        ]
      }
      demands: {
        Row: {
          category: string
          client_email: string
          client_name: string
          client_phone: string
          cpf_cnpj: string | null
          created_at: string
          delivery_date: string | null
          delivery_forecast: string | null
          description: string
          id: string
          notes: string | null
          photo: string | null
          price: string | null
          status: string
          updated_at: string
        }
        Insert: {
          category: string
          client_email: string
          client_name: string
          client_phone: string
          cpf_cnpj?: string | null
          created_at: string
          delivery_date?: string | null
          delivery_forecast?: string | null
          description: string
          id: string
          notes?: string | null
          photo?: string | null
          price?: string | null
          status: string
          updated_at: string
        }
        Update: {
          category?: string
          client_email?: string
          client_name?: string
          client_phone?: string
          cpf_cnpj?: string | null
          created_at?: string
          delivery_date?: string | null
          delivery_forecast?: string | null
          description?: string
          id?: string
          notes?: string | null
          photo?: string | null
          price?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      envio_email_cliente: {
        Row: {
          categorias: string[]
          data: string
          email: string
          id: number
          nome_cliente: string
        }
        Insert: {
          categorias: string[]
          data?: string
          email: string
          id?: number
          nome_cliente: string
        }
        Update: {
          categorias?: string[]
          data?: string
          email?: string
          id?: number
          nome_cliente?: string
        }
        Relationships: []
      }
      laundries: {
        Row: {
          address: string
          created_at: string
          default_delivery_days: number
          email: string
          id: string
          logo: string | null
          name: string
          phone: string
          updated_at: string
          working_hours: string
        }
        Insert: {
          address: string
          created_at?: string
          default_delivery_days: number
          email: string
          id: string
          logo?: string | null
          name: string
          phone: string
          updated_at?: string
          working_hours: string
        }
        Update: {
          address?: string
          created_at?: string
          default_delivery_days?: number
          email?: string
          id?: string
          logo?: string | null
          name?: string
          phone?: string
          updated_at?: string
          working_hours?: string
        }
        Relationships: []
      }
      laundry_settings: {
        Row: {
          address: string
          default_delivery_days: number
          email: string
          id: string
          name: string
          phone: string
          working_hours: string
        }
        Insert: {
          address: string
          default_delivery_days: number
          email: string
          id: string
          name: string
          phone: string
          working_hours: string
        }
        Update: {
          address?: string
          default_delivery_days?: number
          email?: string
          id?: string
          name?: string
          phone?: string
          working_hours?: string
        }
        Relationships: []
      }
      system_users: {
        Row: {
          auth_uid: string | null
          created_at: string
          email: string
          id: number
          laundry_id: string | null
          name: string
          role: string
        }
        Insert: {
          auth_uid?: string | null
          created_at?: string
          email: string
          id?: number
          laundry_id?: string | null
          name: string
          role: string
        }
        Update: {
          auth_uid?: string | null
          created_at?: string
          email?: string
          id?: number
          laundry_id?: string | null
          name?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_users_laundry_id_fkey"
            columns: ["laundry_id"]
            isOneToOne: false
            referencedRelation: "laundries"
            referencedColumns: ["id"]
          },
        ]
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
