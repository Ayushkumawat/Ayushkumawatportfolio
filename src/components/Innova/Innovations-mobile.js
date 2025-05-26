import React, { useState, useEffect } from 'react';
import './Innovations-mobile.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function InnovationsMobile({ projects }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const currentProject = projects[currentIndex];

  // Auto-advance timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHovered) {
        handleNext();
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [isHovered]);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
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
    <div 
      className="innovations-mobile"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
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
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
          
          <motion.div 
            className="project-details"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div 
              className="project-category"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {currentProject.category}
            </motion.div>
            
            <motion.h2 
              className="project-title"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {currentProject.title} {currentProject.title2}
            </motion.h2>
            
            <motion.p 
              className="project-description"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {currentProject.description}
            </motion.p>
            
            <motion.div 
              className="project-actions"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
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
      </AnimatePresence>

      <motion.div 
        className="navigation-controls"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div className="navigation-buttons">
          <motion.button 
            className="prev-button" 
            onClick={handlePrev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
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
          >
            <i className="fas fa-chevron-right"></i>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
