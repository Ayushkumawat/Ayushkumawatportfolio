import React, { useContext, useState, useEffect, useRef } from 'react';
import { ThemeContext } from '../../ThemeContext';
import './Navbar.css';

export default function Navbar(props) {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [activeNav, setActiveNav] = useState(0);
  const [tline, setTline] = useState(0);
  const [visible, setVisible] = useState(false);
  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const toggleRef = useRef(null);
  const iconRef = useRef(null);
  const navRef = useRef(null);
  const linksRef = useRef([]);

  // Initialize intersection observer for lazy loading
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.01  // Lower threshold to detect navbar sooner
    };

    const handleIntersect = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        // Remove delay to make animation start immediately
        setVisible(true);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, options);
    
    if (navbarRef.current) {
      observer.observe(navbarRef.current);
    }

    return () => {
      if (navbarRef.current) {
        observer.unobserve(navbarRef.current);
      }
    };
  }, []);

  // Apply staggered animation to navbar links
  useEffect(() => {
    if (visible && linksRef.current.length > 0) {
      linksRef.current.forEach((link, index) => {
        if (link) {
          link.classList.add(`link-delay-${index}`);
          link.style.animationDelay = `${0.5 + (index * 0.1)}s`;
        }
      });
    }
  }, [visible]);

  // Update activeNav when currentSection changes from elsewhere (scrolling)
  useEffect(() => {
    setActiveNav(props.currentSection);
  }, [props.currentSection]);

  const handleNavClick = (index) => {
    // Only proceed if not in a transitioning state
    if (!props.isTransitioning) {
      setActiveNav(index);
      props.setCurrentSection(index);
    }
  };

  function toggleTheme() {
    const body = document.querySelector("body");
    const moon = document.querySelector(".moon");
    const tdnn = document.querySelector(".tdnn");
    body.classList.toggle("light");
    moon.classList.toggle("sun");
    tdnn.classList.toggle("day");
    toggleDarkMode();
  }

  return (
    <div className="outer_nav">
      <div 
        ref={navbarRef}
        className={`section-navbar ${darkMode ? 'dark-mode' : ''} ${visible ? 'navbar-visible' : 'navbar-hidden'}`}
      >
        <a 
          ref={logoRef}
          href="/Home" 
          className={`logo ${visible ? 'logo-animate' : ''}`}
        >
          Ayush Kumawat<span>.</span>
        </a>
        <button 
          ref={toggleRef}
          className={`tdnn ${visible ? 'tdnn-animate' : ''}`} 
          onClick={toggleTheme}
        >
          <div className="moon"></div>
        </button>
        <i
          ref={iconRef}
          onClick={() => setTline(tline === 0 ? 1 : 0)}
          className={`fa-solid ${tline === 1 ? 'fa-xmark' : 'fa-list'} ${visible ? 'icon-animate' : ''}`}
          aria-label={tline === 1 ? 'Close menu' : 'Open menu'}
        ></i>
        <nav 
          ref={navRef}
          className={`navbar ${visible ? 'navbar-animate' : ''}`}
        >
          {['HOME', 'ABOUT ME', 'INNOVATIONS', 'DASHBOARD', 'CONTACT'].map((item, index) => (
            <a
              key={index}
              ref={el => linksRef.current[index] = el}
              className={`${activeNav === index ? 'active' : ''} ${visible ? 'link-animate' : ''}`}
              onClick={() => handleNavClick(index)}
            >
              {item}
            </a>
          ))}
        </nav>
      </div>
      <nav className={`navbar1 ${tline === 1 ? 'navbar1_active' : ''}`}>
        <a onClick={() => { handleNavClick(0); setTline(0); }} className={activeNav === 0 ? 'active btn' : 'btn'}>Home</a>
        <a onClick={() => { handleNavClick(1); setTline(0); }} className={activeNav === 1 ? 'active btn' : 'btn'}>About</a>
        <a onClick={() => { handleNavClick(2); setTline(0); }} className={activeNav === 2 ? 'active btn' : 'btn'}>Innovations</a>
        <a onClick={() => { handleNavClick(3); setTline(0); }} className={activeNav === 3 ? 'active btn' : 'btn'}>Dashboard</a>
        <a onClick={() => { handleNavClick(4); setTline(0); }} className={activeNav === 4 ? 'active btn' : 'btn'}>Contact</a>
      </nav>      
    </div>
  );
}