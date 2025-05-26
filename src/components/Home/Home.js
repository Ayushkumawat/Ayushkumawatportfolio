import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import './Home.css';
import { Typed } from 'react-typed';

// Simplified animation variants
const fadeIn = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export default function Home({ setCurrentSection }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 998);
  const typedRef = useRef(null);
  const typedInstance = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageControls = useAnimation();
  const circleControls = useAnimation();
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 998);
      // Destroy and reinitialize typed instance on resize to prevent overflow issues
      if (typedInstance.current) {
        typedInstance.current.destroy();
        initTyped();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize Typed.js animation with options
  const initTyped = () => {
    const options = {
      strings: ["Frontend Developer", "Python Programmer", "AI - ML Developer"],
      typeSpeed: 80,
      backSpeed: 80,
      loop: true,
      // Smart backspace to help prevent overflow
      smartBackspace: true,
      // Shorter delays to reduce time with longer text
      backDelay: 700,
      startDelay: 300
    };
    if (typedRef.current) {
      typedInstance.current = new Typed(typedRef.current, options);
    }
    return typedInstance.current;
  };

  // Original Typed.js animation
  useEffect(() => {
    const typedObj = initTyped();
    
    // Clean up on unmount
    return () => {
      if (typedObj) typedObj.destroy();
    };
  }, []);

  // Animation sequence for image and circle
  useEffect(() => {
    if (imageLoaded) {
      // Start image animation
      imageControls.start({
        opacity: 1,
        rotateY: 0,
        rotateZ: 0,
        scale: 1,
        transition: {
          duration: 1.2,
          ease: [0.6, 0.01, -0.05, 0.95],
          opacity: { duration: 0.8 },
          rotateY: { duration: 1.2 },
          rotateZ: { duration: 1.0 },
          scale: { duration: 1.2 }
        }
      });
      
      // Start circle animation with delay
      setTimeout(() => {
        circleControls.start({
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.8
          }
        });
        
        // Start rotation after circle appears
        setTimeout(() => {
          circleControls.start({
            rotate: 360,
            transition: {
              repeat: Infinity,
              duration: 15,
              ease: "linear"
            }
          });
        }, 400);
        
      }, 700); // Delay circle appearance
    }
  }, [imageLoaded, imageControls, circleControls]);

  // Handle external link opening
  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Handle image load completion
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
    // Still proceed with animations
    setImageLoaded(true);
  };

  // Helper to remove hover effect on mobile after click
  const removeHover = (e) => {
    if (window.innerWidth <= 998 && e.currentTarget) {
      e.currentTarget.classList.add('no-hover');
      setTimeout(() => {
        if (e.currentTarget) {
          e.currentTarget.classList.remove('no-hover');
        }
      }, 150); // Remove highlight quickly after tap
    }
  };

  return (
    <section className="section_outer">
      <div className='home-section'>
        <div className='home-img'>
          <motion.img
            src={require('../../images/IMG.png')}
            alt='Profile'
            initial={{ opacity: 0, rotateY: 15, rotateZ: -10, scale: 0.8 }}
            animate={imageControls}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
          <motion.span
            className="circle-spin"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={circleControls}
          />
        </div>
        <div className='home-content'>
          <motion.h3
            initial="hidden"
            animate={{ ...fadeIn.visible, transition: { duration: 0.7 } }}
            variants={fadeIn}
          >
            Hey there!, It's Me
          </motion.h3>
          <motion.h1
            initial="hidden"
            animate={{ ...fadeIn.visible, transition: { duration: 0.7, delay: 0.2 } }}
            variants={fadeIn}
          >
            Ayush Kumawat
          </motion.h1>
          <motion.h3
            initial="hidden"
            animate={{ ...fadeIn.visible, transition: { duration: 0.7, delay: 0.4 } }}
            variants={fadeIn}
          >
            And I'm a <span id="types" ref={typedRef}></span>
          </motion.h3>
          <motion.div
            className="card glass-card"
            initial="hidden"
            animate={{ ...fadeIn.visible, transition: { duration: 0.7, delay: 0.6 } }}
            variants={fadeIn}
          >
            <p>An AI Researcher and Robotics Enthusiast passionate about building intelligent systems that solve real-world problems. From deploying models on edge devices at ISRO to developing award-winning AI solutions, I blend innovation with impact across domains like computer vision, autonomous systems, and human-centered AI.</p>
          </motion.div>
          <motion.div
            className="social-media"
            initial="hidden"
            animate={{ opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.8 } }}
          >
            {[
              { icon: "fa-brands fa-linkedin-in", url: 'https://www.linkedin.com/in/ayush-kumawat/' },
              { icon: "fa-brands fa-github", url: 'https://www.github.com/Ayushkumawat' },
              { icon: "fa-solid fa-envelope", url: "mailto:ayu.kumawat2002@gmail.com" },
              { icon: "fa-brands fa-twitter", url: 'https://twitter.com/_Ayush_Kumawat' }
            ].map((social, index) => (
              <motion.a
                key={index}
                onClick={e => { openInNewTab(social.url); removeHover(e); }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + (index * 0.18) }}
              >
                <i className={social.icon}></i>
              </motion.a>
            ))}
          </motion.div>
          <motion.div
            className="btns"
            initial="hidden"
            animate={{ ...fadeIn.visible, transition: { duration: 0.7, delay: 1 } }}
            variants={fadeIn}
          >
            <button onClick={e => { setCurrentSection(3); removeHover(e); }} className='btn'>
              {isMobile ? 'My Dashboard' : 'Proficiency Dashboard'}
            </button>
            <button onClick={e => { setCurrentSection(4); removeHover(e); }} className='btn'>
              {isMobile ? "Let's Connect !" : "Let's work together !"}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}