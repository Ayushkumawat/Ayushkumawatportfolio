import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'
import './Timeline.css'

export default function Timeline() {
  const [visibleItems, setVisibleItems] = useState({});
  const [maxVisibleIndex, setMaxVisibleIndex] = useState(-1);  // track highest visible block
  const [lineStart, setLineStart] = useState(0);             // pixel offset of first block center
  const [lineHeight, setLineHeight] = useState(0);           // dynamic line height
  const [lineActive, setLineActive] = useState(false);
  const containerRefs = useRef([]);
  const timelineRef = useRef(null);

  // Timeline data - moved to top before hooks use it
  const timelineItems = [
    {
      position: 'left',
      image: require('../../../images/time/isro.jpg'),
      jobTitle: 'Artificial Intelligence Researcher',
      company: 'ISRO - Space Application Center, Ahmedabad',
      period: 'Aug 2024 - Dec 2024',
      description: 'I contributed to the development of real-time fault detection algorithms using machine learning on the Jetson AGX Orin platform. My work focused on enhancing the reliability and autonomy of space systems through intelligent AI-driven solutions.'
    },
    {
      position: 'right',
      image: require('../../../images/time/google.png'),
      jobTitle: 'AI - ML Intern',
      company: 'Google For Developers',
      period: 'Jan 2024 - Mar 2024',
      description: ' I focused on image classification with object detection, building and optimizing models for real-world applications, and deploying them on Google Cloud Platform.'
    },
    {
      position: 'left',
      image: require('../../../images/time/acm.jpg'),
      jobTitle: 'Chairperson',
      company: 'IAC SAGE ACM Student Chapter',
      period: 'Jun 2023 - Present',
      description: 'As the Chairperson of the esteemed Association for Computing Machinery (ACM) Student Chapter, I have had the honor of leading a dynamic community of passionate and talented individuals in the field of computer science and technology.'
    },
    {
      position: 'right',
      image: require('../../../images/time/person.jpg'),
      jobTitle: 'Machine Learning Intern',
      company: 'Personifwy',
      period: 'Aug 2022 - Nov 2022',
      description: 'In my experience as ML intern I have worked on news classification project which has given me a hand-on experience with NLP and data analysis techniques.'
    },
    {
      position: 'left',
      image: require('../../../images/time/sage.jpg'),
      jobTitle: 'B.Tech in AI & Data Science',
      company: 'Sage University, Indore',
      period: '2020 - 2024',
      description: 'B.Tech Specialization in Artificial Intelligence & Data Science (Computer Science Engineering)'
    },
    {
      position: 'right',
      image: require('../../../images/time/school.png'),
      jobTitle: 'Higher Secondary Education',
      company: 'Guru Ramdas Public School',
      period: '2019 - 2020',
      description: 'Science Stream : Physics, Chemistry, Biology & Mathematics'
    }
  ];

  // Initialize refs array
  if (containerRefs.current.length !== timelineItems.length) {
    containerRefs.current = Array(timelineItems.length).fill(null);
  }

  // Observe each block for visibility and update maxVisibleIndex
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const id = parseInt(entry.target.getAttribute('data-id'));
          if (entry.isIntersecting) {
            setVisibleItems(prev => ({ ...prev, [id]: true }));
            setMaxVisibleIndex(prev => Math.max(prev, id));
            // if first block, activate line after fade-in delay
            if (id === 0) {
              setTimeout(() => setLineActive(true), 800);
            }
          }
        });
      },
      { threshold: 0.1 }
    );
    containerRefs.current.forEach(el => el && observer.observe(el));
    return () => containerRefs.current.forEach(el => el && observer.unobserve(el));
  }, []);

  // Update the useLayoutEffect to measure position after animation completes
  useLayoutEffect(() => {
    if (!visibleItems[0] || !containerRefs.current[0]) return;
    
    // Wait for the animation to complete before measuring
    const measureAfterAnimation = () => {
      if (!timelineRef.current) return;
      
      const tlRect = timelineRef.current.getBoundingClientRect();
      const imgElement = containerRefs.current[0].querySelector('.timeline-image');
      
      if (imgElement) {
        const imgRect = imgElement.getBoundingClientRect();
        // Use the center of the logo image as the starting point
        const start = imgRect.top - tlRect.top + imgRect.height / 2;
        setLineStart(start);
      }
    };

    // Add a delay matching the animation duration (800ms for fade in)
    const animationDelay = 850; // slightly longer than animation to ensure it's complete
    const timer = setTimeout(measureAfterAnimation, animationDelay);
    
    return () => clearTimeout(timer);
  }, [visibleItems[0]]);

  // Update lineHeight whenever maxVisibleIndex changes or when scrolling
  useEffect(() => {
    if (!lineActive || maxVisibleIndex < 0) {
      setLineHeight(0);
      return;
    }

    // Store the animation delay
    const animationDelay = 160; // ms - matches the animation duration
    let lastMeasuredIndex = -1;
    let animationTimeout = null;

    // Continuously update line height on scroll for last item accuracy
    const handleScroll = () => {
      const tlEl = timelineRef.current;
      if (!tlEl) return;
      const tlRect = tlEl.getBoundingClientRect();

      // Find the position of the current highest visible logo
      const visibleEl = containerRefs.current[maxVisibleIndex];
      if (!visibleEl) return;

      const visibleImgElement = visibleEl.querySelector('.timeline-image');
      if (!visibleImgElement) return;

      // Only measure newly visible elements after animation completes
      if (maxVisibleIndex > lastMeasuredIndex) {
        lastMeasuredIndex = maxVisibleIndex;
        
        // Clear any pending animation timeouts
        if (animationTimeout) {
          clearTimeout(animationTimeout);
        }
        
        // Delay measurement until after animation completes
        animationTimeout = setTimeout(() => {
          handleScroll(); // Re-measure after animation
          animationTimeout = null;
        }, animationDelay);
        
        return; // Skip this measurement cycle, wait for timeout
      }

      const visibleImgRect = visibleImgElement.getBoundingClientRect();
      const visibleCenter = visibleImgRect.top - tlRect.top + visibleImgRect.height / 2;

      // Always check the last logo position to stop the line there
      const lastEl = containerRefs.current[timelineItems.length - 1];
      if (!lastEl) return;
      
      const lastImgElement = lastEl.querySelector('.timeline-image');
      if (!lastImgElement) return;
      
      const lastImgRect = lastImgElement.getBoundingClientRect();
      const lastCenter = lastImgRect.top - tlRect.top + lastImgRect.height / 2;
      
      // If the last block is coming into view (approaching half of viewport)
      const viewportHeight = window.innerHeight;
      const lastElRect = lastEl.getBoundingClientRect();
      const lastElDistanceFromCenter = Math.abs((viewportHeight / 2) - (lastElRect.top + lastElRect.height / 2));
      
      // If the last element is nearing the center, prioritize ending at the last logo
      if (lastElDistanceFromCenter < viewportHeight * 0.5 || maxVisibleIndex === timelineItems.length - 1) {
        // Set line height to reach exactly to the last logo
        setLineHeight(Math.max(lastCenter - lineStart, 0));
      } else {
        // Otherwise, follow the highest visible element
        setLineHeight(Math.max(visibleCenter - lineStart, 0));
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initial setup - wait for animation to complete before first measurement
    const initialTimer = setTimeout(handleScroll, animationDelay);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(initialTimer);
      if (animationTimeout) {
        clearTimeout(animationTimeout);
      }
    };
  }, [maxVisibleIndex, lineActive, lineStart, timelineItems.length]);

  // Reset when scrolling out of timeline section
  useEffect(() => {
    const resetObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setMaxVisibleIndex(-1);
          setVisibleItems({});
          setLineActive(false);
          setLineHeight(0);
        }
      },
      { threshold: 0 }
    );
    if (timelineRef.current) resetObserver.observe(timelineRef.current);
    return () => resetObserver.disconnect();
  }, []);

  return (
    <div className="outer-timeline">
      <h1>Time<span>line</span></h1>
      <div className='timeline' ref={timelineRef}>
        <div
          className="timeline-line"
          style={{
            top: `${lineStart}px`,
            height: lineActive ? `${lineHeight}px` : '0px',
            opacity: lineActive ? 1 : 0
          }}
        ></div>
        {timelineItems.map((item, index) => {
          const arrowClass = item.position === 'left' ? 'right-arrow' : 'left-arrow';
          return (
            <div
              key={index}
              data-id={index}
              ref={el => containerRefs.current[index] = el}
              className={`container ${item.position}-container ${visibleItems[index] ? 'visible' : ''}`}
            >
              <img src={item.image} alt="" className="timeline-image" />
              <div className={`text-box-${item.position}`}>
                <div className="position">{item.jobTitle}</div>
                <div className="company">{item.company}</div>
                <small>{item.period}</small>
                <p>{item.description}</p>
                <span className={arrowClass}></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}