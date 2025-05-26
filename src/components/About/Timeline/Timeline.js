import React, { useEffect, useRef, useState, useLayoutEffect, forwardRef } from 'react'
import './Timeline.css'

const Timeline = forwardRef((props, ref) => {
  const [visibleItems, setVisibleItems] = useState({});
  const [maxVisibleIndex, setMaxVisibleIndex] = useState(-1);  // track highest visible block
  const [lineStart, setLineStart] = useState(0);             // pixel offset of first block center
  const [lineHeight, setLineHeight] = useState(0);           // dynamic line height
  const [lineActive, setLineActive] = useState(false);
  const containerRefs = useRef([]);
  const internalTimelineRef = useRef(null);
  const [animatedContainers, setAnimatedContainers] = useState({});
  
  // Use internal ref for component logic, but forward the ref for external use
  const timelineRef = ref || internalTimelineRef;

  // Timeline data - moved to top before hooks use it
  const timelineItems = [
    {
      position: 'left',
      image: 'https://raw.githubusercontent.com/Ayushkumawat/Ayushkumawatportfolio/refs/heads/main/src/images/time/isro.jpeg',
      jobTitle: 'Artificial Intelligence Researcher',
      company: 'Indian Space Research Organization, Ahmedabad',
      period: 'Aug 2024 - Dec 2024',
      description: 'I contributed to the development of real-time fault detection algorithms using machine learning on the Jetson AGX Orin platform. My work focused on enhancing the reliability and autonomy of space systems through intelligent AI-driven solutions.'
    },
    {
      position: 'right',
      image: 'https://raw.githubusercontent.com/Ayushkumawat/Ayushkumawatportfolio/refs/heads/main/src/images/time/google.png',
      jobTitle: 'AI - ML Intern',
      company: 'Google For Developers',
      period: 'Jan 2024 - Mar 2024',
      description: ' I focused on image classification with object detection, building and optimizing models for real-world applications, and deploying them on Google Cloud Platform.'
    },
    {
      position: 'left',
      image: 'https://raw.githubusercontent.com/Ayushkumawat/Ayushkumawatportfolio/refs/heads/main/src/images/time/acm.jpg',
      jobTitle: 'Chairperson',
      company: 'IAC SAGE ACM Student Chapter',
      period: 'Jun 2023 - Present',
      description: 'As the Chairperson of the esteemed Association for Computing Machinery (ACM) Student Chapter, I have had the honor of leading a dynamic community of passionate and talented individuals in the field of computer science and technology.'
    },
    {
      position: 'right',
      image: 'https://raw.githubusercontent.com/Ayushkumawat/Ayushkumawatportfolio/refs/heads/main/src/images/time/person.jpg',
      jobTitle: 'Machine Learning Intern',
      company: 'Personifwy',
      period: 'Aug 2022 - Nov 2022',
      description: 'In my experience as ML intern I have worked on news classification project which has given me a hand-on experience with NLP and data analysis techniques.'
    },
    {
      position: 'left',
      image: 'https://raw.githubusercontent.com/Ayushkumawat/Ayushkumawatportfolio/refs/heads/main/src/images/time/sage.jpg',
      jobTitle: 'B.Tech in AI & Data Science',
      company: 'Sage University, Indore',
      period: '2020 - 2024',
      description: 'B.Tech Specialization in Artificial Intelligence & Data Science (Computer Science Engineering)'
    },
    {
      position: 'right',
      image: 'https://raw.githubusercontent.com/Ayushkumawat/Ayushkumawatportfolio/refs/heads/main/src/images/time/school.jpeg',
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

  // Combined: Staggered reveal for first 2 cards, Intersection Observer for the rest
  useEffect(() => {
    if (!props.isActive) {
      setVisibleItems({});
      setMaxVisibleIndex(-1);
      setLineActive(false);
      setAnimatedContainers({});
      return;
    }
    // Reveal first 2 cards with stagger
    let timeouts = [];
    [0, 1].forEach((idx) => {
      timeouts.push(setTimeout(() => {
        setVisibleItems(prev => ({ ...prev, [idx]: true }));
        setMaxVisibleIndex(prev => Math.max(prev, idx));
        if (idx === 0) {
          setTimeout(() => setLineActive(true), 300);
        }
        setTimeout(() => {
          setAnimatedContainers(prev => ({ ...prev, [idx]: true }));
        }, 1000);
      }, idx * 250));
    });
    return () => timeouts.forEach(clearTimeout);
  }, [props.isActive, timelineItems.length]);

  // Intersection Observer for the rest of the cards
  useEffect(() => {
    if (!props.isActive) return;
    const observer = new window.IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const id = parseInt(entry.target.getAttribute('data-id'));
          if (id < 2) return; // skip first 2, already revealed
          if (entry.isIntersecting) {
            setVisibleItems(prev => ({ ...prev, [id]: true }));
            setMaxVisibleIndex(prev => Math.max(prev, id));
            setTimeout(() => {
              setAnimatedContainers(prev => ({ ...prev, [id]: true }));
            }, 1000);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    containerRefs.current.forEach((el, idx) => {
      if (el && idx >= 2) observer.observe(el);
    });
    return () => {
      containerRefs.current.forEach((el, idx) => {
        if (el && idx >= 2) observer.unobserve(el);
      });
    };
  }, [props.isActive, timelineItems.length]);

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

    // Continuously update line height on scroll for smooth line drawing
    const handleScroll = () => {
      const tlEl = timelineRef.current;
      if (!tlEl) return;
      const tlRect = tlEl.getBoundingClientRect();
      
      // Get all completely animated containers (those that have finished their animation)
      const animatedIndices = Object.keys(animatedContainers)
        .map(index => parseInt(index))
        .sort((a, b) => a - b); // Sort indices numerically
      
      if (animatedIndices.length === 0) {
        return; // No fully animated containers yet
      }
      
      // Get the last animated container
      const lastAnimatedIndex = animatedIndices[animatedIndices.length - 1];
      const lastAnimatedContainer = containerRefs.current[lastAnimatedIndex];
      
      if (!lastAnimatedContainer) return;
      
      const imgElement = lastAnimatedContainer.querySelector('.timeline-image');
      if (!imgElement) return;
      
      // Get the actual position after all animations have completed
      const containerRect = lastAnimatedContainer.getBoundingClientRect();
      const imgRect = imgElement.getBoundingClientRect();
      
      // Calculate the exact center of the image after animations
      const imgCenterY = imgRect.top - tlRect.top + (imgRect.height / 2);
      
      // Calculate target height - from line start to the center of image
      const targetHeight = Math.max(0, imgCenterY - lineStart);
      
      // Apply the line height
      setLineHeight(targetHeight);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    // Initial line height calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [lineActive, lineStart, visibleItems, maxVisibleIndex, animatedContainers]);

  // Add mouse move event listener for the vanilla tilt gradient effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Get all textboxes
      const textBoxes = document.querySelectorAll('.text-box-left, .text-box-right');
      
      textBoxes.forEach(box => {
        const boxRect = box.getBoundingClientRect();
        // Calculate relative position of mouse inside the box (0-100%)
        const x = Math.max(0, Math.min(100, ((e.clientX - boxRect.left) / boxRect.width) * 100));
        const y = Math.max(0, Math.min(100, ((e.clientY - boxRect.top) / boxRect.height) * 100));
        
        // Check if mouse is close to the element
        const isNearBox = 
          e.clientX >= boxRect.left - 100 && 
          e.clientX <= boxRect.right + 100 && 
          e.clientY >= boxRect.top - 100 && 
          e.clientY <= boxRect.bottom + 100;
        
        if (isNearBox) {
          // Apply the gradient based on mouse position
          box.style.setProperty('--mouse-x', `${x}%`);
          box.style.setProperty('--mouse-y', `${y}%`);
          box.classList.add('gradient-active');
        } else {
          box.classList.remove('gradient-active');
        }
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Function to reset visibility on scroll to top
  useEffect(() => {
    const handleScrollReset = () => {
      // Reset animations when scrolling to top of page
      if (window.scrollY < 100) {
        setVisibleItems({});
        setMaxVisibleIndex(-1);
        setLineActive(false);
        setLineHeight(0);
        setAnimatedContainers({});
      }
    };
    
    window.addEventListener('scroll', handleScrollReset);
    
    return () => {
      window.removeEventListener('scroll', handleScrollReset);
    };
  }, []);

  return (
    <div className="outer-timeline" style={{ height: 'auto', minHeight: '100%', touchAction: 'pan-y' }}>
      <div className='timeline' ref={timelineRef} style={{ paddingBottom: '200px' }}>
        <div
          className="timeline-line"
          style={{
            top: `${lineStart}px`,
            height: lineActive ? `${lineHeight}px` : '0px',
            opacity: lineActive ? 1 : 0,
            transition: 'height 0.8s ease-in-out'
          }}
        ></div>
        {timelineItems.map((item, index) => {
          const arrowClass = item.position === 'left' ? 'right-arrow' : 'left-arrow';
          // Only render the block when visibleItems[index] is true
          if (!visibleItems[index]) {
            // Render a placeholder to avoid layout shift
            return (
              <div
                key={index}
                data-id={index}
                ref={el => containerRefs.current[index] = el}
                className={`container ${item.position}-container`}
                style={{ minHeight: '200px', width: '100%', maxWidth: '1600px', marginTop: index === 0 ? '10px' : '45px', opacity: 0 }}
              />
            );
          }
          return (
            <div
              key={index}
              data-id={index}
              ref={el => containerRefs.current[index] = el}
              className={`container ${item.position}-container visible`}
              style={{ 
                marginTop: index === 0 ? '10px' : '45px',
                opacity: 1,
                transform: 'translateY(0) translateX(0)'
              }}
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
});

export default Timeline;