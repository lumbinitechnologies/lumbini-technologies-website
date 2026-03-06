import React, { useState } from "react";
import { supabase } from "../../services/supabase";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    alert("Account created! Please check your email to confirm your account.");
    navigate("/Login");
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
