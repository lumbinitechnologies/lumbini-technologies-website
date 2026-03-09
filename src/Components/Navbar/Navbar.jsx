import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();

  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const userMenuRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    setAboutOpen(false);
    setUserMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setAboutOpen(false);
    setUserMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      setUserMenuOpen(false);
      setIsAdmin(false);
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      navigate("/");
      closeMenu();
    }
  };

  const checkAdmin = async (email) => {
    try {
      const { data } = await supabase
        .from("admins")
        .select("id")
        .eq("email", email)
        .maybeSingle();
      setIsAdmin(!!data);
    } catch {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setIsAdmin(false); return; }
    checkAdmin(user.email);
  }, [user, authLoading]);

  useEffect(() => { closeMenu(); }, [location]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatarLetter = user?.email?.[0]?.toUpperCase() || "U";

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        /* ── Header ── */
        .lt-header {
          position: fixed;
          top: 0; left: 0; right: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 40px;
          background: transparent;
          transition: background 0.35s, box-shadow 0.35s;
          z-index: 1060;
          gap: 12px;
        }
        .lt-header.sticky {
          background: rgba(0,0,0,0.96);
          box-shadow: 0 1px 0 rgba(250,204,21,0.12);
          backdrop-filter: blur(8px);
        }

        /* ── Logo ──
           clamp(min, preferred, max)
           Scales from 14px on tiny screens up to 22px on desktop.
           flex-shrink:1 lets it compress before the hamburger ever gets squeezed. */
        .lt-logo {
          color: #fff;
          font-weight: 700;
          text-decoration: none;
          letter-spacing: -0.3px;
          white-space: nowrap;
          font-size: clamp(14px, 4vw, 22px);
          flex-shrink: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1;
        }
        /* Both words white — no coloured span needed */
        .lt-logo span { color: #fff; }

        /* ── Hamburger ── no box, just bare lines, synced height to logo */
        .lt-hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          /* Width of the lines; height matches logo line-height so they feel paired */
          width: clamp(28px, 5vw, 36px);
          height: clamp(28px, 5vw, 36px);
          min-width: 28px;
          flex-shrink: 0;
          cursor: pointer;
          gap: clamp(4px, 1vw, 6px);
          border: none;
          background: none;
          padding: 0;
          border-radius: 0;
          -webkit-tap-highlight-color: transparent;
          position: relative;
          z-index: 1070;
        }
        .lt-hamburger span {
          display: block;
          width: clamp(18px, 4vw, 24px);
          height: 2px;
          background: #facc15;
          border-radius: 2px;
          transition: transform 0.32s ease, opacity 0.22s ease, width 0.28s ease;
          transform-origin: center;
        }
        .lt-hamburger.open span:nth-child(1) { transform: translateY(clamp(6px,1.2vw,8px)) rotate(45deg); }
        .lt-hamburger.open span:nth-child(2) { opacity: 0; width: 0; }
        .lt-hamburger.open span:nth-child(3) { transform: translateY(clamp(-6px,-1.2vw,-8px)) rotate(-45deg); }

        /* ── Desktop Nav ── */
        .lt-nav {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .lt-nav > a,
        .lt-nav .lt-dropdown-trigger {
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          font-size: 15px;
          padding: 7px 12px;
          border-radius: 6px;
          transition: color 0.22s, background 0.22s;
          white-space: nowrap;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-weight: 400;
          line-height: 1;
        }
        .lt-nav > a:hover,
        .lt-nav .lt-dropdown-trigger:hover { color: #facc15; background: rgba(250,204,21,0.06); }

        /* ── About Dropdown ── */
        .lt-dropdown { position: relative; }
        .lt-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          background: #111;
          border: 1px solid rgba(250,204,21,0.15);
          border-radius: 10px;
          display: none;
          flex-direction: column;
          min-width: 160px;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(0,0,0,0.6);
        }
        .lt-dropdown-menu.open { display: flex; }
        .lt-dropdown-menu a {
          padding: 11px 16px;
          font-size: 14px;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .lt-dropdown-menu a:last-child { border-bottom: none; }
        .lt-dropdown-menu a:hover { background: rgba(250,204,21,0.07); color: #facc15; }

        /* ── Auth Buttons ── */
        .lt-auth { display: flex; align-items: center; gap: 8px; margin-left: 6px; }
        .lt-btn-login {
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          font-size: 14px;
          padding: 7px 14px;
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 7px;
          transition: border-color 0.25s, color 0.25s;
          white-space: nowrap;
        }
        .lt-btn-login:hover { border-color: #facc15; color: #facc15; }
        .lt-btn-signup {
          color: #000 !important;
          text-decoration: none;
          font-size: 14px;
          padding: 7px 14px;
          background: #facc15;
          border-radius: 7px;
          font-weight: 600;
          transition: background 0.25s, box-shadow 0.25s;
          white-space: nowrap;
        }
        .lt-btn-signup:hover { background: #fde047; box-shadow: 0 4px 14px rgba(250,204,21,0.35); }

        /* ── User Avatar (desktop) ── */
        .lt-user { position: relative; margin-left: 8px; }
        .lt-avatar-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: #facc15;
          color: #000;
          font-weight: 700;
          font-size: 14px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .lt-avatar-btn:hover { transform: scale(1.08); box-shadow: 0 0 14px rgba(250,204,21,0.45); }
        .lt-user-menu {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: #111;
          border: 1px solid rgba(250,204,21,0.15);
          border-radius: 10px;
          display: none;
          flex-direction: column;
          min-width: 220px;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(0,0,0,0.6);
          z-index: 999;
        }
        .lt-user-menu.open { display: flex; }
        .lt-user-email {
          padding: 12px 16px;
          font-size: 13px;
          color: #facc15;
          background: rgba(250,204,21,0.06);
          border-bottom: 1px solid rgba(250,204,21,0.1);
          word-break: break-all;
        }
        .lt-user-item {
          padding: 11px 16px;
          font-size: 14px;
          color: rgba(255,255,255,0.75);
          background: none;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          cursor: pointer;
          text-align: left;
          transition: background 0.2s, color 0.2s;
          text-decoration: none;
          display: block;
          width: 100%;
          font-family: inherit;
        }
        .lt-user-item:last-child { border-bottom: none; }
        .lt-user-item:hover { background: rgba(250,204,21,0.05); color: #facc15; }
        .lt-user-item.admin { color: #facc15; background: rgba(250,204,21,0.04); }
        .lt-user-item.admin:hover { background: rgba(250,204,21,0.09); }
        .lt-user-item.logout { color: rgba(248,113,113,0.85); }
        .lt-user-item.logout:hover { background: rgba(239,68,68,0.07); color: #f87171; }

        /* ── Overlay ── */
        .lt-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          z-index: 1040;
          opacity: 0;
          transition: opacity 0.32s;
        }
        .lt-overlay.open { display: block; opacity: 1; }

        /* ── Drawer ──
           padding-top pushes content below the fixed header (≈68px tall on mobile).
           No duplicate logo needed — the main header logo is always visible on top. */
        .lt-drawer {
          display: none;
          position: fixed;
          top: 0; right: 0;
          width: min(300px, 85vw);
          height: 100dvh;
          background: #0a0a0a;
          border-left: 1px solid rgba(250,204,21,0.12);
          flex-direction: column;
          overflow-y: auto;
          z-index: 1050;
          transform: translateX(100%);
          transition: transform 0.36s cubic-bezier(0.4,0,0.2,1);
          padding-top: 68px;
        }
        .lt-drawer.open { transform: translateX(0); }

        /* Drawer body */
        .lt-drawer-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 8px 0 16px;
        }
        .lt-drawer-link {
          display: flex;
          align-items: center;
          padding: 15px 24px;
          color: rgba(255,255,255,0.82);
          text-decoration: none;
          font-size: 15px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.2s, color 0.2s;
          background: none;
          border-left: none; border-right: none; border-top: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
          font-weight: 400;
        }
        .lt-drawer-link:hover { background: rgba(250,204,21,0.06); color: #facc15; }

        /* About accordion */
        .lt-acc { border-bottom: 1px solid rgba(255,255,255,0.04); }
        .lt-acc-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 24px;
          color: rgba(255,255,255,0.82);
          font-size: 15px;
          background: none;
          border: none;
          width: 100%;
          cursor: pointer;
          font-family: inherit;
          transition: color 0.2s;
        }
        .lt-acc-trigger:hover { color: #facc15; }
        .lt-chevron {
          font-size: 10px;
          opacity: 0.5;
          transition: transform 0.28s ease, opacity 0.2s;
        }
        .lt-chevron.open { transform: rotate(180deg); opacity: 1; color: #facc15; }
        .lt-acc-body {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.3s ease;
          background: rgba(255,255,255,0.015);
        }
        .lt-acc-body.open { max-height: 160px; }
        .lt-acc-body a {
          display: block;
          padding: 12px 36px;
          color: rgba(255,255,255,0.62);
          text-decoration: none;
          font-size: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          transition: color 0.2s, background 0.2s;
        }
        .lt-acc-body a:last-child { border-bottom: none; }
        .lt-acc-body a:hover { color: #facc15; background: rgba(250,204,21,0.04); }

        /* Auth section in drawer */
        .lt-drawer-auth {
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-top: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }
        .lt-drawer-login {
          display: block; text-align: center;
          color: rgba(255,255,255,0.82);
          text-decoration: none;
          font-size: 15px;
          padding: 11px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          transition: border-color 0.25s, color 0.25s;
        }
        .lt-drawer-login:hover { border-color: #facc15; color: #facc15; }
        .lt-drawer-signup {
          display: block; text-align: center;
          color: #000 !important;
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
          padding: 11px;
          background: #facc15;
          border-radius: 8px;
          transition: background 0.25s;
        }
        .lt-drawer-signup:hover { background: #fde047; }

        /* User section in drawer */
        .lt-drawer-user {
          padding: 16px 20px;
          border-top: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }
        .lt-drawer-user-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 8px;
        }
        .lt-drawer-avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: #facc15;
          color: #000;
          font-weight: 700;
          font-size: 15px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .lt-drawer-email {
          font-size: 13px;
          color: rgba(255,255,255,0.58);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .lt-drawer-ulink {
          display: block;
          padding: 11px 4px;
          color: rgba(255,255,255,0.75);
          text-decoration: none;
          font-size: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: color 0.2s;
          cursor: pointer;
          background: none;
          border-left: none; border-right: none; border-top: none;
          width: 100%;
          text-align: left;
          font-family: inherit;
        }
        .lt-drawer-ulink:last-child { border-bottom: none; }
        .lt-drawer-ulink:hover { color: #facc15; }
        .lt-drawer-ulink.admin { color: #facc15; }
        .lt-drawer-ulink.logout { color: rgba(248,113,113,0.85); padding-top: 14px; }
        .lt-drawer-ulink.logout:hover { color: #f87171; }

        /* ── Breakpoints ── */
        @media (max-width: 900px) {
          .lt-header { padding: 13px 16px; }
          .lt-hamburger { display: flex; }
          .lt-nav { display: none; }
          .lt-drawer { display: flex; }
        }

        @media (max-width: 1100px) and (min-width: 901px) {
          .lt-header { padding: 14px 24px; }
          .lt-nav { gap: 0; }
          .lt-nav > a,
          .lt-nav .lt-dropdown-trigger { padding: 7px 9px; font-size: 14px; }
        }

        @media (max-width: 380px) {
          .lt-drawer { width: 92vw; padding-top: 62px; }
        }
      `}</style>

      {/* Overlay */}
      <div
        className={`lt-overlay ${menuOpen ? "open" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`lt-drawer ${menuOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="lt-drawer-body">
          <Link to="/" className="lt-drawer-link" onClick={closeMenu}>Home</Link>

          <div className="lt-acc">
            <button
              className="lt-acc-trigger"
              onClick={() => setAboutOpen((p) => !p)}
              aria-expanded={aboutOpen}
            >
              About
              <span className={`lt-chevron ${aboutOpen ? "open" : ""}`}>▼</span>
            </button>
            <div className={`lt-acc-body ${aboutOpen ? "open" : ""}`}>
              <Link to="/About" onClick={closeMenu}>About Us</Link>
              <Link to="/Gallery" onClick={closeMenu}>Gallery</Link>
            </div>
          </div>

          <Link to="/ServicePage" className="lt-drawer-link" onClick={closeMenu}>Services</Link>
          <Link to="/Career" className="lt-drawer-link" onClick={closeMenu}>Careers</Link>
          <Link to="/Products" className="lt-drawer-link" onClick={closeMenu}>Products</Link>
          <Link to="/Contact" className="lt-drawer-link" onClick={closeMenu}>Contact</Link>
        </div>

        {!user ? (
          <div className="lt-drawer-auth">
            <Link to="/Login" className="lt-drawer-login" onClick={closeMenu}>Login</Link>
            <Link to="/signup" className="lt-drawer-signup" onClick={closeMenu}>Sign Up</Link>
          </div>
        ) : (
          <div className="lt-drawer-user">
            <div className="lt-drawer-user-row">
              <div className="lt-drawer-avatar">{avatarLetter}</div>
              <span className="lt-drawer-email">{user.email}</span>
            </div>
            {isAdmin && (
              <Link to="/admin-dashboard" className="lt-drawer-ulink admin" onClick={closeMenu}>
                ⚙ Admin Dashboard
              </Link>
            )}
            <Link to="/dashboard" className="lt-drawer-ulink" onClick={closeMenu}>Dashboard</Link>
            <Link to="/my-applications" className="lt-drawer-ulink" onClick={closeMenu}>My Applications</Link>
            <button className="lt-drawer-ulink logout" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>

      {/* Header */}
      <header className={`lt-header ${isSticky ? "sticky" : ""}`}>
        <Link to="/" className="lt-logo" onClick={closeMenu}>
          Lumbini Technologies
        </Link>

        {/* Hamburger — mobile only */}
        <button
          className={`lt-hamburger ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Desktop Nav */}
        <nav className="lt-nav" aria-label="Main navigation">
          <Link to="/">Home</Link>

          <div
            className="lt-dropdown"
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            <button
              className="lt-dropdown-trigger"
              onClick={() => setAboutOpen((p) => !p)}
              aria-expanded={aboutOpen}
            >
              About ▾
            </button>
            <div className={`lt-dropdown-menu ${aboutOpen ? "open" : ""}`}>
              <Link to="/About">About Us</Link>
              <Link to="/Gallery">Gallery</Link>
            </div>
          </div>

          <Link to="/ServicePage">Services</Link>
          <Link to="/Career">Careers</Link>
          <Link to="/Products">Products</Link>
          <Link to="/Contact">Contact</Link>

          {!user ? (
            <div className="lt-auth">
              <Link to="/Login" className="lt-btn-login">Login</Link>
              <Link to="/signup" className="lt-btn-signup">Sign Up</Link>
            </div>
          ) : (
            <div className="lt-user" ref={userMenuRef}>
              <button
                className="lt-avatar-btn"
                onClick={() => setUserMenuOpen((p) => !p)}
                title={user.email}
                aria-label="User menu"
                aria-expanded={userMenuOpen}
              >
                {avatarLetter}
              </button>
              <div className={`lt-user-menu ${userMenuOpen ? "open" : ""}`}>
                <div className="lt-user-email">{user.email}</div>
                {isAdmin && (
                  <Link to="/admin-dashboard" className="lt-user-item admin" onClick={closeMenu}>
                    ⚙ Admin Dashboard
                  </Link>
                )}
                <Link to="/dashboard" className="lt-user-item" onClick={closeMenu}>Dashboard</Link>
                <Link to="/my-applications" className="lt-user-item" onClick={closeMenu}>My Applications</Link>
                <button className="lt-user-item logout" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;