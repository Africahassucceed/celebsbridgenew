import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table names
export const TABLES = {
  USERS: 'users',
  CELEBRITIES: 'celebrities',
  SHOUTOUT_REQUESTS: 'shoutout_requests',
  SHOUTOUT_VIDEOS: 'shoutout_videos',
  CATEGORIES: 'categories'
}

// Storage bucket names
export const STORAGE_BUCKETS = {
  CELEBRITY_PROFILES: 'celebrity_profiles',
  SHOUTOUTS: 'shoutouts'
} 