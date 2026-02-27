import { createClient } from '@supabase/supabase-js';

// Use provided credentials or environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://supabase.infra-remakingautomacoes.cloud';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzE1MDUwODAwLAogICJleHAiOiAxODcyODE3MjAwCn0.VFKkaPwcpuWYV2L-iMR5K_07259lQZvOUX67u0a8W4Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
