import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './GitHubStats.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Fallback data in case GitHub API fails
const FALLBACK_REPOS = [
  { name: 'Advanced-Aerial-Drone-Detection-System', stargazers_count: 23, forks_count: 7 },
  { name: 'Bus-Passenger-Management', stargazers_count: 5, forks_count: 2 },
  { name: 'AI-MedDiagnostics', stargazers_count: 6, forks_count: 5 },
  { name: 'News-Classification-NLP', stargazers_count: 4, forks_count: 3 }
];

function AnimatedNumber({ value, duration = 1200, instanceKey }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [suffix, setSuffix] = useState('');
  
  useEffect(() => {
    let start = 0;
    let startTime = null;
    let raf;
    
    // Parse value and extract suffix
    let numericValue;
    let extractedSuffix = '';
    let decimalPlaces = 0;
    
    if (typeof value === 'string') {
      const matches = value.match(/^([\d.]+)([^\d.]*)$/);
      if (matches) {
        numericValue = parseFloat(matches[1]);
        extractedSuffix = matches[2];
        // Count decimal places in the original number
        decimalPlaces = (matches[1].split('.')[1] || '').length;
      } else {
        setDisplayValue(value);
        return;
      }
    } else {
      numericValue = value;
      // Count decimal places if it's a number
      decimalPlaces = value.toString().includes('.') ? 
        value.toString().split('.')[1].length : 0;
    }
    
    setSuffix(extractedSuffix);
    
    // Reset the display value when instanceKey changes
    setDisplayValue(0);
    
    function animate(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const currentValue = progress * (numericValue - start) + start;
      
      // Format with the same number of decimal places as the target value
      setDisplayValue(Number(currentValue.toFixed(decimalPlaces)));
      
      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        setDisplayValue(numericValue);
      }
    }
    
    if (!isNaN(numericValue)) {
      raf = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(raf);
    }
  }, [value, duration, instanceKey]);

  // If it's a non-numeric string without a number prefix, just show it as is
  if (typeof value === 'string' && !value.match(/^[\d.]+/)) {
    return <span>{value}</span>;
  }
  
  // Return the animated number with its suffix
  return (
    <span>
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: displayValue % 1 === 0 ? 0 : 1,
        maximumFractionDigits: 1
      })}
      <span className="number-suffix">{suffix}</span>
    </span>
  );
}

