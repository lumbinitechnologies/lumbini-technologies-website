import { createClient } from "@supabase/supabase-js";

// Prefer environment variables in production, but fall back to the
// project defaults so local/dev still works even if env is not set.
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://etcalajnegfqeykeegie.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0Y2FsYWpuZWdmcWV5a2VlZ2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NDM1MzMsImV4cCI6MjA4ODMxOTUzM30.bI7Fs0xlMgo5WY8JvYfmGbVYjNuyM64vWsy259o4uH4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
