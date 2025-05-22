import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './Certifications.css';

const Certifications = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [slideDirection, setSlideDirection] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const certifications = [
    {
      title: "IBM Certified Applied Data Science Capstone",
      organization: "IBM",
      date: "2023",
      description: "This certification is a part of the IBM Certified Applied Data Science Capstone course, which is a part of the IBM Certified Applied AI Professional course.",
      image: require('../../../images/certif/IBM.jpg'),
      link: "#"
    },
    {
      title: "International English Language Testing System",
      organization: "IELTS",
      date: "2024",
      description: "Qualified in the IELTS exam with an overall score of 7.5",
      image: require('../../../images/certif/IELTS.jpg'),
      link: "#"
    },
    {
      title: "AI Researcher",
      organization: "Indian Space Research Organization, SAC, Ahemdabad",
      date: "2024",
      description: "I contributed to the development of real-time fault detection algorithms using machine learning on the Jetson AGX Orin platform.",
      image: require('../../../images/certif/ISRO.jpg'),
      link: "#"
    },
    {
      title: "Programming and DSA",
      organization: "NPTEL",
      date: "2023",
      description: "Earned an 'Elite' certification from NPTEL-IIT Madras for clearing the exam for 8-week course on Programming, Data Structures, and Algorithms using Python.",
      image: require('../../../images/certif/NPTEL.jpg'),
      link: "#"
    },
    {
      title: "Full Stack Development",
      organization: "GUVI",
      date: "2022",
      description: "Comprehensive certification in Full Stack Web Development",
      image: require('../../../images/certif/guvi.jpg'),
      link: "#"
    }
  ];

  const cardsPerPage = 4;
  const totalPages = Math.ceil(certifications.length / cardsPerPage);

  const handleNavigation = (direction) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSlideDirection(direction);

    setTimeout(() => {
      setCurrentPage((prev) => {
        if (direction === 'next') {
          return prev === totalPages - 1 ? 0 : prev + 1;
        } else {
          return prev === 0 ? totalPages - 1 : prev - 1;
        }
      });

      // Reset slide direction after a brief delay
      setTimeout(() => {
        setSlideDirection('');
        setIsAnimating(false);
      }, 50);
    }, 300);
  };

  const getVisibleCertifications = () => {
    const start = currentPage * cardsPerPage;
    const end = start + cardsPerPage;
    const visibleCerts = [...certifications.slice(start, end)];
    
    if (visibleCerts.length < cardsPerPage) {
      visibleCerts.push(...certifications.slice(0, cardsPerPage - visibleCerts.length));
    }
    
    return visibleCerts;
  };

  const openModal = (cert) => {
    setIsClosing(false);
    setSelectedCert(cert);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
      setSelectedCert(null);
    }, 300);
  };

  return (
    <>
      <div className="certifications-container">
        <div className="certifications-wrapper">
          <button 
            className="nav-arrow prev-arrow" 
            onClick={() => handleNavigation('prev')}
            disabled={isAnimating}
            aria-label="Previous certificates"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <div className={`certifications-grid ${isVisible ? 'visible' : ''} ${slideDirection}`}>
            {getVisibleCertifications().map((cert, index) => (
              <div 
                className="cert-card" 
                key={`${currentPage}-${index}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="cert-card-inner">
                  <div className="cert-card-front">
                    <div className="cert-image">
                      <img src={cert.image} alt={cert.title} />
                    </div>
                    <div className="cert-info">
                      <h3>{cert.title}</h3>
                      <p className="cert-org">{cert.organization}</p>
                    </div>
                  </div>
                  <div className="cert-card-back">
                    <div className="cert-details">
                      <h3>{cert.title}</h3>
                      <p className="cert-org">{cert.organization}</p>
                      <p className="cert-date">{cert.date}</p>
                      <p className="cert-desc">{cert.description}</p>
                      <button type="button" className="cert-link" onClick={() => openModal(cert)}>
                        <i className="fas fa-external-link-alt"></i> View Certificate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            className="nav-arrow next-arrow" 
            onClick={() => handleNavigation('next')}
            disabled={isAnimating}
            aria-label="Next certificates"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
      {(isModalOpen || isClosing) && ReactDOM.createPortal(
        <div
          className={
            `cert-modal-overlay ${isModalOpen && !isClosing ? 'open' : ''} ${isClosing ? 'closing' : ''}`
          }
          onClick={closeModal}
        >
          <div className="cert-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="cert-modal-close" onClick={closeModal}>×</button>
            {selectedCert && <img src={selectedCert.image} alt={selectedCert.title} />}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Certifications;
