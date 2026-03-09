import React, { useState, useEffect } from "react";

/* ─────────────────────────────────────────
   REDACTED GHOST LINES — rotate in the
   terminal bar like the system is watching
───────────────────────────────────────── */
const GHOST_LINES = [
  "// certain data points are classified.",
  "// some collection methods are not disclosed here.",
  "// [REDACTED] — clearance level insufficient.",
  "// you have been logged accessing this document.",
  "// document access timestamp recorded.",
  "// this policy is monitored for compliance.",
  "// the void retains what it collects.",
  "// we know more than this document states.",
  "// your session id has been stored.",
  "// passive data collection is ongoing.",
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes terminalCursor {
    0%, 100% { opacity: 1; } 50% { opacity: 0; }
  }
  @keyframes glitchBlink {
    0%, 93%, 100% { opacity:1; text-shadow: 0 0 10px #facc15; }
    94%  { opacity:0.1; text-shadow: 7px 0 #facc15; }
    97%  { opacity:0.7; text-shadow: -5px 0 #facc15; }
  }
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes ghostIn {
    from { opacity:0; transform:translateX(-8px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes ghostOut {
    from { opacity:1; transform:translateX(0); }
    to   { opacity:0; transform:translateX(6px); }
  }
  @keyframes redactedPulse {
    0%,100% { background: rgba(248,113,113,0.18); }
    50%     { background: rgba(248,113,113,0.3); }
  }
  @keyframes warningPulse {
    0%,100% { opacity:0.5; }
    50%     { opacity:1; text-shadow: 0 0 8px #39ff14; }
  }
  @keyframes warningBlink {
    0%,100% { border-color: rgba(248,113,113,0.2); }
    50%     { border-color: rgba(248,113,113,0.5); box-shadow: 0 0 16px rgba(248,113,113,0.05); }
  }
  @keyframes sectionIn {
    from { opacity:0; transform: translateY(8px); }
    to   { opacity:1; transform: translateY(0); }
  }

  /* ─── PAGE ─── */
  .pp-page {
    min-height: 100vh;
    background: #040404;
    color: #e2e8f0;
    font-family: 'Share Tech Mono', monospace;
    padding: clamp(5rem,10vw,8rem) clamp(0.75rem,4vw,2.5rem) clamp(3rem,6vw,5rem);
    position: relative; overflow-x: hidden;
  }
  .pp-page::before {
    content:''; position:fixed; top:0; left:0; right:0; height:2px;
    background: linear-gradient(90deg, transparent, rgba(57,255,20,0.35), transparent);
    animation: scanline 5s linear infinite;
    pointer-events:none; z-index:200;
  }
  .pp-page::after {
    content:''; position:fixed; inset:0;
    background-image:
      linear-gradient(rgba(57,255,20,0.01) 1px, transparent 1px),
      linear-gradient(90deg, rgba(57,255,20,0.01) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events:none; z-index:0;
  }
  .pp-inner {
    position:relative; z-index:1;
    max-width:820px; margin:0 auto; width:100%;
  }

  /* ─── TERMINAL BAR ─── */
  .pp-tbar {
    display:flex; align-items:center; gap:6px;
    background: rgba(57,255,20,0.03);
    border:1px solid rgba(57,255,20,0.14); border-bottom:none;
    border-radius:8px 8px 0 0;
    padding:0.42rem clamp(0.6rem,2vw,1rem);
    font-size: clamp(0.5rem,1.2vw,0.6rem);
    letter-spacing:0.12em; color:#39ff14;
    overflow:hidden;
  }
  .pp-tbar-dots { display:flex; gap:5px; flex-shrink:0; }
  .pp-tbar-dot  { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
  .pp-tbar-title {
    flex:1; min-width:0;
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
    padding-left:4px;
  }
  .pp-tbar-path {
    margin-left:auto; opacity:0.3;
    font-size:clamp(0.45rem,1vw,0.55rem);
    white-space:nowrap; flex-shrink:0;
  }
  .pp-cursor {
    display:inline-block; width:6px; height:11px;
    background:#39ff14; margin-left:3px;
    animation:terminalCursor 1s step-end infinite;
    vertical-align:middle; flex-shrink:0;
  }

  /* ─── GHOST BAR ─── */
  .pp-ghost {
    min-height:24px;
    font-size:clamp(0.52rem,1.2vw,0.6rem);
    color:rgba(57,255,20,0.4); letter-spacing:0.08em;
    font-style:italic;
    padding:0.32rem clamp(0.6rem,2vw,1rem);
    background:rgba(57,255,20,0.015);
    border-left:1px solid rgba(57,255,20,0.1);
    border-right:1px solid rgba(57,255,20,0.1);
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }

  /* ─── HEADER ─── */
  .pp-header {
    background:rgba(4,4,4,0.98);
    border:1px solid rgba(250,204,21,0.14); border-top:none;
    padding:clamp(1.4rem,4vw,2.5rem) clamp(1rem,4vw,2.5rem) clamp(1rem,3vw,1.75rem);
    position:relative; overflow:hidden;
  }
  .pp-header::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,#facc15,rgba(57,255,20,0.6),transparent);
    opacity:0.4;
  }
  .pp-header::after {
    content:''; position:absolute; bottom:-50px; right:-50px;
    width:220px; height:220px; border-radius:50%;
    background:radial-gradient(circle,rgba(250,204,21,0.04),transparent 70%);
    pointer-events:none;
  }
  .pp-header-tag {
    font-size:clamp(0.5rem,1.2vw,0.58rem); color:#39ff14;
    letter-spacing:0.18em; text-transform:uppercase;
    margin-bottom:8px; animation:warningPulse 3s ease-in-out infinite;
  }
  .pp-title {
    font-family:'Orbitron',monospace;
    font-size:clamp(1.1rem,5vw,2.2rem);
    font-weight:900; color:#fff;
    letter-spacing:clamp(1px,0.4vw,3px);
    text-transform:uppercase; line-height:1.2;
    animation:glitchBlink 9s infinite;
    margin-bottom:10px; word-break:break-word;
  }
  .pp-title .yellow { color:#facc15; text-shadow:0 0 22px rgba(250,204,21,0.4); }

  .pp-meta {
    display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-top:10px;
  }
  .pp-meta-date {
    font-size:clamp(0.56rem,1.3vw,0.64rem);
    color:rgba(255,255,255,0.25); letter-spacing:0.07em;
  }
  .pp-badge {
    display:inline-flex; align-items:center; gap:4px;
    padding:3px 10px; border-radius:4px;
    font-size:clamp(0.46rem,1.1vw,0.55rem);
    letter-spacing:0.09em; text-transform:uppercase;
    border:1px solid; white-space:nowrap;
  }
  .pp-badge.green  { color:#39ff14; border-color:rgba(57,255,20,0.25);  background:rgba(57,255,20,0.05); }
  .pp-badge.yellow { color:#facc15; border-color:rgba(250,204,21,0.25); background:rgba(250,204,21,0.05); }
  .pp-badge.red    { color:#f87171; border-color:rgba(248,113,113,0.25); background:rgba(248,113,113,0.05); animation:warningBlink 2.5s ease-in-out infinite; }

  /* ─── CLASSIFIED BANNER ─── */
  .pp-classified {
    margin-top:14px;
    display:flex; align-items:flex-start; gap:10px;
    padding:10px 14px;
    background:rgba(248,113,113,0.04);
    border:1px solid rgba(248,113,113,0.18);
    border-left:3px solid rgba(248,113,113,0.5);
    border-radius:6px;
    font-size:clamp(0.58rem,1.3vw,0.65rem);
    color:rgba(248,113,113,0.55);
    letter-spacing:0.04em; line-height:1.75;
    animation:warningBlink 3s ease-in-out infinite;
  }
  .pp-classified-icon { flex-shrink:0; font-size:0.9rem; margin-top:1px; animation:warningPulse 2s infinite; }

  /* ─── BODY ─── */
  .pp-body {
    background:rgba(4,4,4,0.98);
    border:1px solid rgba(255,255,255,0.05); border-top:none;
    border-radius:0 0 14px 14px;
    padding:clamp(1.2rem,4vw,2.5rem);
    display:flex; flex-direction:column; gap:clamp(0.9rem,2.5vw,1.4rem);
  }

  /* ─── INTRO TEXT ─── */
  .pp-intro {
    font-size:clamp(0.7rem,1.6vw,0.78rem);
    color:rgba(255,255,255,0.4); line-height:1.85; letter-spacing:0.03em;
  }
  .pp-intro strong { color:rgba(255,255,255,0.7); }

  /* ─── ASIDE ─── */
  .pp-aside {
    padding:10px 14px;
    background:rgba(57,255,20,0.025);
    border:1px solid rgba(57,255,20,0.1);
    border-left:3px solid rgba(57,255,20,0.3);
    border-radius:0 6px 6px 0;
    font-size:clamp(0.57rem,1.2vw,0.64rem);
    color:rgba(57,255,20,0.38); letter-spacing:0.05em;
    line-height:1.75; font-style:italic;
  }

  /* ─── SECTION (collapsible) ─── */
  .pp-section {
    background:rgba(255,255,255,0.012);
    border:1px solid rgba(255,255,255,0.055);
    border-radius:10px; overflow:hidden;
    transition:border-color 0.3s;
    animation:sectionIn 0.4s ease forwards;
  }
  .pp-section:hover { border-color:rgba(250,204,21,0.12); }

  .pp-section-head {
    display:flex; align-items:center; gap:10px;
    padding:clamp(0.75rem,2vw,1rem) clamp(0.9rem,2.5vw,1.4rem);
    background:rgba(255,255,255,0.018);
    border-bottom:1px solid rgba(255,255,255,0.05);
    cursor:pointer; user-select:none;
    transition:background 0.2s;
  }
  .pp-section-head:hover { background:rgba(250,204,21,0.04); }

  .pp-section-num {
    display:inline-flex; align-items:center; justify-content:center;
    width:22px; height:22px; border-radius:50%;
    background:#facc15; color:#000;
    font-family:'Orbitron',monospace;
    font-size:0.58rem; font-weight:900; flex-shrink:0;
  }
  .pp-section-title {
    font-family:'Orbitron',monospace;
    font-size:clamp(0.62rem,1.8vw,0.78rem);
    font-weight:700; color:#fff;
    letter-spacing:clamp(0.5px,0.2vw,1.5px);
    text-transform:uppercase; flex:1; word-break:break-word;
  }
  .pp-chevron {
    font-size:0.65rem; color:rgba(250,204,21,0.4);
    transition:transform 0.25s, color 0.2s; flex-shrink:0;
  }
  .pp-chevron.open { transform:rotate(180deg); color:#facc15; }

  .pp-section-body {
    padding:clamp(0.9rem,2.5vw,1.3rem) clamp(0.9rem,2.5vw,1.4rem);
    display:flex; flex-direction:column; gap:10px;
    border-left:2px solid rgba(57,255,20,0.15);
  }

  /* ─── CONTENT TYPES ─── */
  .pp-text {
    font-size:clamp(0.68rem,1.6vw,0.77rem);
    color:rgba(255,255,255,0.42); line-height:1.85; letter-spacing:0.03em;
  }
  .pp-text strong { color:rgba(255,255,255,0.7); }

  .pp-subhead {
    font-size:clamp(0.58rem,1.3vw,0.65rem);
    color:rgba(57,255,20,0.55); letter-spacing:0.15em;
    text-transform:uppercase; margin-top:4px;
  }

  .pp-list { display:flex; flex-direction:column; gap:5px; }
  .pp-item {
    display:flex; align-items:flex-start; gap:8px;
    font-size:clamp(0.66rem,1.5vw,0.74rem);
    color:rgba(255,255,255,0.38); line-height:1.7; letter-spacing:0.02em;
  }
  .pp-item::before { content:'▸'; color:#facc15; flex-shrink:0; font-size:0.62rem; margin-top:3px; }

  /* ─── REDACTED BLOCK ─── */
  .pp-redacted {
    display:flex; align-items:flex-start; gap:8px;
    padding:8px 12px;
    background:rgba(248,113,113,0.04);
    border:1px solid rgba(248,113,113,0.15);
    border-radius:5px;
    font-size:clamp(0.58rem,1.3vw,0.65rem);
    color:rgba(248,113,113,0.45);
    letter-spacing:0.07em; font-style:italic; line-height:1.65;
  }
  .pp-redacted-icon { flex-shrink:0; animation:warningPulse 2s infinite; }

  /* inline redacted bar */
  .pp-bar {
    display:inline-block;
    background:rgba(248,113,113,0.22);
    color:transparent !important;
    border-radius:2px;
    padding:0 6px; user-select:none;
    animation:redactedPulse 2.5s ease-in-out infinite;
    font-size:0.7em; vertical-align:middle;
  }

  /* ─── CONTACT CARD ─── */
  .pp-contact-card {
    background:rgba(255,255,255,0.015);
    border:1px solid rgba(250,204,21,0.15);
    border-radius:8px;
    padding:clamp(1rem,2.5vw,1.4rem);
    display:flex; flex-direction:column; gap:9px;
    position:relative; overflow:hidden;
  }
  .pp-contact-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,#facc15,rgba(57,255,20,0.5),transparent);
    opacity:0.4;
  }
  .pp-contact-label {
    font-size:clamp(0.5rem,1.1vw,0.57rem);
    color:rgba(57,255,20,0.5); letter-spacing:0.17em; text-transform:uppercase;
    margin-bottom:2px;
  }
  .pp-contact-row {
    display:flex; align-items:baseline; gap:10px; flex-wrap:wrap;
  }
  .pp-contact-key {
    font-size:clamp(0.58rem,1.2vw,0.65rem);
    color:rgba(255,255,255,0.25); letter-spacing:0.09em;
    text-transform:uppercase; flex-shrink:0; min-width:55px;
  }
  .pp-contact-val {
    font-size:clamp(0.68rem,1.5vw,0.76rem);
    color:#facc15; letter-spacing:0.04em; word-break:break-all;
  }
  .pp-contact-val a {
    color:#facc15; text-decoration:none;
    transition:color 0.2s, text-shadow 0.2s;
  }
  .pp-contact-val a:hover { color:#fde047; text-shadow:0 0 12px rgba(250,204,21,0.4); }

  /* ─── FOOTER ─── */
  .pp-footer {
    text-align:center;
    font-size:clamp(0.52rem,1.1vw,0.6rem);
    color:rgba(255,255,255,0.1); letter-spacing:0.1em;
    padding-top:clamp(0.5rem,2vw,1rem);
    border-top:1px solid rgba(255,255,255,0.04);
    line-height:1.9;
  }
  .pp-footer .g { color:rgba(57,255,20,0.22); }
  .pp-footer .hash { color:rgba(57,255,20,0.18); font-size:0.9em; }

  /* ─── RESPONSIVE ─── */
  @media (max-width:480px) {
    .pp-tbar-path { display:none; }
    .pp-header  { padding:1rem 0.85rem; }
    .pp-body    { padding:0.85rem 0.75rem; }
    .pp-section-body { padding:0.85rem 0.8rem; }
    .pp-classified { padding:8px 10px; }
    .pp-meta { gap:6px; }
  }
  @media (max-width:360px) {
    .pp-page { padding-left:0.5rem; padding-right:0.5rem; }
    .pp-tbar { padding:0.35rem 0.5rem; }
    .pp-body { padding:0.7rem 0.55rem; }
    .pp-title { font-size:0.95rem; }
  }
`;

/* ─── Ghost bar ─── */
const GhostBar = () => {
  const [msg,  setMsg]  = useState(GHOST_LINES[0]);
  const [anim, setAnim] = useState("ghostIn 0.5s ease forwards");
  useEffect(() => {
    const cycle = () => {
      setAnim("ghostOut 0.35s ease forwards");
      setTimeout(() => {
        setMsg(GHOST_LINES[Math.floor(Math.random() * GHOST_LINES.length)]);
        setAnim("ghostIn 0.5s ease forwards");
      }, 400);
    };
    const id = setInterval(cycle, 4000);
    return () => clearInterval(id);
  }, []);
  return <div className="pp-ghost" style={{ animation: anim }}>{msg}</div>;
};

/* ─── Collapsible section ─── */
const Section = ({ num, title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="pp-section">
      <div className="pp-section-head" onClick={() => setOpen(o => !o)}>
        <span className="pp-section-num">{num}</span>
        <span className="pp-section-title">{title}</span>
        <span className={`pp-chevron${open ? " open" : ""}`}>▼</span>
      </div>
      {open && <div className="pp-section-body">{children}</div>}
    </div>
  );
};

/* ─── Bullet list ─── */
const List = ({ items }) => (
  <div className="pp-list">
    {items.map((item, i) => <div key={i} className="pp-item">{item}</div>)}
  </div>
);

/* ─── Redacted block ─── */
const Redacted = ({ children }) => (
  <div className="pp-redacted">
    <span className="pp-redacted-icon">⚠</span>
    <span>{children}</span>
  </div>
);

/* ─── Aside ─── */
const Aside = ({ children }) => <div className="pp-aside">{children}</div>;

/* ─── Generate a fake hash on mount — stays stable ─── */
const HASH = Array.from({ length: 40 }, () =>
  Math.floor(Math.random() * 16).toString(16)
).join("");

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const PrivacyPolicy = () => (
  <>
    <style>{CSS}</style>

    <div className="pp-page">
      <div className="pp-inner">

        {/* Terminal bar */}
        <div className="pp-tbar">
          <span className="pp-tbar-dots">
            <span className="pp-tbar-dot" style={{ background:"#ff5f57" }} />
            <span className="pp-tbar-dot" style={{ background:"#facc15" }} />
            <span className="pp-tbar-dot" style={{ background:"#39ff14" }} />
          </span>
          <span className="pp-tbar-title">
            PRIVACY_POLICY.SYS — CLASSIFIED DOCUMENT
            <span className="pp-cursor" />
          </span>
          <span className="pp-tbar-path">~/legal/privacy</span>
        </div>

        {/* Rotating ghost line */}
        <GhostBar />

        {/* Header */}
        <div className="pp-header">
          <div className="pp-header-tag">// document_classification: internal — last_updated: march 2026</div>
          <h1 className="pp-title">PRIVACY <span className="yellow">POLICY</span></h1>
          <div className="pp-meta">
            <span className="pp-meta-date">📅 last updated: march 2026</span>
            <span className="pp-badge green">⬡ ENCRYPTED TRANSIT</span>
            <span className="pp-badge yellow">⚡ LIVE DOCUMENT</span>
            <span className="pp-badge red">⚠ ACCESS LOGGED</span>
          </div>

          <div className="pp-classified">
            <span className="pp-classified-icon">⚠</span>
            <span>
              // notice: your access to this document has been recorded. certain sections
              contain <span className="pp-bar">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> that
              cannot be disclosed at this clearance level. continued reading constitutes acceptance
              of terms you have not been shown.
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="pp-body">

          {/* Intro */}
          <div className="pp-intro">
            <strong>Lumbini Technologies Private Limited</strong> ("Lumbini Technologies", "we", "our", or "us")
            respects your privacy and is committed to protecting your personal information.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your
            information when you use our website, services, and internship application portal.
            <br /><br />
            By accessing or using our services, you agree to the terms of this Privacy Policy.
          </div>

          <Aside>
            // your agreement is implicit upon access. the system noted your arrival before
            you reached this sentence. no additional action is required — or available.
          </Aside>

          {/* 1. Information We Collect */}
          <Section num="1" title="Information We Collect" defaultOpen={true}>
            <div className="pp-text">We may collect the following types of information:</div>

            <div className="pp-subhead">// personal_information.dat</div>
            <div className="pp-text">When you apply for internships or create an account:</div>
            <List items={[
              "Full Name",
              "Email Address",
              "Phone Number",
              "University / Educational Institution",
              "Degree and Academic Details",
              "Skills and Resume Information",
              "Internship application responses",
            ]} />

            <div className="pp-subhead">// account_data.log</div>
            <div className="pp-text">When you register for an account:</div>
            <List items={[
              "Email address",
              "Encrypted password",
              "Authentication and verification data",
            ]} />

            <div className="pp-subhead">// auto_collected.sys</div>
            <div className="pp-text">Automatically collected technical information:</div>
            <List items={[
              "IP address",
              "Browser type",
              "Device information",
              "Access timestamps",
              "Website usage data",
            ]} />

            <Redacted>
              // [REDACTED] — additional passive collection methods exist that are not
              enumerated in this document. clearance level insufficient to view complete list.
            </Redacted>
          </Section>

          {/* 2. How We Use */}
          <Section num="2" title="How We Use Your Information">
            <div className="pp-text">We use the information collected for the following purposes:</div>
            <List items={[
              "To process internship applications",
              "To communicate application status updates",
              "To generate internship documents such as offer letters and certificates",
              "To verify and manage user accounts",
              "To maintain the security of our platform",
              "To improve our website and services",
            ]} />
            <Aside>
              // your behavioral patterns on this platform are analysed to improve system
              performance. this is routine. this is normal. do not be concerned.
            </Aside>
          </Section>

          {/* 3. Documents */}
          <Section num="3" title="Document Generation & Storage">
            <div className="pp-text">Our platform may generate documents such as:</div>
            <List items={[
              "Internship Offer Letters",
              "Internship Completion Certificates",
            ]} />
            <div className="pp-text">
              These documents may contain personal details such as your name and internship information.
              They are <strong>securely stored</strong> and are only accessible to authorized administrators
              and the respective intern.
            </div>
            <Redacted>
              // document storage location:{" "}
              <span className="pp-bar">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>.
              {" "}access logs are maintained indefinitely. document read-receipts are recorded.
            </Redacted>
          </Section>

          {/* 4. Sharing */}
          <Section num="4" title="Data Sharing & Disclosure">
            <div className="pp-text">
              <strong>We do not sell or rent your personal data.</strong>
              <br /><br />
              Your information may only be shared:
            </div>
            <List items={[
              "With authorized company administrators for recruitment and internship management",
              "With secure infrastructure providers required to operate the platform",
              "When required by law or regulatory authorities",
            ]} />
            <Aside>
              // we define "authorized administrators" broadly. the exact number of entities
              with access to your data is{" "}
              <span style={{ color:"rgba(248,113,113,0.5)" }}>not publicly disclosed</span>.
              trust is a feature of this agreement, not a guarantee.
            </Aside>
          </Section>

          {/* 5. Security */}
          <Section num="5" title="Data Security">
            <div className="pp-text">
              We implement appropriate technical and organizational security measures to protect
              your personal information from unauthorized access, misuse, or disclosure.
              <br /><br />
              However, <strong>no internet-based service can guarantee complete security.</strong>
            </div>
            <Redacted>
              // security architecture details: [REDACTED — CLASSIFICATION LEVEL 3].
              incident response protocol:{" "}
              <span className="pp-bar">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>.
              {" "}breach notification timelines are subject to internal discretion.
            </Redacted>
          </Section>

          {/* 6. Retention */}
          <Section num="6" title="Data Retention">
            <div className="pp-text">We retain personal information only for as long as necessary to:</div>
            <List items={[
              "Process internship applications",
              "Maintain internship records",
              "Comply with legal obligations",
            ]} />
            <Aside>
              // "as long as necessary" is determined internally and reviewed periodically.
              certain anonymised data points may persist indefinitely for analytical purposes.
              the void does not forget.
            </Aside>
          </Section>

          {/* 7. Rights */}
          <Section num="7" title="Your Rights">
            <div className="pp-text">You may request to:</div>
            <List items={[
              "Access your personal data",
              "Correct inaccurate information",
              "Request deletion of your account",
            ]} />
            <div className="pp-text">
              Requests can be made by contacting us using the information below.
            </div>
            <Aside>
              // all requests are logged upon receipt and reviewed by human administrators
              within a reasonable timeframe. "reasonable" is contextual and non-binding.
            </Aside>
          </Section>

          {/* 8. Third Party */}
          <Section num="8" title="Third-Party Services">
            <div className="pp-text">
              Our platform may use third-party services such as authentication providers,
              cloud storage, and email delivery services to operate the system securely and efficiently.
              <br /><br />
              These providers may process limited information necessary to deliver their services.
            </div>
            <Redacted>
              // full list of third-party data processors: [REDACTED].
              each provider operates under their own governance framework.
              we cannot speak for their voids.
            </Redacted>
          </Section>

          {/* 9. Updates */}
          <Section num="9" title="Updates to This Policy">
            <div className="pp-text">
              We may update this Privacy Policy from time to time. Updates will be reflected
              by revising the "Last Updated" date on this page.
            </div>
            <Aside>
              // you are advised to revisit this document periodically.
              continued use of the platform constitutes acceptance of revisions,
              whether or not you have read them. this is standard. this is normal.
            </Aside>
          </Section>

          {/* 10. Contact */}
          <Section num="10" title="Contact Us" defaultOpen={true}>
            <div className="pp-text">
              If you have questions regarding this Privacy Policy, please contact:
            </div>
            <div className="pp-contact-card">
              <div className="pp-contact-label">// transmission_channel.open</div>
              <div className="pp-contact-row">
                <span className="pp-contact-key">ENTITY</span>
                <span className="pp-contact-val">Lumbini Technologies Private Limited</span>
              </div>
              <div className="pp-contact-row">
                <span className="pp-contact-key">EMAIL</span>
                <span className="pp-contact-val">
                  <a href="mailto:admin@lumbinitechnologies.com">admin@lumbinitechnologies.com</a>
                </span>
              </div>
              <div className="pp-contact-row">
                <span className="pp-contact-key">WEB</span>
                <span className="pp-contact-val">
                  <a href="https://lumbinitechnologies.com" target="_blank" rel="noopener noreferrer">
                    lumbinitechnologies.com
                  </a>
                </span>
              </div>
            </div>
            <Aside>
              // all communications are monitored for quality and compliance purposes.
              your inquiry will be acknowledged. eventually. we are watching for your message.
            </Aside>
          </Section>

          {/* Footer */}
          <div className="pp-footer">
            // end_of_document — lumbini technologies private limited — march 2026<br />
            <span className="g">// this document was delivered over an encrypted channel. your session is now closing.</span><br />
            // doc_hash: <span className="hash">{HASH}</span>
          </div>

        </div>
      </div>
    </div>
  </>
);

export default PrivacyPolicy;