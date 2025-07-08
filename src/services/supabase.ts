import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ivxpejnqfudtefzisphu.supabase.co' //import.meta.env.VITE_SUPABASE_URL
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2eHBlam5xZnVkdGVmemlzcGh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMDM0NzksImV4cCI6MjA2Njc3OTQ3OX0.kFElH_o0DcQ8oq9GH80Fy6aR9yaLs2vQMdS731MDMVI' //import.meta.env.VITE_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
