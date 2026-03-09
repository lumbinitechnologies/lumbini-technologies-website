import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

export default function EmailVerified() {
  const navigate = useNavigate();

  const [status, setStatus] = useState("checking");
  const [dotsVisible, setDotsVisible] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/", { replace: true });
        return;
      }

      setStatus("verified");
      setTimeout(() => setDotsVisible(true), 100);
      setTimeout(() => setCardVisible(true), 300);
      setTimeout(() => navigate("/dashboard", { replace: true }), 3000);
    };

    verify();
  }, [navigate]);

  if (status === "checking") return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');

        @keyframes glitchBlink {
          0%, 94%, 100% { opacity: 1; text-shadow: 0 0 8px #facc15; }
          95%            { opacity: 0.2; text-shadow: 4px 0 #facc15; }
          97%            { opacity: 0.8; text-shadow: -3px 0 #facc15; }
        }

        @keyframes ev-pulse {
          0%, 100% { transform: scale(1);   opacity: 0.5; }
          50%       { transform: scale(1.28); opacity: 0; }
        }

        @keyframes scanBar {
          0%   { top: 0%; }
          100% { top: 100%; }
        }

        @keyframes dotBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.15; }
        }

        @keyframes countDown {
          from { width: 100%; }
          to   { width: 0%; }
        }

        .ev-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          padding: 8rem 1rem 4rem;
          background: transparent;
          font-family: 'Share Tech Mono', monospace;
        }

        .ev-card {
          background: rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(250, 204, 21, 0.18);
          border-radius: 20px;
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(250, 204, 21, 0.06) inset,
            0 0 40px rgba(250, 204, 21, 0.04);
          padding: 3rem 3.5rem;
          width: 100%;
          max-width: 480px;
          text-align: center;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .ev-card.ev-card--visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Dots ── */
        .ev-dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-bottom: 2rem;
          opacity: 0;
          transition: opacity 0.4s ease 0.2s;
        }

        .ev-dots--visible { opacity: 1; }

        .ev-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #facc15;
          animation: dotBlink 1.4s ease-in-out infinite;
        }

        .ev-dot:nth-child(2) { opacity: 0.5; animation-delay: 0.2s; }
        .ev-dot:nth-child(3) { opacity: 0.25; animation-delay: 0.4s; }

        /* ── Icon ── */
        .ev-icon-wrap {
          position: relative;
          width: 72px; height: 72px;
          margin: 0 auto 1.75rem;
        }

        .ev-ring {
          width: 72px; height: 72px;
          border-radius: 50%;
          border: 2px solid rgba(250, 204, 21, 0.3);
          position: absolute; inset: 0;
          animation: ev-pulse 2.2s ease-in-out infinite;
        }

        .ev-ring-inner {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: rgba(250, 204, 21, 0.07);
          border: 2px solid rgba(250, 204, 21, 0.6);
          display: flex; align-items: center; justify-content: center;
          position: relative; z-index: 1;
          overflow: hidden;
        }

        /* scan line inside ring */
        .ev-ring-inner::after {
          content: '';
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(250,204,21,0.6), transparent);
          animation: scanBar 1.8s linear infinite;
        }

        .ev-check {
          font-size: 1.8rem; line-height: 1;
          color: #facc15;
          text-shadow: 0 0 16px rgba(250,204,21,0.7);
          opacity: 0;
          transform: scale(0.5);
          transition: opacity 0.4s ease 0.6s, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s;
          position: relative; z-index: 2;
        }

        .ev-card--visible .ev-check { opacity: 1; transform: scale(1); }

        /* ── Text ── */
        .ev-tag {
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          color: rgba(250, 204, 21, 0.55);
          text-transform: uppercase;
          margin-bottom: 0.5rem;
          opacity: 0;
          transition: opacity 0.4s ease 0.5s;
          font-family: 'Share Tech Mono', monospace;
        }

        .ev-card--visible .ev-tag { opacity: 1; }

        .ev-title {
          font-size: 1.7rem;
          font-weight: 900;
          color: #facc15;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin: 0 0 0.75rem;
          font-family: 'Orbitron', monospace;
          text-shadow: 0 0 20px rgba(250,204,21,0.4), 0 0 40px rgba(250,204,21,0.15);
          animation: glitchBlink 5s infinite;
          opacity: 0;
          transition: opacity 0.4s ease 0.65s;
        }

        .ev-card--visible .ev-title { opacity: 1; }

        .ev-body {
          font-size: 0.76rem;
          color: rgba(250, 204, 21, 0.45);
          line-height: 1.75;
          margin-bottom: 2rem;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.03em;
          opacity: 0;
          transition: opacity 0.4s ease 0.75s;
        }

        .ev-card--visible .ev-body { opacity: 1; }

        /* ── Countdown bar ── */
        .ev-countdown-wrap {
          margin-bottom: 1.5rem;
          opacity: 0;
          transition: opacity 0.4s ease 0.82s;
        }

        .ev-card--visible .ev-countdown-wrap { opacity: 1; }

        .ev-countdown-label {
          font-size: 0.65rem;
          color: rgba(250, 204, 21, 0.35);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 0.45rem;
          font-family: 'Share Tech Mono', monospace;
        }

        .ev-countdown-track {
          height: 2px;
          background: rgba(250, 204, 21, 0.12);
          border-radius: 2px;
          overflow: hidden;
        }

        .ev-countdown-bar {
          height: 100%;
          background: linear-gradient(90deg, #facc15, rgba(250,204,21,0.4));
          border-radius: 2px;
          animation: countDown 3s linear forwards;
          animation-delay: 0.5s;
          width: 100%;
          box-shadow: 0 0 8px rgba(250,204,21,0.5);
        }

        /* ── Divider ── */
        .ev-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(250, 204, 21, 0.25), transparent);
          margin-bottom: 1.5rem;
          opacity: 0;
          transition: opacity 0.4s ease 0.88s;
        }

        .ev-card--visible .ev-divider { opacity: 1; }

        /* ── Button ── */
        .ev-btn {
          display: inline-block;
          width: 100%;
          padding: 13px 0;
          background: #facc15;
          color: #000;
          font-family: 'Orbitron', monospace;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          text-decoration: none;
          opacity: 0;
          transition:
            background 0.25s ease,
            transform 0.2s ease,
            box-shadow 0.25s ease,
            opacity 0.4s ease 0.95s;
          box-sizing: border-box;
        }

        .ev-card--visible .ev-btn { opacity: 1; }

        .ev-btn:hover {
          background: #fde047;
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(250, 204, 21, 0.45), 0 0 40px rgba(250,204,21,0.15);
        }

        .ev-btn:active { transform: translateY(0); box-shadow: none; }

        /* ── Footer hint ── */
        .ev-tab-hint {
          margin-top: 1.25rem;
          font-size: 0.7rem;
          color: rgba(250, 204, 21, 0.25);
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.05em;
        }

        .ev-tab-btn {
          background: none; border: none;
          color: rgba(250, 204, 21, 0.45);
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem; cursor: pointer; padding: 0;
          text-decoration: underline;
          text-decoration-color: rgba(250,204,21,0.25);
          text-underline-offset: 2px;
          transition: color 0.2s ease;
        }

        .ev-tab-btn:hover { color: #facc15; }

        @media (max-width: 540px) {
          .ev-card { padding: 2.25rem 1.75rem; }
          .ev-title { font-size: 1.3rem; }
        }
      `}</style>

      <div className="ev-container">
        <div className={`ev-card${cardVisible ? " ev-card--visible" : ""}`}>

          <div className={`ev-dots${dotsVisible ? " ev-dots--visible" : ""}`}>
            <div className="ev-dot" />
            <div className="ev-dot" />
            <div className="ev-dot" />
          </div>

          <div className="ev-icon-wrap">
            <div className="ev-ring" />
            <div className="ev-ring-inner">
              <span className="ev-check">✓</span>
            </div>
          </div>

          <p className="ev-tag">// verification complete</p>
          <h2 className="ev-title">ACCESS GRANTED</h2>

          <p className="ev-body">
            Identity confirmed. Credentials accepted.<br />
            Redirecting to dashboard in 3 seconds...
          </p>

          <div className="ev-countdown-wrap">
            <div className="ev-countdown-label">// redirecting</div>
            <div className="ev-countdown-track">
              <div className="ev-countdown-bar" />
            </div>
          </div>

          <div className="ev-divider" />

          <Link to="/dashboard" className="ev-btn">
            GO TO DASHBOARD
          </Link>

          <p className="ev-tab-hint">
            opened from email?{" "}
            <button className="ev-tab-btn" onClick={() => window.close()}>
              close this tab
            </button>
          </p>

        </div>
      </div>
    </>
  );
}