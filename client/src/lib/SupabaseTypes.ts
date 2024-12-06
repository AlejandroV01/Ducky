export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
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
  public: {
    Tables: {
      album: {
        Row: {
          archived: boolean | null
          cover_photo_url: string | null
          created_at: string
          description: string | null
          id: string
          owner_id: string
          public: boolean | null
          title: string | null
          total_photos: number | null
          updated_at: string | null
        }
        Insert: {
          archived?: boolean | null
          cover_photo_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          owner_id: string
          public?: boolean | null
          title?: string | null
          total_photos?: number | null
          updated_at?: string | null
        }
        Update: {
          archived?: boolean | null
          cover_photo_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          owner_id?: string
          public?: boolean | null
          title?: string | null
          total_photos?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'album_admin_id_fkey'
            columns: ['owner_id']
            isOneToOne: false
            referencedRelation: 'user'
            referencedColumns: ['id']
          }
        ]
      }
      album_member: {
        Row: {
          album_id: string
          id: string
          joined_at: string
          role: Database['public']['Enums']['album_access_role']
          user_id: string
        }
        Insert: {
          album_id: string
          id?: string
          joined_at?: string
          role: Database['public']['Enums']['album_access_role']
          user_id: string
        }
        Update: {
          album_id?: string
          id?: string
          joined_at?: string
          role?: Database['public']['Enums']['album_access_role']
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'album_role_album_id_fkey'
            columns: ['album_id']
            isOneToOne: false
            referencedRelation: 'album'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'album_role_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user'
            referencedColumns: ['id']
          }
        ]
      }
      join_request: {
        Row: {
          album_id: string
          id: string
          processed_at: string | null
          processed_by: string | null
          requested_at: string
          status: string
          user_id: string
        }
        Insert: {
          album_id: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          requested_at?: string
          status?: string
          user_id: string
        }
        Update: {
          album_id?: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          requested_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'join_request_album_id_fkey'
            columns: ['album_id']
            isOneToOne: false
            referencedRelation: 'album'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'join_request_processed_by_fkey'
            columns: ['processed_by']
            isOneToOne: false
            referencedRelation: 'user'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'join_request_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user'
            referencedColumns: ['id']
          }
        ]
      }
      pending_user: {
        Row: {
          auth_provider: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          password: string
          user_name: string
        }
        Insert: {
          auth_provider?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          password: string
          user_name: string
        }
        Update: {
          auth_provider?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          password?: string
          user_name?: string
        }
        Relationships: []
      }
      photo: {
        Row: {
          album_id: string
          description: string | null
          file_name: string
          id: string
          mime_type: string | null
          size: number | null
          storage_path: string
          taken_at: string | null
          uploaded_at: string
          url: string
          user_id: string
        }
        Insert: {
          album_id: string
          description?: string | null
          file_name: string
          id?: string
          mime_type?: string | null
          size?: number | null
          storage_path: string
          taken_at?: string | null
          uploaded_at?: string
          url: string
          user_id: string
        }
        Update: {
          album_id?: string
          description?: string | null
          file_name?: string
          id?: string
          mime_type?: string | null
          size?: number | null
          storage_path?: string
          taken_at?: string | null
          uploaded_at?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'photo_album_id_fkey'
            columns: ['album_id']
            isOneToOne: false
            referencedRelation: 'album'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'photo_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user'
            referencedColumns: ['id']
          }
        ]
      }
      user: {
        Row: {
          auth_provider: string | null
          created_at: string | null
          email: string
          first_name: string
          icon_url: string | null
          id: string
          is_verified: boolean | null
          last_failed_login: string | null
          last_login: string | null
          last_name: string
          login_attempts: number | null
          password: string | null
          user_name: string
        }
        Insert: {
          auth_provider?: string | null
          created_at?: string | null
          email: string
          first_name: string
          icon_url?: string | null
          id?: string
          is_verified?: boolean | null
          last_failed_login?: string | null
          last_login?: string | null
          last_name: string
          login_attempts?: number | null
          password?: string | null
          user_name: string
        }
        Update: {
          auth_provider?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          icon_url?: string | null
          id?: string
          is_verified?: boolean | null
          last_failed_login?: string | null
          last_login?: string | null
          last_name?: string
          login_attempts?: number | null
          password?: string | null
          user_name?: string
        }
        Relationships: []
      }
      verification_attempt: {
        Row: {
          attempts: number | null
          code: string
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
        }
        Insert: {
          attempts?: number | null
          code: string
          created_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
        }
        Update: {
          attempts?: number | null
          code?: string
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      album_access_role: 'owner' | 'admin' | 'contributor' | 'viewer'
      privacy_setting: 'public' | 'private' | 'friends_only'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views']) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] & Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] & Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
  ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes'] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
  ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never
