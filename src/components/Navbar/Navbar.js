import React, { useContext, useState, useEffect, useRef } from 'react';
import { ThemeContext } from '../../ThemeContext';
import './Navbar.css';
import './AutoShowBanner.css';

export default function Navbar(props) {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [activeNav, setActiveNav] = useState(0);
  const [tline, setTline] = useState(0);
  const [visible, setVisible] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(70);
  const [isNarrowScreen, setIsNarrowScreen] = useState(false);
  const [showAutoBanner, setShowAutoBanner] = useState(false);
  const [canCloseBanner, setCanCloseBanner] = useState(false);
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

  // Handle resize events to adjust spacing and font size based on available space
  useEffect(() => {
    // Get the current navbar height from CSS variable
    const getNavbarHeight = () => {
      const root = document.documentElement;
      const navHeightValue = getComputedStyle(root).getPropertyValue('--navbar-height').trim();
      return parseInt(navHeightValue, 10);
    };

    // Initial setup
    setNavbarHeight(getNavbarHeight());
    
    // Update calculations when window resizes
    const handleResize = () => {
      const newHeight = getNavbarHeight();
      setNavbarHeight(newHeight);
      
      // Get current viewport dimensions
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
      
      // Set narrow screen state
      const narrow = vw < 768;
      setIsNarrowScreen(narrow);
      
      // Calculate aspect ratio to determine if we should optimize for width or height
      const aspectRatio = vw / vh;
      const isWidthConstrained = aspectRatio < 1.2; // More portrait-like
      
      // Calculate available space and adjust spacing if needed
      adjustNavItemSpacing(vw, vh, newHeight, isWidthConstrained);
      
      // Additional layout adjustments based on dimensions
      if (navbarRef.current) {
        // Adjust padding for very narrow screens
        if (vw < 400) {
          navbarRef.current.style.padding = '0 0.8rem';
        } else if (vw < 768) {
          navbarRef.current.style.padding = '0 1.2rem';
        } else {
          navbarRef.current.style.padding = '0 2rem';
        }
      }
    };

    // Adjust spacing between nav items based on available space
    const adjustNavItemSpacing = (width, height, navHeight, isWidthConstrained) => {
      if (navRef.current) {
        // For wider screens, add more spacing
        if (width > 1200) {
          navRef.current.style.gap = '2.5rem';
        } 
        // For medium screens, use moderate spacing
        else if (width > 900) {
          navRef.current.style.gap = '2rem';
        }
        // For medium-small screens
        else if (width > 768) {
          navRef.current.style.gap = '1.8rem';
        }
        // For smaller screens, reduce spacing
        else if (width > 700) {
          navRef.current.style.gap = '1.2rem';
        }
        // For narrow screens
        else if (width > 600) {
          navRef.current.style.gap = '0.8rem';
        }
        // For very narrow screens
        else if (width > 480) {
          navRef.current.style.gap = '0.6rem';
        }
        // For extremely narrow screens
        else {
          navRef.current.style.gap = '0.4rem';
        }
        
        // Adjust navbar items based on available width
        const navLinks = navRef.current.querySelectorAll('a');
        navLinks.forEach(link => {
          // Adjust padding based on screen width
          if (width <= 480) {
            link.style.padding = '0.2rem 0.3rem';
          } else if (width <= 600) {
            link.style.padding = '0.25rem 0.4rem';
          } else if (width <= 700) {
            link.style.padding = '0.3rem 0.5rem';
          } else if (width <= 768) {
            link.style.padding = '0.4rem 0.7rem';
          } else {
            link.style.padding = '0.5rem 1rem';
          }
        });
      }
      
      // Adjust logo based on screen width
      if (logoRef.current) {
        if (width <= 480) {
          logoRef.current.style.padding = '0.2rem 0.5rem';
        } else if (width <= 600) {
          logoRef.current.style.padding = '0.2rem 0.6rem';
        } else if (width <= 768) {
          logoRef.current.style.padding = '0.25rem 0.8rem';
        } else {
          logoRef.current.style.padding = '0.3rem 1rem';
        }
      }
    };

    // Run resize handler on initial load
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
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

  useEffect(() => {
    // Show the auto banner only on mobile
    if (window.innerWidth <= 998) {
      setShowAutoBanner(true);
      setCanCloseBanner(false);
      setTimeout(() => setCanCloseBanner(true), 3000);
    }
  }, []);

  // Swipe up to close banner
  useEffect(() => {
    if (!showAutoBanner) return;
    let startY = null;
    let isSwiping = false;
    function handleTouchStart(e) {
      if (e.touches && e.touches.length === 1) {
        startY = e.touches[0].clientY;
        isSwiping = true;
      }
    }
    function handleTouchMove(e) {
      if (!isSwiping || startY === null) return;
      const currentY = e.touches[0].clientY;
      if (canCloseBanner && startY - currentY > 60) { // swipe up threshold
        setShowAutoBanner(false);
        isSwiping = false;
      }
    }
    function handleTouchEnd() {
      isSwiping = false;
      startY = null;
    }
    const banner = document.querySelector('.auto-show-banner');
    if (banner) {
      banner.addEventListener('touchstart', handleTouchStart);
      banner.addEventListener('touchmove', handleTouchMove);
      banner.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      if (banner) {
        banner.removeEventListener('touchstart', handleTouchStart);
        banner.removeEventListener('touchmove', handleTouchMove);
        banner.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [showAutoBanner, canCloseBanner]);

  const handleNavClick = (index) => {
    // Prevent event propagation
    if (!props.isTransitioning) {
      // Add a small delay to ensure state updates properly
      setTimeout(() => {
        setActiveNav(index);
        props.setCurrentSection(index);
        // Close mobile menu if open
        if (tline === 1) {
          setTline(0);
        }
      }, 50);
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

  // Helper function to shorten labels for very narrow screens
  const getShortenedLabel = (text) => {
    // Get current viewport width
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    
    // Only use original text on wider screens
    if (vw > 768) return text;
    
    // Map full names to shortened versions depending on screen width
    if (vw <= 600) {
      // Extra short labels for very narrow screens
      const extraShortLabels = {
        'HOME': 'HOME',
        'ABOUT ME': 'ABT',
        'INNOVATIONS': 'INV',
        'DASHBOARD': 'DASH',
        'CONTACT': 'CNTC'
      };
      return extraShortLabels[text] || text;
    } else if (vw <= 700) {
      // Short labels for medium-narrow screens
      const shortLabels = {
        'HOME': 'HOME',
        'ABOUT ME': 'ABOUT',
        'INNOVATIONS': 'INNOV',
        'DASHBOARD': 'DASH',
        'CONTACT': 'CNTCT'
      };
      return shortLabels[text] || text;
    } else {
      // Slightly shortened labels for somewhat narrow screens
      const mediumLabels = {
        'HOME': 'HOME',
        'ABOUT ME': 'ABOUT ME',
        'INNOVATIONS': 'INNOVATIONS',
        'DASHBOARD': 'DASHBOARD',
        'CONTACT': 'CONTACT'
      };
      return mediumLabels[text] || text;
    }
  };

  return (
    <div className="outer_nav">
      {/* Auto-show banner/modal, independent of hamburger */}
      {showAutoBanner && (
        <div className="auto-show-banner">
          {/* No close button */}
          <div className="auto-show-banner-content"></div>
        </div>
      )}
      <div 
        ref={navbarRef}
        className={`section-navbar glass-card ${darkMode ? 'dark-mode' : ''} ${visible ? 'navbar-visible' : 'navbar-hidden'}`}
        style={{ height: `${navbarHeight}px` }}
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
          className={`tdnn ${visible ? 'tdnn-animate' : ''} ${!darkMode ? 'day' : ''}`} 
          onClick={toggleTheme}
        >
          <div className={`moon${!darkMode ? ' sun' : ''}`}></div>
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
              {getShortenedLabel(item)}
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