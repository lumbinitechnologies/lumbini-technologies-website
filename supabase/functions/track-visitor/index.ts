import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function requireEnv(name: string): string {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  try {
    const supabase = createClient(
      requireEnv("SUPABASE_URL"),
      requireEnv("SUPABASE_SERVICE_ROLE_KEY")
    );

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";

    const userAgent = req.headers.get("user-agent") || "unknown";

    const { error } = await supabase.from("visitors").insert([
      {
        ip_address: ip,
        user_agent: userAgent,
        visited_at: new Date().toISOString(),
      },
    ]);

    if (error) return json(500, { error: error.message });

    return json(200, { success: true });
  } catch (err) {
    return json(500, { error: String(err) });
  }
});