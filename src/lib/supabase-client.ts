import { createClient } from '@supabase/supabase-js'

let supabase: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase environment variables are not set. Please check your .env.local file.')
      // Return a dummy client that won't crash the app but won't work either
      return null
    }

    supabase = createClient(supabaseUrl, supabaseAnonKey)
  }

  return supabase
}