import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Linkedin, Instagram, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

const styles = `
  .footer {
    background: #000;
    color: #d1d5db;
    padding: 2rem 0;
    border-top: 1px solid rgba(250, 204, 21, 0.12);
    position: relative;
    z-index: 10;
    margin-top: auto;
    flex-shrink: 0;
  }

  @media (min-width: 768px) {
    .footer { padding: 3rem 0; }
  }

  .footer-grid {
    max-width: 72rem;
    margin: 0 auto;
    padding: 0 1rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  @media (min-width: 640px) { .footer-grid { grid-template-columns: repeat(2, 1fr); gap: 2rem; } }
  @media (min-width: 768px) { .footer-grid { grid-template-columns: repeat(4, 1fr); gap: 2rem; } }

  .footer-brand {
    font-size: 1.125rem;
    font-weight: 800;
    color: #facc15;
    margin-bottom: 0.5rem;
    line-height: 1.2;
  }
  @media (min-width: 768px) { .footer-brand { font-size: 1.25rem; } }

  .footer-subtext {
    color: #9ca3af;
    font-size: 0.8125rem;
    line-height: 1.5;
    margin-bottom: 0;
  }
  @media (min-width: 768px) { .footer-subtext { font-size: 0.875rem; } }

  .mb-3 { margin-bottom: 0.75rem !important; }

  .footer-title {
    font-size: 1rem;
    color: #fff;
    font-weight: 600;
    margin-bottom: 0.75rem;
    line-height: 1.3;
  }
  @media (min-width: 768px) { .footer-title { font-size: 1.125rem; } }

  .footer-list { list-style: none; margin: 0; padding: 0; }
  .footer-list li { margin-bottom: 0.375rem; line-height: 1.4; }
  .footer-list li:last-child { margin-bottom: 0; }
  @media (min-width: 768px) { .footer-list li { margin-bottom: 0.5rem; } }

  .footer-link {
    color: inherit;
    text-decoration: none;
    position: relative;
    transition: color 200ms ease;
    display: inline-block;
  }
  .footer-link:hover { color: #facc15; }
  .footer-link::after {
    content: "";
    position: absolute;
    left: 0; bottom: -3px;
    width: 0; height: 2px;
    background: #facc15;
    transition: width 300ms ease;
  }
  .footer-link:hover::after { width: 100%; }

  .footer-contact {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #d1d5db;
    font-size: 0.8125rem;
  }
  @media (min-width: 768px) { .footer-contact { font-size: 0.875rem; } }
  .footer-contact svg { flex-shrink: 0; color: #facc15; }

  .newsletter-section { grid-column: 1 / -1; }
  @media (min-width: 640px) { .newsletter-section { grid-column: auto; } }

  .footer-form { display: flex; gap: 0.5rem; margin-top: 0.75rem; }

  .footer-input {
    flex: 1;
    padding: 0.5rem 0.75rem;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 0.375rem;
    color: #fff;
    border: 1px solid rgba(250, 204, 21, 0.2);
    outline: none;
    transition: box-shadow 150ms ease, border-color 150ms ease;
    font-size: 0.875rem;
  }
  .footer-input::placeholder { color: #9ca3af; }
  .footer-input:focus {
    box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.1);
    border-color: #facc15;
  }

  .footer-btn {
    padding: 0.5rem 1rem;
    background: #facc15;
    color: #000;
    font-weight: 600;
    border-radius: 0.375rem;
    border: none;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 150ms ease, transform 100ms ease;
    white-space: nowrap;
  }
  .footer-btn:hover { background: #fde047; transform: translateY(-1px); }
  .footer-btn:active { transform: translateY(0); }

  .footer-bottom {
    border-top: 1px solid rgba(250, 204, 21, 0.08);
    margin-top: 1.5rem;
    padding: 1rem 1rem 0;
    max-width: 72rem;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
    justify-content: space-between;
    text-align: center;
  }
  @media (min-width: 768px) {
    .footer-bottom {
      margin-top: 2.5rem;
      padding: 1.25rem 1rem 0;
      flex-direction: row;
      text-align: left;
    }
  }
  .footer-bottom p { margin: 0; font-size: 0.875rem; color: #9ca3af; }

  .footer-bottom-links { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
  @media (min-width: 768px) { .footer-bottom-links { justify-content: flex-start; } }
  .footer-bottom-links .footer-link { font-size: 0.875rem; color: #9ca3af; }
  .footer-bottom-links .footer-link:hover { color: #facc15; }

  .footer-socials { display: flex; gap: 0.75rem; justify-content: center; }
  .footer-socials a {
    color: #9ca3af;
    transition: color 150ms ease, transform 150ms ease;
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
    text-decoration: none;
  }
  .footer-socials a:hover {
    color: #facc15;
    transform: translateY(-2px);
    background: rgba(250, 204, 21, 0.1);
  }

  .scroll-top-btn {
    position: fixed;
    right: 1.5rem; bottom: 1.5rem;
    padding: 0.6rem; border-radius: 50%;
    background: #facc15; color: #000;
    box-shadow: 0 4px 20px rgba(250, 204, 21, 0.3), 0 0 0 0 rgba(250, 204, 21, 0.4);
    border: none; cursor: pointer;
    transition: all 200ms ease; z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    width: 44px; height: 44px;
    animation: pulse 2s infinite;
  }
  .scroll-top-btn:hover {
    box-shadow: 0 6px 25px rgba(250, 204, 21, 0.4), 0 0 0 8px rgba(250, 204, 21, 0.1);
    transform: translateY(-2px);
    background: #fde047;
  }
  .scroll-top-btn:active { transform: translateY(0); }

  @keyframes pulse {
    0%   { box-shadow: 0 4px 20px rgba(250,204,21,0.3), 0 0 0 0 rgba(250,204,21,0.4); }
    70%  { box-shadow: 0 4px 20px rgba(250,204,21,0.3), 0 0 0 10px rgba(250,204,21,0); }
    100% { box-shadow: 0 4px 20px rgba(250,204,21,0.3), 0 0 0 0 rgba(250,204,21,0); }
  }

  .footer-message { margin-top: 0.5rem; font-size: 0.8125rem; color: #facc15; }

  @media (max-width: 639px) {
    .footer { padding: 1.5rem 0; }
    .footer-grid { gap: 1.25rem; }
    .footer-form { flex-direction: column; }
    .footer-bottom { margin-top: 1rem; padding: 0.75rem 1rem 0; }
    .footer-bottom p { font-size: 0.8125rem; }
    .footer-bottom-links { gap: 0.75rem; }
    .footer-bottom-links .footer-link { font-size: 0.8125rem; }
    .scroll-top-btn { right: 1rem; bottom: 1rem; width: 40px; height: 40px; padding: 0.5rem; }
  }

  @media (max-width: 480px) {
    .footer { padding: 1.25rem 0; }
    .footer-grid { gap: 1rem; }
    .footer-brand { font-size: 1rem; }
    .footer-title { font-size: 0.9375rem; }
    .footer-subtext { font-size: 0.75rem; }
    .footer-contact { font-size: 0.75rem; }
  }

  .footer *::selection { background: rgba(250, 204, 21, 0.2); color: #facc15; }
  .footer-input:focus, .footer-btn:focus,
  .footer-link:focus, .scroll-top-btn:focus { outline: 2px solid #facc15; outline-offset: 2px; }
  .footer-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;

export default function Footer() {
  const [showScroll, setShowScroll] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setMessage("⚠️ Please enter a valid email.");
      return;
    }
    console.log("Subscribed with:", email);
    setMessage("✅ Thank you for subscribing!");
    setEmail("");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <>
      <style>{styles}</style>

      <footer className="footer">
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <h2 className="footer-brand">Lumbini Technologies</h2>
            <p className="footer-subtext">Innovating Technology for a Smarter Future</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-list">
              {[
                { to: "/",            label: "Home"     },
                { to: "/About",       label: "About Us" },
                { to: "/ServicePage", label: "Services" },
                { to: "/Products",    label: "Products" },
                { to: "/Career",      label: "Careers"  },
                { to: "/Contact",     label: "Contact"  },
              ].map(({ to, label }) => (
                <li key={to}><Link to={to} className="footer-link">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="footer-title">Contact</h3>
            <ul className="footer-list">
              <li className="footer-contact"><MapPin size={16} /> Vijayawada, India</li>
              <li className="footer-contact"><Mail size={16} /> lumbini.technologies01@gmail.com</li>
              <li className="footer-contact"><Phone size={16} /> +91 98482 94006</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="newsletter-section">
            <h3 className="footer-title">Newsletter</h3>
            <p className="footer-subtext mb-3">
              Stay updated with our latest solutions &amp; opportunities.
            </p>
            <form className="footer-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Your email"
                className="footer-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="footer-btn"
                type="submit"
              >
                Subscribe
              </motion.button>
            </form>
            {message && <p className="footer-message">{message}</p>}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© 2025 Lumbini Technologies. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="footer-link">Terms &amp; Conditions</Link>
          </div>
          <div className="footer-socials">
            <a href="https://www.linkedin.com/company/lumbini-technologies/?viewAsMember=true" target="_blank" rel="noreferrer">
              <Linkedin size={18} />
            </a>
            <a href="https://www.instagram.com/lumbini_technologies/" target="_blank" rel="noreferrer">
              <Instagram size={18} />
            </a>
          </div>
        </div>

        {/* Scroll-to-Top */}
        <AnimatePresence>
          {showScroll && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={scrollToTop}
              className="scroll-top-btn"
              aria-label="Scroll to top"
            >
              <ArrowUp size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </footer>
    </>
  );
}