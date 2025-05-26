import React, { useEffect, useState, useRef } from 'react';
import './Innovations.css';
import { gsap } from 'gsap';
import InnovationsMobile from './Innovations-mobile';

export default function Innovations() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 999);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEven, setIsEven] = useState(true);
  const innovationsRef = useRef(null);
  const demoRef = useRef(null);
  const slideNumbersRef = useRef(null);
  const detailsEvenRef = useRef(null);
  const detailsOddRef = useRef(null);
  const paginationRef = useRef(null);
  const indicatorRef = useRef(null);
  const cardsRef = useRef([]);
  const cardContentsRef = useRef([]);
  const slideItemsRef = useRef([]);
  const [initialized, setInitialized] = useState(false);

  // Project data
  const projects = [
    {
      category: 'Artificial Intelligence',
      title: 'AI MED',
      title2: 'DIAGNOSIS',
      description: 'AI MedDiagnostics is a web-based application that allows users to track their symptoms and predict the likelihood of having a disease based on their symptoms.',
      imageUrl: require('../../images/proj/proj_1.png'),
      githubLink: 'https://github.com/Ayushkumawat/AI-MedDiagnostics',
    },
    {
      category: 'IoT & Transportation',
      title: 'BUS PASSENGER',
      title2: 'MANAGEMENT',
      description: 'Bus-Passenger-Management will help in digitalizing local transportation system by providing QR code to consumers, it will help in managing user data by creating excel sheets.',
      imageUrl: require('../../images/proj/proj_2.png'),
      githubLink: 'https://github.com/Ayushkumawat/Bus-Passenger-Management-using-Smart-Card-Technology',
    },
    {
      category: 'Computer Vision',
      title: 'FACIAL',
      title2: 'RECOGNITION',
      description: 'This project helps in real time facial recognition and gender detection. It uses only single clear image of person to detect and make predictions.',
      imageUrl: require('../../images/proj/proj_3.png'),
      githubLink: 'https://github.com/Ayushkumawat/Facial-Recognition-with-Gender-Detection',
    },
    {
      category: 'Machine Learning',
      title: 'AERIAL DRONE',
      title2: 'DETECTION',
      description: 'This project demonstrates real-time drone detection using YOLOv5 and OpenCV. It detects drones in real-time and displays a warning when a drone is detected inside or near a defined rectangle.',
      imageUrl: require('../../images/proj/proj_4.png'),
      githubLink: 'https://github.com/Ayushkumawat/Advanced-Aerial-Drone-Detection-System',
    },
    {
      category: 'Computer Vision',
      title: 'Number Plate',
      title2: 'Detection',
      description: 'This project uses custom trained YOLO models to detect and recognize number plates in real-time. It provides a bounding box when a number plate is detected and stores the data in a excel sheet.',
      imageUrl: require('../../images/proj/proj_5.png'),
      githubLink: 'https://github.com/Ayushkumawat/Number-Plate-Detection-Advanced-using-Python',
    },
    {
      category: 'Automation Systems',
      title: 'RESTAURANT',
      title2: 'ORDERING',
      description: 'In this project we developed a system to automate the ordering & billing process in resturants. I also got a patent on this.',
      imageUrl: require('../../images/proj/proj_6.png'),
      githubLink: 'https://www.github.com/Ayushkumawat',
    }
  ];

  // Values for animations
  let offsetTop = 200;
  let offsetLeft = 700;
  let cardWidth = window.innerWidth <= 998 ? 90 : 150;
  let cardHeight = window.innerWidth <= 998 ? 130 : 220;
  let gap = 25;
  let numberSize = 50;
  const ease = "sine.inOut";
  let order = [0, 1, 2, 3, 4, 5];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 999);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Observe section visibility to lazy-init carousel
  useEffect(() => {
    const section = innovationsRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) setInitialized(true);
      else setInitialized(false);
    }, { threshold: 0.1 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Setup or cleanup carousel when scrolling into/out of view
  useEffect(() => {
    const section = innovationsRef.current;
    if (!section) return;
    if (!initialized) {
      // cleanup carousel
      if (window.autoAnimationTimeout) clearTimeout(window.autoAnimationTimeout);
      gsap.killTweensOf('*');
      section.innerHTML = '';
      return;
    }
    // ORIGINAL SETUP CODE STARTS HERE
    // Create required DOM structure
    section.innerHTML = '';
    
    // Create indicator
    const indicator = document.createElement('div');
    indicator.className = 'indicator';
    indicatorRef.current = indicator;
    section.appendChild(indicator);
    
    // Create cover
    const cover = document.createElement('div');
    cover.className = 'cover';
    section.appendChild(cover);
    
    // Create cards container
    const cardsContainer = document.createElement('div');
    cardsContainer.id = 'demo';
    demoRef.current = cardsContainer;
    section.appendChild(cardsContainer);
    
    // Create details panels
    const detailsEven = document.createElement('div');
    detailsEven.className = 'details';
    detailsEven.id = 'details-even';
    detailsEven.innerHTML = `
      <div class="place-box"><div class="text">${projects[0].category}</div></div>
      <div class="title-box-1"><div class="title-1">${projects[0].title}</div></div>
      <div class="title-box-2"><div class="title-2">${projects[0].title2}</div></div>
      <div class="desc">${projects[0].description}</div>
      <div class="cta">
        <button class="bookmark"><i class="fa-brands fa-github"></i></button>
        <button class="discover">View Project</button>
    </div>
    `;
    detailsEvenRef.current = detailsEven;
    section.appendChild(detailsEven);
    
    const detailsOdd = document.createElement('div');
    detailsOdd.className = 'details';
    detailsOdd.id = 'details-odd';
    detailsOdd.innerHTML = detailsEven.innerHTML;
    detailsOddRef.current = detailsOdd;
    section.appendChild(detailsOdd);
    
    // Create pagination
    const pagination = document.createElement('div');
    pagination.className = 'pagination';
    pagination.id = 'pagination';
    pagination.innerHTML = `
      <div class="pagination-arrows">
        <div class="arrow prev"><i class="fas fa-chevron-left"></i></div>
        <div class="arrow next"><i class="fas fa-chevron-right"></i></div>
      </div>
      <div class="progress-sub-container">
        <div class="progress-sub-background">
          <div class="progress-sub-foreground"></div>
        </div>
      </div>
      <div class="slide-numbers" id="slide-numbers"></div>
    `;
    paginationRef.current = pagination;
    section.appendChild(pagination);
    
    // Create slide numbers
    const slideNumbers = pagination.querySelector('#slide-numbers');
    slideNumbersRef.current = slideNumbers;
    
    // Add button event listeners
    const nextBtn = pagination.querySelector('.next');
    const prevBtn = pagination.querySelector('.prev');
    
    const nextClickHandler = () => {
      // Stop auto animation
      if (window.autoAnimationTimeout) {
        clearTimeout(window.autoAnimationTimeout);
      }
      
      // Kill active animations
      gsap.killTweensOf(indicatorRef.current);
      
      // Update order
      order.push(order.shift());
      setActiveIndex(order[0]);
      setIsEven(!isEven);
      
      // Run single step
      executeStep().then(() => {
        // Reset the timer after manual slide change
        if (window.autoAnimationTimeout) {
          clearTimeout(window.autoAnimationTimeout);
        }
        window.autoAnimationTimeout = setTimeout(() => {
          startLoop();
        }, 5000); // Reset to full 5-second delay
      });
    };
    
    const prevClickHandler = () => {
      // Stop auto animation
      if (window.autoAnimationTimeout) {
        clearTimeout(window.autoAnimationTimeout);
      }
      
      // Kill active animations
      gsap.killTweensOf(indicatorRef.current);
      
      // Update order
      order.unshift(order.pop());
      setActiveIndex(order[0]);
      setIsEven(!isEven);
      
      // Run single step
      executeStep().then(() => {
        // Reset the timer after manual slide change
        if (window.autoAnimationTimeout) {
          clearTimeout(window.autoAnimationTimeout);
        }
        window.autoAnimationTimeout = setTimeout(() => {
          startLoop();
        }, 5000); // Reset to full 5-second delay
      });
    };
    
    // Use direct event assignment instead of addEventListener
    nextBtn.onclick = nextClickHandler;
    prevBtn.onclick = prevClickHandler;
    
    // Setup github links
    const setupGithubLinks = () => {
      const discoverBtnEven = detailsEven.querySelector('.discover');
      const discoverBtnOdd = detailsOdd.querySelector('.discover');
      
      if (discoverBtnEven) {
        discoverBtnEven.onclick = () => openInNewTab(projects[activeIndex].githubLink);
      }
      
      if (discoverBtnOdd) {
        discoverBtnOdd.onclick = () => openInNewTab(projects[activeIndex].githubLink);
      }
    };
    
    setupGithubLinks();
    
    // Create card elements
    const cardsHTML = projects.map((project, index) => 
      `<div class="innovation-card" id="card${index}" style="background-image:url(${project.imageUrl})" ></div>`
    ).join('');

    // Create card content elements
    const cardContentsHTML = projects.map((project, index) => 
      `<div class="card-content" id="card-content-${index}">
        <div class="content-start"></div>
        <div class="content-place">${project.category}</div>
        <div class="content-title-1">${project.title}</div>
        <div class="content-title-2">${project.title2}</div>
      </div>`
    ).join('');

    // Create slide numbers
    const slideNumbersHTML = projects.map((_, index) => 
      `<div class="slide-item" id="slide-item-${index}">${index+1}</div>`
    ).join('');

    // Append elements to the DOM
    cardsContainer.innerHTML = cardsHTML + cardContentsHTML;
    slideNumbersRef.current.innerHTML = slideNumbersHTML;

    // Store refs for elements
    projects.forEach((_, index) => {
      cardsRef.current[index] = document.getElementById(`card${index}`);
      cardContentsRef.current[index] = document.getElementById(`card-content-${index}`);
      slideItemsRef.current[index] = document.getElementById(`slide-item-${index}`);
    });

    // Pre-load images to avoid blank cards
    Promise.all(
      projects.map(project => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.src = project.imageUrl;
        });
      })
    ).then(() => {
      // Initialize after images are loaded
      initializeCarousel();
    });
    
    // ORIGINAL SETUP CODE ENDS HERE
    return () => {
      // cleanup when unmounting or re-initializing
      if (window.autoAnimationTimeout) clearTimeout(window.autoAnimationTimeout);
      gsap.killTweensOf('*');
      section.innerHTML = '';
      nextBtn.onclick = null;
      prevBtn.onclick = null;
    };
  }, [initialized]);

  // Initialize the carousel layout
  const initializeCarousel = () => {
    const [active, ...rest] = order;
    const detailsActive = isEven ? detailsEvenRef.current : detailsOddRef.current;
    const detailsInactive = isEven ? detailsOddRef.current : detailsEvenRef.current;
    const { innerHeight: height, innerWidth: width } = window;
    
    // Calculate offset values based on window size
    offsetTop = height - 370;
    offsetLeft = width - 680;

    // Set initial positions
    gsap.set(paginationRef.current, {
      top: offsetTop + 250,
      left: offsetLeft,
      y: 0,
      opacity: 1,
      zIndex: 60,
    });

    // Set main card full screen under the navbar
    const navEl = document.querySelector('.section-navbar');
    const navH = navEl ? navEl.offsetHeight : 0;
    gsap.set(`#card${active}`, {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    });
    
    // Hide content for main card
    gsap.set(`#card-content-${active}`, { x: 0, y: 0, opacity: 0 });
    
    // Set details position and hide content initially
    gsap.set(detailsActive, { opacity: 0, zIndex: 22, x: -200 });
    gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });
    
    // Hide all text elements initially for both active and inactive panels
    // Helper function to safely set GSAP properties
    const safeSet = (element, selector, props) => {
      const target = element.querySelector(selector);
      if (target) {
        gsap.set(target, props);
      }
    };

    // Set initial states for active panel
    if (detailsActive) {
      safeSet(detailsActive, '.place-box .text', { y: 100, opacity: 0 });
      safeSet(detailsActive, '.title-1', { y: 100, opacity: 0 });
      safeSet(detailsActive, '.title-2', { y: 100, opacity: 0 });
      safeSet(detailsActive, '.desc', { y: 50, opacity: 0 });
      safeSet(detailsActive, '.cta', { y: 60, opacity: 0 });
    }

    // Set initial states for inactive panel
    if (detailsInactive) {
      safeSet(detailsInactive, '.place-box .text', { y: 100, opacity: 0 });
      safeSet(detailsInactive, '.title-1', { y: 100, opacity: 0 });
      safeSet(detailsInactive, '.title-2', { y: 100, opacity: 0 });
      safeSet(detailsInactive, '.desc', { y: 50, opacity: 0 });
      safeSet(detailsInactive, '.cta', { y: 60, opacity: 0 });
    }

    // Set progress bar
    let progressBarWidth = 500;
    if (window.innerWidth <= 480) progressBarWidth = 100;
    else if (window.innerWidth <= 999) progressBarWidth = 150;
    else if (window.innerWidth <= 992) progressBarWidth = 200;
    else if (window.innerWidth <= 1400) progressBarWidth = 300;
    gsap.set(".progress-sub-foreground", {
      width: progressBarWidth * (1 / order.length) * (active + 1),
    });

    // Position smaller cards
    rest.forEach((i, index) => {
      gsap.set(`#card${i}`, {
        x: offsetLeft + 400 + index * (cardWidth + gap),
        y: offsetTop,
        width: cardWidth,
        height: cardHeight,
        zIndex: 30,
        borderRadius: 10,
        opacity: 0.9, // Slightly transparent
      });
      
      gsap.set(`#card-content-${i}`, {
        x: offsetLeft + 400 + index * (cardWidth + gap),
        zIndex: 40,
        y: offsetTop,
        width: cardWidth,
        height: cardHeight,
        opacity: 1
      });
      
      gsap.set(`#slide-item-${i}`, { x: (index + 1) * numberSize });
    });

    gsap.set(indicatorRef.current, { x: -window.innerWidth });

    // Start animation
    const startDelay = 0.6;

    gsap.to(".cover", {
      x: width + 400,
      delay: 0.5,
      ease,
      onComplete: () => {
        setTimeout(() => {
          // Add a longer delay before starting the auto-slide
          setTimeout(() => {
            startLoop();
          }, 5000); // 5-second delay before starting auto-sliding
        }, 500);
      },
    });
    
    // Animate the rest of the cards into position
    rest.forEach((i, index) => {
      gsap.to(`#card${i}`, {
        x: offsetLeft + index * (cardWidth + gap),
        zIndex: 30,
        delay: 0.05 * index + startDelay,
        ease,
        opacity: 0.9, // Slightly transparent
      });
      
      gsap.to(`#card-content-${i}`, {
        x: offsetLeft + index * (cardWidth + gap),
        zIndex: 40,
        delay: 0.05 * index + startDelay,
        ease,
      });
    });
    
    // Fade in the UI elements
    // gsap.to(paginationRef.current, { y: 0, opacity: 1, ease, delay: startDelay });
    gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: startDelay });

    // Initially populate details content
    updateDetailsContent(detailsActive, active);

    // Animate in the text elements of the initial slide
    // Helper function to safely animate elements
    const safeAnimate = (element, selector, props) => {
      const target = element.querySelector(selector);
      if (target) {
        gsap.to(target, props);
      }
    };

    if (detailsActive) {
      safeAnimate(detailsActive, '.place-box .text', {
        y: 0,
        opacity: 1,
        delay: startDelay + 0.1,
        duration: 0.5,
        ease,
      });

      safeAnimate(detailsActive, '.title-1', {
        y: 0,
        opacity: 1,
        delay: startDelay + 0.15,
        duration: 0.5,
        ease,
      });

      safeAnimate(detailsActive, '.title-2', {
        y: 0,
        opacity: 1,
        delay: startDelay + 0.2,
        duration: 0.5,
        ease,
      });

      safeAnimate(detailsActive, '.desc', {
        y: 0,
        opacity: 1,
        delay: startDelay + 0.25,
        duration: 0.4,
        ease,
      });

      safeAnimate(detailsActive, '.cta', {
        y: 0,
        opacity: 1,
        delay: startDelay + 0.3,
        duration: 0.4,
        ease,
      });
    }
  };

  // Update the details panel with current project information
  const updateDetailsContent = (detailsElement, projectIndex) => {
    const project = projects[projectIndex];
    if (!detailsElement || !project) return;
    
    const textEl = detailsElement.querySelector('.place-box .text');
    const title1El = detailsElement.querySelector('.title-1');
    const title2El = detailsElement.querySelector('.title-2');
    const descEl = detailsElement.querySelector('.desc');
    
    // Force content update to ensure fresh content
    if (textEl) {
      textEl.innerHTML = '';
      textEl.textContent = project.category;
    }
    if (title1El) {
      title1El.innerHTML = '';
      title1El.textContent = project.title;
    }
    if (title2El) {
      title2El.innerHTML = '';
      title2El.textContent = project.title2;
    }
    if (descEl) {
      descEl.innerHTML = '';
      descEl.textContent = project.description;
    }
  };

  // Transition to the next slide
  const executeStep = () => {
    return new Promise((resolve) => {
      const [active, ...rest] = order;
      const prv = order[order.length - 1];
      const isCurrentEven = isEven;
      const detailsActive = isCurrentEven ? detailsEvenRef.current : detailsOddRef.current;
      const detailsInactive = isCurrentEven ? detailsOddRef.current : detailsEvenRef.current;
      
      // Update active content but hide it initially
      updateDetailsContent(detailsActive, active);
      
      // Hide all text elements for active details panel
      gsap.set(`#${detailsActive.id} .place-box .text`, { y: 100, opacity: 0 });
      gsap.set(`#${detailsActive.id} .title-1`, { y: 100, opacity: 0 });
      gsap.set(`#${detailsActive.id} .title-2`, { y: 100, opacity: 0 });
      gsap.set(`#${detailsActive.id} .desc`, { y: 50, opacity: 0 });
      gsap.set(`#${detailsActive.id} .cta`, { y: 60, opacity: 0 });
      
      // Hide the inactive details (previous slide content) immediately
      gsap.set(detailsInactive, { zIndex: 12, opacity: 0 });
      gsap.set(`#${detailsInactive.id} .desc`, { opacity: 0 });
      gsap.set(`#${detailsInactive.id} .place-box .text`, { opacity: 0 });
      gsap.set(`#${detailsInactive.id} .title-1`, { opacity: 0 });
      gsap.set(`#${detailsInactive.id} .title-2`, { opacity: 0 });
      gsap.set(`#${detailsInactive.id} .cta`, { opacity: 0 });

      // Fade out active card content
      gsap.to(`#card-content-${active}`, {
        opacity: 0,
        duration: 0.3,
        ease,
      });
      
      // Move slide number indicators
      gsap.to(`#slide-item-${active}`, { x: 0, ease });
      gsap.to(`#slide-item-${prv}`, { x: -numberSize, ease });
      
      // Update progress bar
      let progressBarWidth = 500;
      if (window.innerWidth <= 480) progressBarWidth = 100;
      else if (window.innerWidth <= 999) progressBarWidth = 150;
      else if (window.innerWidth <= 992) progressBarWidth = 200;
      else if (window.innerWidth <= 1400) progressBarWidth = 300;
      gsap.to(".progress-sub-foreground", {
        width: progressBarWidth * (1 / order.length) * (active + 1),
        ease,
      });

      // Expand active card to full screen under the navbar
      const navEl = document.querySelector('.section-navbar');
      const navH = navEl ? navEl.offsetHeight : 0;
      gsap.to(`#card${active}`, {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        borderRadius: 0,
        zIndex: 20,
        ease,
        duration: 0.8,
        onComplete: () => {
          // Animate the details in
          gsap.to(detailsActive, { 
            opacity: 1, 
            x: 0,
            duration: 0.5, 
            ease 
          });
          
          gsap.to(`#${detailsActive.id} .place-box .text`, {
            y: 0,
            opacity: 1,
            delay: 0.1,
            duration: 0.5,
            ease,
          });
          
          gsap.to(`#${detailsActive.id} .title-1`, {
            y: 0,
            opacity: 1,
            delay: 0.15,
            duration: 0.5,
            ease,
          });
          
          gsap.to(`#${detailsActive.id} .title-2`, {
            y: 0,
            opacity: 1,
            delay: 0.2,
            duration: 0.5,
            ease,
          });
          
          gsap.to(`#${detailsActive.id} .desc`, {
            y: 0,
            opacity: 1,
            delay: 0.25,
            duration: 0.4,
            ease,
          });
          
          gsap.to(`#${detailsActive.id} .cta`, {
            y: 0,
            opacity: 1,
            delay: 0.3,
            duration: 0.4,
            onComplete: resolve,
            ease,
          });
        }
      });

      // Snap previous card back instantly to thumbnail position for smooth transition
      const xPrev = offsetLeft + (rest.length - 1) * (cardWidth + gap);
      gsap.set(`#card${prv}`, {
        x: xPrev,
        y: offsetTop,
        width: cardWidth,
        height: cardHeight,
        borderRadius: 10,
        scale: 1,
        zIndex: 30,
        opacity: 0.9
      });
      gsap.set(`#card-content-${prv}`, {
        x: xPrev,
        y: offsetTop,
        width: cardWidth,
        height: cardHeight,
        opacity: 1,
        zIndex: 40
      });
      gsap.set(`#slide-item-${prv}`, { x: rest.length * numberSize });

      // Position all other cards
      rest.forEach((i, index) => {
        if (i !== prv) {
          const xNew = offsetLeft + index * (cardWidth + gap);
          gsap.to(`#card${i}`, {
            x: xNew,
            y: offsetTop,
            width: cardWidth,
            height: cardHeight,
            borderRadius: 10,
            zIndex: 30,
            ease,
            duration: 0.8,
            delay: 0.05 * (index + 1),
            opacity: 0.9, // Slightly transparent
          });

          gsap.to(`#card-content-${i}`, {
            x: xNew,
            y: offsetTop,
            width: cardWidth,
            height: cardHeight,
            opacity: 1,
            zIndex: 40,
            ease,
            duration: 0.8,
            delay: 0.05 * (index + 1),
          });
          
          gsap.to(`#slide-item-${i}`, { 
            x: (index + 1) * numberSize, 
            ease,
            duration: 0.8
          });
        }
      });
      
      // Reset inactive details
      gsap.to(detailsInactive, { 
        opacity: 0,
        duration: 0.3,
        ease
      });
    });
  };

  // Main animation loop
  const startLoop = async () => {
    // Stop the loop if component is unmounted
    if (!innovationsRef.current) return;
    
    try {
      await animateIndicator();
      
      // Update the order and toggle even/odd state
      order.push(order.shift());
      setActiveIndex(order[0]);
      setIsEven(!isEven);
      
      await executeStep();
      
      // Set timeout for next animation cycle (stored in window for cleanup)
      window.autoAnimationTimeout = setTimeout(() => {
        startLoop();
      }, 5000); // 5 second delay between auto-animations
    } catch (error) {
      console.error("Animation error:", error);
    }
  };

  // Animate the progress indicator
  const animateIndicator = async () => {
    return new Promise((resolve) => {
      gsap.fromTo(
        indicatorRef.current, 
        { x: -window.innerWidth },
        {
          x: window.innerWidth,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: resolve
        }
      );
    });
  };

  // Open link in new tab
  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  if (isMobile) {
    return <InnovationsMobile projects={projects} />;
  }

  return (
    <section className='innovations-section' ref={innovationsRef}>
      {/* Content is dynamically created in useEffect */}
    </section>
  );
}
