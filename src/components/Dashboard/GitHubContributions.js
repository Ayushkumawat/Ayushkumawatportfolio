import React, { useContext } from 'react';
import './GitHubStats/GitHubStats.css';
import { ThemeContext } from '../../ThemeContext';

const GitHubContributions = () => {
  const { darkMode } = useContext(ThemeContext);
  
  // Choose the right color for the contribution chart based on theme
  const chartColor = darkMode ? 'ec2146' : 'ff002f';

  const contributionStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    padding: '0 0 0 15px'
  };

  const imageStyle = {
    width: '96%',
    height: 'auto',
    objectFit: 'contain',
    display: 'block',
    maxHeight: '140px'
  };

  return (
    <div style={contributionStyle}>
      <img 
        src={`https://ghchart.rshah.org/${chartColor}/Ayushkumawat`}
        alt="GitHub Contribution Chart" 
        style={imageStyle}
      />
    </div>
  );
};

export default GitHubContributions; 