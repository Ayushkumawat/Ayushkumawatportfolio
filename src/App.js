import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import './styles/GlassCard.css';
import { ThemeProvider } from './ThemeContext';
import ParticlesBackground from './components/Background/ParticlesBackground';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import About from './components/About/About';
import Innovations from './components/Innovations/Innovations';
import DashboardEntry from './components/Dashboard/DashboardEntry';
import Contact from './components/Contact/Contacts';

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const appContainerRef = useRef(null);
  const isMobile = useIsMobile();

  // Update current section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!appContainerRef.current || isTransitioning) return;
      
      const container = appContainerRef.current;
      const scrollPosition = container.scrollTop;
      const windowHeight = window.innerHeight;
      const sectionIndex = Math.round(scrollPosition / windowHeight);
      
      setCurrentSection(sectionIndex);
    };

    const container = appContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [isTransitioning]);

  // Method to change section (for navbar)
  const changeSectionSafely = (sectionIndex) => {
    if (!appContainerRef.current || isTransitioning) return;
    
    setIsTransitioning(true);
    const container = appContainerRef.current;
    const targetScroll = sectionIndex * window.innerHeight;
    
    container.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });

    // Wait for scroll transition to complete
    setTimeout(() => {
      setIsTransitioning(false);
      setCurrentSection(sectionIndex);
    }, 800); // Match this with your scroll transition duration
  };

  return (
    <ThemeProvider>
      <ParticlesBackground />
      
      <Navbar 
        currentSection={currentSection} 
        setCurrentSection={changeSectionSafely}
      />
      
      <div 
        ref={appContainerRef}
        className="app-container"
        style={{
          scrollSnapType: isTransitioning ? 'none' : 'y mandatory',
          pointerEvents: isTransitioning ? 'none' : 'auto'
        }}
      >
        <section id="home">
          <Home setCurrentSection={changeSectionSafely} />
        </section>
        
        <section id="about">
          <About currentSection={currentSection === 1 ? 1 : null} />
        </section>
        
        <section id="innovations">
          <Innovations 
            isActive={currentSection === 2}
            changeSection={changeSectionSafely}
            currentSection={currentSection}
          />
        </section>
        
        <section id="dashboard">
          <DashboardEntry currentSection={currentSection} />
        </section>
        
        <section id="contact">
          <Contact />
        </section>
      </div>
    </ThemeProvider>
  );
}