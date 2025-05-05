import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './WeeklyCommitsChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const lineDrawPlugin = {
  id: 'lineDrawPlugin',
  afterDraw: (chart, args, options) => {
    if (!options.enabled) return;
    const { ctx, chartArea, scales } = chart;
    const dataset = chart.data.datasets[0];
    const meta = chart.getDatasetMeta(0);
    if (!meta || !meta.data || meta.data.length === 0) return;
    const points = meta.data;
    const progress = options.progress ?? 1;
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        // Only draw up to the current progress
        const pct = i / (points.length - 1);
        if (pct > progress) break;
        ctx.lineTo(point.x, point.y);
      }
    }
    ctx.strokeStyle = dataset.borderColor || 'rgba(236, 33, 70, 0.9)';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(236, 33, 70, 0.2)';
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.restore();
  },
};

ChartJS.register(lineDrawPlugin);

const WeeklyCommitsChart = ({ animateLine = false }) => {
  const [data, setData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [drawProgress, setDrawProgress] = useState(animateLine ? 0 : 1);

  useEffect(() => {
    // Fetch actual commit activity from GitHub API for a main repo
    // We'll use the repo 'Advanced-Aerial-Drone-Detection-System' as an example
    const fetchCommits = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/Ayushkumawat/Advanced-Aerial-Drone-Detection-System/stats/commit_activity');
        let commitData = [];
        if (response.ok) {
          commitData = await response.json();
        }
        // commitData is an array of 52 weeks, each with { total, week, days }
        // We'll take the last 8 weeks
        let lastWeeks = commitData.slice(-8);
        // If no data or empty, create 8 weeks of 0s
        if (!Array.isArray(lastWeeks) || lastWeeks.length === 0) {
          const now = new Date();
          lastWeeks = Array.from({ length: 8 }, (_, i) => {
            const weekDate = new Date(now.getTime() - (7 * (7 - i)) * 24 * 60 * 60 * 1000);
            return { week: Math.floor(weekDate.getTime() / 1000), total: 0 };
          });
        }
        const labels = lastWeeks.map(weekObj => {
          const date = new Date(weekObj.week * 1000);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        const counts = lastWeeks.map(weekObj => weekObj.total);
        setData({
          labels,
          datasets: [
            {
              label: 'Commits',
              data: counts,
              borderColor: 'rgba(236, 33, 70, 0.9)',
              backgroundColor: 'rgba(236, 33, 70, 0.5)',
              tension: 0.3,
            },
          ],
        });
      } catch (err) {
        // fallback to 8 weeks of 0s
        const now = new Date();
        const lastWeeks = Array.from({ length: 8 }, (_, i) => {
          const weekDate = new Date(now.getTime() - (7 * (7 - i)) * 24 * 60 * 60 * 1000);
          return { week: Math.floor(weekDate.getTime() / 1000), total: 0 };
        });
        const labels = lastWeeks.map(weekObj => {
          const date = new Date(weekObj.week * 1000);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        setData({
          labels,
          datasets: [
            {
              label: 'Commits',
              data: Array(8).fill(0),
              borderColor: 'rgba(236, 33, 70, 0.9)',
              backgroundColor: 'rgba(236, 33, 70, 0.5)',
              tension: 0.3,
            },
          ],
        });
      }
      setLoading(false);
    };
    fetchCommits();
  }, []);

  useEffect(() => {
    if (!animateLine) {
      setDrawProgress(1);
      return;
    }
    let frame;
    let start;
    const duration = 1200;
    function animate(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      setDrawProgress(progress);
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    }
    setDrawProgress(0);
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [animateLine]);

  if (loading || !data || !data.labels) {
    return <div className="weekly-commits-loading">Loading weekly commits...</div>;
  }

  return (
    <div className="weekly-commits-chart-container">
      <Line
        data={data ?? { labels: [], datasets: [] }}
        options={{
          responsive: true,
          animation: false, // disable built-in animation
          hover: { animationDuration: 0 },
          responsiveAnimationDuration: 0,
          plugins: {
            legend: { display: false },
            title: { display: false },
            lineDrawPlugin: {
              enabled: animateLine,
              progress: drawProgress,
            },
          },
          elements: {
            line: {
              borderWidth: 0, // hide the default line
            },
            point: {
              radius: 4,
              backgroundColor: 'rgba(236, 33, 70, 0.9)',
              borderWidth: 0,
            },
          },
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, ticks: { stepSize: 5 } },
          },
        }}
      />
    </div>
  );
};

export default WeeklyCommitsChart; 