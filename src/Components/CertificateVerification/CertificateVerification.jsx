import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { supabase } from "../../services/supabase";

const DEFAULT_ROLE = "Software Engineer Intern";
const DEFAULT_DEPARTMENT = "Engineering & Product";

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const CertificateVerification = () => {
  const navigate = useNavigate();
  const { certificateId: routeCertificateId } = useParams();
  const [searchParams] = useSearchParams();
  const queryCertificateId = searchParams.get("certificate") || "";
  const initialCertificateId = routeCertificateId || queryCertificateId;
  const [certificateId, setCertificateId] = useState(initialCertificateId);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const verify = async (value) => {
    const normalized = value.trim();
    setSearched(true);
    setCertificate(null);
    setError("");
    if (!normalized) {
      setError("Enter a certificate number to continue.");
      return;
    }

    setLoading(true);
    try {
      const { data, error: rpcError } = await supabase.rpc("verify_certificate", {
        p_certificate_id: normalized,
      });
      if (rpcError) throw rpcError;
      setCertificate(data?.[0] || null);
    } catch {
      setError("Verification is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialValue = routeCertificateId || queryCertificateId;
    if (initialValue) {
      setCertificateId(initialValue);
      verify(initialValue);
    }
  }, [routeCertificateId, queryCertificateId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalized = certificateId.trim();
    if (!normalized) {
      verify(normalized);
      return;
    }
    navigate(`/verify-certificate/${encodeURIComponent(normalized.toUpperCase())}`);
  };

  return (
    <main className="certificate-verification">
      <style>{`
        .certificate-verification {
          min-height: 82vh;
          padding: 7rem 1.25rem 5rem;
          display: flex;
          justify-content: center;
          color: #e2e8f0;
          font-family: 'Share Tech Mono', monospace;
          position: relative;
          overflow: hidden;
        }
        .certificate-verification::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          background-image: linear-gradient(rgba(57,255,20,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,.035) 1px, transparent 1px);
          background-size: 46px 46px;
          mask-image: linear-gradient(to bottom, black, transparent 88%);
        }
        .certificate-verification::after {
          content: '';
          position: fixed;
          left: 0;
          right: 0;
          top: 0;
          height: 1px;
          background: #39ff14;
          opacity: .45;
          box-shadow: 0 0 18px #39ff14;
          animation: cvScan 7s linear infinite;
          pointer-events: none;
        }
        @keyframes cvScan {
          from { transform: translateY(12vh); }
          to { transform: translateY(88vh); }
        }
        .cv-shell {
          width: min(100%, 1080px);
          position: relative;
        }
        .cv-topline {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2.6rem;
          color: rgba(226,232,240,.48);
          font-size: .68rem;
          letter-spacing: .16em;
        }
        .cv-brand {
          color: #facc15;
          font-weight: 700;
        }
        .cv-live {
          display: inline-flex;
          align-items: center;
          gap: .45rem;
        }
        .cv-live::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #39ff14;
          box-shadow: 0 0 10px #39ff14;
        }
        .cv-layout {
          display: grid;
          grid-template-columns: minmax(250px, .72fr) minmax(0, 1.28fr);
          gap: clamp(1.5rem, 5vw, 5rem);
          align-items: start;
        }
        .cv-intro {
          padding-top: 1rem;
        }
        .cv-kicker {
          color: #39ff14;
          font-size: .72rem;
          letter-spacing: .2em;
          margin-bottom: 1.1rem;
        }
        .cv-title {
          color: #fff;
          font-family: 'Orbitron', monospace;
          font-size: clamp(2rem, 5vw, 4.2rem);
          line-height: 1.05;
          letter-spacing: .01em;
          margin-bottom: 1.2rem;
          text-shadow: 0 0 26px rgba(57,255,20,.18);
        }
        .cv-title span {
          display: block;
          color: #facc15;
        }
        .cv-copy {
          color: rgba(226,232,240,.64);
          line-height: 1.75;
          max-width: 410px;
          margin-bottom: 2rem;
        }
        .cv-stamp {
          display: inline-flex;
          align-items: center;
          gap: .6rem;
          padding: .75rem .9rem;
          border-left: 2px solid #facc15;
          color: rgba(255,255,255,.7);
          background: rgba(250,204,21,.055);
          font-size: .7rem;
          letter-spacing: .08em;
        }
        .cv-stamp strong { color: #facc15; }
        .cv-console {
          padding: clamp(1.1rem, 3vw, 1.8rem);
          border: 1px solid rgba(57,255,20,.28);
          background: linear-gradient(145deg, rgba(5,17,14,.94), rgba(7,12,24,.92));
          box-shadow: 0 22px 70px rgba(0,0,0,.38), inset 0 1px 0 rgba(255,255,255,.06);
          position: relative;
        }
        .cv-console::before {
          content: 'LT / PUBLIC RECORD';
          position: absolute;
          top: -1px;
          right: 1.2rem;
          transform: translateY(-50%);
          padding: .35rem .55rem;
          color: #39ff14;
          background: #07100e;
          border: 1px solid rgba(57,255,20,.35);
          font-size: .58rem;
          letter-spacing: .13em;
        }
        .cv-form {
          display: flex;
          gap: .7rem;
          flex-wrap: wrap;
          margin-bottom: 1.1rem;
        }
        .cv-input {
          flex: 1 1 280px;
          min-width: 0;
          padding: 1rem;
          color: #fff;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(250,204,21,.28);
          font: inherit;
          text-transform: uppercase;
          letter-spacing: .08em;
          outline: none;
          border-radius: 0;
        }
        .cv-input:focus { border-color: #facc15; box-shadow: 0 0 0 3px rgba(250,204,21,.1); }
        .cv-button {
          border: 1px solid #facc15;
          background: #facc15;
          color: #111827;
          padding: 1rem 1.2rem;
          font: 700 .76rem 'Share Tech Mono', monospace;
          letter-spacing: .08em;
          cursor: pointer;
          transition: box-shadow .2s ease, transform .2s ease;
        }
        .cv-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 0 22px rgba(250,204,21,.28);
        }
        .cv-button:disabled { opacity: .55; cursor: wait; }
        .cv-result, .cv-error {
          margin-top: 1.6rem;
          padding: 1.4rem;
          border: 1px solid rgba(57,255,20,.3);
          background: linear-gradient(145deg, rgba(4, 15, 12, .92), rgba(5, 10, 18, .88));
          box-shadow: 0 18px 50px rgba(0, 0, 0, .3), inset 0 1px 0 rgba(255,255,255,.05);
          backdrop-filter: blur(14px);
        }
        .cv-result { animation: cvReveal .45s ease both; }
        @keyframes cvReveal {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cv-error { border-color: rgba(248,113,113,.35); background: rgba(248,113,113,.06); color: #fca5a5; }
        .cv-valid { color: #39ff14; font-size: .72rem; letter-spacing: .14em; margin-bottom: 1rem; }
        .cv-id { color: #fff; font-size: 1.1rem; letter-spacing: .1em; margin: .35rem 0 1.4rem; word-break: break-word; }
        .cv-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .8rem; }
        .cv-field { min-width: 0; padding: .85rem .9rem; border: 1px solid rgba(255,255,255,.1); border-radius: 4px; background: rgba(255,255,255,.045); }
        .cv-label { color: #cbd5e1; font-size: .68rem; font-weight: 700; letter-spacing: .11em; line-height: 1.3; margin-bottom: .42rem; }
        .cv-value { color: #fff; font-size: .95rem; line-height: 1.45; overflow-wrap: anywhere; }
        @media (max-width: 760px) {
          .cv-layout { grid-template-columns: 1fr; gap: 2rem; }
          .cv-intro { padding-top: 0; }
          .cv-copy { max-width: 560px; }
        }
        @media (max-width: 520px) {
          .certificate-verification { padding-top: 6rem; }
          .cv-topline { align-items: flex-start; flex-direction: column; gap: .7rem; margin-bottom: 2rem; }
          .cv-grid { grid-template-columns: 1fr; }
          .cv-button { width: 100%; }
        }
      `}</style>
      <section className="cv-shell">
        <div className="cv-topline"><span className="cv-brand">LUMBINI TECHNOLOGIES / VERIFICATION NODE</span><span className="cv-live">PUBLIC LEDGER ONLINE</span></div>
        <div className="cv-layout">
          <div className="cv-intro">
            <div className="cv-kicker">CERTIFICATE AUTHENTICATION</div>
            <h1 className="cv-title">Verify the <span>real record.</span></h1>
            <p className="cv-copy">Confirm an internship certificate directly against Lumbini Technologies' official record. Every certificate ID maps to one issued document.</p>
            <div className="cv-stamp"><strong>SECURE LOOKUP</strong><span>// read-only public access</span></div>
          </div>
          <div className="cv-console">
            <form className="cv-form" onSubmit={handleSubmit}>
              <input
                className="cv-input"
                value={certificateId}
                onChange={(event) => setCertificateId(event.target.value)}
                placeholder="LT-IC-2026-000001"
                aria-label="Certificate number"
              />
              <button className="cv-button" type="submit" disabled={loading}>
                {loading ? "CHECKING..." : "VERIFY CERTIFICATE"}
              </button>
            </form>

            {error && <div className="cv-error" role="alert">{error}</div>}
            {searched && !loading && !error && !certificate && (
              <div className="cv-error" role="status">No certificate was found for that number.</div>
            )}
            {certificate && (
              <div className="cv-result" role="status">
                <div className="cv-valid">CERTIFICATE {certificate.status?.toUpperCase() || "VALID"}</div>
                <div className="cv-label">CERTIFICATE ID</div>
                <div className="cv-id">{certificate.certificate_id}</div>
                <div className="cv-grid">
                  <div className="cv-field"><div className="cv-label">CERTIFICATE HOLDER</div><div className="cv-value">{certificate.holder_name}</div></div>
                  <div className="cv-field"><div className="cv-label">ROLE</div><div className="cv-value">{certificate.role || DEFAULT_ROLE}</div></div>
                  <div className="cv-field"><div className="cv-label">DEPARTMENT</div><div className="cv-value">{certificate.department || DEFAULT_DEPARTMENT}</div></div>
                  <div className="cv-field"><div className="cv-label">ISSUED ON</div><div className="cv-value">{formatDate(certificate.issue_date)}</div></div>
                  <div className="cv-field"><div className="cv-label">INTERNSHIP START</div><div className="cv-value">{formatDate(certificate.internship_start)}</div></div>
                  <div className="cv-field"><div className="cv-label">INTERNSHIP END</div><div className="cv-value">{formatDate(certificate.internship_end)}</div></div>
                  <div className="cv-field"><div className="cv-label">STATUS</div><div className="cv-value">{certificate.status?.toUpperCase() || "VALID"}</div></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CertificateVerification;
