import React, { useState, useEffect } from 'react';
import './GitHubStats.css';

const GitHubContributions = ({ instanceKey }) => {
  const [timestamp, setTimestamp] = useState(Date.now());

  // Refresh the chart every 10 minutes (600,000 ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(Date.now());
    }, 600000); // 10 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="github-contributions-container">
      <div className="github-contributions-card">
        <h2>GitHub Contribution Activity</h2>
        <div className="contributions-content compact">
          <div className="contribution-embed compact">
            <div className="contribution-chart-wrapper">
              <img 
                src={`https://ghchart.rshah.org/ec2146/Ayushkumawat?${timestamp}&key=${instanceKey}`}
                alt="GitHub Contribution Chart"
                className="contribution-chart compact"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubContributions; 