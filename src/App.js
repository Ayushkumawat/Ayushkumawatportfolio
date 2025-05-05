import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { ThemeProvider } from './ThemeContext';
import ParticlesBackground from './components/Background/ParticlesBackground';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import About from './components/About/About';
import Innovations from './components/Innovations/Innovations';
import Dashboard from './components/Dashboard/Dashboard';
import Contact from './components/Contact/Contacts';
import PageTransition from './components/PageTransition/PageTransition';

// Responsive hook
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 998);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 998);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
}

export default function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [lastSection, setLastSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationsComplete, setAnimationsComplete] = useState(true);
  const lastScrollTimeRef = useRef(Date.now() - 2000); // Initialize with a past time
  const scrollAccumulatorRef = useRef(0);
  const SCROLL_THRESHOLD = 50;
  const TOTAL_SECTIONS = 5;
  const ANIMATION_DURATION = 800; // Animation duration in ms
  const SCROLL_COOLDOWN = 1000; // ms between allowed scrolls
  const isMobile = useIsMobile();

  // Handle page transition completion
  useEffect(() => {
    // Start transition
    setIsTransitioning(true);
    setAnimationsComplete(false);
    
    // Record the scroll time
    lastScrollTimeRef.current = Date.now();
    
    // Set timer for transition end
    const transitionTimer = setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
    
    // Set a timer for animations to complete
    const animationTimer = setTimeout(() => {
      setAnimationsComplete(true);
    }, ANIMATION_DURATION);

    return () => {
      clearTimeout(transitionTimer);
      clearTimeout(animationTimer);
    };
  }, [currentSection]);

  const handleWheel = (e) => {
    // Don't handle wheel events while transitioning or animations are still running
    if (isTransitioning || !animationsComplete) {
      e.preventDefault();
      return;
    }

    // Check time since last scroll to prevent rapid scrolling
    const now = Date.now();
    const timeSinceLastScroll = now - lastScrollTimeRef.current;
    const canScroll = timeSinceLastScroll > SCROLL_COOLDOWN;
    
    if (!canScroll) {
      e.preventDefault();
      return;
    }

    // Check if we're in the About section - let it handle its own scrolling
    if (currentSection === 1) {
      return; // Don't interfere with About section scrolling
    }

    // Check the complete path of elements to see if we're in a timeline or scrollable component
    let element = e.target;
    let isInScrollable = false;
    
    // Check if the event originated in a scrollable area by walking up the DOM tree
    while (element && element !== document) {
      // Timeline specific classes
      if (element.classList && 
          (element.classList.contains('outer-timeline') || 
           element.classList.contains('timeline') || 
           element.classList.contains('smal'))) {
        isInScrollable = true;
        break;
      }
      
      // General scrollable test - if element can scroll vertically
      if (element.scrollHeight > element.clientHeight) {
        const style = window.getComputedStyle(element);
        const overflowY = style.getPropertyValue('overflow-y');
        if (overflowY === 'scroll' || overflowY === 'auto') {
          // Check if scrolling is possible in the direction of wheel
          if ((e.deltaY > 0 && element.scrollTop < element.scrollHeight - element.clientHeight) ||
              (e.deltaY < 0 && element.scrollTop > 0)) {
            isInScrollable = true;
            break;
          }
        }
      }
      
      element = element.parentNode;
    }
    
    // If inside a scrollable area, let the browser handle it
    if (isInScrollable) {
      return;
    }

    // For other sections, handle page transitions
    scrollAccumulatorRef.current += e.deltaY;

    if (Math.abs(scrollAccumulatorRef.current) >= SCROLL_THRESHOLD) {
      const direction = scrollAccumulatorRef.current > 0 ? 1 : -1;
      const nextSection = currentSection + direction;
      
      if (nextSection >= 0 && nextSection < TOTAL_SECTIONS) {
        // Update last scroll time
        lastScrollTimeRef.current = now;
        
        setIsTransitioning(true);
        setAnimationsComplete(false);
        setLastSection(currentSection);
        setCurrentSection(nextSection);
      }
      
      scrollAccumulatorRef.current = 0;
    }
  };

  // Method to manually change section
  const changeSectionSafely = (sectionIndex) => {
    if (isTransitioning || !animationsComplete) return;
    
    // Check time since last scroll
    const now = Date.now();
    const timeSinceLastScroll = now - lastScrollTimeRef.current;
    const canScroll = timeSinceLastScroll > SCROLL_COOLDOWN;
    
    if (!canScroll) return;
    
    if (sectionIndex >= 0 && sectionIndex < TOTAL_SECTIONS) {
      // Update last scroll time
      lastScrollTimeRef.current = now;
      
      setIsTransitioning(true);
      setAnimationsComplete(false);
      setLastSection(currentSection);
      setCurrentSection(sectionIndex);
    }
  };

  // Method for child components to signal their animations are complete
  const handleComponentAnimationComplete = () => {
    setAnimationsComplete(true);
  };

  const direction = currentSection > lastSection ? 1 : -1;
  
  return (
    <ThemeProvider>
      {/* Particles background is placed outside PageTransition so it doesn't reset during transitions */}
      <ParticlesBackground />
      
      <Navbar 
        currentSection={currentSection} 
        setCurrentSection={changeSectionSafely} 
        isTransitioning={isTransitioning || !animationsComplete}
      />
      
      <div 
        className="app-container" 
        onWheel={handleWheel}
        style={{ 
          pointerEvents: isTransitioning ? 'none' : 'auto',
          position: 'relative' 
        }}
      >
        {isMobile ? (
          <>
            <Home setCurrentSection={changeSectionSafely} />
            <About 
              currentSection={currentSection} 
              direction={direction} 
              setCurrentSection={changeSectionSafely}
            />
            <Innovations />
            <Dashboard 
              currentSection={currentSection} 
              setCurrentSection={changeSectionSafely}
            />
            <Contact />
          </>
        ) : (
          <PageTransition 
            location={currentSection}
            onAnimationComplete={handleComponentAnimationComplete}
          >
            <Home setCurrentSection={changeSectionSafely} />
            <About 
              currentSection={currentSection} 
              direction={direction} 
              setCurrentSection={changeSectionSafely}
            />
            <Innovations />
            <Dashboard 
              currentSection={currentSection} 
              setCurrentSection={changeSectionSafely}
            />
            <Contact />
          </PageTransition>
        )}
      </div>
    </ThemeProvider>
  );
}