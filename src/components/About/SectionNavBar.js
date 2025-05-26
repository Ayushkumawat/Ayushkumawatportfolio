import React, { useState, useEffect } from 'react';
import './SectionNavBar.css';

export default function SectionNavBar({ currentSection, setSection, sectionNames, isActive }) {
  const [navClass, setNavClass] = useState('');

  useEffect(() => {
    const updateNavClass = () => {
      const height = window.innerHeight;
      if (height <= 450) {
        setNavClass('section-nav-compact');
      } else if (height <= 650) {
        setNavClass('section-nav-reduced');
      } else {
        setNavClass('');
      }
    };
    updateNavClass();
    window.addEventListener('resize', updateNavClass);
    return () => window.removeEventListener('resize', updateNavClass);
  }, []);

  return (
    <nav
      className={`section-nav-bar${isActive ? ' animate-in' : ''} ${navClass}`}
      style={!isActive ? { opacity: 0 } : {}}
    >
      {sectionNames.map((name, idx) => (
        <button
          key={name}
          className={`section-nav-dot${currentSection === idx ? ' active' : ''}`}
          onClick={() => setSection(idx)}
          aria-label={name}
        >
          {currentSection === idx ? <span className="section-nav-label">{name.toUpperCase()}</span> : idx + 1}
        </button>
      ))}
    </nav>
  );
} 