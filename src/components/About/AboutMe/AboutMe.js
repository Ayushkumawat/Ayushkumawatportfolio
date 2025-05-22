import React, { useEffect, useRef } from 'react';
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
  visible: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.8, delay: 0.6, type: "spring", stiffness: 60 } },
  exit: { opacity: 0, y: 60, rotate: 8, transition: { duration: 0.5 } }
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

export default function AboutMe() {
  const aboutRef = useRef(null);
  const isMobile = useIsMobile();
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

  return (
    <div className={isMobile ? "about-content aboutme-mobile" : "about-content"} ref={aboutRef}>
      <div className='cont'>
        <motion.h2
          className="heading"
          variants={headingVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          About <span>Me</span>
        </motion.h2>
        <motion.p
          variants={paraVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
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
        >
          <i className="fa-solid fa-file-export"></i>Resume
        </motion.a>
      </div>
      {!isMobile && (
        <motion.div
          className="card"
          variants={cardVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <img src={require('../../../images/favicon.jpg')}  alt=''></img>
          <h1>Ayush Kumawat</h1>
          <h2>Data Analyst</h2>
          <h3>B.Tech (Hons.) Computer Science Engineer</h3>
          <h4>Specilization in Artifical Intelligence and Data Science</h4>
          <p>+91 - 9098984098 | ayushkumawat2112@gmail.com</p>
        </motion.div>
      )}
    </div>
  );
}