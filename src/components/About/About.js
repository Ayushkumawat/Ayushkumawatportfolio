import React, { useState, useRef, useEffect } from 'react'
import './About.css'
import Taskbar from './Taskbar/Taskbar'
import AboutMe from './AboutMe/AboutMe'
import Timeline from './Timeline/Timeline'
import Achievements from './Achievements/Achievements'
import Certifications from './Certifications/Certifications'
import { motion } from 'framer-motion';

const tabOrder = ['about', 'timeline', 'achievements', 'certifications'];

// Responsive hook for About
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 998);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 998);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
}

export default function About({ currentSection, direction, setCurrentSection, isTransitioning }) {
  const [activeTab, setActiveTab] = useState('about')
  const [isVisible, setIsVisible] = useState(false)
  const [isContentReady, setIsContentReady] = useState(false)
  const [timelineAtBottom, setTimelineAtBottom] = useState(false)
  const sectionRef = useRef(null);
  const smalRef = useRef(null);
  const largRef = useRef(null); // Reference for the taskbar container
  const timelineRef = useRef(null); // Reference to access the Timeline component
  const isScrollingRef = useRef(false);
  const scrollEndTimerRef = useRef(null);
  const lastSectionChangeRef = useRef(Date.now());
  const transitionInProgressRef = useRef(false);
  const MIN_WHEEL_DELTA = 30; // px threshold to ignore jitter
  const SECTION_CHANGE_DELAY = 400; // ms to wait between section changes
  const CONTENT_READY_DELAY = 300; // ms to wait for content to be ready after appearing
  const SCROLL_THRESHOLD = 5; // px threshold for considering scroll at bottom/top
  const isMobile = useIsMobile();

  // Track when this component receives focus (becomes current section)
  useEffect(() => {
    if (currentSection === 1) {
      // Reset to about tab when returning to this section
      setActiveTab('about');
      setIsVisible(true);
      setTimelineAtBottom(false);
      
      // Reset content ready state
      setIsContentReady(false);
      
      // Set a timer to mark content as ready (for animations to complete)
      const timer = setTimeout(() => {
        setIsContentReady(true);
      }, CONTENT_READY_DELAY);
      
      return () => clearTimeout(timer);
    }
  }, [currentSection]);

  useEffect(() => {
    // Observer for scroll animations
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update visibility state based on intersection
        setIsVisible(entry.isIntersecting);
        
        // If becoming visible, set a timer for content to be ready
        if (entry.isIntersecting) {
          // Reset content ready state
          setIsContentReady(false);
          
          // Set a timer to mark content as ready
          const timer = setTimeout(() => {
            setIsContentReady(true);
          }, CONTENT_READY_DELAY);
          
          return () => clearTimeout(timer);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.2, // Trigger when 20% of the element is visible
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Reset timeline bottom state when changing tabs
  useEffect(() => {
    setTimelineAtBottom(false);
  }, [activeTab]);

  // Update the last section change timestamp when activeTab changes
  useEffect(() => {
    lastSectionChangeRef.current = Date.now();
    
    // Reset content ready state
    setIsContentReady(false);
    
    // Set a timer to mark content as ready
    const timer = setTimeout(() => {
      setIsContentReady(true);
    }, CONTENT_READY_DELAY);
    
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Handle section navigation with proper transitions
  const navigateToSection = (targetSection) => {
    if (transitionInProgressRef.current || isTransitioning) return;
    
    transitionInProgressRef.current = true;
    setCurrentSection(targetSection);
    
    // Reset transition flag after transition duration
    setTimeout(() => {
      transitionInProgressRef.current = false;
    }, 800); // Match App.js transition duration
  };

  // Monitor timeline scroll position
  useEffect(() => {
    if (activeTab !== 'timeline') return;

    const checkTimelineScrollPosition = () => {
      const smalEl = smalRef.current;
      if (!smalEl) return;

      const { scrollTop, scrollHeight, clientHeight } = smalEl;
      // Consider "at bottom" when we're within a few pixels of the bottom
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD;
      setTimelineAtBottom(isAtBottom);
    };

    const smalEl = smalRef.current;
    if (smalEl) {
      smalEl.addEventListener('scroll', checkTimelineScrollPosition);
      // Initial check
      checkTimelineScrollPosition();
    }

    return () => {
      if (smalEl) {
        smalEl.removeEventListener('scroll', checkTimelineScrollPosition);
      }
    };
  }, [activeTab]);

  // Intercept only the first wheel event in a scroll burst to switch tabs
  useEffect(() => {
    // reset scroll block when activeTab or section changes
    isScrollingRef.current = false;
    if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);

    const handleWheel = (e) => {
      // Don't process if a parent transition is in progress or content is not ready
      if (isTransitioning || !isContentReady) {
        e.preventDefault();
        return;
      }
      
      // Don't process if a section transition is in progress
      if (transitionInProgressRef.current) {
        e.preventDefault();
        return;
      }
      
      const smalEl = smalRef.current;
      const delta = e.deltaY;
      
      // Check if enough time has passed since the last section change
      const now = Date.now();
      const timeSinceLastChange = now - lastSectionChangeRef.current;
      const canChangeSection = timeSinceLastChange > SECTION_CHANGE_DELAY;
      
      // Special case: If scrolling from taskbar and we're in timeline tab, 
      // manually scroll the content instead of changing tabs immediately
      if (activeTab === 'timeline' && e.currentTarget === largRef.current && smalEl) {
        const { scrollTop, scrollHeight, clientHeight } = smalEl;
        const isAtTop = scrollTop <= 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD;
        
        // If we're not at boundaries, manually scroll the content
        if (delta > 0 && !isAtBottom) {
          smalEl.scrollTop += Math.min(delta, 100);
          e.preventDefault();
          return;
        }
        if (delta < 0 && !isAtTop) {
          smalEl.scrollTop += Math.max(delta, -100);
          e.preventDefault();
          return;
        }
      }
      
      // Normal behavior for non-taskbar scrolling or at timeline boundaries
      if (smalEl) {
        const { scrollTop, scrollHeight, clientHeight } = smalEl;
        const isAtTop = scrollTop <= 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD;
        
        // For Timeline tab with positive delta (scrolling down)
        if (activeTab === 'timeline' && delta > 0) {
          // If not at bottom yet, allow natural scrolling and prevent section change
          if (!isAtBottom) {
            return; // Let the browser handle normal scrolling
          }
          
          // If we've detected we're at the bottom, and this is the first scroll event 
          // after reaching the bottom, wait one more scroll event before changing tabs
          if (isAtBottom && !timelineAtBottom) {
            setTimelineAtBottom(true);
            e.preventDefault();
            return;
          }
        }
        // For other tabs or negative delta (scrolling up)
        else {
          // Only allow inner scrolling if we're not at the boundaries
          if (delta > 0 && !isAtBottom) {
            return; // Scrolling down and not at bottom
          }
          if (delta < 0 && !isAtTop) {
            return; // Scrolling up and not at top
          }
        }
      }
      
      // ignore small jitters
      if (Math.abs(delta) < MIN_WHEEL_DELTA) return;
      
      // If we're in a cooldown period, prevent section change
      if (!canChangeSection) {
        e.preventDefault();
        return;
      }
      
      // Always prevent default to stop any momentum scrolling
      e.preventDefault();
      
      // Only process the first scroll event in a burst
      if (!isScrollingRef.current) {
        isScrollingRef.current = true;
        const currentTabIdx = tabOrder.indexOf(activeTab);
        
        // Update last section change time immediately
        lastSectionChangeRef.current = now;
        
        if (delta > 0) {
          if (currentTabIdx < tabOrder.length - 1) {
            setActiveTab(tabOrder[currentTabIdx + 1]);
            setTimelineAtBottom(false);
          } else {
            navigateToSection(currentSection + 1);
          }
        } else {
          if (currentTabIdx > 0) {
            setActiveTab(tabOrder[currentTabIdx - 1]);
          } else {
            navigateToSection(currentSection - 1);
          }
        }
        
        // Set a longer cooldown to prevent rapid scrolling
        if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
        scrollEndTimerRef.current = setTimeout(() => {
          isScrollingRef.current = false;
        }, SECTION_CHANGE_DELAY);
      }
    };
    
    // Add wheel event listeners to both the content and the taskbar areas
    const smalNode = smalRef.current;
    const largNode = largRef.current;
    const sectionNode = sectionRef.current;
    
    smalNode && smalNode.addEventListener('wheel', handleWheel, { passive: false });
    largNode && largNode.addEventListener('wheel', handleWheel, { passive: false });
    sectionNode && sectionNode.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      smalNode && smalNode.removeEventListener('wheel', handleWheel);
      largNode && largNode.removeEventListener('wheel', handleWheel);
      sectionNode && sectionNode.removeEventListener('wheel', handleWheel);
      if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
    };
  }, [isTransitioning, isContentReady, currentSection, activeTab, timelineAtBottom]);

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <AboutMe key="about" />
      case 'timeline':
        return <Timeline key="timeline" ref={timelineRef} />
      case 'achievements':
        return <Achievements key="achievements" />
      case 'certifications':
        return <Certifications key="certifications" />
      default:
        return <AboutMe key="about" />
    }
  }

  // Taskbar animation variants
  const taskbarVariants = {
    initial: direction === 1 ? { opacity: 0, y: -40 } : { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.7 } },
    exit: direction === 1 ? { opacity: 0, y: 40, transition: { duration: 0.5 } } : { opacity: 0, y: -40, transition: { duration: 0.5 } }
  };

  return (
    <section className='about-section' ref={sectionRef}>
      {isMobile ? (
        <div className="about-sections-stack">
          <AboutMe />
          <Timeline />
          <Achievements />
          <Certifications />
        </div>
      ) : (
        <>
          <motion.div
            className={`larg ${isVisible ? 'visible' : ''}`}
            variants={taskbarVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            ref={largRef}
          >
            <Taskbar activeTab={activeTab} setActiveTab={setActiveTab} direction={direction} />
          </motion.div>
          <div ref={smalRef} className={`smal ${isVisible ? 'visible' : ''}`}>
            {renderContent()}
          </div>
        </>
      )}
    </section>
  )
}