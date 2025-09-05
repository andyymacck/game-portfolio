import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Body scroll lock & initial focus on open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen && navRef.current) {
      // Focus first link after opening for accessibility
      setTimeout(() => {
        const firstLink = navRef.current.querySelector('a');
        firstLink && firstLink.focus();
      }, 0);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(o => !o);

  // Keyboard: ESC to close, basic focus trap
  useEffect(() => {
    const handleKey = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        setIsOpen(false);
      } else if (e.key === 'Tab' && navRef.current) {
        const focusables = navRef.current.querySelectorAll('a');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        // Allow activating the hamburger via keyboard when focused
        if (document.activeElement?.classList.contains('hamburger-menu')) {
          e.preventDefault();
          toggleMenu();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  return (
    <>
      <div
        className={`hamburger-menu ${isOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        role="button"
        aria-label="Navigation menu"
        aria-expanded={isOpen}
        aria-controls="main-navigation"
        tabIndex={0}
      >
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
      </div>
      
      <nav
        id="main-navigation"
        ref={navRef}
        className={`nav-menu ${isOpen ? 'open' : ''}`}
        aria-hidden={!isOpen}
      >
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>

      <div 
        className={`menu-overlay ${isOpen ? 'visible' : ''}`}
        onClick={toggleMenu}
      />
    </>
  );
};

export default Navigation;
