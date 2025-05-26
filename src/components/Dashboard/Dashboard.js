import React, { useState, useEffect, useRef } from 'react';
import GitHubStats from './GitHubStats/GitHubStats';
import GitHubContributions from './GitHubStats/GitHubContributions';
import GitHubLanguages from './GitHubStats/GitHubLanguages';
// import GitHubAchievements from './GitHubStats/GitHubAchievements';
import './Dashboard.css';
import VanillaTilt from 'vanilla-tilt';
import { ThemeContext } from '../../ThemeContext';
import { useContext } from 'react';
import RepoCreationChart from './RepoCreationChart';
import WeeklyCommitsChart from './WeeklyCommitsChart';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from './Loader';

export default function Dashboard({ currentSection }) {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chartsVisible, setChartsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    if (currentSection === 3) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [currentSection]);

  useEffect(() => {
    // Simulate loading, or set to false when all data is ready
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      // Show charts after cards are visible
      const chartTimer = setTimeout(() => setChartsVisible(true), 700);
      return () => clearTimeout(chartTimer);
    } else {
      setChartsVisible(false);
    }
  }, [loading]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation variants for staggered cards
  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.15, type: 'spring', duration: 0.7 }
    })
  };
  // Animation for chart content
  const chartVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: 0.2 + i * 0.1, type: 'spring', duration: 0.7 }
    })
  };

  // Sample contribution activity data for the new chart
  const contributionActivity = {
    weeks: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    commits: [5, 12, 8, 15],
    pullRequests: [2, 4, 1, 3],
    codeReviews: [3, 6, 4, 8]
  };

  // Generate stars JSX
  const generateStars = () => {
    const stars = [];
    for (let i = 0; i < 50; i++) {
      const size = Math.random() * 2;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const duration = 3 + Math.random() * 5;
      
      stars.push(
        <div 
          key={i}
          className="star"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${top}%`,
            left: `${left}%`,
            animationDuration: `${duration}s`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      );
    }
    return stars;
  };

  // Simple contribution activity chart renderer
  const renderContributionActivity = () => {
    const maxValue = Math.max(
      ...contributionActivity.commits,
      ...contributionActivity.pullRequests,
      ...contributionActivity.codeReviews
    );
    
    return (
      <div className="contribution-activity-chart">
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-color commits"></span>
            <span className="legend-label">Commits</span>
          </div>
          <div className="legend-item">
            <span className="legend-color pull-requests"></span>
            <span className="legend-label">Pull Requests</span>
          </div>
          <div className="legend-item">
            <span className="legend-color code-reviews"></span>
            <span className="legend-label">Code Reviews</span>
          </div>
        </div>
        <div className="chart-bars">
          {contributionActivity.weeks.map((week, index) => (
            <div key={index} className="week-group">
              <div className="bar-group">
                <div 
                  className="bar commits" 
                  style={{ height: `${(contributionActivity.commits[index] / maxValue) * 100}%` }}
                ></div>
                <div 
                  className="bar pull-requests" 
                  style={{ height: `${(contributionActivity.pullRequests[index] / maxValue) * 100}%` }}
                ></div>
                <div 
                  className="bar code-reviews" 
                  style={{ height: `${(contributionActivity.codeReviews[index] / maxValue) * 100}%` }}
                ></div>
              </div>
              <div className="week-label">{week}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="dashboard-section">
      {isVisible && loading && <Loader />}
      <div className={`dashboard-content ${isVisible ? 'visible' : ''}`}>
        <div className="statistics-section">
          {isMobile ? <ChartInViewSummaryMobile /> : <ChartInViewSummary />}
          <AnimatePresence>
            <motion.div
              className="dashboard-grid"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{}}
            >
              {[
                {
                  id: 'repo-activity',
                  chart: null, // handled below
                  title: 'Repository Activity',
                },
                {
                  id: 'language-dist',
                  chart: null, // handled below
                  title: 'Language Distribution',
                },
                {
                  id: 'contrib-history',
                  chart: null, // handled below
                  title: 'Weekly Commits',
                },
                {
                  id: 'new-chart-1',
                  chart: null, // handled below
                  title: 'Repos by Creation Date',
                },
                {
                  id: 'new-chart-2',
                  chart: null, // handled below
                  title: 'Contribution History',
                },
              ].map((card, i) => (
                <motion.div
                  className="dashboard-card glass-card"
                  id={card.id}
                  key={card.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <div className="card-title">{card.title}</div>
                  {card.id === 'contrib-history' ? (
                    <ChartInView index={i} />
                  ) : card.id === 'language-dist' ? (
                    <ChartInViewDoughnut index={i} />
                  ) : card.id === 'repo-activity' ? (
                    <ChartInViewRepoActivity index={i} />
                  ) : card.id === 'new-chart-1' ? (
                    <ChartInViewRepoCreation index={i} />
                  ) : card.id === 'new-chart-2' ? (
                    <ChartInViewContributions index={i} />
                  ) : (
                    <motion.div
                      className="card-chart-content"
                      custom={i}
                      variants={chartVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: false, amount: 0.4 }}
                      exit="hidden"
                    >
                      {card.chart}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Animated glow elements */}
        <div className="glow-element top-left"></div>
        <div className="glow-element bottom-right"></div>
      </div>
    </section>
  );
}

// Helper component for WeeklyCommitsChart with in-view animation
function ChartInView({ index }) {
  const [inView, setInView] = useState(false);
  const ref = useRef();
  return (
    <motion.div
      className="card-chart-content"
      custom={index}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { delay: 0.2 + index * 0.1, type: 'spring', duration: 0.7 },
        },
      }}
      whileInView={() => setInView(true)}
      onViewportLeave={() => setInView(false)}
      viewport={{ once: false, amount: 0.4 }}
      ref={ref}
    >
      <WeeklyCommitsChart animateLine={inView} />
    </motion.div>
  );
}

// Helper component for GitHubLanguages Doughnut chart with in-view animation
function ChartInViewDoughnut({ index }) {
  const [inView, setInView] = useState(false);
  const [instanceKey, setInstanceKey] = useState(0);
  const ref = useRef();
  useEffect(() => {
    if (inView) {
      setInstanceKey(prev => prev + 1);
    }
  }, [inView]);
  return (
    <motion.div
      className="card-chart-content"
      custom={index}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { delay: 0.2 + index * 0.1, type: 'spring', duration: 0.7 },
        },
      }}
      whileInView={() => setInView(true)}
      onViewportLeave={() => setInView(false)}
      viewport={{ once: false, amount: 0.4 }}
      ref={ref}
    >
      <GitHubLanguages instanceKey={instanceKey} />
    </motion.div>
  );
}

// Helper component for Repository Activity chart with in-view animation
function ChartInViewRepoActivity({ index }) {
  const [inView, setInView] = useState(false);
  const [instanceKey, setInstanceKey] = useState(0);
  const ref = useRef();

  useEffect(() => {
    // Trigger animation when the component mounts
    const timer = setTimeout(() => {
      setInView(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (inView) {
      setInstanceKey(prev => prev + 1);
    }
  }, [inView]);

  return (
    <motion.div
      className="card-chart-content"
      custom={index}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { delay: 0.2 + index * 0.1, type: 'spring', duration: 0.7 },
        },
      }}
      whileInView={() => setInView(true)}
      onViewportLeave={() => setInView(false)}
      viewport={{ once: false, amount: 0.4 }}
      ref={ref}
    >
      <GitHubStats showChart={true} showSummary={false} instanceKey={instanceKey} />
    </motion.div>
  );
}

// Helper component for RepoCreationChart with in-view animation
function ChartInViewRepoCreation({ index }) {
  const [inView, setInView] = useState(false);
  const [instanceKey, setInstanceKey] = useState(0);
  const ref = useRef();
  useEffect(() => {
    if (inView) {
      setInstanceKey(prev => prev + 1);
    }
  }, [inView]);
  return (
    <motion.div
      className="card-chart-content"
      custom={index}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { delay: 0.2 + index * 0.1, type: 'spring', duration: 0.7 },
        },
      }}
      whileInView={() => setInView(true)}
      onViewportLeave={() => setInView(false)}
      viewport={{ once: false, amount: 0.4 }}
      ref={ref}
    >
      <RepoCreationChart instanceKey={instanceKey} />
    </motion.div>
  );
}

// Helper component for Contribution History chart with in-view animation
function ChartInViewContributions({ index }) {
  const [inView, setInView] = useState(false);
  const [instanceKey, setInstanceKey] = useState(0);
  const ref = useRef();
  useEffect(() => {
    if (inView) {
      setInstanceKey(prev => prev + 1);
    }
  }, [inView]);
  return (
    <motion.div
      className="card-chart-content"
      custom={index}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { delay: 0.2 + index * 0.1, type: 'spring', duration: 0.7 },
        },
      }}
      whileInView={() => setInView(true)}
      onViewportLeave={() => setInView(false)}
      viewport={{ once: false, amount: 0.4 }}
      ref={ref}
    >
      <GitHubContributions instanceKey={instanceKey} />
    </motion.div>
  );
}

// Helper component for Stats Summary with in-view animation for mobile
function ChartInViewSummaryMobile() {
  const [inView, setInView] = useState(false);
  const [instanceKey, setInstanceKey] = useState(0);
  const ref = useRef();
  const prevInView = useRef(false);

  useEffect(() => {
    if (inView && !prevInView.current) {
      setInstanceKey(prev => prev + 1);
    }
    prevInView.current = inView;
  }, [inView]);

  return (
    <motion.div
      className="stats-summary-row mobile"
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }}
      whileInView={() => setInView(true)}
      onViewportLeave={() => setInView(false)}
      viewport={{ once: false, amount: 0.4 }}
      ref={ref}
    >
      <GitHubStats
        showChart={false}
        showSummary={true}
        instanceKey={instanceKey}
        renderStatItem={(content, i) => (
          <motion.div
            className="stat-item"
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.9 },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { duration: 0.4, delay: i * 0.1, type: 'spring' }
              }
            }}
          >
            {content}
          </motion.div>
        )}
      />
    </motion.div>
  );
}

// Helper component for Stats Summary with in-view animation
function ChartInViewSummary() {
  const [inView, setInView] = useState(false);
  const [instanceKey, setInstanceKey] = useState(0);
  const ref = useRef();

  useEffect(() => {
    if (inView) {
      setInstanceKey(prev => prev + 1);
    }
  }, [inView]);

  return (
    <motion.div
      className="stats-summary-row"
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }}
      whileInView={() => setInView(true)}
      onViewportLeave={() => setInView(false)}
      viewport={{ once: false, amount: 0.4 }}
      ref={ref}
    >
      <GitHubStats
        showChart={false}
        showSummary={true}
        instanceKey={instanceKey}
        renderStatItem={(content, i) => (
          <motion.div
            className="stat-item glass-card"
            key={i}
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.9 },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { duration: 0.5, delay: i * 0.1, type: 'spring' }
              }
            }}
          >
            {content}
          </motion.div>
        )}
      />
    </motion.div>
  );
}
