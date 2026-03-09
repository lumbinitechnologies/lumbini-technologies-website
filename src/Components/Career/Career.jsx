import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, Coffee, Award, Users } from "lucide-react";
import { supabase } from "../../services/supabase";

const Career = () => {
  const navigate = useNavigate();

  const handleApply = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      navigate("/Login?redirect=/internship-application");
    } else {
      navigate("/internship-application");
    }
  };

  const internship = {
    id: 1,
    title: "Student Internship Application",
    description: `We're currently accepting applications for student internships. If you're passionate about learning and building real-world projects with us, submit your application using the form.`,
  };

  const benefits = [
    {
      icon: <Heart size={32} />,
      title: "Health & Wellness",
      description: "Comprehensive health insurance, mental health support, and wellness programs for you and your family",
      accent: "#facc15",
      tag: "WELFARE.EXE",
    },
    {
      icon: <Coffee size={32} />,
      title: "Work-Life Balance",
      description: "Flexible working hours, remote work options, unlimited PTO, and a supportive work environment",
      accent: "#39ff14",
      tag: "BALANCE.SYS",
    },
    {
      icon: <Award size={32} />,
      title: "Growth & Learning",
      description: "Learning budget, conference attendance, certification support, and clear career development paths",
      accent: "#ffffff",
      tag: "UPGRADE.EXE",
    },
    {
      icon: <Users size={32} />,
      title: "Great Culture",
      description: "Collaborative environment, team events, innovation time, and work with amazing colleagues",
      accent: "#facc15",
      tag: "NETWORK.SYS",
    },
  ];

  const stats = [
    { number: "20+", label: "Team Members", color: "#facc15" },
    { number: "1", label: "Active Internship", color: "#39ff14" },
    { number: "VJA", label: "Current Workspace", color: "#ffffff" },
    { number: "BLR", label: "Coming Soon", color: "#facc15" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');

        /* ── Keyframes ── */
        @keyframes glitchBlink {
          0%, 93%, 100% { opacity:1; text-shadow: 0 0 12px #facc15; }
          94%            { opacity:0.2; text-shadow: 4px 0 #facc15; }
          97%            { opacity:0.8; text-shadow: -3px 0 #facc15; }
        }

        @keyframes greenGlitch {
          0%, 93%, 100% { opacity:1; text-shadow: 0 0 12px #39ff14; }
          94%            { opacity:0.2; text-shadow: 4px 0 #39ff14; }
          97%            { opacity:0.8; text-shadow: -3px 0 #39ff14; }
        }

        @keyframes matrixRain {
          0%   { background-position: 0 0; }
          100% { background-position: 0 200px; }
        }

        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        @keyframes borderPulse {
          0%, 100% { box-shadow: 0 0 0 1px rgba(250,204,21,0.2), 0 0 16px rgba(250,204,21,0.05); }
          50%       { box-shadow: 0 0 0 1px rgba(250,204,21,0.5), 0 0 32px rgba(250,204,21,0.12); }
        }

        @keyframes greenBorderPulse {
          0%, 100% { box-shadow: 0 0 0 1px rgba(57,255,20,0.2), 0 0 16px rgba(57,255,20,0.05); }
          50%       { box-shadow: 0 0 0 1px rgba(57,255,20,0.45), 0 0 28px rgba(57,255,20,0.12); }
        }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }

        @keyframes terminalCursor {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        @keyframes countBarFill {
          from { width: 0%; }
          to   { width: 100%; }
        }

        /* ── Base ── */
        .career-page {
          min-height: 100vh;
          background: #050505;
          color: #fff;
          font-family: 'Share Tech Mono', monospace;
          overflow-x: hidden;
          position: relative;
        }

        /* Subtle scanline overlay */
        .career-page::before {
          content: '';
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, rgba(57,255,20,0.25), transparent);
          animation: scanline 6s linear infinite;
          pointer-events: none;
          z-index: 100;
        }

        /* ── Hero ── */
        .hero-section {
          position: relative;
          padding: clamp(5rem, 10vw, 8rem) clamp(1rem, 5vw, 3rem) clamp(3rem, 6vw, 5rem);
          background:
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(250,204,21,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 80% 80%, rgba(57,255,20,0.04) 0%, transparent 60%),
            #050505;
          border-bottom: 1px solid rgba(250,204,21,0.12);
        }

        .hero-content { max-width: 64rem; margin: 0 auto; text-align: center; }

        /* Terminal top bar */
        .terminal-bar {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(57,255,20,0.06);
          border: 1px solid rgba(57,255,20,0.25);
          border-radius: 4px;
          padding: 0.35rem 0.85rem;
          margin-bottom: 2rem;
          font-size: 0.7rem;
          color: #39ff14;
          letter-spacing: 0.12em;
        }

        .terminal-dot {
          width: 7px; height: 7px; border-radius: 50%;
        }

        .dot-red   { background: #ff5f57; }
        .dot-yellow{ background: #facc15; }
        .dot-green { background: #39ff14; }

        .terminal-cursor {
          display: inline-block;
          width: 8px; height: 13px;
          background: #39ff14;
          margin-left: 2px;
          animation: terminalCursor 1s step-end infinite;
          vertical-align: middle;
        }

        .hero-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(1.7rem, 5vw, 3.5rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 1rem;
          color: #ffffff;
          letter-spacing: 2px;
          animation: glitchBlink 7s infinite;
        }

        .text-yellow { color: #facc15; text-shadow: 0 0 20px rgba(250,204,21,0.5); }
        .text-green  { color: #39ff14; text-shadow: 0 0 16px rgba(57,255,20,0.5); }

        .hero-subtitle {
          font-size: clamp(0.8rem, 1.6vw, 1rem);
          color: rgba(255,255,255,0.45);
          margin-bottom: 2.5rem;
          letter-spacing: 0.08em;
          line-height: 1.7;
        }

        /* Stats */
        .hero-stats {
          display: flex; flex-wrap: wrap; gap: 1rem;
          justify-content: center; margin-bottom: 2rem;
        }

        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 1.2rem 1.5rem;
          min-width: 120px; text-align: center;
          transition: all 0.3s ease;
          position: relative; overflow: hidden;
        }

        .stat-card::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px;
          background: var(--stat-color, #facc15);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .stat-card:hover { transform: translateY(-4px); border-color: var(--stat-color, #facc15); }
        .stat-card:hover::after { transform: scaleX(1); }

        .stat-number {
          display: block;
          font-family: 'Orbitron', monospace;
          font-size: clamp(1.3rem, 3vw, 1.8rem);
          font-weight: 900;
          color: var(--stat-color, #facc15);
          text-shadow: 0 0 16px var(--stat-color, rgba(250,204,21,0.5));
          line-height: 1;
        }

        .stat-label {
          font-size: 0.65rem; color: rgba(255,255,255,0.4);
          margin-top: 0.4rem; letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* Info banner */
        .info-banner {
          background: rgba(57,255,20,0.04);
          border: 1px solid rgba(57,255,20,0.2);
          border-left: 3px solid #39ff14;
          border-radius: 6px;
          padding: 0.85rem 1.1rem;
          text-align: left;
        }

        .info-banner-label {
          font-size: 0.62rem; color: #39ff14;
          letter-spacing: 0.2em; text-transform: uppercase;
          margin-bottom: 0.35rem;
        }

        .info-text {
          margin: 0; color: rgba(255,255,255,0.55);
          font-size: clamp(0.72rem, 1.2vw, 0.82rem);
          line-height: 1.7;
        }

        .info-text strong { color: rgba(255,255,255,0.85); font-weight: 600; }

        /* ── Benefits ── */
        .benefits-section {
          padding: clamp(3rem, 7vw, 5rem) clamp(1rem, 5vw, 3rem);
          background:
            radial-gradient(ellipse 60% 50% at 10% 50%, rgba(57,255,20,0.03) 0%, transparent 60%),
            #080808;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .section-container { max-width: 72rem; margin: 0 auto; }

        .section-header {
          text-align: center;
          margin-bottom: clamp(2rem, 5vw, 3.5rem);
        }

        .section-tag {
          font-size: 0.65rem; color: #39ff14;
          letter-spacing: 0.2em; text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .section-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(1.2rem, 3vw, 1.8rem);
          font-weight: 900; color: #fff;
          letter-spacing: 2px; text-transform: uppercase;
          margin: 0;
        }

        .benefits-grid {
          display: grid;
          gap: 1.25rem;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }

        .benefit-card {
          background: rgba(255,255,255,0.02);
          border-radius: 10px;
          padding: 1.75rem 1.5rem;
          text-align: center;
          position: relative; overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid rgba(255,255,255,0.07);
        }

        .benefit-card.yellow-card { animation: borderPulse 4s ease-in-out infinite; }
        .benefit-card.green-card  { animation: greenBorderPulse 4s ease-in-out infinite; }
        .benefit-card.white-card  {
          animation: none;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.1);
        }

        .benefit-card:hover {
          transform: translateY(-6px);
        }

        .benefit-card.yellow-card:hover { border-color: rgba(250,204,21,0.5); box-shadow: 0 8px 32px rgba(250,204,21,0.1); }
        .benefit-card.green-card:hover  { border-color: rgba(57,255,20,0.5);  box-shadow: 0 8px 32px rgba(57,255,20,0.1); }
        .benefit-card.white-card:hover  { border-color: rgba(255,255,255,0.3); box-shadow: 0 8px 32px rgba(255,255,255,0.06); }

        /* top accent line */
        .benefit-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--card-accent, #facc15);
          opacity: 0.6;
        }

        .benefit-tag {
          font-size: 0.58rem; letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--card-accent, #facc15);
          margin-bottom: 1rem; opacity: 0.7;
        }

        .benefit-icon {
          color: var(--card-accent, #facc15);
          margin-bottom: 1rem;
          display: flex; justify-content: center;
          filter: drop-shadow(0 0 8px var(--card-accent, rgba(250,204,21,0.5)));
        }

        .benefit-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(0.75rem, 1.4vw, 0.9rem);
          font-weight: 700; color: #fff;
          margin-bottom: 0.75rem; letter-spacing: 1px;
          text-transform: uppercase;
        }

        .benefit-description {
          color: rgba(255,255,255,0.4);
          font-size: clamp(0.7rem, 1.1vw, 0.78rem);
          line-height: 1.65;
        }

        /* ── Jobs Section ── */
        .jobs-section {
          padding: clamp(3rem, 7vw, 5rem) clamp(1rem, 5vw, 3rem);
          background:
            radial-gradient(ellipse 60% 50% at 90% 50%, rgba(250,204,21,0.04) 0%, transparent 60%),
            #050505;
        }

        .jobs-grid {
          display: grid; gap: 1.25rem;
          grid-template-columns: 1fr; margin-top: 1rem;
        }

        .job-card {
          background: rgba(250,204,21,0.03);
          border: 1px solid rgba(250,204,21,0.2);
          border-radius: 10px;
          padding: clamp(1.2rem, 2.5vw, 1.75rem);
          position: relative; overflow: hidden;
          transition: all 0.3s ease;
          animation: borderPulse 4s ease-in-out infinite;
        }

        .job-card:hover {
          border-color: rgba(250,204,21,0.5);
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(250,204,21,0.1);
        }

        /* Matrix green corner accent */
        .job-card::after {
          content: '';
          position: absolute; top: 0; right: 0;
          width: 60px; height: 60px;
          background: radial-gradient(circle at top right, rgba(57,255,20,0.08), transparent 70%);
          pointer-events: none;
        }

        .job-card-top {
          display: flex; align-items: center; gap: 0.6rem;
          margin-bottom: 0.5rem;
        }

        .job-status-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #39ff14;
          box-shadow: 0 0 8px #39ff14;
          animation: terminalCursor 1.5s ease-in-out infinite;
          flex-shrink: 0;
        }

        .job-status-label {
          font-size: 0.62rem; color: #39ff14;
          letter-spacing: 0.18em; text-transform: uppercase;
        }

        .job-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(1rem, 2vw, 1.2rem);
          font-weight: 700; color: #fff;
          margin-bottom: 0.75rem; letter-spacing: 1px;
          text-transform: uppercase;
        }

        .job-description {
          color: rgba(255,255,255,0.45);
          font-size: clamp(0.72rem, 1.2vw, 0.8rem);
          line-height: 1.75; margin-bottom: 1.25rem;
        }

        .job-divider {
          height: 1px;
          background: linear-gradient(90deg, rgba(250,204,21,0.25), rgba(57,255,20,0.15), transparent);
          margin-bottom: 1.25rem;
        }

        .modal-actions { display: flex; gap: 1rem; }

        .btn-primary {
          padding: 0.65rem 2rem;
          background: #facc15; color: #000;
          font-family: 'Orbitron', monospace;
          font-size: 0.78rem; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          border: none; border-radius: 6px; cursor: pointer;
          transition: all 0.25s ease;
        }

        .btn-primary:hover {
          background: #fde047;
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(250,204,21,0.4);
        }

        .btn-primary:active { transform: translateY(0); }

        /* ── Responsive ── */
        @media (max-width: 480px) {
          .hero-stats { flex-direction: column; align-items: center; }
          .stat-card { width: 100%; max-width: 220px; }
          .modal-actions { flex-direction: column; }
          .benefits-grid { grid-template-columns: 1fr; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="career-page">

        {/* ── Hero ── */}
        <section className="hero-section">
          <div className="hero-content">

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="terminal-bar"
            >
              <span className="terminal-dot dot-red" />
              <span className="terminal-dot dot-yellow" />
              <span className="terminal-dot dot-green" />
              &nbsp;CAREER_PORTAL.EXE — ACTIVE SESSION
              <span className="terminal-cursor" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="hero-title"
            >
              JOIN OUR{" "}
              <span className="text-yellow">INNOVATION</span>{" "}
              <span className="text-green">JOURNEY</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hero-subtitle"
            >
              // build the future with cutting-edge technology and an exceptional team
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="hero-stats"
            >
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="stat-card"
                  style={{ "--stat-color": s.color }}
                >
                  <span className="stat-number">{s.number}</span>
                  <p className="stat-label">{s.label}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="info-banner"
            >
              <div className="info-banner-label">// sys.info</div>
              <p className="info-text">
                We are currently offering{" "}
                <strong>internships for students</strong> only. Our team has{" "}
                <strong>20+ members</strong>. One workspace is active in{" "}
                <strong>Vijayawada</strong>, and another is{" "}
                <strong>coming soon in Bangalore</strong>.
              </p>
            </motion.div>

          </div>
        </section>

        {/* ── Benefits ── */}
        <section className="benefits-section">
          <div className="section-container">

            <div className="section-header">
              <p className="section-tag">// benefits.sys — loaded</p>
              <h2 className="section-title">WHY WORK WITH US?</h2>
            </div>

            <div className="benefits-grid">
              {benefits.map((benefit, index) => {
                const cardClass =
                  benefit.accent === "#facc15" ? "yellow-card" :
                  benefit.accent === "#39ff14" ? "green-card"  : "white-card";
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className={`benefit-card ${cardClass}`}
                    style={{ "--card-accent": benefit.accent }}
                  >
                    <div className="benefit-tag">{benefit.tag}</div>
                    <div className="benefit-icon">{benefit.icon}</div>
                    <h3 className="benefit-title">{benefit.title}</h3>
                    <p className="benefit-description">{benefit.description}</p>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </section>

        {/* ── Internship ── */}
        <section className="jobs-section">
          <div className="section-container">

            <div className="section-header">
              <p className="section-tag">// openings.exe — 1 active</p>
              <h2 className="section-title">INTERNSHIP APPLICATION</h2>
            </div>

            <div className="jobs-grid">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="job-card">
                  <div className="job-card-top">
                    <span className="job-status-dot" />
                    <span className="job-status-label">OPEN — ACCEPTING APPLICATIONS</span>
                  </div>

                  <h3 className="job-title">{internship.title}</h3>
                  <p className="job-description">{internship.description}</p>

                  <div className="job-divider" />

                  <div className="modal-actions">
                    <button onClick={handleApply} className="btn-primary">
                      APPLY NOW
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </section>

      </div>
    </>
  );
};

export default Career;