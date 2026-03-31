import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://mvaecmpjwetxavlutdku.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12YWVjbXBqd2V0eGF2bHV0ZGt1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQ5NDk2MSwiZXhwIjoyMDkwMDcwOTYxfQ.WvJuADKQFimtMjcCqYdmhQUXkRib9dhhKt04IKiJwno"

export const supabase = createClient(supabaseUrl, supabaseKey)