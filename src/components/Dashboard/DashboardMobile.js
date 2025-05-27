import React, { useState, useRef } from 'react';
import GitHubStats from './GitHubStats/GitHubStats';
import WeeklyCommitsChart from './WeeklyCommitsChart';
import './DashboardMobile.css';
import { motion } from 'framer-motion';

function ChartInViewRepoActivityMobile({ index }) {
  const [inView, setInView] = useState(false);
  const [instanceKey, setInstanceKey] = useState(0);
  const ref = useRef();
  const prevInView = useRef(false);
  React.useEffect(() => {
    if (inView && !prevInView.current) {
      setInstanceKey(prev => prev + 1);
    }
    prevInView.current = inView;
  }, [inView]);
  return (
    <motion.div
      className="mobile-card-chart-content"
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { delay: 0.1, type: 'spring', duration: 0.7 },
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

function ChartInViewWeeklyCommitsMobile({ index }) {
  const [inView, setInView] = useState(false);
  const ref = useRef();
  const prevInView = useRef(false);
  const [instanceKey, setInstanceKey] = useState(0);
  React.useEffect(() => {
    if (inView && !prevInView.current) {
      setInstanceKey(prev => prev + 1);
    }
    prevInView.current = inView;
  }, [inView]);
  return (
    <motion.div
      className="mobile-card-chart-content"
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { delay: 0.1, type: 'spring', duration: 0.7 },
        },
      }}
      whileInView={() => setInView(true)}
      onViewportLeave={() => setInView(false)}
      viewport={{ once: false, amount: 0.4 }}
      ref={ref}
    >
      <WeeklyCommitsChart animateLine={inView} key={instanceKey} />
    </motion.div>
  );
}

// Animated summary stats row for mobile, with in-view logic
function ChartInViewSummaryMobile() {
  const [inView, setInView] = useState(false);
  const [instanceKey, setInstanceKey] = useState(0);
  const ref = useRef();
  const prevInView = useRef(false);

  React.useEffect(() => {
    if (inView && !prevInView.current) {
      setInstanceKey(prev => prev + 1);
    }
    prevInView.current = inView;
  }, [inView]);

  return (
    <motion.div
      className="mobile-stats-summary-row"
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
        statFilter={['Patents Published', 'Stars Received', 'Research Contributions', 'LinkedIn Followers']}
        renderStatItem={(content, i) => (
          <motion.div
            className="mobile-stat-item"
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

export default function DashboardMobile() {
  return (
    <section className="dashboard-mobile-section">
      {/* Dashboard title at the top, styled like Innovations */}
      <motion.h1 
        className="dashboard-mobile-title"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        My <span>Dashboard</span>
      </motion.h1>
      {/* Animated summary stats row with in-view logic */}
      <ChartInViewSummaryMobile />
      <div className="mobile-card glass-card">
        <div className="mobile-card-title">Repository Activity</div>
        <ChartInViewRepoActivityMobile index={0} />
      </div>
      <div className="mobile-card weekly-commits glass-card">
        <div className="mobile-card-title">Weekly Commits</div>
        <ChartInViewWeeklyCommitsMobile index={1} />
      </div>
    </section>
  );
} 