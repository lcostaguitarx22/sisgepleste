import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cixkayzueouennpdikov.supabase.co'
const supabaseKey = 'sb_publishable_ROMdvqDaMKQkK6d_jhLbJw_lm4Id3kq'

export const supabase = createClient(supabaseUrl, supabaseKey)
