import { supabase } from "./supabase";

export async function fetchIsAdmin() {
  const { data, error } = await supabase.functions.invoke("is-admin", {
    body: {},
  });

  if (error) throw new Error(error.message || "Admin check failed.");
  if (!data?.ok) throw new Error(data?.error || "Admin check failed.");

  return !!data.isAdmin;
}

