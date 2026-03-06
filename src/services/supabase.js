import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://etcalajnegfqeykeegie.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0Y2FsYWpuZWdmcWV5a2VlZ2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NDM1MzMsImV4cCI6MjA4ODMxOTUzM30.bI7Fs0xlMgo5WY8JvYfmGbVYjNuyM64vWsy259o4uH4";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
