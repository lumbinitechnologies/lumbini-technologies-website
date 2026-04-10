// track-visitor/index.ts  —  drop-in replacement
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function requireEnv(name: string): string {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

// ── Device + Browser parsers ─────────────────────────────────────
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

// ── Geo-location (unchanged from your working version) ───────────
async function getGeoLocation(ip: string) {
  if (!ip || ip === "unknown" || /^(192.168|10.|127.)/.test(ip)) {
    console.log("Geo skipped: private/unknown IP:", ip);
    return { country: null, city: null };
  }

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`);
    const data = await res.json();
    if (data.status === "success") return { country: data.country, city: data.city };
  } catch (e) { console.log("ip-api failed:", e); }

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await res.json();
    if (!data.error) return { country: data.country_name, city: data.city };
  } catch (e) { console.log("ipapi.co failed:", e); }

  return { country: null, city: null };
}

// ── Main handler ─────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const supabase = createClient(
      requireEnv("SUPABASE_URL"),
      requireEnv("SUPABASE_SERVICE_ROLE_KEY")
    );

    // ── Request body ──────────────────────────────────────────────
    const body = await req.json().catch(() => ({}));
    const visitorId: string | null = body.visitor_id ?? null;

    // ── IP + User-Agent ───────────────────────────────────────────
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // ── Auth → userId + email (optional, won't break if absent) ──
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

    // ── Device + Browser ──────────────────────────────────────────
    const device  = parseDevice(userAgent);
    const browser = parseBrowser(userAgent);

    // ── Geo ───────────────────────────────────────────────────────
    const { country, city } = await getGeoLocation(ip);

    console.log("Inserting:", { ip, userId, device, browser, country, city });

    // ── Insert ────────────────────────────────────────────────────
    const { error } = await supabase.from("visitors").insert([{
      ip_address: ip,
      user_agent: userAgent,
      visited_at: new Date().toISOString(),
      visitor_id: visitorId,
      user_id:    userId,
      email,
      device,
      browser,
      country,
      city,
    }]);

    if (error) return json(500, { error: error.message });

    return json(200, { success: true, ip, device, browser, country, city });

  } catch (err) {
    return json(500, { error: String(err) });
  }
});