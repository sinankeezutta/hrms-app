import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hfeeskcwyszzdqafswlo.supabase.co'
const supabaseAnonKey = 'sb_publishable_ELJdriu6_0g8BQyot4tCog_zTgHEtYV'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)