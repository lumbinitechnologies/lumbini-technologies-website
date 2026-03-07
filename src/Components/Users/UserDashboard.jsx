import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useAuthGuard from "../hooks/useAuthGuard";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "#6b7280",
    bg: "rgba(107,114,128,0.12)",
    glow: "rgba(107,114,128,0.08)",
  },
  shortlisted: {
    label: "Shortlisted",
    color: "#facc15",
    bg: "rgba(250,204,21,0.12)",
    glow: "rgba(250,204,21,0.06)",
  },
  selected: {
    label: "Selected",
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
    glow: "rgba(52,211,153,0.06)",
  },
  rejected: {
    label: "Rejected",
    color: "#f87171",
    bg: "rgba(248,113,113,0.12)",
    glow: "rgba(248,113,113,0.06)",
  },
};

const STATUS_MESSAGES = {
  pending: "Your application is under review. We'll update you soon.",
  shortlisted: "Great news! You've been shortlisted. Expect a call from us.",
  selected: "Congratulations! You've been selected for the internship.",
  rejected:
    "Thank you for applying. We'll keep your profile for future opportunities.",
};

const DOC_META = {
  offer_letter: {
    label: "Offer Letter",
    icon: "📄",
    color: "#60a5fa",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.2)",
  },
  certificate: {
    label: "Certificate of Appreciation",
    icon: "🏅",
    color: "#fb923c",
    bg: "rgba(251,146,60,0.08)",
    border: "rgba(251,146,60,0.2)",
  },
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const { session, user, loading: authLoading } = useAuth();

  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [appsError, setAppsError] = useState(null);
  const [activeApp, setActiveApp] = useState(null);

  const [documents, setDocuments] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("applications");
  // Centralized auth guard redirects unauthenticated users back to Login with redirect param
  useAuthGuard("/Login");

  useEffect(() => {
    if (!user) return;
    setAppsLoading(true);
    fetchApplications();
    fetchDocuments();
  }, [user]);

  const fetchApplications = async () => {
    setAppsError(null);
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("email", user.email)
        .order("created_at", { ascending: false });

      if (error) {
        setApplications([]);
        setActiveApp(null);
        setAppsError(error.message || "Failed to load applications.");
      } else {
        setApplications(data || []);
        if (data && data.length > 0) setActiveApp(data[0]);
      }
    } catch (e) {
      setApplications([]);
      setActiveApp(null);
      setAppsError(
        e instanceof Error ? e.message : "Failed to load applications.",
      );
    } finally {
      setAppsLoading(false);
    }
  };

  const fetchDocuments = async () => {
    if (!user) return;
    setDocsLoading(true);
    try {
      const { data: intern } = await supabase
        .from("interns")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();

      if (!intern) {
        setDocuments([]);
        return;
      }

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("intern_id", intern.id)
        .order("created_at", { ascending: false });

      setDocuments(error ? [] : data || []);
    } catch {
      setDocuments([]);
    } finally {
      setDocsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const fmt = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  const avatarLetter = user?.email?.[0]?.toUpperCase() || "U";
  const latestStatus = applications[0]?.status || null;
  const latestS = STATUS_CONFIG[latestStatus] || null;
  const loading = authLoading || appsLoading;

  // ── Early returns (mirrors your original) ─────────────────────────────────
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "#facc15",
          fontFamily: "'DM Mono', monospace",
          fontSize: 13,
        }}
      >
        Initializing dashboard...
      </div>
    );
  }

  if (!session) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ud {
          min-height: 100vh;
          background: #020407;
          color: #e2e8f0;
          font-family: 'Outfit', sans-serif;
          padding: clamp(5rem, 10vw, 7rem) 0 4rem;
        }

        .ud-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(1rem, 4vw, 2.5rem);
        }

        .ud-sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: sticky;
          top: 100px;
          align-self: start;
        }

        .ud-profile-card {
          background: #0a0d14;
          border: 1px solid #111827;
          border-radius: 16px;
          padding: 24px 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .ud-profile-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 60px;
          background: linear-gradient(135deg, #facc1508 0%, transparent 100%);
        }

        .ud-avatar {
          width: 64px; height: 64px; border-radius: 50%;
          background: #facc15; color: #000;
          font-size: 1.6rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 14px;
          box-shadow: 0 0 24px rgba(250,204,21,0.25);
          position: relative; z-index: 1;
        }

        .ud-profile-name { font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .ud-profile-email { font-family: 'DM Mono', monospace; font-size: 11px; color: #334155; word-break: break-all; margin-bottom: 16px; }
        .ud-profile-divider { height: 1px; background: #111827; margin: 0 -20px 16px; }
        .ud-profile-stat { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .ud-profile-stat-label { color: #334155; font-family: 'DM Mono', monospace; font-size: 11px; }
        .ud-profile-stat-val { color: #94a3b8; font-weight: 600; font-size: 13px; }

        .ud-nav {
          background: #0a0d14; border: 1px solid #111827;
          border-radius: 16px; padding: 12px;
          display: flex; flex-direction: column; gap: 4px;
        }

        .ud-nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: 10px;
          font-size: 14px; font-weight: 500; color: #475569;
          cursor: pointer; border: 1px solid transparent;
          background: none; width: 100%; text-align: left;
          transition: all 0.2s; font-family: 'Outfit', sans-serif;
          text-decoration: none;
        }
        .ud-nav-item:hover { background: #111827; color: #e2e8f0; }
        .ud-nav-item.active { background: rgba(250,204,21,0.08); color: #facc15; border-color: rgba(250,204,21,0.15); }

        .ud-nav-badge {
          margin-left: auto;
          background: rgba(96,165,250,0.15);
          color: #60a5fa;
          font-family: 'DM Mono', monospace;
          font-size: 10px; font-weight: 700;
          padding: 2px 7px; border-radius: 999px;
          border: 1px solid rgba(96,165,250,0.25);
        }

        .ud-logout-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: 10px;
          font-size: 14px; font-weight: 500; color: #f87171;
          cursor: pointer; border: 1px solid transparent;
          background: none; width: 100%; text-align: left;
          transition: all 0.2s; font-family: 'Outfit', sans-serif;
          margin-top: 4px;
        }
        .ud-logout-btn:hover { background: rgba(248,113,113,0.08); border-color: rgba(248,113,113,0.2); }

        .ud-main { display: flex; flex-direction: column; gap: 20px; min-width: 0; }

        .ud-welcome {
          background: #0a0d14; border: 1px solid #111827;
          border-radius: 16px; padding: 24px 28px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; position: relative; overflow: hidden;
        }
        .ud-welcome::after {
          content: '';
          position: absolute; right: -40px; top: -40px;
          width: 180px; height: 180px; border-radius: 50%;
          background: radial-gradient(circle, rgba(250,204,21,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .ud-welcome-greeting { font-size: 13px; font-family: 'DM Mono', monospace; color: #facc15; margin-bottom: 6px; }
        .ud-welcome-title { font-size: clamp(1.2rem, 2.5vw, 1.6rem); font-weight: 800; color: #fff; line-height: 1.2; }
        .ud-welcome-sub { font-size: 13px; color: #334155; margin-top: 6px; }

        .ud-apply-btn {
          padding: 10px 22px; background: #facc15; color: #000;
          font-weight: 700; font-size: 14px; border-radius: 10px;
          border: none; cursor: pointer; white-space: nowrap;
          flex-shrink: 0; transition: all 0.2s; font-family: 'Outfit', sans-serif;
        }
        .ud-apply-btn:hover { background: #fde047; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(250,204,21,0.3); }

        .ud-status-banner {
          border-radius: 16px; padding: 20px 24px;
          display: flex; align-items: center; gap: 16px;
          background: var(--glow); border: 1px solid var(--color-dim);
        }
        .ud-status-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: var(--color-dim);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; flex-shrink: 0;
        }
        .ud-status-banner-label { font-size: 11px; font-family: 'DM Mono', monospace; color: var(--color); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
        .ud-status-banner-msg { font-size: 14px; color: #94a3b8; font-weight: 500; }

        .ud-status-dot-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 10px; border-radius: 999px;
          font-size: 11px; font-weight: 600; font-family: 'DM Mono', monospace;
          background: var(--sbg); color: var(--sc);
          margin-left: auto; white-space: nowrap; flex-shrink: 0;
        }
        .ud-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--sc); }

        .ud-section-title {
          font-size: 13px; font-family: 'DM Mono', monospace;
          color: #334155; text-transform: uppercase; letter-spacing: 0.12em;
          margin-bottom: 14px;
          display: flex; align-items: center; gap: 10px;
        }
        .ud-section-title::after { content: ''; flex: 1; height: 1px; background: #111827; }

        .ud-app-card {
          background: #0a0d14; border: 1px solid #111827;
          border-radius: 14px; padding: 20px 22px;
          margin-bottom: 12px; cursor: pointer; transition: all 0.2s;
          position: relative; overflow: hidden;
        }
        .ud-app-card::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 3px; background: var(--accent); border-radius: 0 2px 2px 0;
        }
        .ud-app-card:hover { border-color: #1a2535; background: #0d1118; transform: translateX(2px); }
        .ud-app-card.active-card { border-color: var(--accent-dim); background: #0d1118; }
        .ud-app-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; gap: 12px; }
        .ud-app-card-university { font-size: 11px; font-family: 'DM Mono', monospace; color: #334155; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.06em; }
        .ud-app-card-name { font-size: 15px; font-weight: 700; color: #e2e8f0; }
        .ud-app-card-skills { font-size: 12px; color: #334155; font-family: 'DM Mono', monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 8px; }
        .ud-app-card-date { font-size: 12px; color: #1e2d3d; font-family: 'DM Mono', monospace; margin-top: 6px; }

        .ud-detail { background: #0a0d14; border: 1px solid #111827; border-radius: 16px; padding: 24px; }
        .ud-detail-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; gap: 12px; flex-wrap: wrap; }
        .ud-detail-title { font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .ud-detail-sub { font-size: 12px; font-family: 'DM Mono', monospace; color: #334155; }
        .ud-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .ud-detail-field { background: #060a10; border: 1px solid #0f1520; border-radius: 10px; padding: 12px 14px; }
        .ud-detail-field-label { font-size: 10px; font-family: 'DM Mono', monospace; color: #1e3a5f; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 5px; }
        .ud-detail-field-val { font-size: 13px; color: #64748b; font-weight: 500; word-break: break-word; }
        .ud-detail-motivation { background: #060a10; border: 1px solid #0f1520; border-radius: 10px; padding: 14px 16px; margin-bottom: 16px; }
        .ud-detail-motivation-label { font-size: 10px; font-family: 'DM Mono', monospace; color: #1e3a5f; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 8px; }
        .ud-detail-motivation-text { font-size: 13px; color: #475569; line-height: 1.7; }

        .ud-resume-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 9px 18px; background: rgba(250,204,21,0.08);
          border: 1px solid rgba(250,204,21,0.2); border-radius: 8px;
          color: #facc15; font-size: 13px; font-weight: 600;
          text-decoration: none; transition: all 0.2s; font-family: 'Outfit', sans-serif;
        }
        .ud-resume-btn:hover { background: rgba(250,204,21,0.15); border-color: #facc15; }

        .ud-docs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
        .ud-doc-card {
          background: #0a0d14; border: 1px solid var(--doc-border);
          border-radius: 14px; padding: 20px;
          position: relative; overflow: hidden;
          transition: border-color 0.2s, background 0.2s;
        }
        .ud-doc-card::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 3px; background: var(--doc-color); border-radius: 0 2px 2px 0;
        }
        .ud-doc-card:hover { background: #0d1118; }
        .ud-doc-icon { width: 44px; height: 44px; border-radius: 12px; background: var(--doc-bg); display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 14px; }
        .ud-doc-label { font-size: 14px; font-weight: 700; color: #e2e8f0; margin-bottom: 4px; }
        .ud-doc-date { font-size: 11px; font-family: 'DM Mono', monospace; color: #334155; margin-bottom: 14px; }
        .ud-doc-download {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px; background: var(--doc-bg); border: 1px solid var(--doc-border);
          border-radius: 7px; color: var(--doc-color);
          font-size: 12px; font-weight: 600; font-family: 'DM Mono', monospace;
          text-decoration: none; transition: all 0.2s;
        }
        .ud-doc-download:hover { filter: brightness(1.2); }

        .ud-docs-empty { background: #0a0d14; border: 1px dashed #111827; border-radius: 14px; padding: 36px 24px; text-align: center; }
        .ud-docs-empty-icon { font-size: 2rem; opacity: 0.2; margin-bottom: 10px; }
        .ud-docs-empty-text { font-family: 'DM Mono', monospace; font-size: 12px; color: #1e2d3d; }

        .ud-timeline { display: flex; align-items: center; gap: 0; margin-bottom: 20px; overflow-x: auto; padding-bottom: 4px; }
        .ud-tl-step { display: flex; flex-direction: column; align-items: center; flex: 1; min-width: 60px; position: relative; }
        .ud-tl-step:not(:last-child)::after {
          content: ''; position: absolute; top: 12px;
          left: calc(50% + 12px); right: calc(-50% + 12px);
          height: 1px; background: var(--line-color, #111827); z-index: 0;
        }
        .ud-tl-dot {
          width: 24px; height: 24px; border-radius: 50%;
          background: var(--dot-bg, #111827); border: 2px solid var(--dot-border, #1f2937);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; position: relative; z-index: 1; transition: all 0.3s;
        }
        .ud-tl-label { font-size: 10px; font-family: 'DM Mono', monospace; color: var(--tl-label-color, #1e2d3d); margin-top: 6px; text-align: center; text-transform: uppercase; letter-spacing: 0.05em; }

        .ud-empty { background: #0a0d14; border: 1px dashed #111827; border-radius: 16px; padding: 48px 24px; text-align: center; }
        .ud-empty-icon { font-size: 2.5rem; opacity: 0.2; margin-bottom: 12px; }
        .ud-empty-text { font-family: 'DM Mono', monospace; font-size: 13px; color: #1e2d3d; margin-bottom: 20px; }

        @media (max-width: 900px) {
          .ud-grid { grid-template-columns: 1fr; }
          .ud-sidebar { position: static; flex-direction: row; flex-wrap: wrap; }
          .ud-profile-card { flex: 1; min-width: 200px; }
          .ud-nav { flex: 1; min-width: 200px; flex-direction: row; flex-wrap: wrap; }
          .ud-detail-grid { grid-template-columns: 1fr; }
          .ud-docs-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ud">
        <div className="ud-grid">

          {/* ── Sidebar ── */}
          <aside className="ud-sidebar">
            <div className="ud-profile-card">
              <div className="ud-avatar">{avatarLetter}</div>
              <div className="ud-profile-name">
                {applications[0]?.name || user?.email?.split("@")[0] || "User"}
              </div>
              <div className="ud-profile-email">{user?.email}</div>
              <div className="ud-profile-divider" />
              <div className="ud-profile-stat">
                <span className="ud-profile-stat-label">Applications</span>
                <span className="ud-profile-stat-val">{applications.length}</span>
              </div>
              <div className="ud-profile-stat">
                <span className="ud-profile-stat-label">Documents</span>
                <span className="ud-profile-stat-val" style={{ color: "#60a5fa" }}>
                  {documents.length}
                </span>
              </div>
              <div className="ud-profile-stat">
                <span className="ud-profile-stat-label">Latest Status</span>
                <span className="ud-profile-stat-val" style={{ color: latestS?.color || "#334155" }}>
                  {latestS?.label || "—"}
                </span>
              </div>
              <div className="ud-profile-stat">
                <span className="ud-profile-stat-label">Member Since</span>
                <span className="ud-profile-stat-val">{fmt(user?.created_at)}</span>
              </div>
            </div>

            <div className="ud-nav">
              <button
                className={"ud-nav-item" + (activeTab === "applications" ? " active" : "")}
                onClick={() => setActiveTab("applications")}
              >
                <span>📋</span> My Applications
              </button>
              <button
                className={"ud-nav-item" + (activeTab === "documents" ? " active" : "")}
                onClick={() => setActiveTab("documents")}
              >
                <span>📁</span> My Documents
                {documents.length > 0 && (
                  <span className="ud-nav-badge">{documents.length}</span>
                )}
              </button>
              <button className="ud-nav-item" onClick={() => navigate("/Career")}>
                <span>🎯</span> Browse Internships
              </button>
              <button className="ud-nav-item" onClick={() => navigate("/")}>
                <span>🏠</span> Home
              </button>
              <button className="ud-logout-btn" onClick={handleLogout}>
                <span>↩</span> Logout
              </button>
            </div>
          </aside>

          {/* ── Main ── */}
          <main className="ud-main">
            {appsError && (
              <div style={{
                background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)",
                borderRadius: 14, padding: "14px 16px", color: "#fca5a5",
                fontFamily: "'DM Mono', monospace", fontSize: 12,
              }}>
                // could not load dashboard data
                <div style={{ marginTop: 8, color: "#f87171" }}>{appsError}</div>
              </div>
            )}

            {/* Welcome */}
            <div className="ud-welcome">
              <div>
                <div className="ud-welcome-greeting">// welcome back</div>
                <div className="ud-welcome-title">
                  Hello, {applications[0]?.name?.split(" ")[0] || user?.email?.split("@")[0]} 👋
                </div>
                <div className="ud-welcome-sub">
                  {applications.length === 0
                    ? "You haven't applied for any internship yet."
                    : `You have ${applications.length} application${applications.length > 1 ? "s" : ""} on record.`}
                </div>
              </div>
              {applications.length === 0 && (
                <button className="ud-apply-btn" onClick={() => navigate("/Career")}>
                  Apply Now →
                </button>
              )}
            </div>

            {/* Status banner */}
            {latestS && (
              <div
                className="ud-status-banner"
                style={{ "--color": latestS.color, "--color-dim": latestS.bg, "--glow": latestS.glow }}
              >
                <div className="ud-status-icon">
                  {latestStatus === "pending" && "⏳"}
                  {latestStatus === "shortlisted" && "⭐"}
                  {latestStatus === "selected" && "🎉"}
                  {latestStatus === "rejected" && "📩"}
                </div>
                <div>
                  <div className="ud-status-banner-label">Latest Application Status</div>
                  <div className="ud-status-banner-msg">{STATUS_MESSAGES[latestStatus]}</div>
                </div>
                <span className="ud-status-dot-badge" style={{ "--sbg": latestS.bg, "--sc": latestS.color }}>
                  <span className="ud-dot" />
                  {latestS.label}
                </span>
              </div>
            )}

            {/* ── APPLICATIONS TAB ── */}
            {activeTab === "applications" && (
              <>
                {applications.length === 0 ? (
                  <div className="ud-empty">
                    <div className="ud-empty-icon">📄</div>
                    <div className="ud-empty-text">// no applications found</div>
                    <button className="ud-apply-btn" onClick={() => navigate("/Career")}>
                      Browse Internships
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="ud-section-title">Applications</div>
                      {applications.map((app) => {
                        const s = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                        return (
                          <div
                            key={app.id}
                            className={"ud-app-card" + (activeApp?.id === app.id ? " active-card" : "")}
                            style={{ "--accent": s.color, "--accent-dim": s.bg }}
                            onClick={() => setActiveApp(app)}
                          >
                            <div className="ud-app-card-top">
                              <div>
                                <div className="ud-app-card-university">{app.university || "—"}</div>
                                <div className="ud-app-card-name">{app.name || "—"}</div>
                              </div>
                              <span className="ud-status-dot-badge" style={{ "--sbg": s.bg, "--sc": s.color }}>
                                <span className="ud-dot" />{s.label}
                              </span>
                            </div>
                            {app.skills && <div className="ud-app-card-skills">{app.skills}</div>}
                            <div className="ud-app-card-date">Applied {fmt(app.created_at)}</div>
                          </div>
                        );
                      })}
                    </div>

                    {activeApp && (() => {
                      const s = STATUS_CONFIG[activeApp.status] || STATUS_CONFIG.pending;
                      return (
                        <div className="ud-detail">
                          <div className="ud-section-title">Application Details</div>

                          {/* Timeline */}
                          <div className="ud-timeline">
                            {["pending", "shortlisted", "selected"].map((step, i) => {
                              const steps = ["pending", "shortlisted", "selected"];
                              const current = steps.indexOf(activeApp.status);
                              const isDone = activeApp.status === "rejected" ? false : i <= current;
                              return (
                                <div
                                  key={step}
                                  className="ud-tl-step"
                                  style={{
                                    "--dot-bg": isDone ? s.color : "#111827",
                                    "--dot-border": isDone ? s.color : "#1f2937",
                                    "--line-color": isDone && i < current ? s.color : "#111827",
                                    "--tl-label-color": isDone ? s.color : "#1e2d3d",
                                  }}
                                >
                                  <div className="ud-tl-dot">{isDone ? "✓" : ""}</div>
                                  <div className="ud-tl-label">{step === "pending" ? "Applied" : step}</div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="ud-detail-header">
                            <div>
                              <div className="ud-detail-title">{activeApp.name}</div>
                              <div className="ud-detail-sub">{activeApp.email}</div>
                            </div>
                            <span className="ud-status-dot-badge" style={{ "--sbg": s.bg, "--sc": s.color }}>
                              <span className="ud-dot" />{s.label}
                            </span>
                          </div>

                          <div className="ud-detail-grid">
                            {[
                              ["University", activeApp.university],
                              ["Degree",     activeApp.degree],
                              ["Year",       activeApp.year],
                              ["Phone",      activeApp.phone],
                              ["Skills",     activeApp.skills],
                              ["Applied On", fmt(activeApp.created_at)],
                            ].map(([label, val]) => (
                              <div key={label} className="ud-detail-field">
                                <div className="ud-detail-field-label">{label}</div>
                                <div className="ud-detail-field-val">{val || "—"}</div>
                              </div>
                            ))}
                          </div>

                          {activeApp.motivation && (
                            <div className="ud-detail-motivation">
                              <div className="ud-detail-motivation-label">Why this internship?</div>
                              <div className="ud-detail-motivation-text">{activeApp.motivation}</div>
                            </div>
                          )}

                          {activeApp.resume_url && (
                            <a href={activeApp.resume_url} target="_blank" rel="noopener noreferrer" className="ud-resume-btn">
                              ↗ View Resume (PDF)
                            </a>
                          )}
                        </div>
                      );
                    })()}
                  </>
                )}
              </>
            )}

            {/* ── DOCUMENTS TAB ── */}
            {activeTab === "documents" && (
              <div>
                <div className="ud-section-title">My Documents</div>
                {docsLoading ? (
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#334155", padding: "24px 0" }}>
                    Loading documents...
                  </div>
                ) : documents.length === 0 ? (
                  <div className="ud-docs-empty">
                    <div className="ud-docs-empty-icon">📁</div>
                    <div className="ud-docs-empty-text">
                      // no documents available yet
                      <span style={{ color: "#1a2535", display: "block", marginTop: 6 }}>
                        Documents will appear here once the admin generates them for you.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="ud-docs-grid">
                    {documents.map((doc) => {
                      const meta = DOC_META[doc.document_type] || {
                        label: doc.document_type?.replace(/_/g, " ") || "Document",
                        icon: "📄", color: "#94a3b8",
                        bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)",
                      };
                      return (
                        <div
                          key={doc.id}
                          className="ud-doc-card"
                          style={{ "--doc-color": meta.color, "--doc-bg": meta.bg, "--doc-border": meta.border }}
                        >
                          <div className="ud-doc-icon">{meta.icon}</div>
                          <div className="ud-doc-label">{meta.label}</div>
                          <div className="ud-doc-date">
                            {doc.created_at ? `Issued ${fmt(doc.created_at)}` : "Recently issued"}
                          </div>
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="ud-doc-download">
                            ↗ View &amp; Download
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
