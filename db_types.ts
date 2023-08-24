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
      actions: {
        Row: {
          category: number
          client: number
          created_at: string
          date: string
          description: string | null
          id: string
          state: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: number
          client: number
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          state: number
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          category?: number
          client?: number
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          state?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "actions_category_fkey"
            columns: ["category"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_client_fkey"
            columns: ["client"]
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_state_fkey"
            columns: ["state"]
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: number
          slug: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: number
          slug: string
          title: string
        }
        Update: {
          created_at?: string
          id?: number
          slug?: string
          title?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          created_at: string
          id: number
          short: string
          slug: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: number
          short: string
          slug: string
          title: string
        }
        Update: {
          created_at?: string
          id?: number
          short?: string
          slug?: string
          title?: string
        }
        Relationships: []
      }
      people: {
        Row: {
          created_at: string
          email: string
          id: number
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "people_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      states: {
        Row: {
          created_at: string
          id: number
          order: number
          slug: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: number
          order: number
          slug: string
          title: string
        }
        Update: {
          created_at?: string
          id?: number
          order?: number
          slug?: string
          title?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
