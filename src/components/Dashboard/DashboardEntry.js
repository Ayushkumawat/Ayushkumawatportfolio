import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import DashboardMobile from './DashboardMobile';

export default function DashboardEntry(props) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 998);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 998);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile ? <DashboardMobile {...props} /> : <Dashboard {...props} />;
} 