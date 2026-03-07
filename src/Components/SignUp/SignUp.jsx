import React, { useState } from "react";
import { supabase } from "../../services/supabase";
import { Link, useNavigate } from "react-router-dom";

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  if (!message) return null;

  const styles = {
    wrapper: {
      position: "fixed",
      top: "1.5rem",
      right: "1.5rem",
      zIndex: 9999,
      animation: "slideIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
    },
    toast: {
      display: "flex",
      alignItems: "flex-start",
      gap: "0.75rem",
      padding: "1rem 1.25rem",
      borderRadius: "12px",
      maxWidth: "360px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
      backdropFilter: "blur(16px)",
      border:
        type === "error"
          ? "1px solid rgba(239,68,68,0.4)"
          : "1px solid rgba(74,222,128,0.4)",
      background:
        type === "error" ? "rgba(30, 10, 10, 0.85)" : "rgba(10, 30, 15, 0.85)",
    },
    icon: {
      fontSize: "1.2rem",
      marginTop: "1px",
      flexShrink: 0,
    },
    body: {
      flex: 1,
    },
    title: {
      fontWeight: 700,
      fontSize: "0.88rem",
      color: type === "error" ? "#f87171" : "#4ade80",
      marginBottom: "0.2rem",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    text: {
      fontSize: "0.82rem",
      color: "rgba(255,255,255,0.72)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      lineHeight: 1.45,
    },
    close: {
      background: "none",
      border: "none",
      color: "rgba(255,255,255,0.4)",
      cursor: "pointer",
      fontSize: "1rem",
      padding: "0",
      lineHeight: 1,
      flexShrink: 0,
      transition: "color 0.2s",
    },
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0)   scale(1);    }
        }
      `}</style>
      <div style={styles.wrapper}>
        <div style={styles.toast}>
          <span style={styles.icon}>{type === "error" ? "⚠️" : "✅"}</span>
          <div style={styles.body}>
            <div style={styles.title}>
              {type === "error" ? "Error" : "Success"}
            </div>
            <div style={styles.text}>{message}</div>
          </div>
          <button
            style={styles.close}
            onClick={onClose}
            onMouseEnter={(e) => (e.target.style.color = "#fff")}
            onMouseLeave={(e) =>
              (e.target.style.color = "rgba(255,255,255,0.4)")
            }
          >
            ✕
          </button>
        </div>
      </div>
    </>
  );
};

const Signup = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    if (type === "success") {
      setTimeout(() => setToast({ message: "", type: "" }), 4000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast("Passwords do not match. Please re-enter them.", "error");
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters long.", "error");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: "https://lumbinitechnologies.com/login",
      },
    });

    if (error) {
      showToast(error.message, "error");
      setLoading(false);
      return;
    }

    showToast(
      "Account created! Please check your email to confirm your account.",
      "success",
    );
    setTimeout(() => navigate("/Login"), 2500);
    setLoading(false);
  };

  return (
    <>
      <style>{`
        .signup-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          background: transparent;
          padding: 8rem 1rem;
          margin-top: 7rem;
        }

        .signup-form {
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

        .signup-title {
          font-size: 2rem;
          margin-bottom: 0.4rem;
          color: #ffffff;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .signup-subtitle {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9rem;
          margin-bottom: 1.8rem;
        }

        .signup-field {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin: 10px 0;
        }

        .signup-input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.08);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          font-size: 1rem;
          color: #ffffff;
          box-sizing: border-box;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .signup-input::placeholder {
          color: rgba(255, 255, 255, 0.45);
        }

        .signup-input:focus {
          border-color: #facc15;
          box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.15);
          outline: none;
        }

        .signup-input.input-error {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
        }

        .error-msg {
          font-size: 0.78rem;
          color: #f87171;
          margin-top: 5px;
          font-weight: 500;
        }

        .signup-button {
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

        .signup-button:hover {
          background-color: #fde047;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(250, 204, 21, 0.35);
        }

        .signup-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .signup-footer {
          margin-top: 1.25rem;
          color: rgba(255, 255, 255, 0.55);
          font-size: 0.9rem;
        }

        .signup-footer a {
          color: #facc15;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .signup-footer a:hover {
          color: #fde047;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .signup-container {
            padding: 10rem 1rem;
            margin-top: 1rem;
          }

          .signup-form {
            padding: 2rem 1.5rem;
          }

          .signup-title {
            font-size: 1.6rem;
          }

          .signup-button {
            font-size: 1rem;
          }
        }
      `}</style>

      {/* Toast notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
      />

      <div className="signup-container">
        <form onSubmit={handleSubmit} className="signup-form">
          <h2 className="signup-title">Create Account</h2>
          <p className="signup-subtitle">Join us today</p>

          <div className="signup-field">
            <input
              type="text"
              placeholder="Full Name"
              className="signup-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="signup-field">
            <input
              type="email"
              placeholder="Email Address"
              className="signup-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="signup-field">
            <input
              type="password"
              placeholder="Password"
              className="signup-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="signup-field">
            <input
              type="password"
              placeholder="Confirm Password"
              className={`signup-input ${
                confirmPassword && password !== confirmPassword
                  ? "input-error"
                  : ""
              }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPassword && password !== confirmPassword && (
              <span className="error-msg">Passwords do not match</span>
            )}
          </div>

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="signup-footer">
            Already have an account? <Link to="/Login">Login</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Signup;
