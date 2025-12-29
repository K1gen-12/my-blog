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
      articles: {
        Row: {
          id: string
          title: string
          excerpt: string
          content: string
          category: '配信' | 'お知らせ' | '趣味'
          thumbnail: string | null
          status: 'published' | 'draft'
          author_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          excerpt: string
          content: string
          category: '配信' | 'お知らせ' | '趣味'
          thumbnail?: string | null
          status?: 'published' | 'draft'
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          excerpt?: string
          content?: string
          category?: '配信' | 'お知らせ' | '趣味'
          thumbnail?: string | null
          status?: 'published' | 'draft'
          author_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'admin' | 'editor' | 'viewer'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role?: 'admin' | 'editor' | 'viewer'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'admin' | 'editor' | 'viewer'
          created_at?: string
        }
      }
      site_settings: {
        Row: {
          id: string
          settings: SiteSettings
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          settings: SiteSettings
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          settings?: SiteSettings
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export interface SiteSettings {
  profile: {
    name: string
    bio: string
  }
  schedule: Array<{
    day: string
    title: string
    start: string
    end: string
  }>
  favorite_games: Array<{
    title: string
    description: string
  }>
}