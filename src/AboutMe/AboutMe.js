import React, { useEffect, useRef, useState } from 'react';
import './AboutMe.css';
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
      delay: 0.6, 
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
  const { isSmall, isVerySmall, isShortHeight, isVeryShortHeight, width, height } = useScreenSize();
  const [topPadding, setTopPadding] = useState('2rem');
  const [contentStyle, setContentStyle] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Simulate lazy loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Calculate dynamic padding and positioning based on screen height
  useEffect(() => {
    const updateLayout = () => {
      const height = window.innerHeight;
      const navbarHeight = 70; // Estimated navbar height
      let newTopPadding = '30px'; // Default desktop padding
      let newContentStyle = {};
      
      if (isMobile) {
        // For mobile screens, calculate spacing that centers content vertically
        newContentStyle = { 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        };
      }
      
      setTopPadding(newTopPadding);
      setContentStyle(newContentStyle);
    };
    
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [isMobile]);
  
  useEffect(() => {
    if (!isMobile) {
      const cards = document.querySelectorAll('.card');
      cards.forEach((card) => {
        VanillaTilt.init(card, {
          max: 15,
          speed: 4,
          glare: true,
          'max-glare': 0.3,
        });
      });
    }
  }, [isMobile]);

  // Get appropriate class based on screen size
  const getResponsiveClass = () => {
    if (!isMobile) return "about-content";
    
    let classes = "about-content aboutme-mobile aboutme-centered-content";
    
    // Width-based classes
    if (isVerySmall) classes += " aboutme-very-small";
    else if (isSmall) classes += " aboutme-small";
    
    // Height-based classes
    if (isVeryShortHeight) classes += " aboutme-very-short";
    else if (isShortHeight) classes += " aboutme-short";
    
    return classes;
  };

  // Get dynamic font size for paragraph based on available space
  const getResponsiveFontSize = () => {
    if (!isMobile) return {};
    
    // Calculate font size based on both height and width
    let baseFontSize = Math.min(height * 0.0018, width * 0.0025);
    
    // Smaller font for very small screens
    if (width <= 360) {
      baseFontSize = Math.min(height * 0.0015, width * 0.0022);
    }
    
    // Even smaller font for extremely small screens
    if (width <= 330) {
      baseFontSize = Math.min(height * 0.0012, width * 0.0018);
    }
    
    const fontSize = `${Math.max(0.7, Math.min(baseFontSize, 1.1))}rem`;
    
    return { fontSize };
  };

  // Get card style based on screen size
  const getCardStyle = () => {
    if (!isMobile) return {};
    
    let style = {
      width: '90%',
      maxWidth: '600px',
    };
    
    // Adjust width for small screens
    if (width <= 380) {
      style.width = '95%';
      style.padding = '0.8rem 0.5rem';
    }
    
    // Further adjust for very small screens
    if (width <= 330) {
      style.width = '92%';
      style.padding = '0.6rem 0.4rem';
    }
    
    return style;
  };

  return (
    <div 
      className={getResponsiveClass()} 
      ref={aboutRef} 
      style={{
        display: 'flex', 
        visibility: 'visible', 
        position: 'relative', 
        zIndex: 30,
        height: isMobile ? '100vh' : 'auto',
        ...contentStyle
      }}
    >
      {!isMobile && (
        <motion.div
          className="card"
          variants={cardVariant}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          exit="exit"
        >
          <img src={require('../../../images/favicon.jpg')}  alt=''></img>
          <h1>Ayush Kumawat</h1>
          <h2>AI Researcher</h2>
          <h3>Indian Space Research Organization, Ahmedabad</h3>
          <h4>B.Tech (Hons.) Artifical Intelligence and Data Science</h4>
          <p className="contact-info">+91 - 9098984098 | ayushkumawat2112@gmail.com</p>
        </motion.div>
      )}
      <div className="cont-wrapper">
        {!isMobile && (
          <motion.h2
            className="heading"
            variants={headingVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            About Me
          </motion.h2>
        )}
        {isMobile ? (
          <motion.div
            className={`aboutme-card ${isVerySmall ? 'aboutme-card-xs' : ''}`}
            variants={mobileCardVariant}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            exit="exit"
            style={getCardStyle()}
          >
            <div className="aboutme-card-content">
              <motion.p
                variants={paraVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={getResponsiveFontSize()}
              >
                So, about me! I'm an aspiring B.Tech. Computer Science student specializing in Artificial Intelligence and Data Science. My journey has been all about creating impactful software and conquering projects in detection, prediction, and classification. These experiences have bestowed me with a strong grasp of practical applications in these cutting-edge technologies. As I journey forward, my goal is to not only excel in the technical aspects but also to collaborate and communicate effectively, understanding that the best solutions are often born from collective efforts. If you're looking for a dedicated and forward-thinking team player who is ready to make a difference, I'm excited to connect and explore the endless possibilities together.
              </motion.p>
              <motion.a
                href={require("../../../images/Ayush Kumawat's Resume.pdf")}
                className="btn"
                download="Ayush Kumawat's.pdf"
                variants={btnVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={width <= 330 ? { fontSize: '0.8rem', padding: '0.3rem 0.8rem' } : {}}
              >
                <i className="fa-solid fa-file-export"></i>View Resume
              </motion.a>
            </div>
          </motion.div>
        ) : (
          <>
            <div className='cont'>
              <motion.p
                variants={paraVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={getResponsiveFontSize()}
              >
                So, about me! I'm an aspiring B.Tech. Computer Science student specializing in Artificial Intelligence and Data Science. My journey has been all about creating impactful software and conquering projects in detection, prediction, and classification. These experiences have bestowed me with a strong grasp of practical applications in these cutting-edge technologies. As I journey forward, my goal is to not only excel in the technical aspects but also to collaborate and communicate effectively, understanding that the best solutions are often born from collective efforts. If you're looking for a dedicated and forward-thinking team player who is ready to make a difference, I'm excited to connect and explore the endless possibilities together.
              </motion.p>
            </div>
            <motion.a
              href={require("../../../images/Ayush Kumawat's Resume.pdf")}
              className="btn"
              download="Ayush Kumawat's.pdf"
              variants={btnVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <i className="fa-solid fa-file-export"></i>View Resume
            </motion.a>
          </>
        )}
      </div>
    </div>
  );
}