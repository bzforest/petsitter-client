import { createClient } from '@supabase/supabase-js'

// ใช้ anon key เท่านั้น — service_role key ห้ามใช้ฝั่ง frontend เด็ดขาด!
// anon key มีสิทธิ์จำกัดตาม Row Level Security (RLS) policies ใน Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)