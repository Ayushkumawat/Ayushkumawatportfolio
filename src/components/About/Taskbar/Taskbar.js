import React, { useState, useEffect, useRef } from 'react';
import './Taskbar.css';

export default function Taskbar({ activeTab, setActiveTab, direction }) {
  const [hoverTab, setHoverTab] = useState(activeTab);
  const [isVisible, setIsVisible] = useState(false);
  const [buttonPositions, setButtonPositions] = useState({
    aboutme: { width: '25%', left: '0%' },
    timeline: { width: '25%', left: '25%' },
    achievements: { width: '25%', left: '50%' },
    certifications: { width: '25%', left: '75%' }
  });
  
  const taskbarRef = useRef(null);
  const navRef = useRef(null);
  const buttonsRef = useRef([]);

  // Additional upward adjustment based on screen size
  useEffect(() => {
    const adjustTaskbarPosition = () => {
      if (!taskbarRef.current) return;
      
      const viewportHeight = window.innerHeight;
      
      // Add more upward positioning for smaller screens
      if (viewportHeight < 600) {
        taskbarRef.current.style.transform = 'translateY(-10px)';
      } else if (viewportHeight < 700) {
        taskbarRef.current.style.transform = 'translateY(-7px)';
      } else if (viewportHeight < 800) {
        taskbarRef.current.style.transform = 'translateY(-5px)';
      } else {
        taskbarRef.current.style.transform = 'translateY(0)';
      }
    };
    
    // Initial adjustment
    adjustTaskbarPosition();
    
    // Add resize listener with debounce
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(adjustTaskbarPosition, 150);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Update hoverTab when activeTab changes
  useEffect(() => {
    setHoverTab(activeTab);
  }, [activeTab]);

  // Calculate button positions for the underline animation
  useEffect(() => {
    const updateButtonPositions = () => {
      // Calculate button positions for the underline animation
      if (navRef.current && buttonsRef.current.length === 4) {
        const buttonWidths = buttonsRef.current.map(btn => btn ? btn.offsetWidth : 0);
        
        let currentLeft = 0;
        const newPositions = {
          aboutme: { width: `${buttonWidths[0]}px`, left: `${currentLeft}px` },
          timeline: { width: `${buttonWidths[1]}px`, left: `${currentLeft += buttonWidths[0]}px` },
          achievements: { width: `${buttonWidths[2]}px`, left: `${currentLeft += buttonWidths[1]}px` },
          certifications: { width: `${buttonWidths[3]}px`, left: `${currentLeft += buttonWidths[2]}px` }
        };
        
        setButtonPositions(newPositions);
      }
    };

    // Initial calculation
    updateButtonPositions();
    
    // Add resize listener with debounce
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateButtonPositions, 150);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Re-run position calculation after a short delay to ensure everything has rendered
    const rerunTimer = setTimeout(updateButtonPositions, 500);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      clearTimeout(rerunTimer);
    };
  }, []);

  // Set up intersection observer for fade-in animation
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const handleIntersect = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, options);
    
    if (taskbarRef.current) {
      observer.observe(taskbarRef.current);
    }

    return () => {
      if (taskbarRef.current) {
        observer.unobserve(taskbarRef.current);
      }
    };
  }, []);

  // Apply staggered animation to taskbar buttons
  useEffect(() => {
    if (isVisible && buttonsRef.current.length > 0) {
      buttonsRef.current.forEach((button, index) => {
        if (button) {
          button.classList.add(`button-delay-${index}`);
          button.style.animationDelay = `${0.1 + (index * 0.1)}s`;
        }
      });
    }
  }, [isVisible]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setHoverTab(tab);
  };
  
  const handleTabHover = (tab) => setHoverTab(tab);
  
  const handleTabLeave = () => setHoverTab(activeTab);

  // Simplified animation class logic to focus on visibility
  const getAnimationClass = () => {
    return !isVisible ? 'taskbar-hidden' : (direction > 0 ? 'taskbar-slide-up' : 'taskbar-slide-down');
  };

  return (
    <>
      <div 
        ref={taskbarRef}
        className={`task-bar ${getAnimationClass()}`}
        // style={{ 
        //   transform: 'translateY(-45px)',
        //   marginTop: '-20px',
        //   top: 'calc(var(--navbar-height) - 80px)'
        // }}
      >
        <div 
          ref={navRef}
          className={`taskbar-nav ${isVisible ? 'taskbar-visible' : ''}`}
        >
          <button
            ref={el => buttonsRef.current[0] = el}
            className={`taskbar-button ${activeTab === 'aboutme' ? 'active' : ''} ${isVisible ? 'button-animate' : ''}`}
            onClick={() => handleTabClick('aboutme')}
            onMouseEnter={() => handleTabHover('aboutme')}
            onMouseLeave={handleTabLeave}
          >
            About
          </button>
          <button
            ref={el => buttonsRef.current[1] = el}
            className={`taskbar-button ${activeTab === 'timeline' ? 'active' : ''} ${isVisible ? 'button-animate' : ''}`}
            onClick={() => handleTabClick('timeline')}
            onMouseEnter={() => handleTabHover('timeline')}
            onMouseLeave={handleTabLeave}
          >
            Timeline
          </button>
          <button
            ref={el => buttonsRef.current[2] = el}
            className={`taskbar-button ${activeTab === 'achievements' ? 'active' : ''} ${isVisible ? 'button-animate' : ''}`}
            onClick={() => handleTabClick('achievements')}
            onMouseEnter={() => handleTabHover('achievements')}
            onMouseLeave={handleTabLeave}
          >
            Achievements
          </button>
          <button
            ref={el => buttonsRef.current[3] = el}
            className={`taskbar-button ${activeTab === 'certifications' ? 'active' : ''} ${isVisible ? 'button-animate' : ''}`}
            onClick={() => handleTabClick('certifications')}
            onMouseEnter={() => handleTabHover('certifications')}
            onMouseLeave={handleTabLeave}
          >
            Certifications
          </button>
          <div
            className="taskbar-animation"
            style={buttonPositions[hoverTab] || buttonPositions[activeTab] || {}}
          ></div>
        </div>
      </div>
      {/* Spacer to prevent content from being hidden behind fixed taskbar */}
      {/* <div className="taskbar-spacer"></div> */}
    </>
  );
}