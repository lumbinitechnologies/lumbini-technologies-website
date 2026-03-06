import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";
import useAuthGuard from "../hooks/useAuthGuard";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "#6b7280", bg: "rgba(107,114,128,0.12)" },
  shortlisted: {
    label: "Shortlisted",
    color: "#facc15",
    bg: "rgba(250,204,21,0.12)",
  },
  selected: {
    label: "Selected",
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
  },
  rejected: {
    label: "Rejected",
    color: "#f87171",
    bg: "rgba(248,113,113,0.12)",
  },
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [appsError, setAppsError] = useState(null);
  const navigate = useNavigate();

  // ✅ useAuthGuard handles auth check — no more manual getUser() + navigate("/Login")
  const { user, loading: authLoading } = useAuthGuard();

  // Only fetch once we have a confirmed user
  useEffect(() => {
    if (!user) return;
    setAppsLoading(true);
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    setAppsError(null);
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("email", user.email)
      .order("created_at", { ascending: false });

    if (error) {
      setApplications([]);
      setAppsError(error.message || "Failed to load applications.");
    } else {
      setApplications(data || []);
    }
    setAppsLoading(false);
  };

  const fmt = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  const loading = authLoading || appsLoading;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Syne:wght@400;600;700;800&display=swap');

        .myapp-page {
          min-height: 100vh;
          background: #000;
          color: #e2e8f0;
          font-family: 'Syne', sans-serif;
          padding: clamp(6rem, 12vw, 9rem) clamp(1rem, 5vw, 3rem) 4rem;
        }

        .myapp-header {
          max-width: 900px;
          margin: 0 auto 2.5rem;
        }

        .myapp-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: #475569;
          font-size: 13px;
          font-family: 'Syne', sans-serif;
          cursor: pointer;
          padding: 0;
          margin-bottom: 1.5rem;
          transition: color 0.2s;
        }

        .myapp-back-btn:hover { color: #facc15; }

        .myapp-title {
          font-size: clamp(1.6rem, 4vw, 2.2rem);
          font-weight: 800;
          color: #fff;
          margin-bottom: 0.4rem;
        }

        .myapp-title span { color: #facc15; }

        .myapp-subtitle {
          color: #475569;
          font-size: 0.9rem;
          font-family: 'JetBrains Mono', monospace;
        }

        .myapp-loading {
          max-width: 900px;
          margin: 4rem auto;
          text-align: center;
          color: #facc15;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          animation: flicker 1.2s infinite;
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }

        .myapp-empty {
          max-width: 900px;
          margin: 0 auto;
          background: #0a0f1a;
          border: 1px dashed #1f2937;
          border-radius: 16px;
          padding: 4rem 2rem;
          text-align: center;
        }

        .myapp-empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.3;
        }

        .myapp-empty-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #334155;
          margin-bottom: 0.5rem;
        }

        .myapp-empty-text {
          font-size: 0.85rem;
          color: #1e2d3d;
          font-family: 'JetBrains Mono', monospace;
          margin-bottom: 1.5rem;
        }

        .myapp-apply-btn {
          display: inline-block;
          padding: 10px 24px;
          background: #facc15;
          color: #000;
          font-weight: 700;
          font-size: 0.9rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Syne', sans-serif;
        }

        .myapp-apply-btn:hover {
          background: #fde047;
          transform: translateY(-1px);
        }

        .myapp-list {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .myapp-card {
          background: #0a0f1a;
          border: 1px solid #0f1923;
          border-radius: 14px;
          padding: 20px 24px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          align-items: start;
          transition: border-color 0.2s, background 0.2s;
          position: relative;
          overflow: hidden;
        }

        .myapp-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: var(--accent);
          opacity: 0.6;
        }

        .myapp-card:hover {
          border-color: #1a2535;
          background: #0d1420;
        }

        .myapp-card-left { min-width: 0; }

        .myapp-card-university {
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 6px;
        }

        .myapp-card-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 8px;
        }

        .myapp-card-skills {
          font-size: 12px;
          color: #475569;
          font-family: 'JetBrains Mono', monospace;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 500px;
          margin-bottom: 10px;
        }

        .myapp-card-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .myapp-card-date {
          font-size: 12px;
          color: #334155;
          font-family: 'JetBrains Mono', monospace;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .myapp-card-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          flex-shrink: 0;
        }

        .myapp-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
          background: var(--sbg);
          color: var(--sc);
          white-space: nowrap;
        }

        .myapp-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--sc);
        }

        .myapp-resume-link {
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          color: #334155;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: color 0.2s;
        }

        .myapp-resume-link:hover { color: #facc15; }

        .myapp-status-msg {
          margin-top: 8px;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-family: 'JetBrains Mono', monospace;
          background: var(--msgbg);
          color: var(--msgc);
          border: 1px solid var(--msgborder);
        }

        @media (max-width: 600px) {
          .myapp-card { grid-template-columns: 1fr; }
          .myapp-card-right { flex-direction: row; align-items: center; }
        }
      `}</style>

      <div className="myapp-page">
        <div className="myapp-header">
          <button className="myapp-back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1 className="myapp-title">
            My <span>Applications</span>
          </h1>
          <p className="myapp-subtitle">
            // {applications.length} application
            {applications.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {appsError && !loading && (
          <div
            style={{
              maxWidth: 900,
              margin: "0 auto 18px",
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: 14,
              padding: "14px 16px",
              color: "#fca5a5",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
            }}
          >
            // could not load applications
            <div style={{ marginTop: 8, color: "#f87171" }}>{appsError}</div>
          </div>
        )}

        {loading ? (
          <div className="myapp-loading">Loading your applications...</div>
        ) : applications.length === 0 ? (
          <div className="myapp-empty">
            <div className="myapp-empty-icon">📄</div>
            <div className="myapp-empty-title">No applications yet</div>
            <div className="myapp-empty-text">
              // You haven't applied for any internships
            </div>
            <button
              className="myapp-apply-btn"
              onClick={() => navigate("/Career")}
            >
              Browse Internships
            </button>
          </div>
        ) : (
          <div className="myapp-list">
            {applications.map((app) => {
              const s = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
              const messages = {
                pending: {
                  text: "Your application is under review.",
                  bg: "rgba(107,114,128,0.06)",
                  c: "#475569",
                  border: "#1f2937",
                },
                shortlisted: {
                  text: "Congratulations! You have been shortlisted.",
                  bg: "rgba(250,204,21,0.06)",
                  c: "#facc15",
                  border: "rgba(250,204,21,0.2)",
                },
                selected: {
                  text: "You have been selected! We will contact you.",
                  bg: "rgba(52,211,153,0.06)",
                  c: "#34d399",
                  border: "rgba(52,211,153,0.2)",
                },
                rejected: {
                  text: "Unfortunately, you were not selected this time.",
                  bg: "rgba(248,113,113,0.06)",
                  c: "#f87171",
                  border: "rgba(248,113,113,0.2)",
                },
              };
              const msg = messages[app.status] || messages.pending;

              return (
                <div
                  key={app.id}
                  className="myapp-card"
                  style={{ "--accent": s.color }}
                >
                  <div className="myapp-card-left">
                    <div className="myapp-card-university">
                      {app.university || "—"}
                    </div>
                    <div className="myapp-card-name">{app.name || "—"}</div>
                    {app.skills && (
                      <div className="myapp-card-skills">
                        Skills: {app.skills}
                      </div>
                    )}
                    <div className="myapp-card-meta">
                      <span className="myapp-card-date">
                        📅 Applied {fmt(app.created_at)}
                      </span>
                    </div>
                    <div
                      className="myapp-status-msg"
                      style={{
                        "--msgbg": msg.bg,
                        "--msgc": msg.c,
                        "--msgborder": msg.border,
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>

                  <div className="myapp-card-right">
                    <span
                      className="myapp-status-badge"
                      style={{ "--sbg": s.bg, "--sc": s.color }}
                    >
                      <span className="myapp-status-dot" />
                      {s.label}
                    </span>
                    {app.resume_url && (
                      <a
                        href={app.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="myapp-resume-link"
                      >
                        ↗ Resume
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default MyApplications;