const GitHubStats = ({ showChart = true, showSummary = true, renderStatItem, statFilter, instanceKey }) => {
  const [repoData, setRepoData] = useState([]);
  const [totalRepos, setTotalRepos] = useState(0);
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
    const fetchGitHubData = async () => {
      try {
        const response = await fetch('https://api.github.com/users/Ayushkumawat/repos?per_page=100');
        if (!response.ok) {
          throw new Error(`GitHub API returned ${response.status}`);
        }
        const data = await response.json();
        setTotalRepos(data.length);
        // Sort repositories by stars and limit to show fewer on small screens
        const maxRepos = windowWidth <= 480 ? 3 : 4;
        const sortedRepos = data
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, maxRepos);
        setRepoData(sortedRepos);
        setLoading(false);
      } catch (err) {
        console.log("Using fallback data due to API error:", err.message);
        // Use fallback data
        setTotalRepos(FALLBACK_REPOS.length);
        const maxRepos = windowWidth <= 480 ? 3 : 4;
        setRepoData(FALLBACK_REPOS.slice(0, maxRepos));
        setUsedFallback(true);
        setLoading(false);
      }
    };
    fetchGitHubData();
  }, [windowWidth]);

  const chartData = {
    labels: repoData.map(repo => {
      // Shorten repository names even more for small screens
      const maxLength = windowWidth <= 480 ? 6 : 8;
      return repo.name.length > maxLength ? repo.name.substring(0, maxLength - 2) + '..' : repo.name;
    }),
    datasets: [
      {
        label: 'Stars',
        data: repoData.map(repo => repo.stargazers_count),
        backgroundColor: 'rgba(110, 72, 170, 0.9)',
        borderColor: 'rgba(124, 58, 237, 1)',
        borderWidth: 1,
        barThickness: 'flex',
        maxBarThickness: windowWidth <= 480 ? 25 : 35,
      },
      {
        label: 'Forks',
        data: repoData.map(repo => repo.forks_count),
        backgroundColor: 'rgba(236, 33, 70, 0.9)',
        borderColor: 'rgba(253, 29, 83, 1)',
        borderWidth: 1,
        barThickness: 'flex',
        maxBarThickness: windowWidth <= 480 ? 25 : 35,
      },
    ],
  };

  const isSmallCharts = window.innerHeight < 600 || window.innerWidth < 480;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        display: !isSmallCharts,
        position: 'top',
        align: 'center',
        labels: {
          color: 'rgb(105, 105, 105)',
          font: {
            size: isSmallCharts ? 7 : (window.innerHeight < 600 ? 9 : (windowWidth <= 480 ? 10 : 11)),
          },
          boxWidth: isSmallCharts ? 6 : (window.innerHeight < 600 ? 8 : (windowWidth <= 480 ? 10 : 12)),
          padding: isSmallCharts ? 2 : (window.innerHeight < 600 ? 4 : (windowWidth <= 480 ? 6 : 8)),
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
        displayColors: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ec2146',
        bodyColor: 'rgb(105, 105, 105)',
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            return repoData[index].name;
          }
        }
      },
    },
    layout: {
      padding: {
        left: isSmallCharts ? 1 : (window.innerHeight < 600 ? 3 : 5),
        right: isSmallCharts ? 1 : (window.innerHeight < 600 ? 3 : 5),
        top: isSmallCharts ? 1 : (window.innerHeight < 600 ? 3 : 5),
        bottom: isSmallCharts ? 1 : (window.innerHeight < 600 ? 3 : 5)
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.15)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgb(105, 105, 105)',
          font: {
            size: isSmallCharts ? 7 : (window.innerHeight < 600 ? 9 : (windowWidth <= 480 ? 10 : 11)),
          },
          maxTicksLimit: isSmallCharts ? 2 : (window.innerHeight < 600 ? 3 : (windowWidth <= 480 ? 4 : 5)),
          padding: isSmallCharts ? 1 : (window.innerHeight < 600 ? 3 : 5),
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: 'rgb(105, 105, 105)',
          font: {
            size: isSmallCharts ? 7 : (window.innerHeight < 600 ? 9 : (windowWidth <= 480 ? 10 : 11)),
          },
          padding: isSmallCharts ? 1 : (window.innerHeight < 600 ? 3 : 5),
        },
      },
    },
  };

  if (loading) {
    return <div className="github-stats-loading">Loading GitHub statistics...</div>;
  }

  const totalStars = repoData.reduce((acc, repo) => acc + repo.stargazers_count, 0);

  if (showSummary && !showChart) {
    const statContents = [
      { label: 'Patents Published', value: 2 },
      { label: 'Total Repositories', value: totalRepos },
      { label: 'Stars Received', value: totalStars },
      { label: 'Research Contributions', value: 2 },
      { label: 'LinkedIn Followers', value: "2.8K +" },
      // Add more if needed
    ];
    // Filter stats if statFilter is provided
    const filteredStats = statFilter ? statContents.filter(stat => statFilter.includes(stat.label)) : statContents;
    return (
      <>
        <div className="github-stats-summary">
          {filteredStats.map((stat, i) =>
            renderStatItem ? (
              renderStatItem(
                <>
                  <h3>{stat.label}</h3>
                  <p><AnimatedNumber value={stat.value} duration={1200 + i * 200} instanceKey={instanceKey} /></p>
                </>,
                i
              )
            ) : (
              <div className="stat-item" key={stat.label}>
                <h3>{stat.label}</h3>
                <p><AnimatedNumber value={stat.value} duration={1200 + i * 200} instanceKey={instanceKey} /></p>
              </div>
            )
          )}
        </div>
        {usedFallback && (
          <div className="fallback-notice">
            Using local data (GitHub API limit reached)
          </div>
        )}
      </>
    );
  }

  return (
    <div className="github-stats-container">
      <div className="github-stats-card">
        <h2>{showChart ? 'Top Repositories' : 'GitHub Statistics'}</h2>
        {showChart && (
          <div className="chart-container">
            <Bar key={instanceKey} data={chartData} options={chartOptions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubStats; 