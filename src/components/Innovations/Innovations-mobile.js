import React, { useState, useEffect } from 'react';
import './Innovations-mobile.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function InnovationsMobile({ projects, isActive }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isActive]);

  const handleNext = () => {
    if (!isActive) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    if (!isActive) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const currentProject = projects[currentIndex];

  // Auto-advance timer
  useEffect(() => {
    if (!isActive || !isVisible) return;
    
    const timer = setInterval(() => {
      if (!isHovered) {
        handleNext();
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [isHovered, isActive, isVisible]);

  const variants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      zIndex: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 }
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      zIndex: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 }
      }
    })
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const pageDots = {
    initial: { scale: 0.8, opacity: 0.4 },
    active: { scale: 1, opacity: 1 }
  };

  return (
    <motion.div 
      className="innovations-mobile"
      variants={containerVariants}
      initial="hidden"
      animate={isActive && isVisible ? "visible" : "hidden"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.h1 
        className="innovations-title"
        initial={false}
        animate={isActive && isVisible ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        My <span>Innovations</span>
      </motion.h1>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        {isVisible && (
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                handleNext();
              } else if (swipe > swipeConfidenceThreshold) {
                handlePrev();
              }
            }}
            className="project-display"
          >
            <motion.div 
              className="project-image-container"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.img
                src={currentProject.imageUrl}
                alt={currentProject.title}
                className="project-image"
                initial={false}
                animate={isActive ? { scale: 1 } : { scale: 1.1 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
            
            <motion.div 
              className="project-details glass-card"
              initial={false}
              animate={isActive ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.div 
                className="project-category"
                initial={false}
                animate={isActive ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
                transition={{ delay: 0.3 }}
              >
                {currentProject.category}
              </motion.div>
              
              <motion.h2 
                className="project-title"
                initial={false}
                animate={isActive ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
                transition={{ delay: 0.4 }}
              >
                {currentProject.title} {currentProject.title2}
              </motion.h2>
              
              <motion.p 
                className="project-description"
                initial={false}
                animate={isActive ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ delay: 0.5 }}
              >
                {currentProject.description}
              </motion.p>
              
              <motion.div 
                className="project-actions"
                initial={false}
                animate={isActive ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.a
                  href={currentProject.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-link"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fa-brands fa-github"></i>
                </motion.a>
                
                <motion.button 
                  className="view-project"
                  onClick={() => window.open(currentProject.githubLink, '_blank')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>View Project</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="navigation-controls"
        initial={{ y: 50, opacity: 0 }}
        animate={isActive && isVisible ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="navigation-buttons glass-card">
          <motion.button 
            className="prev-button" 
            onClick={handlePrev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={!isActive}
          >
            <i className="fas fa-chevron-left"></i>
          </motion.button>
          
          <div className="pagination-dots">
            {projects.map((_, index) => (
              <motion.div
                key={index}
                className={`pagination-dot ${index === currentIndex ? 'active' : ''}`}
                variants={pageDots}
                animate={index === currentIndex ? "active" : "initial"}
                whileHover={{ scale: 1.2 }}
                onClick={() => {
                  if (!isActive) return;
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
              />
            ))}
          </div>
          
          <motion.button 
            className="next-button" 
            onClick={handleNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={!isActive}
          >
            <i className="fas fa-chevron-right"></i>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
