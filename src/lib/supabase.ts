import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on our schema
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon_url?: string
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  name: string
  slug: string
  category_id?: string
  logo_url?: string
  website_url?: string
  description?: string
  industry?: string
  founded_year?: number
  headquarters?: string
  employee_count?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AIPlatform {
  id: string
  name: string
  slug: string
  api_endpoint?: string
  is_active: boolean
  rate_limit: number
  cost_per_query?: number
  created_at: string
  updated_at: string
}

export interface QueryTemplate {
  id: string
  name: string
  template: string
  description?: string
  category?: string
  variables?: Record<string, unknown>
  is_active: boolean
  created_at: string
  updated_at: string
}