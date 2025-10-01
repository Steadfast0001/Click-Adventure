// supabaseClient.js - Final Update

import { createClient } from '@supabase/supabase-js'

// ⚠️ Replace 'YOUR_SUPABASE_URL' and 'YOUR_SUPABASE_KEY' with your actual values:
const supabaseUrl = 'https://gvoqmfiohfiqdvzujbzo.supabase.co' 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2b3FtZmlvaGZpcWR2enVqYnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMzkwNzIsImV4cCI6MjA3NDcxNTA3Mn0.iJfajR3QWjC0RKZY3eWF_NVfrEGNDRysD9ZMeDs8wks'

// Initialize the client
export const supabase = createClient(supabaseUrl, supabaseKey)