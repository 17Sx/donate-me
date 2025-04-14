import { createClient } from '@supabase/supabase-js';

// Hardcoded values for development (replace these with your actual values)
const SUPABASE_URL = 'https://zujttzjyoeexxethhzsc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1anR0emp5b2VleHhldGhoenNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MjA5NzksImV4cCI6MjA2MDE5Njk3OX0.ufXzFCCX2MevEpJJv56T_vCd5b1G-Ip0nAmpA3OY7q4';

// Try to get from env vars first, fall back to hardcoded values
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 

