import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const userMenuRef = useRef(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const closeMenu = () => {
    setMenuOpen(false);
    setAboutOpen(false);
    setUserMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      setUser(null);
      setIsAdmin(false);
      setUserMenuOpen(false);
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      navigate("/");
    }
  };

  // ✅ Direct check — no external service file needed
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

  // Sticky on scroll
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        checkAdmin(session.user.email);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT" || !session?.user) {
          setUser(null);
          setIsAdmin(false);
        } else if (session?.user) {
          setUser(session.user);
          await checkAdmin(session.user.email);
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // Close on route change
  useEffect(() => {
    closeMenu();
  }, [location]);

  // Close dropdown on outside click
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
        .header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 40px;
          background: transparent;
          transition: 0.3s;
          z-index: 1000;
          box-sizing: border-box;
        }
        .header.sticky { background: rgba(0, 0, 0, 0.95); }
        .logo {
          font-size: 28px;
          color: white;
          font-weight: 700;
          text-decoration: none;
          flex-shrink: 0;
        }
        .navbar {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .navbar a {
          color: white;
          text-decoration: none;
          font-size: 15px;
          padding: 6px 12px;
          transition: 0.25s;
        }
        .navbar a:hover { color: #facc15; }
        .dropdown-container { position: relative; }
        .dropdown-trigger {
          background: none;
          border: none;
          color: white;
          font-size: 15px;
          cursor: pointer;
          padding: 6px 12px;
          transition: color 0.25s;
        }
        .dropdown-trigger:hover { color: #facc15; }
        .dropdown-menu {
          position: absolute;
          top: 38px;
          left: 0;
          background: #111;
          border: 1px solid #222;
          border-radius: 8px;
          display: none;
          flex-direction: column;
          min-width: 150px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        .dropdown-menu a {
          padding: 10px 16px;
          font-size: 14px;
          border-bottom: 1px solid #1a1a1a;
        }
        .dropdown-menu a:last-child { border-bottom: none; }
        .dropdown-menu a:hover {
          background: rgba(250, 204, 21, 0.08);
          color: #facc15;
        }
        .dropdown-menu.show { display: flex; }
        .user-dropdown-container { position: relative; }
        .user-avatar-btn {
          width: 34px;
          height: 34px;
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
          flex-shrink: 0;
        }
        .user-avatar-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 0 12px rgba(250, 204, 21, 0.4);
        }
        .user-dropdown-menu {
          position: absolute;
          top: 44px;
          right: 0;
          background: #111;
          border: 1px solid #222;
          border-radius: 10px;
          display: none;
          flex-direction: column;
          min-width: 210px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
          z-index: 999;
        }
        .user-dropdown-menu.show { display: flex; }
        .user-dropdown-email {
          padding: 12px 16px;
          font-size: 13px;
          color: #facc15;
          background: rgba(250, 204, 21, 0.06);
          border-bottom: 1px solid #222;
          word-break: break-all;
        }
        .user-dropdown-item {
          padding: 11px 16px;
          font-size: 14px;
          color: #fff;
          background: none;
          border: none;
          border-bottom: 1px solid #1a1a1a;
          cursor: pointer;
          text-align: left;
          transition: background 0.2s;
          text-decoration: none;
          display: block;
          width: 100%;
          font-family: inherit;
        }
        .user-dropdown-item:last-child { border-bottom: none; }
        .user-dropdown-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #facc15;
        }
        .user-dropdown-item.logout { color: #f87171; }
        .user-dropdown-item.logout:hover {
          background: rgba(239, 68, 68, 0.08);
          color: #f87171;
        }
        .user-dropdown-item.admin-item {
          color: #facc15;
          font-size: 13px;
          background: rgba(250,204,21,0.04);
          border-bottom: 1px solid #222;
        }
        .user-dropdown-item.admin-item:hover {
          background: rgba(250,204,21,0.1);
          color: #facc15;
        }
        .auth-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav-login-btn {
          color: white;
          text-decoration: none;
          font-size: 15px;
          padding: 6px 14px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 6px;
          transition: 0.25s;
        }
        .nav-login-btn:hover {
          border-color: #facc15;
          color: #facc15 !important;
        }
        .nav-signup-btn {
          color: #000 !important;
          text-decoration: none;
          font-size: 15px;
          padding: 6px 14px;
          background: #facc15;
          border-radius: 6px;
          font-weight: 600;
          transition: 0.25s;
        }
        .nav-signup-btn:hover {
          background: #fde047;
          color: #000 !important;
        }
        .menu-toggle {
          display: none;
          flex-direction: column;
          cursor: pointer;
          gap: 5px;
          padding: 4px;
        }
        .menu-toggle span {
          width: 25px;
          height: 2.5px;
          background: white;
          border-radius: 2px;
          transition: 0.3s;
          display: block;
        }
        @media (max-width: 900px) {
          .header { padding: 14px 20px; }
          .menu-toggle { display: flex; z-index: 1100; }
          .navbar {
            position: fixed;
            right: -100%;
            top: 0;
            width: 100%;
            height: 100vh;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #000;
            transition: 0.4s;
            gap: 12px;
            z-index: 1050;
          }
          .navbar.show { right: 0; }
          .dropdown-menu {
            position: static;
            background: #111;
            border: none;
            border-radius: 8px;
            box-shadow: none;
            width: 100%;
            text-align: center;
          }
          .user-dropdown-menu {
            position: static;
            border: none;
            border-radius: 8px;
            box-shadow: none;
            width: 210px;
            text-align: center;
          }
          .user-dropdown-item { text-align: center; }
          .auth-links { flex-direction: column; }
        }
      `}</style>

      <header className={`header ${isSticky ? "sticky" : ""}`}>
        <Link to="/" className="logo" onClick={closeMenu}>
          Lumbini Technologies
        </Link>

        <div className="menu-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav className={`navbar ${menuOpen ? "show" : ""}`}>
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          <div
            className="dropdown-container"
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            <button
              className="dropdown-trigger"
              onClick={() => setAboutOpen((prev) => !prev)}
            >
              About ▾
            </button>
            <div className={`dropdown-menu ${aboutOpen ? "show" : ""}`}>
              <Link to="/About" onClick={closeMenu}>
                About Us
              </Link>
              <Link to="/Gallery" onClick={closeMenu}>
                Gallery
              </Link>
            </div>
          </div>

          <Link to="/ServicePage" onClick={closeMenu}>
            Services
          </Link>
          <Link to="/Career" onClick={closeMenu}>
            Careers
          </Link>
          <Link to="/Products" onClick={closeMenu}>
            Products
          </Link>
          <Link to="/Contact" onClick={closeMenu}>
            Contact
          </Link>

          {!user ? (
            <div className="auth-links">
              <Link to="/Login" className="nav-login-btn" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/signup" className="nav-signup-btn" onClick={closeMenu}>
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="user-dropdown-container" ref={userMenuRef}>
              <button
                className="user-avatar-btn"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                title={user.email}
              >
                {avatarLetter}
              </button>

              <div
                className={`user-dropdown-menu ${userMenuOpen ? "show" : ""}`}
              >
                <div className="user-dropdown-email">{user.email}</div>

                {isAdmin && (
                  <Link
                    to="/admin-dashboard"
                    className="user-dropdown-item admin-item"
                    onClick={closeMenu}
                  >
                    ⚙ Admin Dashboard
                  </Link>
                )}

                <Link
                  to="/dashboard"
                  className="user-dropdown-item"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>

                <Link
                  to="/my-applications"
                  className="user-dropdown-item"
                  onClick={closeMenu}
                >
                  My Applications
                </Link>

                <button
                  className="user-dropdown-item logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;
