import React, { useState } from 'react'
import './About.css'
import Taskbar from './Taskbar/Taskbar'
import AboutMe from './AboutMe/AboutMe'
import Timeline from './Timeline/Timeline'
import Achievements from './Achievements/Achievements'
import Certifications from './Certifications/Certifications'
import SectionNavBar from './SectionNavBar'
import { motion } from 'framer-motion';

const mobileSections = ['About Me', 'Timeline', 'Achievements', 'Certifications'];

// Responsive hook for About
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 998);
  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 998);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
}

export default function About({ currentSection, direction }) {
  const [activeSection, setActiveSection] = useState(0);
  const isMobile = useIsMobile();

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 0:
        return <AboutMe isActive={currentSection === 1} />;
      case 1:
        return <Timeline isActive={currentSection === 1} />;
      case 2:
        return <Achievements />;
      case 3:
        return <Certifications />;
      default:
        return <AboutMe isActive={currentSection === 1} />;
    }
  };

  return (
    <motion.section
      className="about-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="about-content">
        {isMobile && currentSection === 1 ? (
          <div className="mobile-nav">
            <SectionNavBar 
              currentSection={activeSection}
              setSection={setActiveSection}
              sectionNames={mobileSections}
              isActive={true}
            />
          </div>
        ) : (
          <div className="larg">
            <Taskbar 
              activeTab={mobileSections[activeSection].toLowerCase().replace(/\s/g, '')}
              setActiveTab={tabName => {
                const idx = mobileSections.map(s => s.toLowerCase().replace(/\s/g, '')).indexOf(tabName);
                if (idx !== -1) setActiveSection(idx);
              }}
              direction={direction}
            />
          </div>
        )}

        <motion.div
          className="smal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </motion.section>
  );
}