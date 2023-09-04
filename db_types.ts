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
          category_id: number
          client_id: number
          created_at: string
          date: string
          description: string | null
          id: string
          priority_id: string
          state_id: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category_id: number
          client_id: number
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          priority_id: string
          state_id: number
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          category_id?: number
          client_id?: number
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          priority_id?: string
          state_id?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "actions_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_priority_id_fkey"
            columns: ["priority_id"]
            referencedRelation: "priority"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_state_id_fkey"
            columns: ["state_id"]
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
      celebration: {
        Row: {
          created_at: string
          date: string
          id: string
          is_holiday: boolean | null
          title: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          is_holiday?: boolean | null
          title: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          is_holiday?: boolean | null
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
      priority: {
        Row: {
          created_at: string
          id: string
          order: number
          slug: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          order: number
          slug: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          order?: number
          slug?: string
          title?: string
        }
        Relationships: []
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
