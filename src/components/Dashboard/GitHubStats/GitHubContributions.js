import React from 'react';
import './GitHubStats.css';

const GitHubContributions = () => {
  return (
    <div className="github-contributions-container">
      <div className="github-contributions-card">
        <h2>GitHub Contribution Activity</h2>
        <div className="contributions-content">
          <div className="contribution-embed">
            <img 
              src="https://ghchart.rshah.org/ec2146/Ayushkumawat" 
              alt="GitHub Contribution Chart" 
              className="contribution-chart"
            />
          </div>
          <div className="contribution-info">
            <p>
              This chart shows contribution activity over the past year. 
              Darker colors indicate more contributions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubContributions; 