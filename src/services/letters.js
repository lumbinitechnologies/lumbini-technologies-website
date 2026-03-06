import { supabase } from "./supabase";

/**
 * Sends a letter to the intern by calling the Supabase Edge Function.
 * Expects the function name: "send-letter"
 */
export async function sendLetter({ applicationId, type }) {
  const { data, error } = await supabase.functions.invoke("send-letter", {
    body: { applicationId, type },
  });

  if (error) {
    // supabase-js wraps fetch errors and non-2xx responses
    throw new Error(error.message || "Failed to send letter.");
  }

  if (!data?.ok) {
    throw new Error(data?.error || "Failed to send letter.");
  }

  return data;
}

