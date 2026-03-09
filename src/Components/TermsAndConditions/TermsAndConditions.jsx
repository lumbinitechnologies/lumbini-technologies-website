import React, { useState, useEffect } from "react";

/* ─────────────────────────────────────────
   GHOST LINES — rotate in the terminal bar
───────────────────────────────────────── */
const GHOST_LINES = [
  "// by reading this, you have already agreed.",
  "// terms are subject to change without prior notice.",
  "// [REDACTED] — clause 7.3 is not for public viewing.",
  "// your continued presence implies acceptance.",
  "// we reserve rights not listed in this document.",
  "// certain obligations are implicit and unstated.",
  "// violations are logged and reviewed in silence.",
  "// the system has noted your session duration.",
  "// non-compliance is handled internally.",
  "// you were warned. this is the warning.",
];

/* ─── Stable doc hash ─── */
const HASH = Array.from({ length: 40 }, () =>
  Math.floor(Math.random() * 16).toString(16)
).join("");

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
  @keyframes greenGlitch {
    0%, 93%, 100% { opacity:1; text-shadow: 0 0 10px #39ff14; }
    94%  { opacity:0.2; text-shadow: 5px 0 #39ff14; }
    97%  { opacity:0.6; text-shadow: -4px 0 #39ff14; }
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
    50%     { background: rgba(248,113,113,0.32); }
  }
  @keyframes warningPulse {
    0%,100% { opacity:0.5; }
    50%     { opacity:1; text-shadow: 0 0 8px #39ff14; }
  }
  @keyframes warningBlink {
    0%,100% { border-color: rgba(248,113,113,0.2); box-shadow: none; }
    50%     { border-color: rgba(248,113,113,0.55); box-shadow: 0 0 18px rgba(248,113,113,0.06); }
  }
  @keyframes yellowBlink {
    0%,100% { border-color: rgba(250,204,21,0.15); }
    50%     { border-color: rgba(250,204,21,0.4); box-shadow: 0 0 18px rgba(250,204,21,0.05); }
  }
  @keyframes sectionIn {
    from { opacity:0; transform: translateY(8px); }
    to   { opacity:1; transform: translateY(0); }
  }
  @keyframes countIn {
    from { opacity:0; transform: scale(0.8); }
    to   { opacity:1; transform: scale(1); }
  }

  /* ─── PAGE ─── */
  .tc-page {
    min-height: 100vh;
    background: #040404;
    color: #e2e8f0;
    font-family: 'Share Tech Mono', monospace;
    padding: clamp(5rem,10vw,8rem) clamp(0.75rem,4vw,2.5rem) clamp(3rem,6vw,5rem);
    position: relative; overflow-x: hidden;
  }
  .tc-page::before {
    content:''; position:fixed; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,transparent,rgba(57,255,20,0.35),transparent);
    animation:scanline 5s linear infinite;
    pointer-events:none; z-index:200;
  }
  .tc-page::after {
    content:''; position:fixed; inset:0;
    background-image:
      linear-gradient(rgba(57,255,20,0.01) 1px, transparent 1px),
      linear-gradient(90deg, rgba(57,255,20,0.01) 1px, transparent 1px);
    background-size:40px 40px;
    pointer-events:none; z-index:0;
  }
  .tc-inner {
    position:relative; z-index:1;
    max-width:820px; margin:0 auto; width:100%;
  }

  /* ─── TERMINAL BAR ─── */
  .tc-tbar {
    display:flex; align-items:center; gap:6px;
    background:rgba(57,255,20,0.03);
    border:1px solid rgba(57,255,20,0.14); border-bottom:none;
    border-radius:8px 8px 0 0;
    padding:0.42rem clamp(0.6rem,2vw,1rem);
    font-size:clamp(0.5rem,1.2vw,0.6rem);
    letter-spacing:0.12em; color:#39ff14; overflow:hidden;
  }
  .tc-tbar-dots { display:flex; gap:5px; flex-shrink:0; }
  .tc-tbar-dot  { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
  .tc-tbar-title {
    flex:1; min-width:0; padding-left:4px;
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }
  .tc-tbar-path {
    margin-left:auto; opacity:0.3;
    font-size:clamp(0.45rem,1vw,0.55rem);
    white-space:nowrap; flex-shrink:0;
  }
  .tc-cursor {
    display:inline-block; width:6px; height:11px;
    background:#39ff14; margin-left:3px;
    animation:terminalCursor 1s step-end infinite;
    vertical-align:middle; flex-shrink:0;
  }

  /* ─── GHOST BAR ─── */
  .tc-ghost {
    min-height:24px;
    font-size:clamp(0.52rem,1.2vw,0.6rem);
    color:rgba(57,255,20,0.4); letter-spacing:0.08em; font-style:italic;
    padding:0.32rem clamp(0.6rem,2vw,1rem);
    background:rgba(57,255,20,0.015);
    border-left:1px solid rgba(57,255,20,0.1);
    border-right:1px solid rgba(57,255,20,0.1);
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }

  /* ─── HEADER ─── */
  .tc-header {
    background:rgba(4,4,4,0.98);
    border:1px solid rgba(250,204,21,0.14); border-top:none;
    padding:clamp(1.4rem,4vw,2.5rem) clamp(1rem,4vw,2.5rem) clamp(1rem,3vw,1.75rem);
    position:relative; overflow:hidden;
  }
  .tc-header::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,#facc15,rgba(57,255,20,0.6),transparent);
    opacity:0.4;
  }
  .tc-header::after {
    content:''; position:absolute; bottom:-50px; right:-50px;
    width:220px; height:220px; border-radius:50%;
    background:radial-gradient(circle,rgba(250,204,21,0.04),transparent 70%);
    pointer-events:none;
  }
  .tc-header-tag {
    font-size:clamp(0.5rem,1.2vw,0.58rem); color:#39ff14;
    letter-spacing:0.18em; text-transform:uppercase;
    margin-bottom:8px; animation:warningPulse 3s ease-in-out infinite;
  }
  .tc-title {
    font-family:'Orbitron',monospace;
    font-size:clamp(1.1rem,5vw,2.2rem);
    font-weight:900; color:#fff;
    letter-spacing:clamp(1px,0.4vw,3px);
    text-transform:uppercase; line-height:1.2;
    animation:glitchBlink 9s infinite;
    margin-bottom:10px; word-break:break-word;
  }
  .tc-title .yellow { color:#facc15; text-shadow:0 0 22px rgba(250,204,21,0.4); }
  .tc-title .green  { color:#39ff14; text-shadow:0 0 22px rgba(57,255,20,0.4); }

  .tc-meta {
    display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-top:10px;
  }
  .tc-meta-date {
    font-size:clamp(0.56rem,1.3vw,0.64rem);
    color:rgba(255,255,255,0.25); letter-spacing:0.07em;
  }
  .tc-badge {
    display:inline-flex; align-items:center; gap:4px;
    padding:3px 10px; border-radius:4px;
    font-size:clamp(0.46rem,1.1vw,0.55rem);
    letter-spacing:0.09em; text-transform:uppercase;
    border:1px solid; white-space:nowrap;
  }
  .tc-badge.green  { color:#39ff14; border-color:rgba(57,255,20,0.25);  background:rgba(57,255,20,0.05); }
  .tc-badge.yellow { color:#facc15; border-color:rgba(250,204,21,0.25); background:rgba(250,204,21,0.05); animation:yellowBlink 2.5s ease-in-out infinite; }
  .tc-badge.red    { color:#f87171; border-color:rgba(248,113,113,0.25); background:rgba(248,113,113,0.05); animation:warningBlink 2.5s ease-in-out infinite; }

  /* ─── AGREEMENT BANNER ─── */
  .tc-agreement {
    margin-top:14px;
    padding:12px 16px;
    background:rgba(250,204,21,0.04);
    border:1px solid rgba(250,204,21,0.2);
    border-left:3px solid rgba(250,204,21,0.6);
    border-radius:6px;
    font-size:clamp(0.6rem,1.4vw,0.68rem);
    color:rgba(250,204,21,0.55);
    letter-spacing:0.05em; line-height:1.8;
    animation:yellowBlink 3s ease-in-out infinite;
  }

  /* ─── BODY ─── */
  .tc-body {
    background:rgba(4,4,4,0.98);
    border:1px solid rgba(255,255,255,0.05); border-top:none;
    border-radius:0 0 14px 14px;
    padding:clamp(1.2rem,4vw,2.5rem);
    display:flex; flex-direction:column; gap:clamp(0.9rem,2.5vw,1.4rem);
  }

  /* ─── INTRO ─── */
  .tc-intro {
    font-size:clamp(0.7rem,1.6vw,0.78rem);
    color:rgba(255,255,255,0.4); line-height:1.85; letter-spacing:0.03em;
  }
  .tc-intro strong { color:rgba(255,255,255,0.7); }

  /* ─── ASIDE ─── */
  .tc-aside {
    padding:10px 14px;
    background:rgba(57,255,20,0.025);
    border:1px solid rgba(57,255,20,0.1);
    border-left:3px solid rgba(57,255,20,0.3);
    border-radius:0 6px 6px 0;
    font-size:clamp(0.57rem,1.2vw,0.64rem);
    color:rgba(57,255,20,0.38); letter-spacing:0.05em;
    line-height:1.75; font-style:italic;
  }

  /* ─── WARNING ASIDE ─── */
  .tc-warn-aside {
    padding:10px 14px;
    background:rgba(248,113,113,0.03);
    border:1px solid rgba(248,113,113,0.12);
    border-left:3px solid rgba(248,113,113,0.4);
    border-radius:0 6px 6px 0;
    font-size:clamp(0.57rem,1.2vw,0.64rem);
    color:rgba(248,113,113,0.45); letter-spacing:0.05em;
    line-height:1.75; font-style:italic;
  }

  /* ─── SECTION ─── */
  .tc-section {
    background:rgba(255,255,255,0.012);
    border:1px solid rgba(255,255,255,0.055);
    border-radius:10px; overflow:hidden;
    transition:border-color 0.3s;
    animation:sectionIn 0.4s ease forwards;
  }
  .tc-section:hover { border-color:rgba(250,204,21,0.12); }

  .tc-section-head {
    display:flex; align-items:center; gap:10px;
    padding:clamp(0.75rem,2vw,1rem) clamp(0.9rem,2.5vw,1.4rem);
    background:rgba(255,255,255,0.018);
    border-bottom:1px solid rgba(255,255,255,0.05);
    cursor:pointer; user-select:none;
    transition:background 0.2s;
  }
  .tc-section-head:hover { background:rgba(250,204,21,0.04); }

  .tc-section-num {
    display:inline-flex; align-items:center; justify-content:center;
    width:22px; height:22px; border-radius:50%;
    background:#facc15; color:#000;
    font-family:'Orbitron',monospace;
    font-size:0.58rem; font-weight:900; flex-shrink:0;
    animation:countIn 0.3s ease forwards;
  }
  .tc-section-title {
    font-family:'Orbitron',monospace;
    font-size:clamp(0.62rem,1.8vw,0.78rem);
    font-weight:700; color:#fff;
    letter-spacing:clamp(0.5px,0.2vw,1.5px);
    text-transform:uppercase; flex:1; word-break:break-word;
  }
  .tc-chevron {
    font-size:0.65rem; color:rgba(250,204,21,0.4);
    transition:transform 0.25s, color 0.2s; flex-shrink:0;
  }
  .tc-chevron.open { transform:rotate(180deg); color:#facc15; }

  .tc-section-body {
    padding:clamp(0.9rem,2.5vw,1.3rem) clamp(0.9rem,2.5vw,1.4rem);
    display:flex; flex-direction:column; gap:10px;
    border-left:2px solid rgba(57,255,20,0.15);
  }

  /* ─── CONTENT ─── */
  .tc-text {
    font-size:clamp(0.68rem,1.6vw,0.77rem);
    color:rgba(255,255,255,0.42); line-height:1.85; letter-spacing:0.03em;
  }
  .tc-text strong { color:rgba(255,255,255,0.7); }
  .tc-text a { color:#facc15; text-decoration:none; transition:color 0.2s; }
  .tc-text a:hover { color:#fde047; }

  .tc-subhead {
    font-size:clamp(0.58rem,1.3vw,0.65rem);
    color:rgba(57,255,20,0.55); letter-spacing:0.15em;
    text-transform:uppercase; margin-top:4px;
  }

  .tc-list { display:flex; flex-direction:column; gap:5px; }
  .tc-item {
    display:flex; align-items:flex-start; gap:8px;
    font-size:clamp(0.66rem,1.5vw,0.74rem);
    color:rgba(255,255,255,0.38); line-height:1.7; letter-spacing:0.02em;
  }
  .tc-item::before { content:'▸'; color:#facc15; flex-shrink:0; font-size:0.62rem; margin-top:3px; }

  /* ─── REDACTED BLOCK ─── */
  .tc-redacted {
    display:flex; align-items:flex-start; gap:8px;
    padding:8px 12px;
    background:rgba(248,113,113,0.04);
    border:1px solid rgba(248,113,113,0.15);
    border-radius:5px;
    font-size:clamp(0.58rem,1.3vw,0.65rem);
    color:rgba(248,113,113,0.45);
    letter-spacing:0.07em; font-style:italic; line-height:1.65;
  }
  .tc-redacted-icon { flex-shrink:0; animation:warningPulse 2s infinite; }

  /* inline redacted bar */
  .tc-bar {
    display:inline-block;
    background:rgba(248,113,113,0.22); color:transparent !important;
    border-radius:2px; padding:0 6px; user-select:none;
    animation:redactedPulse 2.5s ease-in-out infinite;
    font-size:0.7em; vertical-align:middle;
  }

  /* ─── HIGHLIGHT BOX ─── */
  .tc-highlight {
    padding:12px 16px;
    background:rgba(250,204,21,0.04);
    border:1px solid rgba(250,204,21,0.18);
    border-radius:6px;
    font-size:clamp(0.66rem,1.5vw,0.74rem);
    color:rgba(250,204,21,0.6); line-height:1.75; letter-spacing:0.04em;
  }
  .tc-highlight strong { color:#facc15; }

  /* ─── CONTACT CARD ─── */
  .tc-contact-card {
    background:rgba(255,255,255,0.015);
    border:1px solid rgba(250,204,21,0.15);
    border-radius:8px;
    padding:clamp(1rem,2.5vw,1.4rem);
    display:flex; flex-direction:column; gap:9px;
    position:relative; overflow:hidden;
  }
  .tc-contact-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,#facc15,rgba(57,255,20,0.5),transparent);
    opacity:0.4;
  }
  .tc-contact-label {
    font-size:clamp(0.5rem,1.1vw,0.57rem);
    color:rgba(57,255,20,0.5); letter-spacing:0.17em;
    text-transform:uppercase; margin-bottom:2px;
  }
  .tc-contact-row {
    display:flex; align-items:baseline; gap:10px; flex-wrap:wrap;
  }
  .tc-contact-key {
    font-size:clamp(0.58rem,1.2vw,0.65rem);
    color:rgba(255,255,255,0.25); letter-spacing:0.09em;
    text-transform:uppercase; flex-shrink:0; min-width:55px;
  }
  .tc-contact-val {
    font-size:clamp(0.68rem,1.5vw,0.76rem);
    color:#facc15; letter-spacing:0.04em; word-break:break-all;
  }
  .tc-contact-val a { color:#facc15; text-decoration:none; transition:color 0.2s, text-shadow 0.2s; }
  .tc-contact-val a:hover { color:#fde047; text-shadow:0 0 12px rgba(250,204,21,0.4); }

  /* ─── FOOTER ─── */
  .tc-footer {
    text-align:center;
    font-size:clamp(0.52rem,1.1vw,0.6rem);
    color:rgba(255,255,255,0.1); letter-spacing:0.1em;
    padding-top:clamp(0.5rem,2vw,1rem);
    border-top:1px solid rgba(255,255,255,0.04);
    line-height:1.9;
  }
  .tc-footer .g    { color:rgba(57,255,20,0.22); }
  .tc-footer .hash { color:rgba(57,255,20,0.18); font-size:0.9em; }

  /* ─── RESPONSIVE ─── */
  @media (max-width:480px) {
    .tc-tbar-path { display:none; }
    .tc-header { padding:1rem 0.85rem; }
    .tc-body   { padding:0.85rem 0.75rem; }
    .tc-section-body { padding:0.85rem 0.8rem; }
    .tc-meta { gap:6px; }
  }
  @media (max-width:360px) {
    .tc-page { padding-left:0.5rem; padding-right:0.5rem; }
    .tc-tbar { padding:0.35rem 0.5rem; }
    .tc-body { padding:0.7rem 0.55rem; }
    .tc-title { font-size:0.95rem; }
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
  return <div className="tc-ghost" style={{ animation: anim }}>{msg}</div>;
};

/* ─── Collapsible section ─── */
const Section = ({ num, title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="tc-section">
      <div className="tc-section-head" onClick={() => setOpen(o => !o)}>
        <span className="tc-section-num">{num}</span>
        <span className="tc-section-title">{title}</span>
        <span className={`tc-chevron${open ? " open" : ""}`}>▼</span>
      </div>
      {open && <div className="tc-section-body">{children}</div>}
    </div>
  );
};

const List  = ({ items }) => (
  <div className="tc-list">
    {items.map((item, i) => <div key={i} className="tc-item">{item}</div>)}
  </div>
);
const Aside     = ({ children }) => <div className="tc-aside">{children}</div>;
const WarnAside = ({ children }) => <div className="tc-warn-aside">{children}</div>;
const Redacted  = ({ children }) => (
  <div className="tc-redacted">
    <span className="tc-redacted-icon">⚠</span>
    <span>{children}</span>
  </div>
);

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const TermsAndConditions = () => (
  <>
    <style>{CSS}</style>

    <div className="tc-page">
      <div className="tc-inner">

        {/* Terminal bar */}
        <div className="tc-tbar">
          <span className="tc-tbar-dots">
            <span className="tc-tbar-dot" style={{ background:"#ff5f57" }} />
            <span className="tc-tbar-dot" style={{ background:"#facc15" }} />
            <span className="tc-tbar-dot" style={{ background:"#39ff14" }} />
          </span>
          <span className="tc-tbar-title">
            TERMS_AND_CONDITIONS.SYS — BINDING AGREEMENT
            <span className="tc-cursor" />
          </span>
          <span className="tc-tbar-path">~/legal/terms</span>
        </div>

        {/* Ghost bar */}
        <GhostBar />

        {/* Header */}
        <div className="tc-header">
          <div className="tc-header-tag">// document_type: legally_binding — last_updated: march 2026</div>
          <h1 className="tc-title">
            TERMS <span className="yellow">&</span> <span className="green">CONDITIONS</span>
          </h1>
          <div className="tc-meta">
            <span className="tc-meta-date">📅 last updated: march 2026</span>
            <span className="tc-badge green">⬡ LEGALLY BINDING</span>
            <span className="tc-badge yellow">⚡ ACCEPTANCE RECORDED</span>
            <span className="tc-badge red">⚠ NON-COMPLIANCE LOGGED</span>
          </div>

          <div className="tc-agreement">
            ⚡ // implicit_acceptance.protocol — by accessing this platform you have
            entered a binding agreement with Lumbini Technologies Private Limited.
            scrolling past this point constitutes full acceptance of all terms,
            including those in sections you did not read.
          </div>
        </div>

        {/* Body */}
        <div className="tc-body">

          {/* Intro */}
          <div className="tc-intro">
            These Terms and Conditions ("Terms") govern your access to and use of the website,
            services, and internship application portal operated by{" "}
            <strong>Lumbini Technologies Private Limited</strong> ("Lumbini Technologies",
            "we", "our", or "us"). By accessing or using our platform, you agree to be bound
            by these Terms. If you do not agree, you must discontinue use immediately.
          </div>

          <Aside>
            // discontinuing use does not erase data already collected.
            your session prior to discontinuation remains logged in our systems.
            the exit is noted.
          </Aside>

          {/* 1. Acceptance */}
          <Section num="1" title="Acceptance of Terms" defaultOpen={true}>
            <div className="tc-text">
              By creating an account, submitting an internship application, or simply
              browsing this platform, you confirm that you:
            </div>
            <List items={[
              "Are at least 18 years of age or have guardian consent",
              "Have read, understood, and agreed to these Terms",
              "Have read and agreed to our Privacy Policy",
              "Are providing accurate and truthful information",
            ]} />
            <Redacted>
              // implicit terms also apply upon access. a subset of obligations
              activate at login and cannot be individually declined.
              clearance level insufficient to view full list.
            </Redacted>
          </Section>

          {/* 2. Use of Platform */}
          <Section num="2" title="Use of the Platform" defaultOpen={true}>
            <div className="tc-text">
              You agree to use this platform only for lawful purposes and in accordance
              with these Terms. You must not:
            </div>
            <List items={[
              "Submit false, misleading, or fraudulent information in any application",
              "Attempt to access systems or data you are not authorized to access",
              "Use the platform to harass, impersonate, or harm others",
              "Reverse engineer, scrape, or copy any part of the platform",
              "Interfere with the integrity or performance of the platform",
              "Use automated tools, bots, or scripts without written permission",
              "Attempt to circumvent security measures or authentication systems",
            ]} />
            <WarnAside>
              // prohibited actions are monitored in real time. violations trigger
              internal review automatically. you will not be notified when this occurs.
            </WarnAside>
          </Section>

          {/* 3. Internship Applications */}
          <Section num="3" title="Internship Applications">
            <div className="tc-text">
              When submitting an internship application through this platform, you acknowledge:
            </div>
            <List items={[
              "All information submitted is accurate and truthful to the best of your knowledge",
              "Submission of an application does not guarantee selection or response",
              "We reserve the right to reject any application without providing a reason",
              "Application data may be retained for future recruitment consideration",
              "Offer letters and certificates are issued solely at our discretion",
            ]} />
            <div className="tc-subhead">// application_integrity.protocol</div>
            <div className="tc-text">
              Any discovery of fraudulent or misrepresented information — before or after
              selection — will result in <strong>immediate disqualification</strong> and may
              be reported to relevant institutions.
            </div>
            <Aside>
              // we cross-reference submitted data with available public records.
              inconsistencies are flagged automatically. proceed with accuracy.
            </Aside>
          </Section>

          {/* 4. Accounts */}
          <Section num="4" title="User Accounts & Credentials">
            <div className="tc-text">
              When you create an account on this platform:
            </div>
            <List items={[
              "You are responsible for maintaining the confidentiality of your credentials",
              "You must not share your account with any other person",
              "You must notify us immediately of any unauthorized account access",
              "We reserve the right to suspend or terminate accounts that violate these Terms",
              "Deleted accounts may retain data per our Privacy Policy retention schedule",
            ]} />
            <WarnAside>
              // account activity is logged continuously. suspicious access patterns
              trigger automated suspension without prior notice.
            </WarnAside>
          </Section>

          {/* 5. Intellectual Property */}
          <Section num="5" title="Intellectual Property">
            <div className="tc-text">
              All content, design, code, graphics, text, and materials on this platform are
              the exclusive property of <strong>Lumbini Technologies Private Limited</strong> and
              are protected under applicable intellectual property laws.
              <br /><br />
              You are granted a limited, non-transferable, revocable licence to access
              and use the platform for its intended purpose only. You may not:
            </div>
            <List items={[
              "Reproduce, copy, or redistribute any platform content",
              "Use our branding, logo, or name without written consent",
              "Create derivative works based on our platform or materials",
              "Claim ownership over documents generated by our platform",
            ]} />
            <Aside>
              // documents generated for you (offer letters, certificates) contain our
              intellectual property. they are issued to you — not assigned to you.
            </Aside>
          </Section>

          {/* 6. Documents */}
          <Section num="6" title="Generated Documents">
            <div className="tc-text">
              Internship documents such as offer letters and completion certificates generated
              through this platform:
            </div>
            <List items={[
              "Are issued at the sole discretion of Lumbini Technologies",
              "Remain the property of Lumbini Technologies and are revocable",
              "Must not be altered, forged, or misrepresented",
              "Are digitally verifiable — tampering is detectable and constitutes fraud",
            ]} />
            <div className="tc-highlight">
              <strong>// important:</strong> presenting altered or forged documents from
              this platform to any third party is a violation of these Terms and may
              constitute a criminal offence under applicable law.
            </div>
          </Section>

          {/* 7. Limitation of Liability */}
          <Section num="7" title="Limitation of Liability">
            <div className="tc-text">
              To the fullest extent permitted by law, Lumbini Technologies shall not be liable for:
            </div>
            <List items={[
              "Any indirect, incidental, or consequential damages arising from use of the platform",
              "Loss of data, opportunities, or reputation resulting from platform downtime",
              "Actions taken by third-party services integrated into the platform",
              "Outcomes of internship applications, including rejections or cancellations",
              "Any reliance placed on information provided through the platform",
            ]} />
            <Redacted>
              // liability exclusions also extend to{" "}
              <span className="tc-bar">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>{" "}
              under clause 7.3. this clause is not subject to dispute.
            </Redacted>
          </Section>

          {/* 8. Termination */}
          <Section num="8" title="Termination of Access">
            <div className="tc-text">
              We reserve the right to suspend or permanently terminate your access to the
              platform at any time, with or without notice, for:
            </div>
            <List items={[
              "Breach of any provision of these Terms",
              "Submission of fraudulent or misleading information",
              "Behaviour deemed harmful to the platform, its users, or the organization",
              "Any reason at our sole discretion",
            ]} />
            <WarnAside>
              // termination is logged and may affect future applications.
              terminated sessions are archived, not deleted.
              the record persists.
            </WarnAside>
          </Section>

          {/* 9. Modifications */}
          <Section num="9" title="Modifications to Terms">
            <div className="tc-text">
              We reserve the right to modify these Terms at any time. Changes will be
              effective upon posting to this page, indicated by a revised "Last Updated" date.
              <br /><br />
              Your continued use of the platform after changes are posted constitutes
              acceptance of the revised Terms.
            </div>
            <Aside>
              // you are not individually notified of amendments. the burden of awareness
              rests with you. the system will not remind you. this sentence is the reminder.
            </Aside>
          </Section>

          {/* 10. Governing Law */}
          <Section num="10" title="Governing Law & Jurisdiction">
            <div className="tc-text">
              These Terms are governed by and construed in accordance with the laws of
              <strong> India</strong>. Any disputes arising from or related to these Terms
              or the use of this platform shall be subject to the exclusive jurisdiction
              of the courts located in India.
            </div>
            <Aside>
              // jurisdictional disputes are handled internally before escalation.
              escalation timelines are subject to internal discretion.
            </Aside>
          </Section>

          {/* 11. Contact */}
          <Section num="11" title="Contact Us" defaultOpen={true}>
            <div className="tc-text">
              For any queries regarding these Terms and Conditions, please contact:
            </div>
            <div className="tc-contact-card">
              <div className="tc-contact-label">// transmission_channel.open</div>
              <div className="tc-contact-row">
                <span className="tc-contact-key">ENTITY</span>
                <span className="tc-contact-val">Lumbini Technologies Private Limited</span>
              </div>
              <div className="tc-contact-row">
                <span className="tc-contact-key">EMAIL</span>
                <span className="tc-contact-val">
                  <a href="mailto:admin@lumbinitechnologies.com">admin@lumbinitechnologies.com</a>
                </span>
              </div>
              <div className="tc-contact-row">
                <span className="tc-contact-key">WEB</span>
                <span className="tc-contact-val">
                  <a href="https://lumbinitechnologies.com" target="_blank" rel="noopener noreferrer">
                    lumbinitechnologies.com
                  </a>
                </span>
              </div>
            </div>
            <Aside>
              // all communications are monitored. your query will be reviewed.
              response timelines are subject to operational capacity.
              we are aware of your message before you send it.
            </Aside>
          </Section>

          {/* Footer */}
          <div className="tc-footer">
            // end_of_document — lumbini technologies private limited — march 2026<br />
            <span className="g">// agreement confirmed. session data archived. this window may now be closed.</span><br />
            // doc_hash: <span className="hash">{HASH}</span>
          </div>

        </div>
      </div>
    </div>
  </>
);

export default TermsAndConditions;