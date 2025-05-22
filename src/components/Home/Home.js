import React, { useEffect, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';
import { motion } from 'framer-motion';
import './Home.css';
import { Typed } from 'react-typed';

const heading1Variant = {
  hidden: { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  exit: { opacity: 0, y: 40, transition: { duration: 0.5 } }
};
const heading2Variant = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, delay: 0.2 } },
  exit: { opacity: 0, x: 60, transition: { duration: 0.5 } }
};
const typedVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, delay: 0.4 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.5 } }
};
const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.6 } },
  exit: { opacity: 0, y: 40, transition: { duration: 0.5 } }
};
// Social icons: container and icon variants for staggered fade-in
const socialContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.8
    }
  },
  exit: {}
};
const socialIcon = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } }
};
const btnsVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, delay: 1 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.5 } }
};
const imgVariant = {
  hidden: { opacity: 0, rotate: -10, scale: 0.8 },
  visible: { opacity: 1, rotate: 0, scale: 1, transition: { duration: 0.8, delay: 0.3 } },
  exit: { opacity: 0, rotate: 10, scale: 0.8, transition: { duration: 0.5 } }
};
const circleVariant = {
  hidden: { opacity: 0, scale: 0.7, rotate: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 360,
    transition: {
      duration: 1, // for appear
      delay: 0.4,
      opacity: { duration: 0.8 },
      scale: { duration: 0.8 },
      rotate: {
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        duration: 15, // matches your CSS
        delay: 1 // start after appear
      }
    }
  },
  exit: { opacity: 0, scale: 0.7, rotate: 0 }
};

export default function Home({ setCurrentSection }) {
  const imgRef = useRef(null);

  useEffect(() => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
      VanillaTilt.init(card, {
        max: 0,
        speed: 4
      });
    });
  }, []);

  const typedRef = useRef(null);

  useEffect(() => {
    const options = {
      strings: ["Frontend Developer", "Python Programmer", "AI - ML Developer"],
      typeSpeed: 80,
      backSpeed: 80,
      loop: true,
    };
    if (typedRef.current) {
      new Typed(typedRef.current, options);
    }
  }, []);

  const scrollToSection = (index) => {
    const sections = document.querySelectorAll('section');
    const targetSection = sections[index];
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  return (
    <section className="section_outer">
      <div className='home-section'>
        <div className='home-img'>
          <motion.img
            ref={imgRef}
            src={require('../../images/IMG.png')}
            alt=''
            variants={imgVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
          <motion.span
            className="circle-spin"
            variants={circleVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          ></motion.span>
        </div>
        <div className='home-content'>
          <motion.h3
            variants={heading1Variant}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            Hey there!, It's Me
          </motion.h3>
          <motion.h1
            variants={heading2Variant}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            Ayush Kumawat
          </motion.h1>
          <motion.h3
            variants={typedVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            And I'm a <span id="types" ref={typedRef}></span>
          </motion.h3>
          <motion.div
            className="card"
            variants={cardVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <p>An AI Researcher and Robotics Enthusiast passionate about building intelligent systems that solve real-world problems. From deploying models on edge devices at ISRO to developing award-winning AI solutions, I blend innovation with impact across domains like computer vision, autonomous systems, and human-centered AI.</p>
          </motion.div>
          <motion.div
            className="social-media"
            variants={socialContainer}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.a
              variants={socialIcon}
              onClick={() => openInNewTab('https://www.linkedin.com/in/ayush-kumawat/')}
            >
              <i className="fa-brands fa-linkedin-in"></i>
            </motion.a>
            <motion.a
              variants={socialIcon}
              onClick={() => openInNewTab('https://www.github.com/Ayushkumawat')}
            >
              <i className="fa-brands fa-github"></i>
            </motion.a>
            <motion.a
              variants={socialIcon}
              onClick={() => openInNewTab("mailto:ayu.kumawat2002@gmail.com")}
            >
              <i className="fa-solid fa-envelope"></i>
            </motion.a>
            <motion.a
              variants={socialIcon}
              onClick={() => openInNewTab('https://twitter.com/_Ayush_Kumawat')}
            >
              <i className="fa-brands fa-twitter"></i>
            </motion.a>
          </motion.div>
          <motion.div
            className="btns"
            variants={btnsVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <button onClick={() => setCurrentSection(3)} className='btn'>Proficiency Dashboard</button>
            <button onClick={() => setCurrentSection(4)} className='btn'>Let's work together !</button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}