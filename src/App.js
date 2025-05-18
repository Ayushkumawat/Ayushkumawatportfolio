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
  const appContainerRef = useRef(null);
  const isMobile = useIsMobile();

  // Update current section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!appContainerRef.current) return;
      
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
  }, []);

  // Method to change section (for navbar)
  const changeSectionSafely = (sectionIndex) => {
    if (!appContainerRef.current) return;
    
    const container = appContainerRef.current;
    const targetScroll = sectionIndex * window.innerHeight;
    
    container.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
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
      >
        <section id="home">
          <Home />
        </section>
        
        <section id="about">
          <About currentSection={currentSection === 1 ? 1 : null} />
        </section>
        
        <section id="innovations">
          <Innovations isActive={currentSection === 2} />
        </section>
        
        <section id="dashboard">
          <Dashboard />
        </section>
        
        <section id="contact">
          <Contact />
        </section>
      </div>
    </ThemeProvider>
  );
}