import React, { useEffect, useRef, useState } from 'react';
import './AboutMe.css?v=1.1';
import VanillaTilt from 'vanilla-tilt';
import { motion } from 'framer-motion';

const headingVariant = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, type: "spring", stiffness: 80 } },
  exit: { opacity: 0, x: -60, transition: { duration: 0.5 } }
};
const paraVariant = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, delay: 0.2, type: "spring", stiffness: 80 } },
  exit: { opacity: 0, x: 60, transition: { duration: 0.5 } }
};
const btnVariant = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1.1, transition: { duration: 0.5, delay: 0.4, type: "spring", bounce: 0.5 } },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.4 } }
};
const cardVariant = {
  hidden: { opacity: 0, y: 60, rotate: -8 },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotate: 0, 
    transition: { 
      duration: 0.8, 
      delay: 0.3, 
      type: "spring", 
      stiffness: 60 
    } 
  },
  exit: { opacity: 0, y: 60, rotate: 8, transition: { duration: 0.5 } }
};

// Enhanced card variant with more dramatic lazy loading effect for mobile
const mobileCardVariant = {
  hidden: { 
    opacity: 0, 
    y: 100, 
    scale: 0.9,
    filter: "blur(8px)"
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: "blur(0px)",
    transition: { 
      duration: 1.2, 
      delay: 0.4,
      type: "spring", 
      stiffness: 50,
      damping: 15
    } 
  },
  exit: { 
    opacity: 0, 
    y: 30, 
    scale: 0.9, 
    filter: "blur(4px)",
    transition: { 
      duration: 0.5 
    } 
  }
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
  
  const getResponsiveFontSize = () => {
    if (!isMobile) return {};
    // More aggressive scaling for short screens and very narrow screens
    let base = Math.min(height, width) / 60;
    if (height <= 700) base = Math.min(height, width) / 80;
    if (height <= 600) base = Math.min(height, width) / 100;
    if (width <= 400) base = Math.min(height, width) / 120; // Even smaller for very narrow screens
    // Clamp between 0.45rem and 0.85rem for very small screens
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
          justifyContent: 'center', // Centers cont-wrapper vertically
          alignItems: 'center',   // Centers cont-wrapper horizontally
          // Height is now directly on the main div, no need to repeat here
        };
      }
      setContentStyle(newContentStyle);
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [isMobile, height, width]); // Add height and width dependencies for re-layout on size change
  
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

  // Get appropriate class based on screen size
  const getResponsiveClass = () => {
    if (!isMobile) return "aboutme-content";
    
    let classes = "aboutme-content aboutme-mobile";
    
    // Width-based classes
    if (isVerySmall) classes += " aboutme-very-small";
    else if (isSmall) classes += " aboutme-small";
    
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
        padding: isMobile ? '0' : '50px 0 70px', // Mobile padding 0 here
        height: isMobile ? 'calc(100vh - 70px)' : 'auto', // Assumed 70px navbar height
        minHeight: isMobile ? 'calc(100vh - 70px)' : 'auto',
        overflow: isMobile ? 'hidden' : 'auto', // Prevent scrolling on mobile
        boxSizing: 'border-box', // Good practice
        ...contentStyle // Applies flex centering for mobile
      }}
    >
      {/* Card Section - Left side (only show on desktop/tablet) */}
      {!isMobile && (
      <motion.div
        className="card dark-card"
        variants={cardVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
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
      </motion.div>
      )}

      {/* Content Section - Right side (full width and centered on mobile) */}
      <motion.div 
        className="cont-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ 
          order: 1,
          // flex: isMobile ? '1' : 'unset', // Removed, parent div handles main axis centering
          maxWidth: isMobile ? '90%' : '62%',
          width: isMobile ? '90%' : undefined, // max-width should control actual width
          padding: isMobile ? '0 15px' : '0', // Minimal horizontal padding for text on mobile
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', // Centers children (text block and button) vertically
          alignItems: 'center',   // Centers children horizontally
          textAlign: isMobile ? 'center' : 'left', // Center text for p and button
          // No height or minHeight here - should size to its content
        }}
      >
        {/* Only show heading on desktop/tablet */}
        {!isMobile && (
          <motion.h1 
            className="heading" 
            variants={headingVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={getResponsiveFontSize()}
          >
            About Me
          </motion.h1>
        )}

        <motion.div 
          className="cont" // This div wraps the paragraphs
          variants={paraVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ 
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: isMobile ? (width <= 400 ? '0.25rem' : '0.5rem') : '1.2rem', // Even less gap for <=400px
            margin: isMobile ? '0' : undefined,
            padding: isMobile ? '0' : undefined,
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
          
        </motion.div>

        <motion.a 
          href="#resume" 
          className="btn"
          variants={btnVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            ...getResponsiveFontSize(),
            margin: isMobile ? (width <= 400 ? '0.3rem 0 0 0' : '0.5rem 0 0 0') : undefined,
            padding: isMobile ? (width <= 400 ? '0.4rem 1rem' : '0.5rem 1.2rem') : undefined,
            display: 'block',
          }}
        >
          <i className="far fa-file-pdf"></i>
          View Resume
        </motion.a>
      </motion.div>
    </div>
  );
}