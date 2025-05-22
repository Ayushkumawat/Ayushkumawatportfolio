import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Achievements.css';

// Responsive hook for Achievements
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 998);
  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 998);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
}

const Achievements = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const autoAdvanceTimerRef = useRef(null);
  const isMobile = useIsMobile();
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const animateSlide = (direction) => {
    if (isAnimating) return;
    setIsAnimating(true);
    const xOffset = direction === 'next' ? -100 : 100;
    const timeline = gsap.timeline({
      onComplete: () => {
        gsap.set(cardRef.current, { x: 0, opacity: 1 });
        setIsAnimating(false);
      }
    });
    timeline
      .to(cardRef.current, {
        x: xOffset,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          setActiveIndex(prev => {
            if (direction === 'next') {
              return prev === achievementsData.length - 1 ? 0 : prev + 1;
            } else {
              return prev === 0 ? achievementsData.length - 1 : prev - 1;
            }
          });
        }
      })
      .fromTo(cardRef.current,
        { x: -xOffset, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power2.inOut' }
      )
      .fromTo(contentRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' },
        '-=0.2'
      );
  };

  const resetAutoAdvanceTimer = () => {
    if (autoAdvanceTimerRef.current) {
      clearInterval(autoAdvanceTimerRef.current);
    }
    autoAdvanceTimerRef.current = setInterval(handleNext, 6000);
  };

  const handleNext = () => {
    animateSlide('next');
    resetAutoAdvanceTimer();
  };

  const handlePrev = () => {
    animateSlide('prev');
    resetAutoAdvanceTimer();
  };

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
    );
    autoAdvanceTimerRef.current = setInterval(handleNext, 6000);
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearInterval(autoAdvanceTimerRef.current);
      }
    };
  }, []);

  // Touch swipe handlers for mobile
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const deltaX = touchEndX.current - touchStartX.current;
      if (Math.abs(deltaX) > 50) {
        if (deltaX < 0) handleNext();
        else handlePrev();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleIndicatorClick = (index) => {
    if (isAnimating || index === activeIndex) return;
    const direction = index > activeIndex ? 'next' : 'prev';
    setActiveIndex(index);
    animateSlide(direction);
    resetAutoAdvanceTimer();
  };

  return (
    <div className="achievements-container">
      <div className="achievements-content">
        {isMobile && (
          <h2 className="achievements-title">
            Achieve<span>ments</span>
          </h2>
        )}
        <div
          className="achievements-slider"
          onTouchStart={isMobile ? onTouchStart : undefined}
          onTouchMove={isMobile ? onTouchMove : undefined}
          onTouchEnd={isMobile ? onTouchEnd : undefined}
        >
          {!isMobile && (
            <button 
              className="nav-button prev" 
              onClick={handlePrev}
              disabled={isAnimating}
              aria-label="Previous achievement"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
          )}
          <div className="achievement-card" ref={cardRef}>
            <div className="achievement-image">
              <img 
                src={achievementsData[activeIndex].image} 
                alt={achievementsData[activeIndex].title}
              />
              <div className="achievement-overlay"></div>
            </div>
            <div className="achievement-content" ref={contentRef}>
              <div className="achievement-organization">
                {achievementsData[activeIndex].date}
              </div>
              <h2 className="achievement-title">
                {achievementsData[activeIndex].title}
              </h2>
              <p className="achievement-description">
                {achievementsData[activeIndex].text}
              </p>
            </div>
          </div>
          {!isMobile && (
            <button 
              className="nav-button next" 
              onClick={handleNext}
              disabled={isAnimating}
              aria-label="Next achievement"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          )}
        </div>
        {!isMobile && (
          <div className="achievement-indicators">
            {achievementsData.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === activeIndex ? 'active' : ''}`}
                onClick={() => handleIndicatorClick(index)}
                aria-label={`View achievement ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const achievementsData = [
  {
    image: require('../../../images/achive/Jetson.jpg'),
    date: 'NVIDIA',
    title: 'AI Specialist',
    text: 'I am proud to hold the Jetson AI Specialist certificate from NVIDIA, which recognizes my expertise in developing AI applications for edge devices using the powerful NVIDIA Jetson platform. This showcases my potential in areas such as computer vision, machine learning, deep learning frameworks, and deploying AI models on edge devices. With this credential, I am equipped to create intelligent solutions for industries such as robotics, computer vision, and autonomous systems.',
  },
  {
    image: require('../../../images/achive/sage.jpg'),
    date: 'Sage University Indore',
    title: 'Academic Excellence Award',
    text: 'Received the Academic Excellence Award from Sage University in Recognition of Outstanding Performance in all Academic Categories during my B.Tech. Degree.',
  },
  {
    image: require('../../../images/achive/hack.jpg'),
    date: 'Google | AMD | GeeksforGeeks',
    title: 'Hackathon Winner',
    text: 'I am delighted to spotlight my accomplishment in the Institute-Level Hackathon, a collaborative initiative by industry giants Google Cloud, AMD, and esteemed programming community GeeksforGeeks (GFG). Through rigorous competition and unwavering determination, my team and I succeeded in crafting a compelling solution that exemplified our prowess in cloud computing, advanced hardware, and innovative problem-solving.',
  },
  {
    image: require('../../../images/achive/patent1.jpg'),
    date: 'Intellectual Property India',
    title: 'Patent - Voice Automated Virtual Ordering System',
    text: "Another significant achievement in my technological journey – the publication of my patent on a revolutionary Voice-Automated Table Service System. This innovative system redefines the dining experience by introducing a hands-free approach to menu selection and ordering. Designed to seamlessly integrate cutting-edge voice recognition technology, this system empowers diners to engage with menus and place orders effortlessly, without the need for traditional menus or direct human interaction.",
  },
  {
    image: require('../../../images/achive/patent2.jpg'),
    date: 'Intellectual Property India',
    title: 'Patent - A System for Identifying Threats in Surveillance Systems',
    text: "Another significant achievement in my technological journey – the publication of my patent on a revolutionary Voice-Automated Table Service System. This innovative system redefines the dining experience by introducing a hands-free approach to menu selection and ordering. Designed to seamlessly integrate cutting-edge voice recognition technology, this system empowers diners to engage with menus and place orders effortlessly, without the need for traditional menus or direct human interaction.",
  },
  {
    image: require('../../../images/achive/chess.jpg'),
    date: 'District Chess Association',
    title: 'Chess Player',
    text: "I am proud to have secured a prominent position at the district-level chess competition, showcasing my strategic prowess and dedication to the game. Emerging successfully in this challenging competition stands as a testament to my strategic thinking and determination, motivating me to pursue excellence in chess and beyond.",
  },
  {
    image: require('../../../images/achive/rollball.jpg'),
    date: 'State-Level Competition',
    title: 'Roll Ball Player',
    text: 'Having the privilege to compete in the state-level Rollball tournament was a defining moment in my athletic journey. Representing my region at this level was a testament to my dedication to the sport and my commitment to honing my skills.',
  },
  {
    image: require('../../../images/achive/softball.jpg'),
    date: 'State-Level Competition',
    title: 'Soft Ball Player',
    text: 'Participating in the state-level Softball competition was an exhilarating experience that showcased my athletic prowess and team spirit. As a dedicated player, I showcased my skills in throwing, catching, and teamwork on a larger stage, representing my region with pride.',
  }
];

export default Achievements;