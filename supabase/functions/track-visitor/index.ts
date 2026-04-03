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

async function getGeoLocation(ip: string): Promise<{ country: string | null; city: string | null }> {
  // Skip private / unknown IPs — geo APIs will fail on these
  if (!ip || ip === "unknown" || ip.startsWith("192.168") || ip.startsWith("10.") || ip.startsWith("127.")) {
    console.log("Geo skipped: private/unknown IP:", ip);
    return { country: null, city: null };
  }

  // ── Try ip-api.com (no key needed, generous free tier) ──
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`);
    const data = await res.json();
    console.log("ip-api.com response:", JSON.stringify(data));
    if (data.status === "success") {
      return { country: data.country ?? null, city: data.city ?? null };
    }
  } catch (e) {
    console.log("ip-api.com failed:", e);
  }

  // ── Fallback: ipapi.co ──
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await res.json();
    console.log("ipapi.co response:", JSON.stringify(data));
    if (!data.error) {
      return { country: data.country_name ?? null, city: data.city ?? null };
    }
    console.log("ipapi.co error:", data.reason);
  } catch (e) {
    console.log("ipapi.co failed:", e);
  }

  return { country: null, city: null };
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

    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : req.headers.get("x-real-ip") || "unknown";

    const userAgent = req.headers.get("user-agent") || "unknown";

    console.log("Tracking visitor IP:", ip);

    // ── Geo-location ──────────────────────────────────────────────────────────
    const { country, city } = await getGeoLocation(ip);
    console.log("Geo result:", { country, city });
    // ─────────────────────────────────────────────────────────────────────────

    const { error } = await supabase.from("visitors").insert([
      {
        ip_address: ip,
        user_agent: userAgent,
        visited_at: new Date().toISOString(),
        country,
        city,
      },
    ]);

    if (error) return json(500, { error: error.message });

    return json(200, { success: true, ip, country, city });
  } catch (err) {
    return json(500, { error: String(err) });
  }
});