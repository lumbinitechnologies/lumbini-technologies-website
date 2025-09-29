import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import LogoSprinkles from '../Effects/LogoSprinkles';

const Navbar = () => {
  const location = useLocation();
  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Toggle sticky navbar on scroll
  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  // Toggle mobile menu open/close
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  // Close menu when a nav link is clicked
  const closeMenu = () => {
    setMenuOpen(false);
    setAboutOpen(false);
  };

  // Close menu when route changes
  useEffect(() => {
    closeMenu();
  }, [location]);

  // Handle scroll event for sticky navbar
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close About dropdown when route changes
  useEffect(() => {
    setAboutOpen(false);
  }, [location]);

  return (
    <header className={`header ${isSticky ? 'sticky' : ''}`}>
      <div className="logo-wrap">
        <Link to="/" className="logo" onClick={closeMenu}>Lumbini Technologies</Link>
        <LogoSprinkles />
      </div>

      <div 
        className={`menu-toggle ${menuOpen ? 'active' : ''}`} 
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <nav className={`navbar ${menuOpen ? 'show' : ''}`}>
        <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={closeMenu}>Home</Link>

        <div 
          className="dropdown-container"
          onMouseEnter={() => setAboutOpen(true)}
          onMouseLeave={() => setAboutOpen(false)}
        >
          <button
            type="button"
            className={`dropdown-trigger ${location.pathname === '/About' ? 'active' : ''}`}
            aria-haspopup="true"
            aria-expanded={aboutOpen}
            onClick={() => setAboutOpen(prev => !prev)}
          >
            About Us
            <span className={`dropdown-icon ${aboutOpen ? 'open' : ''}`}>▾</span>
          </button>
          <div className={`dropdown-menu ${aboutOpen ? 'show' : ''}`} role="menu">
            <Link to="/About" onClick={closeMenu} role="menuitem">About Us</Link>
            <Link to="/Gallery" onClick={closeMenu} role="menuitem">Gallery</Link>
          </div>
        </div>
        <Link to="/ServicePage" className={location.pathname === '/ServicePage' ? 'active' : ''} onClick={closeMenu}>Services</Link>
        <Link to="/Career" className={location.pathname === '/Career' ? 'active' : ''} onClick={closeMenu}>Careers</Link>
        <Link to="/Products" className={location.pathname === '/Products' ? 'active' : ''} onClick={closeMenu}>Products</Link>
        <Link to="/Contact" className={location.pathname === '/Contact' ? 'active' : ''} onClick={closeMenu}>Contact</Link>
        <Link to="/Login" className={location.pathname === '/Login' ? 'active' : ''} onClick={closeMenu}>Login</Link>
      </nav>
    </header>
  );
};

export default Navbar;