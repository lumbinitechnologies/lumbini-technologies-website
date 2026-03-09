import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

/* ─────────────────────────────────────────
   MYSTERIOUS GHOST MESSAGES
   rotate every ~4s — feels like the system
   is watching the applicant in real time
───────────────────────────────────────── */
const GHOST_MESSAGES = [
  "// scanning applicant profile...",
  "// cross-referencing neural signature...",
  "// identity confirmed. proceed.",
  "// anomaly detected in sector 7...",
  "// monitoring keystrokes. normal.",
  "// your data is being encrypted.",
  "// welcome, candidate. we've been expecting you.",
  "// behavioral analysis: promising.",
  "// this application will self-destruct if left incomplete.",
  "// do not lie. we will know.",
  "// the void is listening.",
  "// file access granted. type carefully.",
];

/* ─────────────────────────────────────────
   INLINE CSS — replaces InternshipApplication.css
───────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes terminalCursor {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  @keyframes glitchBlink {
    0%, 93%, 100% { opacity:1; text-shadow: 0 0 10px #facc15; }
    94%            { opacity:0.15; text-shadow: 6px 0 #facc15; }
    97%            { opacity:0.75; text-shadow: -4px 0 #facc15; }
  }
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes ghostIn {
    from { opacity:0; transform:translateX(-10px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes ghostOut {
    from { opacity:1; transform:translateX(0); }
    to   { opacity:0; transform:translateX(6px); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes successPulse {
    0%,100% { box-shadow: 0 0 20px rgba(57,255,20,0.25); }
    50%     { box-shadow: 0 0 60px rgba(57,255,20,0.55), 0 0 100px rgba(57,255,20,0.1); }
  }
  @keyframes warningPulse {
    0%,100% { opacity:0.55; }
    50%     { opacity:1; text-shadow: 0 0 8px #39ff14; }
  }

  /* ─── BASE ─── */
  .ia-page {
    min-height: 100vh;
    background: #040404;
    color: #e2e8f0;
    font-family: 'Share Tech Mono', monospace;
    /* top pad accounts for fixed navbar; side pad scales with viewport */
    padding: clamp(5rem, 12vw, 8rem) clamp(0.75rem, 4vw, 2.5rem) clamp(3rem, 6vw, 5rem);
    position: relative;
    overflow-x: hidden;
  }

  /* scanline sweep */
  .ia-page::before {
    content: '';
    position: fixed; top:0; left:0; right:0; height:2px;
    background: linear-gradient(90deg, transparent, rgba(57,255,20,0.4), transparent);
    animation: scanline 5s linear infinite;
    pointer-events: none; z-index: 200;
  }

  /* subtle CRT grid */
  .ia-page::after {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(57,255,20,0.012) 1px, transparent 1px),
      linear-gradient(90deg, rgba(57,255,20,0.012) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none; z-index: 0;
  }

  .ia-inner {
    position: relative; z-index: 1;
    max-width: 860px; margin: 0 auto;
    width: 100%;
  }

  /* ─── BACK BUTTON ─── */
  .ia-back {
    display: inline-flex; align-items: center; gap: 6px;
    background: none; border: none; cursor: pointer; padding: 4px 0;
    color: rgba(250,204,21,0.4);
    font-size: clamp(0.6rem, 1.5vw, 0.7rem);
    letter-spacing: 0.14em; text-transform: uppercase;
    font-family: 'Share Tech Mono', monospace;
    margin-bottom: clamp(1rem, 3vw, 1.5rem);
    transition: color 0.2s;
    /* ensure tap target on mobile */
    min-height: 36px;
  }
  .ia-back:hover { color: #facc15; }

  /* ─── TERMINAL BAR ─── */
  .ia-tbar {
    display: flex; align-items: center; gap: 6px;
    background: rgba(57,255,20,0.035);
    border: 1px solid rgba(57,255,20,0.14);
    border-bottom: none;
    border-radius: 8px 8px 0 0;
    padding: 0.4rem clamp(0.6rem, 2vw, 1rem);
    font-size: clamp(0.52rem, 1.2vw, 0.62rem);
    letter-spacing: 0.1em; color: #39ff14;
    /* prevent text overflow on small screens */
    overflow: hidden;
    min-width: 0;
  }
  .ia-tbar-dots { display: flex; gap: 5px; flex-shrink: 0; }
  .ia-tbar-dot  { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .ia-tbar-title {
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    flex: 1; min-width: 0;
  }
  .ia-tbar-path {
    margin-left: auto; opacity: 0.35;
    font-size: clamp(0.48rem, 1vw, 0.58rem);
    white-space: nowrap; flex-shrink: 0;
  }
  .ia-tbar-cursor {
    display: inline-block; width: 6px; height: 11px;
    background: #39ff14; margin-left: 3px;
    animation: terminalCursor 1s step-end infinite;
    vertical-align: middle; flex-shrink: 0;
  }

  /* ─── GHOST MESSAGES ─── */
  .ia-ghost {
    min-height: 26px;
    font-size: clamp(0.55rem, 1.3vw, 0.63rem);
    color: rgba(57,255,20,0.45); letter-spacing: 0.08em;
    font-style: italic;
    padding: 0.35rem clamp(0.6rem, 2vw, 1rem);
    background: rgba(57,255,20,0.018);
    border-left: 1px solid rgba(57,255,20,0.1);
    border-right: 1px solid rgba(57,255,20,0.1);
    border-bottom: none;
    /* prevent long messages from breaking layout */
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  /* ─── HEADER ─── */
  .ia-header {
    background: rgba(4,4,4,0.98);
    border: 1px solid rgba(250,204,21,0.14);
    border-top: none;
    padding: clamp(1.2rem, 4vw, 2.5rem) clamp(1rem, 4vw, 2.5rem) clamp(1rem, 3vw, 1.75rem);
    position: relative; overflow: hidden;
  }
  .ia-header::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, #facc15, rgba(57,255,20,0.7), transparent);
    opacity: 0.45;
  }
  .ia-header::after {
    content: '';
    position: absolute; bottom: -40px; right: -40px;
    width: 180px; height: 180px; border-radius: 50%;
    background: radial-gradient(circle, rgba(250,204,21,0.05), transparent 70%);
    pointer-events: none;
  }
  .ia-header-tag {
    font-size: clamp(0.52rem, 1.2vw, 0.6rem); color: #39ff14;
    letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 8px;
    animation: warningPulse 3s ease-in-out infinite;
  }
  .ia-title {
    font-family: 'Orbitron', monospace;
    font-size: clamp(1.05rem, 5vw, 2.1rem);
    font-weight: 900; color: #fff;
    letter-spacing: clamp(1px, 0.5vw, 2px);
    text-transform: uppercase;
    animation: glitchBlink 9s infinite;
    margin-bottom: 8px; line-height: 1.25;
    /* allow wrapping on tiny screens */
    word-break: break-word;
  }
  .ia-title .yellow { color: #facc15; text-shadow: 0 0 22px rgba(250,204,21,0.4); }
  .ia-title .green  { color: #39ff14; text-shadow: 0 0 22px rgba(57,255,20,0.4); }

  .ia-subtitle {
    font-size: clamp(0.62rem, 1.5vw, 0.7rem);
    color: rgba(255,255,255,0.45);
    letter-spacing: 0.04em; line-height: 1.75;
    margin-top: 6px;
  }
  .ia-req-star { color: #facc15; }

  .ia-badges {
    display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px;
  }
  .ia-badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: 4px;
    font-size: clamp(0.5rem, 1.1vw, 0.58rem);
    letter-spacing: 0.08em; text-transform: uppercase;
    border: 1px solid; white-space: nowrap;
  }
  .ia-badge.green  { color:#39ff14; border-color:rgba(57,255,20,0.25);  background:rgba(57,255,20,0.05);  }
  .ia-badge.yellow { color:#facc15; border-color:rgba(250,204,21,0.25); background:rgba(250,204,21,0.05); }
  .ia-badge.gray   { color:#94a3b8; border-color:rgba(148,163,184,0.2); background:rgba(148,163,184,0.04); }

  /* ─── FORM WRAPPER ─── */
  .ia-form-wrap {
    background: rgba(4,4,4,0.98);
    border: 1px solid rgba(255,255,255,0.05);
    border-top: none;
    border-radius: 0 0 14px 14px;
    padding: clamp(1rem, 4vw, 2.5rem);
    display: flex; flex-direction: column; gap: clamp(12px, 2vw, 16px);
  }

  /* ─── PROGRESS BAR ─── */
  .ia-progress-wrap { margin-bottom: 2px; }
  .ia-progress-label {
    display: flex; justify-content: space-between; align-items: center;
    font-size: clamp(0.52rem, 1.2vw, 0.6rem);
    color: rgba(57,255,20,0.45);
    letter-spacing: 0.12em; margin-bottom: 7px; text-transform: uppercase;
  }
  .ia-progress-track {
    height: 2px; background: rgba(255,255,255,0.05);
    border-radius: 2px; overflow: hidden;
  }
  .ia-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #facc15, #39ff14);
    border-radius: 2px; transition: width 0.4s ease;
    box-shadow: 0 0 10px rgba(57,255,20,0.4);
  }

  /* ─── SECTION ─── */
  .ia-section {
    background: rgba(255,255,255,0.013);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
    padding: clamp(0.9rem, 2.5vw, 1.6rem);
    display: flex; flex-direction: column; gap: clamp(10px, 2vw, 14px);
    position: relative; overflow: hidden;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .ia-section:focus-within {
    border-color: rgba(250,204,21,0.2);
    box-shadow: 0 0 28px rgba(250,204,21,0.03);
  }
  .ia-section::before {
    content: '';
    position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
    background: linear-gradient(to bottom, #facc15, rgba(57,255,20,0.5));
    opacity: 0; transition: opacity 0.3s;
  }
  .ia-section:focus-within::before { opacity: 1; }

  .ia-section-label {
    display: flex; align-items: center; gap: 8px;
    font-size: clamp(0.52rem, 1.2vw, 0.58rem);
    letter-spacing: 0.15em; text-transform: uppercase;
    color: rgba(57,255,20,0.7);
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    /* allow wrapping if label is long */
    flex-wrap: wrap; row-gap: 4px;
  }
  .ia-section-num {
    display: inline-flex; align-items: center; justify-content: center;
    width: 20px; height: 20px; border-radius: 50%;
    background: #facc15; color: #000;
    font-size: 0.6rem; font-weight: 900;
    font-family: 'Orbitron', monospace; flex-shrink: 0;
  }

  /* ─── ROWS / GROUPS ─── */
  .ia-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(10px, 2vw, 14px);
  }
  /* single-column row — constrained width on desktop, full on mobile */
  .ia-row.single {
    grid-template-columns: 1fr;
    max-width: 320px;
  }
  .ia-group { display: flex; flex-direction: column; gap: 6px; }

  .ia-label {
    font-size: clamp(0.6rem, 1.3vw, 0.65rem);
    color: rgba(255,255,255,0.6);
    letter-spacing: 0.09em; text-transform: uppercase;
  }

  /* ─── INPUTS ─── */
  .ia-input, .ia-textarea, .ia-select {
    width: 100%;
    padding: clamp(9px, 1.5vw, 11px) clamp(10px, 2vw, 14px);
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 6px;
    color: #f1f5f9;
    font-size: clamp(0.8rem, 2vw, 0.88rem);
    font-family: 'Share Tech Mono', monospace;
    letter-spacing: 0.03em; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    /* prevent inputs from overflowing on tiny screens */
    min-width: 0;
  }
  .ia-input::placeholder, .ia-textarea::placeholder {
    color: rgba(255,255,255,0.2);
  }
  .ia-input:focus, .ia-textarea:focus, .ia-select:focus {
    border-color: rgba(250,204,21,0.5);
    background: rgba(255,255,255,0.06);
    box-shadow: 0 0 0 3px rgba(250,204,21,0.08);
    color: #fff;
  }
  .ia-input.err, .ia-textarea.err, .ia-select.err {
    border-color: rgba(248,113,113,0.55);
    box-shadow: 0 0 0 3px rgba(248,113,113,0.07);
  }

  .ia-select {
    cursor: pointer; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23e2e8f0' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center;
    padding-right: 2.2rem;
  }
  .ia-select option { background: #111; color: #f1f5f9; }

  .ia-textarea {
    resize: vertical;
    min-height: clamp(100px, 18vw, 130px);
    line-height: 1.75;
  }

  /* ─── HINTS & ERRORS ─── */
  .ia-hint  { font-size: clamp(0.58rem, 1.2vw, 0.63rem); color: rgba(57,255,20,0.35); letter-spacing: 0.03em; line-height: 1.5; }
  .ia-error { font-size: clamp(0.6rem, 1.3vw, 0.65rem); color: #f87171; letter-spacing: 0.03em; display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
  .ia-error::before { content: '//'; color: rgba(248,113,113,0.5); font-size: 0.6rem; flex-shrink: 0; }

  /* ─── FILE UPLOAD ─── */
  .ia-file-label { display: block; cursor: pointer; }
  .ia-file-hidden { display: none; }
  .ia-file-inner {
    display: flex; align-items: center; gap: 10px;
    padding: clamp(11px, 2vw, 14px) clamp(12px, 2.5vw, 16px);
    background: rgba(255,255,255,0.025);
    border: 1px dashed rgba(255,255,255,0.15);
    border-radius: 6px;
    color: rgba(255,255,255,0.4);
    font-size: clamp(0.7rem, 1.8vw, 0.76rem);
    font-family: 'Share Tech Mono', monospace;
    transition: all 0.25s;
    /* allow long filenames to wrap */
    flex-wrap: wrap; word-break: break-all;
  }
  .ia-file-label:hover .ia-file-inner,
  .ia-file-label:focus-within .ia-file-inner {
    border-color: rgba(250,204,21,0.5);
    background: rgba(250,204,21,0.025);
    color: #facc15;
  }
  .ia-file-inner.err { border-color: rgba(248,113,113,0.4); }
  .ia-file-name { color: #facc15; font-weight: 600; word-break: break-all; }

  /* ─── CHECKBOX ─── */
  .ia-check-wrap {
    display: flex; align-items: flex-start; gap: 12px; cursor: pointer;
    padding: clamp(11px, 2vw, 14px) clamp(12px, 2.5vw, 16px);
    background: rgba(255,255,255,0.018);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 6px; transition: border-color 0.2s, background 0.2s;
    user-select: none;
  }
  .ia-check-wrap:hover { border-color: rgba(250,204,21,0.2); background: rgba(250,204,21,0.018); }
  .ia-check-wrap.err   { border-color: rgba(248,113,113,0.35); }

  .ia-check-box {
    width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;
    border: 1px solid rgba(250,204,21,0.3);
    border-radius: 3px;
    background: rgba(250,204,21,0.04);
    position: relative; transition: all 0.2s;
  }
  .ia-check-box.checked { background: #facc15; border-color: #facc15; }
  .ia-check-box.checked::after {
    content: '';
    position: absolute; left: 4px; top: 1px;
    width: 5px; height: 10px;
    border: 2px solid #000; border-top: none; border-left: none;
    transform: rotate(45deg);
  }
  .ia-check-text {
    font-size: clamp(0.65rem, 1.5vw, 0.72rem);
    color: rgba(255,255,255,0.6); line-height: 1.7;
  }

  /* ─── ACTIONS ─── */
  .ia-actions {
    display: flex; gap: 10px; justify-content: flex-end;
    padding-top: 16px;
    border-top: 1px solid rgba(255,255,255,0.05);
    flex-wrap: wrap;
  }

  .ia-btn-cancel {
    padding: clamp(9px, 1.5vw, 11px) clamp(16px, 3vw, 22px);
    background: none; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 6px; color: rgba(255,255,255,0.35);
    font-size: clamp(0.62rem, 1.4vw, 0.7rem);
    font-family: 'Share Tech Mono', monospace;
    letter-spacing: 0.12em; text-transform: uppercase;
    cursor: pointer; transition: all 0.2s;
    white-space: nowrap;
  }
  .ia-btn-cancel:hover { border-color: rgba(255,255,255,0.25); color: rgba(255,255,255,0.6); }
  .ia-btn-cancel:disabled { opacity: 0.4; cursor: not-allowed; }

  .ia-btn-submit {
    padding: clamp(10px, 1.5vw, 12px) clamp(20px, 4vw, 28px);
    background: #facc15; color: #000;
    font-family: 'Orbitron', monospace; font-weight: 700;
    font-size: clamp(0.62rem, 1.4vw, 0.72rem);
    letter-spacing: clamp(1px, 0.3vw, 2px); text-transform: uppercase;
    border: none; border-radius: 6px; cursor: pointer;
    transition: all 0.25s; display: flex; align-items: center; gap: 8px;
    white-space: nowrap;
  }
  .ia-btn-submit:hover {
    background: #fde047; transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(250,204,21,0.4);
  }
  .ia-btn-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

  .ia-spinner {
    width: 13px; height: 13px;
    border: 2px solid rgba(0,0,0,0.2); border-top-color: #000;
    border-radius: 50%; animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  /* ─── GLOBAL ERROR ─── */
  .ia-global-err {
    padding: 12px 16px;
    background: rgba(248,113,113,0.05);
    border: 1px solid rgba(248,113,113,0.22);
    border-left: 3px solid #f87171;
    border-radius: 8px;
    font-size: 0.68rem; color: #fca5a5; letter-spacing: 0.03em;
  }

  /* ── Matrix canvas ── */
  .ia-matrix-canvas {
    position: fixed; inset: 0;
    opacity: 0.035; pointer-events: none; z-index: 0;
  }

  /* ── SUCCESS ── */
  .ia-success-page {
    min-height: 100vh; background: #040404;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Share Tech Mono', monospace;
    position: relative; overflow: hidden; padding: 2rem;
  }
  .ia-success-page::before {
    content: '';
    position: fixed; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, rgba(57,255,20,0.4), transparent);
    animation: scanline 5s linear infinite;
    pointer-events: none; z-index: 200;
  }
  .ia-success-card {
    max-width: 520px; width: 100%;
    background: rgba(4,4,4,0.99);
    border: 1px solid rgba(57,255,20,0.22);
    border-radius: 16px;
    padding: clamp(2rem,6vw,3.5rem);
    text-align: center; position: relative; overflow: hidden;
    animation: successPulse 3s ease-in-out infinite;
  }
  .ia-success-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #39ff14, transparent);
    opacity: 0.55;
  }
  .ia-success-icon {
    width: 72px; height: 72px; border-radius: 50%;
    background: rgba(57,255,20,0.08);
    border: 1px solid rgba(57,255,20,0.28);
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem; margin: 0 auto 1.25rem;
    box-shadow: 0 0 40px rgba(57,255,20,0.15);
  }
  .ia-success-tag { font-size: 0.58rem; color: #39ff14; letter-spacing: 0.22em; margin-bottom: 8px; }
  .ia-success-title {
    font-family: 'Orbitron', monospace;
    font-size: clamp(1.1rem,3vw,1.5rem); font-weight: 900;
    color: #fff; letter-spacing: 2px; text-transform: uppercase;
    margin-bottom: 14px; animation: glitchBlink 6s infinite;
  }
  .ia-success-msg {
    font-size: 0.7rem; color: rgba(255,255,255,0.28);
    line-height: 1.9; margin-bottom: 22px; letter-spacing: 0.03em;
  }
  .ia-success-msg .g { color: rgba(57,255,20,0.55); }
  .ia-success-ref {
    display: inline-block;
    background: rgba(57,255,20,0.05); border: 1px solid rgba(57,255,20,0.18);
    border-radius: 5px; padding: 8px 18px;
    font-size: 0.63rem; color: rgba(57,255,20,0.45); letter-spacing: 0.15em;
    margin-bottom: 28px;
  }
  .ia-success-btn {
    padding: clamp(10px,2vw,12px) clamp(20px,5vw,32px);
    background: #facc15; color: #000;
    font-family: 'Orbitron', monospace; font-weight: 700;
    font-size: clamp(0.62rem, 1.5vw, 0.72rem);
    letter-spacing: 2px; text-transform: uppercase;
    border: none; border-radius: 6px; cursor: pointer; transition: all 0.25s;
    width: 100%; max-width: 280px;
  }
  .ia-success-btn:hover { background: #fde047; transform: translateY(-2px); box-shadow: 0 6px 24px rgba(250,204,21,0.4); }

  /* Success card responsive */
  @media (max-width: 480px) {
    .ia-success-card { border-radius: 10px; }
  }

  /* ─────────────────────────────
     RESPONSIVE BREAKPOINTS
  ───────────────────────────── */

  /* Tablet: collapse 2-col rows to single */
  @media (max-width: 680px) {
    .ia-row { grid-template-columns: 1fr; }
    .ia-row.single { max-width: 100%; }
  }

  /* Landscape mobile: restore 2-col since there's width */
  @media (max-width: 680px) and (orientation: landscape) {
    .ia-row { grid-template-columns: 1fr 1fr; }
    .ia-page { padding-top: 4rem; }
  }

  /* Mobile */
  @media (max-width: 480px) {
    .ia-tbar-path { display: none; }
    .ia-actions { flex-direction: column-reverse; gap: 8px; }
    .ia-btn-cancel { width: 100%; text-align: center; }
    .ia-btn-submit { width: 100%; justify-content: center; }
    .ia-section   { padding: 0.85rem 0.8rem; }
    .ia-form-wrap { padding: 0.85rem 0.75rem; }
    .ia-header    { padding: 1rem 0.85rem; }
    .ia-badges    { gap: 6px; }
    .ia-badge     { padding: 3px 8px; }
    .ia-check-wrap { gap: 10px; padding: 11px 10px; }
  }

  /* Very small: 360px and below */
  @media (max-width: 360px) {
    .ia-page { padding-left: 0.5rem; padding-right: 0.5rem; }
    .ia-tbar { padding: 0.35rem 0.5rem; gap: 4px; }
    .ia-form-wrap { padding: 0.7rem 0.55rem; }
    .ia-section   { padding: 0.75rem 0.6rem; }
    .ia-title { font-size: 0.95rem; letter-spacing: 0.5px; }
    .ia-section-label { font-size: 0.5rem; letter-spacing: 0.1em; }
  }
`;

/* ─── Matrix Rain Canvas ─── */
const MatrixRain = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const cols = Math.floor(canvas.width / 18);
    const drops = Array(cols).fill(1);
    const chars = "アイウエオ01011010APPLY//SYSTEM//INTERNSHIP//SECURE//";
    const draw = () => {
      ctx.fillStyle = "rgba(4,4,4,0.07)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#39ff14";
      ctx.font = "13px 'Share Tech Mono'";
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * 18, y * 18);
        if (y * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };
    const id = setInterval(draw, 55);
    return () => { clearInterval(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="ia-matrix-canvas" />;
};

/* ─── Ghost System Messages ─── */
const GhostText = () => {
  const [msg, setMsg] = useState(GHOST_MESSAGES[0]);
  const [anim, setAnim] = useState("ghostIn 0.5s ease forwards");
  useEffect(() => {
    const cycle = () => {
      setAnim("ghostOut 0.4s ease forwards");
      setTimeout(() => {
        setMsg(GHOST_MESSAGES[Math.floor(Math.random() * GHOST_MESSAGES.length)]);
        setAnim("ghostIn 0.5s ease forwards");
      }, 450);
    };
    const id = setInterval(cycle, 3800);
    return () => clearInterval(id);
  }, []);
  return <div className="ia-ghost" style={{ animation: anim }}>{msg}</div>;
};

/* ─── Progress Bar ─── */
const FormProgress = ({ formData }) => {
  const fields = [
    formData.name, formData.phone, formData.university, formData.degree,
    formData.year, formData.skills, formData.resume, formData.motivation, formData.confirmed,
  ];
  const filled = fields.filter(Boolean).length;
  const pct = Math.round((filled / fields.length) * 100);
  return (
    <div className="ia-progress-wrap">
      <div className="ia-progress-label">
        <span>// form_completion</span>
        <span style={{ color: pct === 100 ? "#39ff14" : "rgba(250,204,21,0.5)" }}>{pct}%</span>
      </div>
      <div className="ia-progress-track">
        <div className="ia-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

/* ─── Field Helper ─── */
const Field = ({ label, hint, error, children }) => (
  <div className="ia-group">
    <label className="ia-label">{label}</label>
    {children}
    {hint && !error && <span className="ia-hint">{hint}</span>}
    {error && <span className="ia-error">{error}</span>}
  </div>
);

/* ─── Section Helper ─── */
const Section = ({ num, label, children }) => (
  <div className="ia-section">
    <div className="ia-section-label">
      <span className="ia-section-num">{num}</span>
      {label}
    </div>
    {children}
  </div>
);

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const InternshipApplication = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", phone: "", university: "", degree: "", year: "",
    skills: "", resume: null, motivation: "", confirmed: false,
  });
  const [resumeFileName, setResumeFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refCode, setRefCode] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(p => ({ ...p, resume: file }));
      setResumeFileName(file.name);
      if (errors.resume) setErrors(p => ({ ...p, resume: "" }));
    }
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim())       e.name       = "full_name required";
    if (!formData.phone.trim())      e.phone      = "phone required";
    if (!formData.university.trim()) e.university = "university required";
    if (!formData.degree.trim())     e.degree     = "degree required";
    if (!formData.year)              e.year       = "year required";
    if (!formData.skills.trim())     e.skills     = "skills required";
    if (!formData.resume)            e.resume     = "resume.pdf required";
    if (!formData.motivation.trim()) e.motivation = "field cannot be empty";
    if (!formData.confirmed)         e.confirmed  = "confirmation required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setIsSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) {
        navigate("/Login?redirect=/internship-application", { replace: true });
        return;
      }
      const fileExt = formData.resume.name.split(".").pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("resumes").upload(fileName, formData.resume);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("resumes").getPublicUrl(fileName);
      const { error } = await supabase.from("applications").insert([{
        name: formData.name, email: user.email, phone: formData.phone,
        university: formData.university, degree: formData.degree,
        year: formData.year, skills: formData.skills,
        motivation: formData.motivation, resume_url: urlData.publicUrl,
        status: "pending", application_type: "internship", user_id: user.id,
      }]);
      if (error) throw error;
      // Mysterious reference code generation
      setRefCode(`APP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setErrors({ _global: err.message });
    }
    setIsSubmitting(false);
  };

  /* ── SUCCESS SCREEN ── */
  if (submitted) {
    return (
      <>
        <style>{CSS}</style>
        <MatrixRain />
        <div className="ia-success-page">
          <motion.div
            className="ia-success-card"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div className="ia-success-tag">// transmission_complete</div>
            <div className="ia-success-icon" style={{ color: "#39ff14", textShadow: "0 0 20px rgba(57,255,20,0.8)" }}>✓</div>
            <div className="ia-success-title">Application Received</div>
            <div className="ia-success-msg">
              Your data has been logged into our systems.<br />
              <span className="g">// a human will review your file shortly.</span><br />
              We'll reach you via the coordinates you provided.<br />
              Do not contact us. We'll find you.
            </div>
            <div className="ia-success-ref">REF: {refCode}</div>
            <br />
            <button className="ia-success-btn" onClick={() => navigate("/Career")}>
              ← RETURN TO BASE
            </button>
          </motion.div>
        </div>
      </>
    );
  }

  /* ── FORM ── */
  return (
    <>
      <style>{CSS}</style>
      <MatrixRain />

      <div className="ia-page">
        <div className="ia-inner">

          <button className="ia-back" onClick={() => navigate("/Career")}>
            ← BACK TO CAREERS
          </button>

          {/* Terminal bar */}
          <div className="ia-tbar">
            <span className="ia-tbar-dots">
              <span className="ia-tbar-dot" style={{ background: "#ff5f57" }} />
              <span className="ia-tbar-dot" style={{ background: "#facc15" }} />
              <span className="ia-tbar-dot" style={{ background: "#39ff14" }} />
            </span>
            <span className="ia-tbar-title">
              INTERNSHIP_APPLICATION.SYS — SECURE FORM
              <span className="ia-tbar-cursor" />
            </span>
            <span className="ia-tbar-path">~/careers/apply</span>
          </div>

          {/* Rotating ghost messages */}
          <GhostText />

          {/* Header */}
          <motion.div
            className="ia-header"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="ia-header-tag">// initiating_application_sequence</div>
            <h1 className="ia-title">
              STUDENT <span className="yellow">INTERNSHIP</span>{" "}
              <span className="green">APPLICATION</span>
            </h1>
            <p className="ia-subtitle">
              All transmissions are encrypted end-to-end.
              Fields marked <span className="ia-req-star">*</span> are required.
              You are being monitored.
            </p>
            <div className="ia-badges">
              <span className="ia-badge green">⬡ ENCRYPTED</span>
              <span className="ia-badge yellow">⚡ LIVE SESSION</span>
              <span className="ia-badge gray">◈ SECURE REVIEW</span>
            </div>
          </motion.div>

          {/* Form body */}
          <motion.form
            className="ia-form-wrap"
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
          >
            <FormProgress formData={formData} />

            {errors._global && (
              <div className="ia-global-err">// error: {errors._global}</div>
            )}

            {/* 1. Personal */}
            <Section num="1" label="personal_information.dat">
              <div className="ia-row">
                <Field label="Full Name *" error={errors.name}>
                  <input className={`ia-input${errors.name ? " err" : ""}`}
                    type="text" name="name" placeholder="your_full_name"
                    value={formData.name} onChange={handleChange} />
                </Field>
                <Field label="Phone *" error={errors.phone}>
                  <input className={`ia-input${errors.phone ? " err" : ""}`}
                    type="tel" name="phone" placeholder="+91_XXXXX_XXXXX"
                    value={formData.phone} onChange={handleChange} />
                </Field>
              </div>
            </Section>

            {/* 2. Education */}
            <Section num="2" label="education_records.log">
              <div className="ia-row">
                <Field label="University *" error={errors.university}>
                  <input className={`ia-input${errors.university ? " err" : ""}`}
                    type="text" name="university" placeholder="institution_name"
                    value={formData.university} onChange={handleChange} />
                </Field>
                <Field label="Degree *" error={errors.degree}>
                  <input className={`ia-input${errors.degree ? " err" : ""}`}
                    type="text" name="degree" placeholder="e.g._B.Tech_CS"
                    value={formData.degree} onChange={handleChange} />
                </Field>
              </div>
              <div className="ia-row single">
                <Field label="Current Year / Semester *" error={errors.year}>
                  <select className={`ia-select${errors.year ? " err" : ""}`}
                    name="year" value={formData.year} onChange={handleChange}>
                    <option value="">select_year</option>
                    {["1st Year / Sem 1","1st Year / Sem 2","2nd Year / Sem 3","2nd Year / Sem 4",
                      "3rd Year / Sem 5","3rd Year / Sem 6","4th Year / Sem 7","4th Year / Sem 8"]
                      .map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </Field>
              </div>
            </Section>

            {/* 3. Skills */}
            <Section num="3" label="skills_matrix.dat">
              <Field label="Technical Skills *" hint="// separate with commas" error={errors.skills}>
                <input className={`ia-input${errors.skills ? " err" : ""}`}
                  type="text" name="skills" placeholder="React, Node.js, Python, Figma..."
                  value={formData.skills} onChange={handleChange} />
              </Field>
            </Section>

            {/* 4. Resume */}
            <Section num="4" label="resume_upload.sys">
              <Field label="Upload Resume (PDF) *" error={errors.resume}>
                <label className="ia-file-label">
                  <input type="file" accept=".pdf" className="ia-file-hidden" onChange={handleFile} />
                  <div className={`ia-file-inner${errors.resume ? " err" : ""}`}>
                    <span style={{ fontSize: "1.1rem" }}>↑</span>
                    {resumeFileName
                      ? <span className="ia-file-name">{resumeFileName}</span>
                      : <span>click_to_upload_resume.pdf</span>}
                  </div>
                </label>
              </Field>
            </Section>

            {/* 5. Motivation */}
            <Section num="5" label="psych_profile.query">
              <Field
                label="Why do you want this internship? *"
                hint="// min 50 chars — vague answers are flagged and filtered automatically"
                error={errors.motivation}
              >
                <textarea
                  className={`ia-textarea${errors.motivation ? " err" : ""}`}
                  name="motivation" rows={5}
                  placeholder="// tell us what drew you here. the void appreciates honesty."
                  value={formData.motivation} onChange={handleChange}
                />
              </Field>
            </Section>

            {/* 6. Confirmation */}
            <Section num="6" label="confirmation_protocol">
              <div
                className={`ia-check-wrap${errors.confirmed ? " err" : ""}`}
                onClick={() => {
                  setFormData(p => ({ ...p, confirmed: !p.confirmed }));
                  if (errors.confirmed) setErrors(p => ({ ...p, confirmed: "" }));
                }}
              >
                <div className={`ia-check-box${formData.confirmed ? " checked" : ""}`} />
                <span className="ia-check-text">
                  // I confirm that all provided information is accurate and truthful.
                  I understand that false data will result in immediate disqualification
                  and permanent blacklisting from this organization.
                </span>
              </div>
              {errors.confirmed && <div className="ia-error">{errors.confirmed}</div>}
            </Section>

            {/* Actions */}
            <div className="ia-actions">
              <button type="button" className="ia-btn-cancel"
                onClick={() => navigate("/Career")} disabled={isSubmitting}>
                CANCEL
              </button>
              <button type="submit" className="ia-btn-submit" disabled={isSubmitting}>
                {isSubmitting
                  ? <><div className="ia-spinner" /> TRANSMITTING...</>
                  : "SUBMIT APPLICATION →"}
              </button>
            </div>
          </motion.form>

        </div>
      </div>
    </>
  );
};

export default InternshipApplication;