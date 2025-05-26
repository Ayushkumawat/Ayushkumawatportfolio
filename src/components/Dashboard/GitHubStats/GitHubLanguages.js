import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './GitHubStats.css';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

// Fallback language data in case GitHub API fails
const FALLBACK_LANGUAGE_DATA = {
  Python: 235000,
  JavaScript: 120000,
  HTML: 85000,
  CSS: 72000,
  Java: 98000
};

const GitHubLanguages = ({ instanceKey }) => {
  const [languageData, setLanguageData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('https://api.github.com/users/Ayushkumawat/repos');
        
        if (!response.ok) {
          throw new Error(`GitHub API returned ${response.status}`);
        }
        
        const repos = await response.json();
        
        const languagePromises = repos.map(repo => 
          fetch(repo.languages_url).then(res => res.json())
        );
        
        const languagesResults = await Promise.all(languagePromises);
        
        // Aggregate language data
        const languageTotals = {};
        
        languagesResults.forEach(langObj => {
          Object.entries(langObj).forEach(([lang, bytes]) => {
            if (languageTotals[lang]) {
              languageTotals[lang] += bytes;
            } else {
              languageTotals[lang] = bytes;
            }
          });
        });
        
        // Sort languages by usage and limit to top 5 to avoid overcrowding
        const maxLanguages = windowWidth <= 480 ? 4 : 5;
        const sortedLangs = Object.entries(languageTotals)
          .sort((a, b) => b[1] - a[1])
          .slice(0, maxLanguages);
          
        const limitedLanguages = Object.fromEntries(sortedLangs);
        console.log('Fetched GitHub language data:', limitedLanguages);
        setLanguageData(limitedLanguages);
        setLoading(false);
      } catch (err) {
        console.log("Using fallback language data due to API error:", err.message);
        // Use fallback data
        const maxLanguages = windowWidth <= 480 ? 4 : 5;
        const sortedLangs = Object.entries(FALLBACK_LANGUAGE_DATA)
          .sort((a, b) => b[1] - a[1])
          .slice(0, maxLanguages);
        
        console.log('Using fallback language data:', Object.fromEntries(sortedLangs));
        setLanguageData(Object.fromEntries(sortedLangs));
        setUsedFallback(true);
        setLoading(false);
      }
    };

    fetchLanguages();
  }, [windowWidth]);

  // Colors for different languages
  const colorMap = {
    Python: 'rgba(53, 114, 165, 0.9)',
    JavaScript: 'rgba(241, 224, 90, 0.9)',
    HTML: 'rgba(227, 76, 38, 0.9)',
    CSS: 'rgba(86, 61, 124, 0.9)',
    Java: 'rgba(176, 114, 25, 0.9)',
    C: 'rgba(85, 85, 85, 0.9)',
    "C++": 'rgba(0, 116, 196, 0.9)',
    TypeScript: 'rgba(49, 120, 198, 0.9)',
    Ruby: 'rgba(193, 31, 49, 0.9)',
    PHP: 'rgba(79, 93, 149, 0.9)',
    Swift: 'rgba(250, 107, 41, 0.9)',
  };

  const getDefaultColor = (index) => {
    const defaultColors = [
      'rgba(236, 33, 70, 0.9)',   // Red (primary)
      'rgba(110, 72, 170, 0.9)',  // Purple
      'rgba(30, 183, 186, 0.9)',  // Teal
      'rgba(255, 199, 0, 0.9)',   // Yellow
      'rgba(56, 195, 114, 0.9)',  // Green
      'rgba(49, 162, 237, 0.9)',  // Blue
      'rgba(255, 145, 0, 0.9)',   // Orange
      'rgba(212, 75, 192, 0.9)',  // Pink
      'rgba(71, 190, 153, 0.9)',  // Mint
      'rgba(150, 60, 200, 0.9)',  // Violet
    ];
    return defaultColors[index % defaultColors.length];
  };

  const chartData = {
    labels: Object.keys(languageData),
    datasets: [
      {
        data: Object.values(languageData),
        backgroundColor: Object.keys(languageData).map((lang, index) => 
          colorMap[lang] || getDefaultColor(index)
        ),
        borderColor: Object.keys(languageData).map((lang, index) => 
          colorMap[lang]?.replace('0.8', '1') || getDefaultColor(index).replace('0.8', '1')
        ),
        borderWidth: 1,
        hoverOffset: 5,
        spacing: 1,
      },
    ],
  };

  const isSmallCharts = window.innerHeight < 600 || window.innerWidth < 480;
  const isMobile = windowWidth <= 480;

  const chartOptions = {
    responsive: true,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        display: !isSmallCharts,
        position: isMobile ? 'bottom' : (windowWidth < 768 ? 'bottom' : 'right'),
        align: 'center',
        labels: {
          color: 'rgb(105, 105, 105)',
          padding: isSmallCharts ? 2 : (window.innerHeight < 700 ? 4 : 6),
          font: {
            size: isMobile ? 8 : (isSmallCharts ? 7 : (window.innerHeight < 600 ? 9 : (windowWidth < 480 ? 10 : 11))),
            weight: '500',
          },
          boxWidth: isMobile ? 8 : (isSmallCharts ? 6 : (window.innerHeight < 600 ? 8 : (windowWidth < 480 ? 10 : 12))),
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        titleFont: {
          size: 12,
          weight: 'bold',
        },
        bodyFont: {
          size: 11,
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ec2146',
        bodyColor: 'rgb(105, 105, 105)',
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((acc, value) => acc + value, 0);
            const percentage = ((context.parsed * 100) / total).toFixed(1);
            return `${context.label}: ${percentage}%`;
          }
        }
      },
    },
    cutout: isMobile ? '70%' : (isSmallCharts ? '40%' : (window.innerHeight < 600 ? '50%' : '60%')),
    maintainAspectRatio: false,
    layout: {
      padding: isMobile ? 2 : (isSmallCharts ? 2 : (window.innerHeight < 600 ? 5 : 10))
    },
  };

  if (loading) {
    return <div className="github-stats-loading">Loading language data...</div>;
  }

  if (Object.keys(languageData).length === 0) {
    return <div className="github-stats-loading">No language data available</div>;
  }

  return (
    <div className="github-languages-container">
      <div className="github-languages-card">
        <h2>Language Distribution</h2>
        <div className="chart-container-doughnut">
          <Doughnut key={instanceKey} data={chartData} options={chartOptions} />
        </div>
        <div className="languages-info">
          {usedFallback && (
            <span className="fallback-notice">Using local data (API limit reached)</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GitHubLanguages; 