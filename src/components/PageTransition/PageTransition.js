import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PageTransition.css';

const pageVariants = {
  // Home page animations
  home: {
    enter: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    },
    exit: {
      y: -100,
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  },
  // About page animations
  about: {
    enter: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    },
    exit: {
      x: 100,
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  },
  // Innovations page animations
  innovations: {
    enter: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  },
  // Dashboard page animations
  dashboard: {
    enter: {
      rotateY: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    },
    exit: {
      rotateY: 90,
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  },
  // Contact page animations
  contact: {
    enter: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    },
    exit: {
      y: 100,
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  }
};

const getPageAnimation = (pageIndex, direction) => {
  const pageNames = ['home', 'about', 'innovations', 'dashboard', 'contact'];
  const pageName = pageNames[pageIndex];
  return pageVariants[pageName];
};

const PageTransition = ({ children, location, onAnimationComplete }) => {
  const [displayLocation, setDisplayLocation] = useState(location);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (location !== displayLocation) {
      setDirection(location > displayLocation ? 1 : -1);
      setDisplayLocation(location);
    }
  }, [location, displayLocation]);

  const pages = React.Children.toArray(children);
  const currentPage = pages[displayLocation];

  // Handle animation completion
  const handleAnimationComplete = () => {
    // Notify parent component that animation is complete
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {currentPage && (
        <motion.div
          key={displayLocation}
          initial="exit"
          animate="enter"
          exit="exit"
          variants={getPageAnimation(displayLocation, direction)}
          className="page-transition"
          onAnimationComplete={handleAnimationComplete}
        >
          {currentPage}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageTransition; 