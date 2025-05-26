import React, { useEffect, useRef, useState } from 'react';
import './AboutMe.css?v=1.1';
import VanillaTilt from 'vanilla-tilt';
import { motion } from 'framer-motion';

// Animation variant for the resume button
const btnVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } }
};

// Responsive hook for AboutMe
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 998);
  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 998);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
}

// Hook for getting screen size details
function useScreenSize() {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isSmall: window.innerWidth <= 480,
    isVerySmall: window.innerWidth <= 360,
    isShortHeight: window.innerHeight <= 650,
    isVeryShortHeight: window.innerHeight <= 550
  });
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScreenSize({
        width,
        height,
        isSmall: width <= 480,
        isVerySmall: width <= 360,
        isShortHeight: height <= 650,
        isVeryShortHeight: height <= 550
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return screenSize;
}

export default function AboutMe() {
  const aboutRef = useRef(null);
  const isMobile = useIsMobile();
  const { isSmall, isVerySmall, width, height } = useScreenSize();
  const [contentStyle, setContentStyle] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  const getResponsiveFontSize = () => {
    if (!isMobile) return {};
    let base = Math.min(height, width) / 60;
    if (height <= 700) base = Math.min(height, width) / 80;
    if (height <= 600) base = Math.min(height, width) / 100;
    if (width <= 400) base = Math.min(height, width) / 120;
    const minFont = width <= 400 ? 0.45 : 0.5;
    const maxFont = width <= 400 ? 0.85 : 0.95;
    const fontSize = Math.max(minFont, Math.min(maxFont, base / 10));
    return { fontSize: `${fontSize}rem`, lineHeight: 1.22 };
  };
  
  useEffect(() => {
    const updateLayout = () => {
      let newContentStyle = {};
      if (isMobile) {
        newContentStyle = { 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        };
      }
      setContentStyle(newContentStyle);
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [isMobile, height, width]);
  
  useEffect(() => {
    if (!isMobile) {
      const cards = document.querySelectorAll('.card');
      cards.forEach((card) => {
        VanillaTilt.init(card, {
          max: 8,
          speed: 2,
          glare: false,
          'max-glare': 0,
        });
      });
    }
  }, [isMobile]);

  // Intersection Observer for entry animation
  useEffect(() => {
    const node = aboutRef.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const getResponsiveClass = () => {
    let classes = 'aboutme-content';
    if (isMobile) classes += ' aboutme-mobile';
    if (isVerySmall) classes += ' aboutme-very-small';
    else if (isSmall) classes += ' aboutme-small';
    // Animation class
    classes += isVisible ? ' aboutme-slide-up' : ' aboutme-hidden';
    return classes;
  };

  return (
    <div
      className={getResponsiveClass()}
      ref={aboutRef}
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        visibility: 'visible',
        position: 'relative',
        zIndex: 30,
        width: '100%',
        padding: isMobile ? '0' : '50px 0 70px',
        height: isMobile ? 'calc(100vh - 70px)' : 'auto',
        minHeight: isMobile ? 'calc(100vh - 70px)' : 'auto',
        overflow: isMobile ? 'hidden' : 'auto',
        boxSizing: 'border-box',
        ...contentStyle
      }}
    >
      {/* Card Section - Left side (only show on desktop/tablet) */}
      {!isMobile && (
        <div
          className="card dark-card"
          style={{ 
            order: 0,
            marginRight: '30px',
            alignSelf: 'center',
            width: '30%',
            minWidth: '300px',
            maxWidth: '380px',
            background: 'linear-gradient(135deg, rgba(18, 20, 25, 0.7) 0%, rgba(12, 14, 18, 0.6) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none'
          }}
        >
          <h1>Ayush Kumawat</h1>
          <h2>AI Researcher</h2>
          <h3>Indian Space Research Organization, Ahmedabad</h3>
          <h4>B.Tech (Hons.) Artificial Intelligence and Data Science</h4>
          <p className="contact-info">
            +91 - 9088984098 | ayushkumawat2112@gmail.com
          </p>
          <i className="fas fa-code" style={{ 
            position: 'absolute',
            top: '18px',
            right: '20px',
            fontSize: '26px',
            color: '#FF214F'
          }}></i>
        </div>
      )}

      {/* Content Section - Right side (full width and centered on mobile) */}
      <div
        className="cont-wrapper"
        style={{ 
          order: 1,
          maxWidth: isMobile ? '90%' : '62%',
          width: isMobile ? '90%' : undefined,
          padding: isMobile ? '0 15px' : '0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: isMobile ? 'center' : 'left',
        }}
      >
        {/* Only show heading on desktop/tablet */}
        {!isMobile && (
          <h1
            className="heading"
            style={getResponsiveFontSize()}
          >
            About Me
          </h1>
        )}

        <div
          className={isMobile ? 'cont glass-card' : 'cont'}
          style={{ 
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: isMobile ? (width <= 400 ? '0.25rem' : '0.5rem') : '1.2rem',
            margin: isMobile ? '0' : undefined,
            padding: isMobile ? '1.1rem 1rem' : undefined,
          }}
        >
          <p style={{ ...getResponsiveFontSize(), margin: isMobile ? (width <= 400 ? '0.1rem 0 0.1rem 0' : '0.2rem 0 0.2rem 0') : undefined }}>
            So, about me! I'm an aspiring B.Tech. Computer Science student specializing in Artificial Intelligence 
            and Data Science. My journey has been all about creating impactful software and conquering projects 
            in detection, prediction, and classification. These experiences have bestowed me with a strong grasp of practical applications in these cutting-edge 
            technologies. As I journey forward, my goal is to not only excel in the technical aspects but also to 
            collaborate and communicate effectively, understanding that the best solutions are often born from 
            collective efforts. If you're looking for a dedicated and forward-thinking team player who is ready to make a difference, I'm 
            excited to connect and explore the endless possibilities together.
          </p>
        </div>

        <motion.a
          href="/Resume.pdf"
          className="btn"
          download="Ayush Kumawat Resume.pdf"
          variants={btnVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={width <= 330 ? { fontSize: '0.8rem', padding: '0.3rem 0.8rem' } : {}}
        >
          <i className="fa-solid fa-file-export"></i>View Resume
        </motion.a>
      </div>
    </div>
  );
}