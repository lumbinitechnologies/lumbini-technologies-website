// track-visitor/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

function requireEnv(name: string): string {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function parseDevice(ua: string): string {
  if (/iPad|Tablet/i.test(ua)) return "Tablet";
  if (/Mobile|Android|iPhone/i.test(ua)) return "Mobile";
  return "Desktop";
}

function parseBrowser(ua: string): string {
  if (ua.includes("Edg/"))    return "Edge";
  if (ua.includes("OPR/"))    return "Opera";
  if (ua.includes("Chrome"))  return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari"))  return "Safari";
  return "Other";
}

async function getGeoLocation(ip: string) {
  if (!ip || ip === "unknown" || /^(192\.168|10\.|127\.)/.test(ip)) {
    console.log("Geo skipped: private/unknown IP:", ip);
    return { country: null, city: null };
  }

  try {
    const res = await fetch(`https://ipwho.is/${ip}`);
    const data = await res.json();
    console.log("ipwho.is response:", data);
    if (data.success) return { country: data.country, city: data.city };
  } catch (e) { console.log("ipwho.is failed:", e); }

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await res.json();
    console.log("ipapi.co response:", data);
    if (!data.error) return { country: data.country_name, city: data.city };
  } catch (e) { console.log("ipapi.co failed:", e); }

  return { country: null, city: null };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const supabase = createClient(
      requireEnv("SUPABASE_URL"),
      requireEnv("SUPABASE_SERVICE_ROLE_KEY")
    );

    const body = await req.json().catch(() => ({}));
    const visitorId: string | null = body.visitor_id ?? null;

    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    let userId: string | null = null;
    let email: string | null = null;

    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const userClient = createClient(
        requireEnv("SUPABASE_URL"),
        requireEnv("SUPABASE_ANON_KEY"),
        { global: { headers: { Authorization: authHeader } } }
      );
      const { data } = await userClient.auth.getUser();
      userId = data?.user?.id ?? null;
      email  = data?.user?.email ?? null;
    }

    const device  = parseDevice(userAgent);
    const browser = parseBrowser(userAgent);
    const { country, city } = await getGeoLocation(ip);

    // ── Timestamps ────────────────────────────────────────────────
    const now = new Date();
    const visited_at = now.toISOString(); // UTC
    const visited_at_ist = now.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }); // IST

    console.log("Inserting:", { ip, userId, device, browser, country, city, visited_at, visited_at_ist });

    const { error } = await supabase.from("visitors").insert([{
      ip_address:    ip,
      user_agent:    userAgent,
      visited_at,
      visited_at_ist,
      visitor_id:    visitorId,
      user_id:       userId,
      email,
      device,
      browser,
      country,
      city,
    }]);

    if (error) {
      console.log("Insert error:", error);
      return json(500, { error: error.message });
    }

    return json(200, { success: true, ip, device, browser, country, city, visited_at, visited_at_ist });

  } catch (err) {
    console.log("Unexpected error:", err);
    return json(500, { error: String(err) });
  }
});