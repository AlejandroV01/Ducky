import { createClient } from '@supabase/supabase-js'
import { Database } from './SupabaseTypes'
// Replace with your Supabase URL and ANON KEY
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing env vars')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
