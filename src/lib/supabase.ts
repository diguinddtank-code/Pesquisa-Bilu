import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if variables are set and not placeholders
const isConfigured = supabaseUrl && 
                     supabaseAnonKey && 
                     supabaseUrl !== 'sua_url_do_supabase_aqui' &&
                     supabaseUrl.startsWith('http');

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
