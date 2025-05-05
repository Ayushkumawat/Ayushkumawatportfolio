import React, { useState, useEffect, useRef } from 'react';
import './Taskbar.css';

export default function Taskbar({ activeTab, setActiveTab, direction }) {
  const [hoverTab, setHoverTab] = useState(activeTab);
  const [isVisible, setIsVisible] = useState(false);
  const taskbarRef = useRef(null);
  const buttonsRef = useRef([]);

  // Update hoverTab when activeTab changes
  useEffect(() => {
    setHoverTab(activeTab);
  }, [activeTab]);

  // Set up intersection observer for lazy loading animation
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
      } else {
        // Only hide when scrolling away completely
        if (entry.boundingClientRect.top > window.innerHeight || 
            entry.boundingClientRect.bottom < 0) {
          setIsVisible(false);
        }
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
    <div 
      ref={taskbarRef}
      className={`task-bar ${getAnimationClass()}`}
    >
      <div className={`taskbar-nav ${isVisible ? 'taskbar-visible' : ''}`}>
        <button
          ref={el => buttonsRef.current[0] = el}
          className={`taskbar-button ${activeTab === 'about' ? 'active' : ''} ${isVisible ? 'button-animate' : ''}`}
          onClick={() => handleTabClick('about')}
          onMouseEnter={() => handleTabHover('about')}
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
          className={`taskbar-animation
            ${hoverTab === 'about' ? 'start-abou' : ''}
            ${hoverTab === 'timeline' ? 'start-time' : ''}
            ${hoverTab === 'achievements' ? 'start-achive' : ''}
            ${hoverTab === 'certifications' ? 'start-cert' : ''}`}
        ></div>
      </div>
    </div>
  );
}