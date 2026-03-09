import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PasswordWhisper = ({ visible }) => {
  if (!visible) return null;
  return (
    <div className="password-whisper">
      <span className="whisper-eye">⚠</span>
      <span className="whisper-text">
        <span className="whisper-tag">[SYS://NOTICE]</span>{" "}
        No preview. No reveal. Intentional.{" "}
        <span className="whisper-accent">Type with precision.</span>{" "}
        What enters the void... stays in the void.
      </span>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUnverified, setIsUnverified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  useEffect(() => {
    if (session && !authLoading) navigate("/dashboard", { replace: true });
  }, [session, authLoading, navigate]);

  const params = new URLSearchParams(location.search);
  const redirectParam = params.get("redirect");
  let redirectTo = "/dashboard";
  if (redirectParam) {
    try { redirectTo = decodeURIComponent(redirectParam); }
    catch { redirectTo = redirectParam; }
  }

  // ── Single submit handler on the <form> — fixes double-click bug ──
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setError(""); setIsUnverified(false); setResendSuccess(false); setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(), password,
    });

    if (signInError) {
      const msg = signInError.message?.toLowerCase() ?? "";
      if (msg.includes("email not confirmed") || msg.includes("not confirmed")) {
        setIsUnverified(true);
        setError("Your email hasn't been verified yet. Please check your inbox and confirm your account before logging in.");
      } else if (msg.includes("invalid login credentials") || msg.includes("invalid credentials")) {
        setError("Incorrect email or password. Please try again.");
      } else if (msg.includes("timeout") || signInError.status === 504) {
        setError("Server timed out. Please try again in a moment.");
      } else { setError(signInError.message); }
      setLoading(false); return;
    }

    const { data: adminData } = await supabase.from("admins").select("id").eq("email", data.user.email).maybeSingle();
    if (adminData) { navigate("/admin-dashboard", { replace: true }); }
    else { navigate(redirectTo, { replace: true }); }
    setLoading(false);
  };

  const handleResendVerification = async () => {
    if (!email) { setError("Please enter your email address above so we can resend the verification."); return; }
    setResendLoading(true); setResendSuccess(false);
    const { error: resendError } = await supabase.auth.resend({
      type: "signup", email: email.trim().toLowerCase(),
      options: { emailRedirectTo: `${window.location.origin}/email-confirmed` },
    });
    setResendLoading(false);
    if (resendError) { setError("Failed to resend verification email. Please try again."); }
    else { setResendSuccess(true); }
  };

  if (authLoading) {
    return (
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        height: "100vh", color: "#39ff14",
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: "0.75rem", letterSpacing: "0.15em",
      }}>
        // AUTHENTICATING...
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');

        @keyframes glitchBlink {
          0%, 94%, 100% { opacity: 1; text-shadow: 0 0 10px #facc15, 0 0 40px rgba(250,204,21,0.2); }
          95%            { opacity: 0.2; text-shadow: 5px 0 #facc15; }
          97%            { opacity: 0.8; text-shadow: -4px 0 #facc15; }
        }
        @keyframes whisperIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes warningPulse {
          0%, 100% { opacity: 0.7; }
          50%       { opacity: 1; text-shadow: 0 0 10px #facc15; }
        }
        @keyframes terminalCursor {
          0%, 100% { opacity: 1; } 50% { opacity: 0; }
        }

        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          background: transparent;
          padding: 8rem 1rem;
          margin-top: 7rem;
        }

        .login-form {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 20px;
          box-shadow: 0 8px 20px rgba(255, 255, 255, 0.2);
          padding: 2.5rem 3rem;
          width: 100%;
          max-width: 500px;
          box-sizing: border-box;
          text-align: center;
          font-family: 'Share Tech Mono', monospace;
        }

        .login-tbar {
          display: flex; align-items: center; gap: 5px;
          margin-bottom: 1.6rem;
          padding: 0.3rem 0.65rem;
          background: rgba(57,255,20,0.06);
          border: 1px solid rgba(57,255,20,0.2);
          border-radius: 5px;
          font-size: 0.56rem; color: #39ff14; letter-spacing: 0.12em;
          text-align: left;
        }
        .login-tbar-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .login-tbar-text { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-left: 3px; }
        .login-cursor {
          display: inline-block; width: 5px; height: 10px;
          background: #39ff14; margin-left: 3px;
          animation: terminalCursor 1s step-end infinite;
          vertical-align: middle;
        }

        .login-title {
          font-size: 2rem;
          margin-bottom: 0.4rem;
          color: #facc15;
          font-weight: 900;
          letter-spacing: 3px;
          font-family: 'Orbitron', monospace;
          text-shadow: 0 0 20px rgba(250,204,21,0.5), 0 0 40px rgba(250,204,21,0.2);
          animation: glitchBlink 6s infinite;
        }

        .login-subtitle {
          color: rgba(57, 255, 20, 0.55);
          font-size: 0.76rem;
          margin-bottom: 1.8rem;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .login-input {
          width: 100%;
          padding: 14px 16px;
          margin: 10px 0;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(250, 204, 21, 0.3);
          border-radius: 8px;
          font-size: 0.95rem;
          color: #fff;
          box-sizing: border-box;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.05em;
          outline: none;
        }
        .login-input::placeholder { color: rgba(250, 204, 21, 0.28); }
        .login-input:focus {
          border-color: #facc15;
          box-shadow: 0 0 0 2px rgba(250,204,21,0.12), 0 0 18px rgba(250,204,21,0.1);
          background: rgba(255, 255, 255, 0.1);
        }

        .password-whisper {
          display: flex; align-items: flex-start; gap: 0.55rem;
          margin-top: 0.1rem; margin-bottom: 0.3rem;
          padding: 0.6rem 0.85rem;
          border-radius: 6px;
          background: rgba(250, 204, 21, 0.06);
          border: 1px solid rgba(250, 204, 21, 0.28);
          border-left: 3px solid #facc15;
          animation: whisperIn 0.35s ease forwards;
          width: 100%; box-sizing: border-box; text-align: left;
          box-shadow: 0 0 20px rgba(250,204,21,0.06);
        }
        .whisper-eye {
          font-size: 0.85rem; flex-shrink: 0; color: #facc15;
          margin-top: 2px; animation: warningPulse 2s infinite;
        }
        .whisper-text {
          font-size: 0.72rem; line-height: 1.6;
          color: rgba(250, 204, 21, 0.6);
          font-family: 'Share Tech Mono', monospace; letter-spacing: 0.03em;
        }
        .whisper-tag { color: #facc15; font-weight: 700; text-shadow: 0 0 8px rgba(250,204,21,0.5); }
        .whisper-accent {
          color: rgba(250, 204, 21, 0.95);
          text-decoration: underline;
          text-decoration-color: rgba(250,204,21,0.4);
          text-underline-offset: 2px;
        }

        .login-error {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-left: 3px solid #ef4444;
          border-radius: 6px; padding: 10px 14px;
          font-size: 0.74rem; color: #f87171; margin-top: 10px;
          text-align: left; font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.03em; line-height: 1.6;
        }

        .login-unverified {
          background: rgba(239, 68, 68, 0.06);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-left: 3px solid #ef4444;
          border-radius: 6px; padding: 12px 14px;
          margin-top: 10px; text-align: left;
        }
        .login-unverified p {
          font-size: 0.74rem; color: #f87171;
          margin: 0 0 8px; line-height: 1.55;
          font-family: 'Share Tech Mono', monospace;
        }
        .resend-btn {
          background: none;
          border: 1px solid rgba(250, 204, 21, 0.4);
          border-radius: 6px; color: #facc15; font-size: 0.72rem;
          padding: 6px 14px; cursor: pointer;
          transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
          font-family: 'Share Tech Mono', monospace; letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .resend-btn:hover:not(:disabled) {
          background: rgba(250,204,21,0.08); border-color: #facc15;
          box-shadow: 0 0 12px rgba(250,204,21,0.15);
        }
        .resend-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .resend-success {
          font-size: 0.7rem; color: #39ff14; margin-top: 7px;
          display: block; font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.05em;
        }

        .redirect-notice {
          background: rgba(239,68,68,0.06);
          border: 1px solid rgba(239,68,68,0.3);
          border-left: 3px solid #ef4444;
          border-radius: 6px; padding: 9px 13px;
          font-size: 0.68rem; color: #f87171;
          margin-bottom: 1.2rem; text-align: left;
          font-family: 'Share Tech Mono', monospace; letter-spacing: 0.04em;
        }

        .login-button {
          width: 100%; padding: 14px;
          background: #facc15;
          border: none; border-radius: 8px;
          color: #000; font-weight: 700;
          font-size: 1rem; cursor: pointer; margin-top: 1.5rem;
          transition: all 0.3s ease;
          font-family: 'Orbitron', monospace;
          letter-spacing: 2px; text-transform: uppercase;
        }
        .login-button:hover {
          background: #fde047;
          transform: translateY(-1px);
          box-shadow: 0 4px 24px rgba(250,204,21,0.45), 0 0 40px rgba(250,204,21,0.15);
        }
        .login-button:active { transform: translateY(0); }
        .login-button:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

        .login-footer {
          margin-top: 1.25rem;
          color: rgba(255, 255, 255, 0.35);
          font-size: 0.78rem;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 1px;
        }
        .login-footer a {
          color: #facc15; font-weight: 600; text-decoration: none;
          transition: color 0.2s; text-shadow: 0 0 8px rgba(250,204,21,0.4);
        }
        .login-footer a:hover { color: #fde047; text-decoration: underline; }

        @media (max-width: 768px) {
          .login-container { padding: 10rem 1rem; margin-top: 1rem; }
          .login-form { padding: 2rem 1.5rem; }
          .login-title { font-size: 1.5rem; }
          .login-button { font-size: 0.9rem; }
        }
      `}</style>

      <div className="login-container">
        {/* ── form onSubmit handles both Enter key and button click ── */}
        <form className="login-form" onSubmit={handleLogin} noValidate>

          <div className="login-tbar">
            <span className="login-tbar-dot" style={{ background: "#ff5f57" }} />
            <span className="login-tbar-dot" style={{ background: "#facc15" }} />
            <span className="login-tbar-dot" style={{ background: "#39ff14" }} />
            <span className="login-tbar-text">AUTH.SYS — SECURE LOGIN<span className="login-cursor" /></span>
          </div>

          <h2 className="login-title">LOGIN</h2>
          <p className="login-subtitle">// authenticate user</p>

          {redirectTo !== "/dashboard" && (
            <div className="redirect-notice">// access restricted — authenticate to continue</div>
          )}

          <input type="email" placeholder="email_address" className="login-input"
            value={email} onChange={(e) => setEmail(e.target.value)}
            disabled={loading} />

          <input type="password" placeholder="password" className="login-input"
            value={password} onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            disabled={loading} />

          <PasswordWhisper visible={passwordFocused} />

          {error && !isUnverified && <div className="login-error">// {error}</div>}

          {isUnverified && (
            <div className="login-unverified">
              <p>// {error}</p>
              <button type="button" className="resend-btn" onClick={handleResendVerification}
                disabled={resendLoading || resendSuccess}>
                {resendLoading ? "SENDING..." : "RESEND_VERIFICATION"}
              </button>
              {resendSuccess && <span className="resend-success">✓ verification sent — check inbox</span>}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
            onMouseDown={(e) => e.preventDefault()}
          >
            {loading ? "AUTHENTICATING..." : "LOGIN"}
          </button>

          <p className="login-footer">
            no account? <Link to="/signup">SIGN UP</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;