import React, { useState } from "react";
import { supabase } from "../../services/supabase";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const params = new URLSearchParams(location.search);
  const redirectParam = params.get("redirect");
  let redirectTo = "/dashboard";
  if (redirectParam) {
    try {
      redirectTo = decodeURIComponent(redirectParam);
    } catch {
      redirectTo = redirectParam;
    }
  }

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    setLoading(true);

    console.log("[Login] Attempting login for:", email);

    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email: email.trim(),
        password,
      },
    );

    console.log("[Login] Result:", { data, error: signInError });

    if (signInError) {
      console.error("[Login] Error:", signInError.message);
      setError(signInError.message);
      setLoading(false);
      return;
    }

    console.log("[Login] Success, checking admin...");

    const { data: adminData, error: adminError } = await supabase
      .from("admins")
      .select("id")
      .eq("email", data.user.email)
      .maybeSingle();

    console.log("[Login] Admin check:", { adminData, adminError });

    if (adminData) {
      console.log("[Login] Navigating to admin dashboard");
      navigate("/admin-dashboard", { replace: true });
    } else {
      console.log("[Login] Navigating to:", redirectTo);
      navigate(redirectTo, { replace: true });
    }

    setLoading(false);
  };

  return (
    <>
      <style>{`
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
          border-radius: 20px;
          box-shadow: 0 8px 20px rgba(255, 255, 255, 0.2);
          padding: 2.5rem 3rem;
          width: 100%;
          max-width: 500px;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          text-align: center;
        }

        .login-title {
          font-size: 2rem;
          margin-bottom: 0.4rem;
          color: #ffffff;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .login-subtitle {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9rem;
          margin-bottom: 1.8rem;
        }

        .login-input {
          width: 100%;
          padding: 14px 16px;
          margin: 10px 0;
          background: rgba(255, 255, 255, 0.08);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          font-size: 1rem;
          color: #ffffff;
          box-sizing: border-box;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .login-input::placeholder { color: rgba(255, 255, 255, 0.45); }

        .login-input:focus {
          border-color: #facc15;
          box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.15);
          outline: none;
        }

        .login-error {
          background: rgba(248, 113, 113, 0.1);
          border: 1px solid rgba(248, 113, 113, 0.3);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 0.85rem;
          color: #f87171;
          margin-top: 10px;
          text-align: left;
        }

        .login-button {
          width: 100%;
          padding: 14px;
          background-color: #facc15;
          border: none;
          border-radius: 8px;
          color: #000;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          margin-top: 1.5rem;
          transition: all 0.3s ease;
        }

        .login-button:hover {
          background-color: #fde047;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(250, 204, 21, 0.35);
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .login-footer {
          margin-top: 1.25rem;
          color: rgba(255, 255, 255, 0.55);
          font-size: 0.9rem;
        }

        .login-footer a {
          color: #facc15;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .login-footer a:hover {
          color: #fde047;
          text-decoration: underline;
        }

        .redirect-notice {
          background: rgba(250, 204, 21, 0.08);
          border: 1px solid rgba(250, 204, 21, 0.25);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 0.82rem;
          color: #facc15;
          margin-bottom: 1.2rem;
        }

        @media (max-width: 768px) {
          .login-container { padding: 10rem 1rem; margin-top: 1rem; }
          .login-form { padding: 2rem 1.5rem; }
          .login-title { font-size: 1.6rem; }
          .login-button { font-size: 1rem; }
        }
      `}</style>

      <div className="login-container">
        <div className="login-form">
          <h2 className="login-title">Login</h2>
          <p className="login-subtitle">Welcome back</p>

          {redirectTo !== "/dashboard" && (
            <div className="redirect-notice">
              Please log in to continue with your application.
            </div>
          )}

          <input
            type="email"
            placeholder="Email Address"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          {error && <div className="login-error">{error}</div>}

          <button
            className="login-button"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="login-footer">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
