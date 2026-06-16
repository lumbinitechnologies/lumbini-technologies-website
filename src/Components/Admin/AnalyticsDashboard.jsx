import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

/* ─── helpers ─────────────────────────────────────────────────────────────── */
const parseDevice = (ua = "") => {
  if (!ua) return "Unknown";
  if (/mobile|android|iphone/i.test(ua)) return "Mobile";
  if (/tablet|ipad/i.test(ua)) return "Tablet";
  return "Desktop";
};
const parseBrowser = (ua = "") => {
  if (!ua) return "Unknown";
  if (/edg\//i.test(ua)) return "Edge";
  if (/opr\//i.test(ua)) return "Opera";
  if (/chrome/i.test(ua)) return "Chrome";
  if (/firefox/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua)) return "Safari";
  return "Other";
};
const fmtTime = (d) =>
  d ? new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";

/* ─── Pulse dot ───────────────────────────────────────────────────────────── */
const Pulse = ({ color = "#39ff14", size = 8 }) => (
  <span style={{ position: "relative", display: "inline-flex", width: size, height: size, flexShrink: 0 }}>
    <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color, opacity: 0.4, animation: "an-ping 1.4s cubic-bezier(0,0,0.2,1) infinite" }} />
    <span style={{ position: "relative", borderRadius: "50%", width: "100%", height: "100%", background: color, boxShadow: `0 0 8px ${color}` }} />
  </span>
);

/* ─── KPI Card ────────────────────────────────────────────────────────────── */
const KpiCard = ({ label, value, sub, color, icon, trend }) => (
  <div className="kpi" style={{ "--c": color }}>
    <div className="kpi-tl" /><div className="kpi-tr" /><div className="kpi-bl" /><div className="kpi-br" />
    <div className="kpi-scan" />
    <div className="kpi-glow" />
    <div className="kpi-icon">{icon}</div>
    <div className="kpi-val">{value}</div>
    <div className="kpi-label">{label}</div>
    <div className="kpi-sub">{sub}</div>
    {trend != null && (
      <div style={{ fontFamily: "var(--mono)", fontSize: 10, marginTop: 6, fontWeight: 700, position: "relative", zIndex: 1, color: trend >= 0 ? "#39ff14" : "#f87171" }}>
        {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}% vs yesterday
      </div>
    )}
  </div>
);

/* ─── Bar Chart ───────────────────────────────────────────────────────────── */
const BarChart = ({ data, color = "#facc15", height = 120 }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height, width: "100%", paddingTop: 20 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
            <div style={{
              width: "100%",
              height: `${Math.max((d.value / max) * 100, d.value > 0 ? 3 : 0)}%`,
              background: `linear-gradient(180deg,${color} 0%,${color}33 100%)`,
              borderRadius: "2px 2px 0 0",
              boxShadow: d.value > 0 ? `0 0 10px ${color}66,0 0 2px ${color}` : "none",
              transition: "height 1.1s cubic-bezier(.34,1.56,.64,1)",
              position: "relative",
            }}>
              {d.value > 0 && (
                <span style={{ position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)", fontSize: 8, fontFamily: "var(--mono)", color, whiteSpace: "nowrap", textShadow: `0 0 6px ${color}` }}>{d.value}</span>
              )}
            </div>
          </div>
          <div style={{ fontSize: 7, fontFamily: "var(--mono)", color: "rgba(255,255,255,0.15)", whiteSpace: "nowrap", marginTop: 4 }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
};

/* ─── Donut ───────────────────────────────────────────────────────────────── */
const Donut = ({ segments, size = 110 }) => {
  const r = 38; const cx = size / 2; const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, d) => s + d.value, 0) || 1;
  let off = 0;
  const slices = segments.map((s) => { const dash = (s.value / total) * circ; const sl = { ...s, dash, gap: circ - dash, offset: off }; off += dash; return sl; });
  return (
    <svg width={size} height={size} style={{ overflow: "visible", flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={13} />
      {slices.map((s, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={13}
          strokeDasharray={`${s.dash} ${s.gap}`} strokeDashoffset={-s.offset + circ * 0.25}
          style={{ filter: `drop-shadow(0 0 6px ${s.color}99)`, transition: "stroke-dasharray 1s ease" }} />
      ))}
      <text x={cx} y={cy - 4} textAnchor="middle" fill="#fff" fontSize={17} fontWeight={800} fontFamily="var(--sans)">{total}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="rgba(255,255,255,0.18)" fontSize={7} fontFamily="var(--mono)">TOTAL</text>
    </svg>
  );
};

/* ─── Arc Gauge ───────────────────────────────────────────────────────────── */
const Arc = ({ value, max, color, label }) => {
  const pct = Math.min(value / (max || 1), 1);
  const r = 34; const circ = Math.PI * r; const dash = pct * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={90} height={54} viewBox="0 0 100 60" style={{ overflow: "visible" }}>
        <path d="M12 52 A38 38 0 0 1 88 52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={10} strokeLinecap="round" />
        <path d="M12 52 A38 38 0 0 1 88 52" fill="none" stroke={color} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ filter: `drop-shadow(0 0 5px ${color})`, transition: "stroke-dasharray 1.3s cubic-bezier(.34,1.2,.64,1)" }} />
        <text x="50" y="50" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="800" fontFamily="var(--sans)">{value}</text>
      </svg>
      <div style={{ fontSize: 9, fontFamily: "var(--mono)", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
    </div>
  );
};

/* ─── Geo Bar ─────────────────────────────────────────────────────────────── */
const GeoBar = ({ name, count, max, total, color = "#facc15" }) => (
  <div style={{ marginBottom: 13 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, gap: 8 }}>
      <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "rgba(255,255,255,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color, fontWeight: 700 }}>{count}</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "rgba(255,255,255,0.2)" }}>{total ? ((count / total) * 100).toFixed(1) : 0}%</span>
      </div>
    </div>
    <div style={{ height: 3, background: "rgba(255,255,255,0.04)", borderRadius: 999, overflow: "hidden" }}>
      <div style={{ height: "100%", borderRadius: 999, width: `${(count / max) * 100}%`, background: `linear-gradient(90deg,${color},${color}44)`, boxShadow: `0 0 8px ${color}66`, transition: "width 1.1s cubic-bezier(.34,1.2,.64,1)" }} />
    </div>
  </div>
);

/* ─── Threat Row ──────────────────────────────────────────────────────────── */
const ThreatRow = ({ icon, title, sub, badge, badgeColor = "#f87171" }) => {
  const rgb = badgeColor === "#f87171" ? "248,113,113" : badgeColor === "#fb923c" ? "251,146,60" : "167,139,250";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", background: `rgba(${rgb},0.04)`, border: `1px solid rgba(${rgb},0.1)`, borderRadius: 3, marginBottom: 8 }}>
      <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: badgeColor, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: `${badgeColor}66`, marginTop: 2 }}>{sub}</div>
      </div>
      <div style={{ flexShrink: 0, padding: "3px 10px", borderRadius: 2, background: `rgba(${rgb},0.1)`, border: `1px solid rgba(${rgb},0.2)`, color: badgeColor, fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700 }}>{badge}</div>
    </div>
  );
};

const OkRow = ({ text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "rgba(57,255,20,0.025)", border: "1px solid rgba(57,255,20,0.08)", borderRadius: 3, marginBottom: 8, fontFamily: "var(--mono)", fontSize: 11, color: "rgba(57,255,20,0.55)" }}>✓ {text}</div>
);

/* ─── Panel ───────────────────────────────────────────────────────────────── */
const Panel = ({ label, children, style = {} }) => (
  <div className="panel" style={style}>
    <div className="p-tl" /><div className="p-br" />
    {label && <div className="panel-lbl">{label}</div>}
    {children}
  </div>
);

/* ─── Legend item ─────────────────────────────────────────────────────────── */
const LegItem = ({ color, label, value, total }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, boxShadow: `0 0 5px ${color}`, flexShrink: 0 }} />
      <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
    </div>
    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
      <span style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.75)" }}>{value}</span>
      <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "rgba(255,255,255,0.2)" }}>{total ? ((value / total) * 100).toFixed(0) : 0}%</span>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  MAIN                                                                       */
/* ═══════════════════════════════════════════════════════════════════════════ */
const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("OVERVIEW");
  const [glitch, setGlitch] = useState(false);
  const [bootLines, setBootLines] = useState([]);
  const [booted, setBooted] = useState(false);
  const mounted = useRef(false);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  const BOOT = [
    "> BOOT   :: OMNIVISION ANALYTICS v3.7",
    "> AUTH   :: OPERATOR CREDENTIALS VERIFIED",
    "> NODE   :: supabase [CONNECTED]",
    "> PROBE  :: SCANNING VISITOR MATRIX...",
    "> CRYPTO :: DECRYPTING BEHAVIORAL LOGS...",
    "> SHIELD :: FIREWALL BYPASS 7X — OK",
    "> STATUS :: ALL SYSTEMS NOMINAL.",
    "> ACCESS GRANTED — WELCOME, OPERATOR ◈",
  ];

  /* boot */
  useEffect(() => {
    mounted.current = true;
    let i = 0;
    const iv = setInterval(() => {
      setBootLines((p) => [...p, BOOT[i]]); i++;
      if (i >= BOOT.length) { clearInterval(iv); setTimeout(() => { if (mounted.current) { setBooted(true); loadData(); } }, 700); }
    }, 270);
    return () => { mounted.current = false; clearInterval(iv); };
  }, []);

  /* glitch */
  useEffect(() => {
    if (!booted) return;
    const iv = setInterval(() => { if (Math.random() > 0.65) { setGlitch(true); setTimeout(() => setGlitch(false), 160); } }, 4200);
    return () => clearInterval(iv);
  }, [booted]);

  /* matrix rain */
  useEffect(() => {
    if (!booted || !canvasRef.current) return;
    const cv = canvasRef.current;
    const ctx = cv.getContext("2d");
    const resize = () => { cv.width = window.innerWidth; cv.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const chars = "アイウエオカキクサシスセソ01ABCDEF◈⬡▣★░▒▓◆◇".split("");
    let cols = Math.floor(cv.width / 18);
    let drops = Array(cols).fill(1);
    const draw = () => {
      ctx.fillStyle = "rgba(3,5,8,0.055)";
      ctx.fillRect(0, 0, cv.width, cv.height);
      drops.forEach((y, i) => {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = `rgba(250,204,21,${Math.random() * 0.1 + 0.03})`;
        ctx.font = "12px 'Space Mono',monospace";
        ctx.fillText(ch, i * 18, y * 18);
        if (y * 18 > cv.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, [booted]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from("visitors").select("*").order("visited_at", { ascending: false }).limit(500);
      if (mounted.current) setVisitors(data || []);
    } catch (e) { console.error(e); }
    finally { if (mounted.current) setLoading(false); }
  }, []);

  /* ── derived ── */
  const total = visitors.length;
  const uniqueIPs = new Set(visitors.map((v) => v.ip_address)).size;
  const uniqueVIDs = new Set(visitors.map((v) => v.visitor_id).filter(Boolean)).size;
  const loggedIn = visitors.filter((v) => v.user_id).length;
  const anonV = total - loggedIn;

  const todayKey = new Date().toISOString().split("T")[0];
  const yesterKey = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const todayV = visitors.filter((v) => v.visited_at?.startsWith(todayKey)).length;
  const yesterV = visitors.filter((v) => v.visited_at?.startsWith(yesterKey)).length;
  const growthPct = yesterV ? Math.round(((todayV - yesterV) / yesterV) * 100) : null;
  const weekStart = new Date(Date.now() - 7 * 86400000);
  const weekV = visitors.filter((v) => new Date(v.visited_at) > weekStart).length;

  const devMap = {}; const brwMap = {}; const cntryMap = {}; const cityMap = {};
  visitors.forEach((v) => {
    const d = parseDevice(v.device || v.user_agent);
    const b = parseBrowser(v.browser || v.user_agent);
    devMap[d] = (devMap[d] || 0) + 1;
    brwMap[b] = (brwMap[b] || 0) + 1;
    if (v.country) cntryMap[v.country] = (cntryMap[v.country] || 0) + 1;
    if (v.city) cityMap[v.city] = (cityMap[v.city] || 0) + 1;
  });

  const devSegs = [
    { label: "Desktop", value: devMap["Desktop"] || 0, color: "#facc15" },
    { label: "Mobile", value: devMap["Mobile"] || 0, color: "#39ff14" },
    { label: "Tablet", value: devMap["Tablet"] || 0, color: "#60a5fa" },
    { label: "Unknown", value: devMap["Unknown"] || 0, color: "#475569" },
  ].filter((s) => s.value > 0);

  const brwColors = { Chrome: "#facc15", Firefox: "#fb923c", Safari: "#60a5fa", Edge: "#a78bfa", Opera: "#f87171", Other: "#475569", Unknown: "#334155" };
  const brwSegs = Object.entries(brwMap).map(([k, v]) => ({ label: k, value: v, color: brwColors[k] || "#475569" })).sort((a, b) => b.value - a.value);

  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() - (13 - i) * 86400000);
    const key = d.toISOString().split("T")[0];
    return { label: `${d.getDate()}/${d.getMonth() + 1}`, value: visitors.filter((v) => v.visited_at?.startsWith(key)).length };
  });
  const last7 = last14.slice(7);

  const topCntry = Object.entries(cntryMap).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const topCity = Object.entries(cityMap).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxCntry = topCntry[0]?.[1] || 1;
  const maxCity = topCity[0]?.[1] || 1;

  const ipCounts = {};
  visitors.forEach((v) => { ipCounts[v.ip_address] = (ipCounts[v.ip_address] || 0) + 1; });
  const suspIPs = Object.entries(ipCounts).filter(([, c]) => c > 8).sort((a, b) => b[1] - a[1]);

  const userCntryMap = {};
  visitors.filter((v) => v.user_id && v.country).forEach((v) => {
    if (!userCntryMap[v.user_id]) userCntryMap[v.user_id] = new Set();
    userCntryMap[v.user_id].add(v.country);
  });
  const multiCntry = Object.entries(userCntryMap).filter(([, s]) => s.size > 1);

  const userDevMap = {};
  visitors.filter((v) => v.user_id).forEach((v) => {
    if (!userDevMap[v.user_id]) userDevMap[v.user_id] = new Set();
    if (v.visitor_id) userDevMap[v.user_id].add(v.visitor_id);
  });
  const multiDev = Object.entries(userDevMap).filter(([, s]) => s.size > 1);

  const threatScore = suspIPs.length + multiCntry.length;
  const threatLevel = threatScore > 5 ? "CRITICAL" : threatScore > 2 ? "HIGH" : threatScore > 0 ? "MODERATE" : "NOMINAL";
  const threatColor = { CRITICAL: "#f87171", HIGH: "#f87171", MODERATE: "#fb923c", NOMINAL: "#39ff14" }[threatLevel];

  const TABS = ["OVERVIEW", "GEO", "DEVICES", "THREATS", "LOG"];
  const TAB_ICO = { OVERVIEW: "◈", GEO: "⬡", DEVICES: "▣", THREATS: "⚡", LOG: "≡" };

  /* ── BOOT SCREEN ── */
  if (!booted) return (
    <div style={{ minHeight: "100vh", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono',monospace", padding: "0 24px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap');
        @keyframes an-bootfade{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
        @keyframes an-blink{50%{opacity:0}}
      `}</style>
      <div style={{ width: "min(520px,100%)" }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(1.3rem,5vw,2rem)", color: "#facc15", textShadow: "0 0 30px rgba(250,204,21,0.6)", marginBottom: 32, letterSpacing: "0.06em" }}>◈ OMNIVISION//SYS</div>
        {bootLines.map((l, i) => (
          <div key={i} style={{ fontSize: "clamp(9px,2.5vw,11px)", color: i === bootLines.length - 1 ? "#facc15" : "#39ff14", textShadow: i === bootLines.length - 1 ? "0 0 10px #facc15" : "0 0 6px rgba(57,255,20,0.5)", marginBottom: 8, animation: "an-bootfade 0.25s ease forwards" }}>{l}</div>
        ))}
        <span style={{ display: "inline-block", width: 8, height: 14, background: "#facc15", boxShadow: "0 0 10px #facc15", animation: "an-blink 0.7s step-start infinite", verticalAlign: "middle", marginTop: 8 }} />
      </div>
    </div>
  );

  /* ── MAIN ── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --y:#facc15;--g:#39ff14;--b:#60a5fa;--r:#f87171;--o:#fb923c;--p:#a78bfa;
          --bg:transparent;--border:rgba(255,255,255,0.055);
          --mono:'Space Mono',monospace;--sans:'Syne',sans-serif;
        }

        .an{min-height:100vh;background:var(--bg);color:#e2e8f0;font-family:var(--sans);padding-top:70px;position:relative;overflow-x:hidden}
        .an-rain{position:fixed;inset:0;pointer-events:none;z-index:0}
        .an-scan{position:fixed;inset:0;pointer-events:none;z-index:1;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 4px)}
        .an-vig{position:fixed;inset:0;pointer-events:none;z-index:1;background:radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,0.75) 100%)}
        .an-cnt{position:relative;z-index:3}

        /* corners */
        .cx{position:fixed;width:44px;height:44px;pointer-events:none;z-index:2}
        .cx-tl{top:72px;left:0;border-top:1px solid rgba(250,204,21,0.2);border-left:1px solid rgba(250,204,21,0.2)}
        .cx-tr{top:72px;right:0;border-top:1px solid rgba(250,204,21,0.2);border-right:1px solid rgba(250,204,21,0.2)}
        .cx-bl{bottom:0;left:0;border-bottom:1px solid rgba(250,204,21,0.2);border-left:1px solid rgba(250,204,21,0.2)}
        .cx-br{bottom:0;right:0;border-bottom:1px solid rgba(250,204,21,0.2);border-right:1px solid rgba(250,204,21,0.2)}

        /* glitch */
        @keyframes an-g1{0%,100%{clip-path:inset(0 0 94% 0);transform:translate(-3px,0)}50%{clip-path:inset(8% 0 78% 0);transform:translate(3px,0)}}
        @keyframes an-g2{0%,100%{clip-path:inset(84% 0 0 0);transform:translate(2px,0)}50%{clip-path:inset(55% 0 28% 0);transform:translate(-2px,0)}}
        .glitch-active .gw::before,.glitch-active .gw::after{content:attr(data-t);position:absolute;inset:0;color:inherit}
        .glitch-active .gw::before{color:#f87171;animation:an-g1 0.1s step-end infinite}
        .glitch-active .gw::after{color:#60a5fa;animation:an-g2 0.1s step-end infinite}
        .gw{position:relative;display:inline-block}

        /* header */
        .an-hdr{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:12px clamp(16px,4vw,40px);border-bottom:1px solid rgba(250,204,21,0.08);background:rgba(3,5,8,0.9);backdrop-filter:blur(20px);position:sticky;top:70px;z-index:50}
        .an-back{display:inline-flex;align-items:center;gap:6px;background:none;border:1px solid rgba(255,255,255,0.07);color:rgba(255,255,255,0.25);font-family:var(--mono);font-size:10px;padding:6px 12px;border-radius:3px;cursor:pointer;transition:all .2s;white-space:nowrap;letter-spacing:.06em}
        .an-back:hover{color:var(--y);border-color:rgba(250,204,21,0.4)}
        .an-sys{font-size:8px;font-family:var(--mono);color:rgba(255,255,255,0.1);letter-spacing:.18em;text-transform:uppercase}
        .an-title-main{font-size:clamp(.9rem,2.5vw,1.05rem);font-weight:800;letter-spacing:.06em;color:#fff}
        .an-title-main span{color:var(--y);text-shadow:0 0 20px rgba(250,204,21,0.55)}
        .live-ind{display:flex;align-items:center;gap:7px;font-family:var(--mono);font-size:10px;color:var(--g);text-shadow:0 0 8px var(--g)}
        .an-sync{background:none;border:1px solid rgba(255,255,255,0.07);color:rgba(255,255,255,0.22);font-family:var(--mono);font-size:10px;padding:6px 12px;border-radius:3px;cursor:pointer;transition:all .2s}
        .an-sync:hover{color:var(--y);border-color:rgba(250,204,21,0.3)}

        /* tabs */
        .an-tabs{display:flex;padding:0 clamp(16px,4vw,40px);border-bottom:1px solid rgba(255,255,255,0.04);background:rgba(3,5,8,0.93);backdrop-filter:blur(20px);position:sticky;top:calc(70px + 50px);z-index:49;overflow-x:auto;scrollbar-width:none}
        .an-tabs::-webkit-scrollbar{display:none}
        .an-tab{display:flex;align-items:center;gap:7px;padding:12px clamp(12px,2.5vw,22px);font-family:var(--mono);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:rgba(255,255,255,0.15);border:none;background:none;cursor:pointer;transition:all .2s;border-bottom:2px solid transparent;margin-bottom:-1px;white-space:nowrap;position:relative}
        .an-tab:hover{color:rgba(255,255,255,0.4)}
        .an-tab.act{color:var(--y);border-bottom-color:var(--y);text-shadow:0 0 12px rgba(250,204,21,0.7)}
        .an-tab.act::before{content:'';position:absolute;bottom:0;left:0;right:0;height:28px;background:linear-gradient(0deg,rgba(250,204,21,0.03),transparent);pointer-events:none}

        /* body */
        .an-body{padding:clamp(14px,3vw,26px) clamp(16px,4vw,40px);max-width:1600px;margin:0 auto}

        /* KPI */
        .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:14px}
        .kpi{position:relative;overflow:hidden;background:rgba(255,255,255,0.016);border:1px solid rgba(255,255,255,0.055);border-radius:2px;padding:clamp(16px,2.5vw,22px) clamp(14px,2vw,20px);transition:transform .3s,border-color .3s;cursor:default}
        .kpi:hover{transform:translateY(-3px);border-color:var(--c)}
        .kpi:hover .kpi-glow{opacity:1}
        .kpi-tl,.kpi-tr,.kpi-bl,.kpi-br{position:absolute;width:10px;height:10px}
        .kpi-tl{top:-1px;left:-1px;border-top:2px solid var(--c);border-left:2px solid var(--c)}
        .kpi-tr{top:-1px;right:-1px;border-top:2px solid var(--c);border-right:2px solid var(--c)}
        .kpi-bl{bottom:-1px;left:-1px;border-bottom:2px solid var(--c);border-left:2px solid var(--c)}
        .kpi-br{bottom:-1px;right:-1px;border-bottom:2px solid var(--c);border-right:2px solid var(--c)}
        .kpi-scan{position:absolute;top:0;left:-100%;width:35%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.018),transparent);animation:an-sweep 5s ease-in-out infinite}
        @keyframes an-sweep{0%{left:-35%}100%{left:135%}}
        .kpi-glow{position:absolute;inset:0;background:radial-gradient(circle at 10% 90%,color-mix(in srgb,var(--c) 9%,transparent),transparent 65%);opacity:0;transition:opacity .3s;pointer-events:none}
        .kpi-icon{font-size:1.2rem;margin-bottom:10px;position:relative;z-index:1}
        .kpi-val{font-family:var(--sans);font-size:clamp(1.8rem,3.5vw,2.8rem);font-weight:800;color:var(--c);line-height:1;position:relative;z-index:1;text-shadow:0 0 28px color-mix(in srgb,var(--c) 38%,transparent);word-break:break-all}
        .kpi-label{font-family:var(--mono);font-size:9px;color:rgba(255,255,255,0.18);text-transform:uppercase;letter-spacing:.15em;margin-top:8px;position:relative;z-index:1}
        .kpi-sub{font-family:var(--mono);font-size:10px;color:rgba(255,255,255,0.1);margin-top:3px;position:relative;z-index:1}

        /* panel */
        .panel{background:rgba(255,255,255,0.016);border:1px solid var(--border);border-radius:2px;padding:clamp(14px,2.5vw,20px);position:relative;overflow:hidden}
        .p-tl{position:absolute;top:-1px;left:-1px;width:12px;height:12px;border-top:2px solid rgba(250,204,21,0.22);border-left:2px solid rgba(250,204,21,0.22)}
        .p-br{position:absolute;bottom:-1px;right:-1px;width:12px;height:12px;border-bottom:2px solid rgba(250,204,21,0.22);border-right:2px solid rgba(250,204,21,0.22)}
        .panel-lbl{font-family:var(--mono);font-size:9px;color:rgba(255,255,255,0.14);text-transform:uppercase;letter-spacing:.18em;margin-bottom:16px;display:flex;align-items:center;gap:8px}
        .panel-lbl::after{content:'';flex:1;height:1px;background:rgba(255,255,255,0.04)}

        /* grids */
        .r2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px}
        .r3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:14px}
        .r21{display:grid;grid-template-columns:2fr 1fr;gap:12px;margin-bottom:14px}
        .r12{display:grid;grid-template-columns:1fr 2fr;gap:12px;margin-bottom:14px}
        .mb14{margin-bottom:14px}

        /* mini stats */
        .mini-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px}
        .mini-stat{background:rgba(255,255,255,0.012);border:1px solid rgba(255,255,255,0.04);border-radius:2px;padding:clamp(12px,2vw,16px);text-align:center;position:relative;overflow:hidden}
        .mini-stat::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 100%,color-mix(in srgb,var(--cv) 6%,transparent),transparent 70%)}
        .mini-stat-val{font-family:var(--sans);font-size:clamp(1.5rem,3vw,2.2rem);font-weight:800;color:var(--cv);position:relative;z-index:1;text-shadow:0 0 20px color-mix(in srgb,var(--cv) 40%,transparent)}
        .mini-stat-lbl{font-family:var(--mono);font-size:9px;color:rgba(255,255,255,0.18);text-transform:uppercase;letter-spacing:.12em;margin-top:4px;position:relative;z-index:1}

        /* donut layout */
        .drow{display:flex;align-items:center;gap:clamp(12px,2.5vw,24px)}

        /* section */
        .sect{font-family:var(--mono);font-size:9px;color:rgba(255,255,255,0.1);text-transform:uppercase;letter-spacing:.2em;margin-bottom:10px;margin-top:4px}

        /* log */
        .log-wrap{border:1px solid var(--border);border-radius:2px;overflow:hidden;overflow-x:auto}
        .log-t{width:100%;border-collapse:collapse;min-width:620px}
        .log-t thead tr{background:rgba(255,255,255,0.018);border-bottom:1px solid rgba(255,255,255,0.04)}
        .log-t th{padding:10px 14px;text-align:left;font-family:var(--mono);font-size:9px;color:rgba(255,255,255,0.14);text-transform:uppercase;letter-spacing:.1em;white-space:nowrap}
        .log-t tbody tr{border-bottom:1px solid rgba(255,255,255,0.02);transition:background .15s}
        .log-t tbody tr:hover{background:rgba(250,204,21,0.022)}
        .log-t td{padding:10px 14px;font-family:var(--mono);font-size:11px;color:#3d5068;vertical-align:middle}
        .log-ip{color:#64748b;font-weight:700}
        .log-rep{color:#f87171;font-size:9px;margin-left:5px}
        .pill{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:2px;font-size:9px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);color:rgba(255,255,255,0.22);font-family:var(--mono);white-space:nowrap}
        .log-auth{color:#39ff14;font-size:9px;text-shadow:0 0 5px #39ff14}
        .log-anon{color:rgba(255,255,255,0.08);font-size:9px}
        .log-time{color:rgba(255,255,255,0.1);font-size:10px;white-space:nowrap}

        /* loading */
        .an-load{display:flex;flex-direction:column;align-items:center;justify-content:center;height:55vh;gap:16px}
        .an-load-txt{font-family:var(--mono);font-size:12px;color:var(--y);text-shadow:0 0 10px var(--y);letter-spacing:.1em}
        .an-load-bar{width:clamp(140px,40vw,220px);height:2px;background:rgba(250,204,21,0.08);border-radius:999px;overflow:hidden}
        .an-load-fill{height:100%;background:var(--y);box-shadow:0 0 10px var(--y);animation:an-loadrun 1.2s ease infinite}
        @keyframes an-loadrun{0%{width:0%;margin-left:0}50%{width:100%;margin-left:0}100%{width:0%;margin-left:100%}}

        @keyframes an-ping{75%,100%{transform:scale(2.4);opacity:0}}

        /* responsive */
        @media(max-width:1100px){.kpis{grid-template-columns:repeat(2,1fr)}.r21,.r12{grid-template-columns:1fr}}
        @media(max-width:768px){
          .r2,.r3{grid-template-columns:1fr}
          .mini-stats{grid-template-columns:1fr 1fr}
          .drow{flex-direction:column;align-items:flex-start}
          .an{padding-top:60px}.an-hdr{top:60px}.an-tabs{top:calc(60px + 46px)}
        }
        @media(max-width:520px){
          .kpis{grid-template-columns:1fr 1fr}
          .mini-stats{grid-template-columns:1fr}
        }
        @media(max-width:360px){.kpis{grid-template-columns:1fr}}
      `}</style>

      <div className={`an${glitch ? " glitch-active" : ""}`}>
        <canvas ref={canvasRef} className="an-rain" />
        <div className="an-scan" /><div className="an-vig" />
        <div className="cx cx-tl" /><div className="cx cx-tr" /><div className="cx cx-bl" /><div className="cx cx-br" />

        <div className="an-cnt">

          {/* HEADER */}
          <div className="an-hdr">
            <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
              <button className="an-back" onClick={() => navigate("/admin-dashboard")}>← BACK</button>
              <div>
                <div className="an-sys">// OMNIVISION ANALYTICS SYS v3.7</div>
                <div className="an-title-main">
                  <span className="gw" data-t="SITE">SITE</span>{" "}
                  <span><span className="gw" data-t="INTEL">INTEL</span></span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
              <div className="live-ind"><Pulse color="#39ff14" size={8} />LIVE</div>
              <button className="an-sync" onClick={loadData}>↻ SYNC</button>
            </div>
          </div>

          {/* TABS */}
          <div className="an-tabs">
            {TABS.map((t) => (
              <button key={t} className={`an-tab${tab === t ? " act" : ""}`} onClick={() => setTab(t)}>
                <span>{TAB_ICO[t]}</span>{t}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="an-load">
              <div className="an-load-txt">DECRYPTING VISITOR MATRIX...</div>
              <div className="an-load-bar"><div className="an-load-fill" /></div>
            </div>
          ) : (
            <div className="an-body">

              {/* ══ OVERVIEW ══ */}
              {tab === "OVERVIEW" && (
                <>
                  <div className="kpis">
                    <KpiCard label="Total Visits" value={total} sub="all recorded" color="#facc15" icon="◈" trend={growthPct} />
                    <KpiCard label="Unique IPs" value={uniqueIPs} sub="distinct nodes" color="#39ff14" icon="⬡" />
                    <KpiCard label="Unique Devices" value={uniqueVIDs} sub="by visitor_id" color="#60a5fa" icon="▣" />
                    <KpiCard label="Authenticated" value={loggedIn} sub={`${anonV} anonymous`} color="#a78bfa" icon="★" />
                  </div>

                  <div className="mini-stats">
                    <div className="mini-stat" style={{ "--cv": "#facc15" }}>
                      <div className="mini-stat-val">{todayV}</div>
                      <div className="mini-stat-lbl">Today's Visits</div>
                    </div>
                    <div className="mini-stat" style={{ "--cv": "#60a5fa" }}>
                      <div className="mini-stat-val">{weekV}</div>
                      <div className="mini-stat-lbl">This Week</div>
                    </div>
                    <div className="mini-stat" style={{ "--cv": "#fb923c" }}>
                      <div className="mini-stat-val">{Object.keys(cntryMap).length}</div>
                      <div className="mini-stat-lbl">Countries</div>
                    </div>
                  </div>

                  <Panel label="◈ TRAFFIC STREAM — LAST 14 DAYS" style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 11px", background: "rgba(250,204,21,0.07)", border: "1px solid rgba(250,204,21,0.2)", borderRadius: 2, fontFamily: "var(--mono)", fontSize: 11, color: "#facc15", fontWeight: 700 }}>TODAY: {todayV}</span>
                      {growthPct !== null && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 11px", borderRadius: 2, fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, background: growthPct >= 0 ? "rgba(57,255,20,0.07)" : "rgba(248,113,113,0.07)", border: `1px solid ${growthPct >= 0 ? "rgba(57,255,20,0.2)" : "rgba(248,113,113,0.2)"}`, color: growthPct >= 0 ? "#39ff14" : "#f87171" }}>
                          {growthPct >= 0 ? "▲" : "▼"} {Math.abs(growthPct)}% vs yesterday
                        </span>
                      )}
                    </div>
                    <BarChart data={last14} color="#facc15" height={130} />
                  </Panel>

                  <div className="r2">
                    <Panel label="DEVICE SPLIT">
                      <div className="drow">
                        <Donut segments={devSegs} size={110} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {devSegs.map((s) => <LegItem key={s.label} color={s.color} label={s.label} value={s.value} total={total} />)}
                        </div>
                      </div>
                    </Panel>
                    <Panel label="BROWSER SPLIT">
                      <div className="drow">
                        <Donut segments={brwSegs} size={110} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {brwSegs.slice(0, 5).map((s) => <LegItem key={s.label} color={s.color} label={s.label} value={s.value} total={total} />)}
                        </div>
                      </div>
                    </Panel>
                  </div>

                  <div className="r21">
                    <Panel label="SESSION BREAKDOWN">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", flexWrap: "wrap", gap: 12, paddingTop: 6 }}>
                        <Arc value={loggedIn} max={total} color="#a78bfa" label="Authenticated" />
                        <Arc value={anonV} max={total} color="#60a5fa" label="Anonymous" />
                        <Arc value={todayV} max={Math.max(total, 1)} color="#facc15" label="Today" />
                      </div>
                    </Panel>
                    <Panel label="TOP ORIGINS">
                      {topCntry.slice(0, 5).map(([c, n]) => <GeoBar key={c} name={`🌍 ${c}`} count={n} max={maxCntry} total={total} color="#facc15" />)}
                      {topCntry.length === 0 && <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "rgba(255,255,255,0.08)" }}>// awaiting geo data</div>}
                    </Panel>
                  </div>
                </>
              )}

              {/* ══ GEO ══ */}
              {tab === "GEO" && (
                <>
                  <div className="kpis">
                    <KpiCard label="Countries" value={Object.keys(cntryMap).length} sub="distinct nations" color="#60a5fa" icon="⬡" />
                    <KpiCard label="Cities" value={Object.keys(cityMap).length} sub="distinct cities" color="#39ff14" icon="📍" />
                    <KpiCard label="Top Country" value={topCntry[0]?.[0] || "—"} sub={`${topCntry[0]?.[1] || 0} visits`} color="#facc15" icon="🌍" />
                    <KpiCard label="Cross-Border" value={multiCntry.length} sub="multi-country users" color={multiCntry.length > 0 ? "#f87171" : "#39ff14"} icon="⚡" />
                  </div>

                  <div className="r2">
                    <Panel label="TOP COUNTRIES">
                      {topCntry.length === 0
                        ? <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "rgba(255,255,255,0.08)" }}>// no geo data yet</div>
                        : topCntry.map(([c, n]) => <GeoBar key={c} name={`🌍 ${c}`} count={n} max={maxCntry} total={total} color="#facc15" />)}
                    </Panel>
                    <Panel label="TOP CITIES">
                      {topCity.length === 0
                        ? <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "rgba(255,255,255,0.08)" }}>// no city data yet</div>
                        : topCity.map(([c, n]) => <GeoBar key={c} name={`📍 ${c}`} count={n} max={maxCity} total={total} color="#39ff14" />)}
                    </Panel>
                  </div>

                  <Panel label="CROSS-BORDER ANOMALIES">
                    {multiCntry.length === 0
                      ? <OkRow text="No multi-country logins detected" />
                      : multiCntry.map(([uid, countries]) => {
                        const uv = visitors.filter((v) => v.user_id === uid);
                        const email = uv[0]?.email || uid.slice(0, 16) + "...";
                        return <ThreatRow key={uid} icon="🌐" title={email} sub={[...countries].join(" → ")} badge={`${countries.size} NATIONS`} />;
                      })}
                  </Panel>
                </>
              )}

              {/* ══ DEVICES ══ */}
              {tab === "DEVICES" && (
                <>
                  <div className="kpis">
                    <KpiCard label="Desktop" value={devMap["Desktop"] || 0} sub={`${total ? (((devMap["Desktop"] || 0) / total) * 100).toFixed(1) : 0}% of visits`} color="#facc15" icon="🖥️" />
                    <KpiCard label="Mobile" value={devMap["Mobile"] || 0} sub={`${total ? (((devMap["Mobile"] || 0) / total) * 100).toFixed(1) : 0}% of visits`} color="#39ff14" icon="📱" />
                    <KpiCard label="Tablet" value={devMap["Tablet"] || 0} sub={`${total ? (((devMap["Tablet"] || 0) / total) * 100).toFixed(1) : 0}% of visits`} color="#60a5fa" icon="📟" />
                    <KpiCard label="Multi-Device" value={multiDev.length} sub="same user, diff devices" color="#a78bfa" icon="◈" />
                  </div>

                  <div className="r2">
                    <Panel label="DEVICE DISTRIBUTION">
                      <div className="drow">
                        <Donut segments={devSegs} size={120} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {devSegs.map((s) => <LegItem key={s.label} color={s.color} label={s.label} value={s.value} total={total} />)}
                        </div>
                      </div>
                    </Panel>
                    <Panel label="BROWSER DISTRIBUTION">
                      <div className="drow">
                        <Donut segments={brwSegs} size={120} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {brwSegs.map((s) => <LegItem key={s.label} color={s.color} label={s.label} value={s.value} total={total} />)}
                        </div>
                      </div>
                    </Panel>
                  </div>

                  <Panel label="LAST 7 DAYS — TRAFFIC" style={{ marginBottom: 14 }}>
                    <BarChart data={last7} color="#a78bfa" height={110} />
                  </Panel>

                  <Panel label="MULTI-DEVICE USERS">
                    {multiDev.length === 0
                      ? <OkRow text="No multi-device users detected" />
                      : multiDev.map(([uid, devs]) => {
                        const uv = visitors.filter((v) => v.user_id === uid);
                        const email = uv[0]?.email || uid.slice(0, 14) + "...";
                        return (
                          <div key={uid} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", padding: "11px 14px", background: "rgba(250,204,21,0.03)", border: "1px solid rgba(250,204,21,0.08)", borderRadius: 2, marginBottom: 8 }}>
                            <div>
                              <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "#e2e8f0", fontWeight: 700 }}>{email}</div>
                              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 2 }}>{uv.length} total visits</div>
                            </div>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                              {[...devs].map((_, i) => (
                                <span key={i} style={{ padding: "3px 10px", background: "rgba(250,204,21,0.07)", border: "1px solid rgba(250,204,21,0.18)", borderRadius: 2, fontSize: 10, fontFamily: "var(--mono)", color: "#facc15" }}>DEV {i + 1}</span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </Panel>
                </>
              )}

              {/* ══ THREATS ══ */}
              {tab === "THREATS" && (
                <>
                  <div className="kpis">
                    <KpiCard label="Threat Level" value={threatLevel} sub="combined score" color={threatColor} icon="◈" />
                    <KpiCard label="Suspicious IPs" value={suspIPs.length} sub="> 8 hits same IP" color={suspIPs.length > 0 ? "#fb923c" : "#39ff14"} icon="⚡" />
                    <KpiCard label="Multi-Country" value={multiCntry.length} sub="cross-border logins" color={multiCntry.length > 0 ? "#f87171" : "#39ff14"} icon="🚨" />
                    <KpiCard label="Multi-Device" value={multiDev.length} sub="same user diff devices" color={multiDev.length > 0 ? "#a78bfa" : "#39ff14"} icon="▣" />
                  </div>

                  <Panel label="THREAT ASSESSMENT MATRIX" style={{ marginBottom: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 16 }}>
                      {[
                        { label: "IP Frequency", val: Math.min(suspIPs.length, 10), max: 10, color: "#fb923c" },
                        { label: "Geo Anomalies", val: Math.min(multiCntry.length, 10), max: 10, color: "#f87171" },
                        { label: "Device Spread", val: Math.min(multiDev.length, 10), max: 10, color: "#a78bfa" },
                        { label: "Auth Ratio", val: Math.round((loggedIn / Math.max(total, 1)) * 10), max: 10, color: "#39ff14" },
                      ].map(({ label, val, max, color }) => (
                        <div key={label}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{label}</span>
                            <span style={{ fontFamily: "var(--mono)", fontSize: 10, color, fontWeight: 700 }}>{val}/{max}</span>
                          </div>
                          <div style={{ height: 4, background: "rgba(255,255,255,0.04)", borderRadius: 999, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${(val / max) * 100}%`, background: `linear-gradient(90deg,${color},${color}55)`, boxShadow: `0 0 8px ${color}66`, borderRadius: 999, transition: "width 1s ease" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Panel>

                  <div className="r2">
                    <div>
                      <div className="sect">⚡ HIGH-FREQUENCY IP NODES</div>
                      {suspIPs.length === 0
                        ? <OkRow text="No suspicious IP activity detected" />
                        : suspIPs.map(([ip, count]) => {
                          const s = visitors.find((v) => v.ip_address === ip);
                          return <ThreatRow key={ip} icon="⚡" title={ip} sub={s?.city && s?.country ? `${s.city}, ${s.country}` : "LOCATION UNKNOWN"} badge={`${count}× HITS`} badgeColor="#fb923c" />;
                        })}
                    </div>
                    <div>
                      <div className="sect">🚨 CROSS-BORDER LOGIN ANOMALIES</div>
                      {multiCntry.length === 0
                        ? <OkRow text="No multi-country logins detected" />
                        : multiCntry.map(([uid, countries]) => {
                          const uv = visitors.filter((v) => v.user_id === uid);
                          const email = uv[0]?.email || uid.slice(0, 14) + "...";
                          return <ThreatRow key={uid} icon="🚨" title={email} sub={[...countries].join(" → ")} badge={`${countries.size} NATIONS`} />;
                        })}
                    </div>
                  </div>
                </>
              )}

              {/* ══ LOG ══ */}
              {tab === "LOG" && (
                <>
                  <div className="kpis">
                    <KpiCard label="Log Records" value={visitors.length} sub="latest 500" color="#facc15" icon="≡" />
                    <KpiCard label="Unique IPs" value={uniqueIPs} sub="in log" color="#39ff14" icon="⬡" />
                    <KpiCard label="Authenticated" value={loggedIn} sub="logged-in sessions" color="#a78bfa" icon="★" />
                    <KpiCard label="Anonymous" value={anonV} sub="guest sessions" color="#60a5fa" icon="○" />
                  </div>

                  <div className="log-wrap">
                    <table className="log-t">
                      <thead>
                        <tr>
                          <th>#</th><th>IP ADDRESS</th><th>LOCATION</th><th>DEVICE</th><th>BROWSER</th><th>USER</th><th>TIME</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visitors.length === 0
                          ? <tr><td colSpan={7} style={{ textAlign: "center", padding: 48, color: "rgba(255,255,255,0.06)", fontFamily: "var(--mono)", fontSize: 11 }}>// NO RECORDS IN MATRIX</td></tr>
                          : visitors.map((v, i) => {
                            const isRep = ipCounts[v.ip_address] > 1;
                            const dev = parseDevice(v.device || v.user_agent);
                            const bro = parseBrowser(v.browser || v.user_agent);
                            const devIco = dev === "Mobile" ? "📱" : dev === "Tablet" ? "📟" : "🖥️";
                            return (
                              <tr key={v.id || i}>
                                <td style={{ color: "rgba(255,255,255,0.06)", fontSize: 9 }}>{i + 1}</td>
                                <td><span className="log-ip">{v.ip_address || "—"}</span>{isRep && <span className="log-rep">×{ipCounts[v.ip_address]}</span>}</td>
                                <td style={{ color: "#3d5068", fontSize: 11 }}>{[v.city, v.country].filter(Boolean).join(", ") || "—"}</td>
                                <td><span className="pill">{devIco} {dev}</span></td>
                                <td><span className="pill">{bro}</span></td>
                                <td>{v.user_id ? <span className="log-auth">● {v.email || "AUTH"}</span> : <span className="log-anon">○ ANON</span>}</td>
                                <td className="log-time">{fmtTime(v.visited_at)}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AnalyticsDashboard;