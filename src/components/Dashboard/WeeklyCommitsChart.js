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
    const { ctx } = chart;
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
        if (pct > progress) {
          // Draw partial bezier to the progress point
          const prev = points[i - 1];
          const prevCPx = prev.controlPointNextX ?? prev.x;
          const prevCPy = prev.controlPointNextY ?? prev.y;
          const currCPx = point.controlPointPreviousX ?? point.x;
          const currCPy = point.controlPointPreviousY ?? point.y;
          // Interpolate to the progress point
          const t = (progress - (i - 1) / (points.length - 1)) * (points.length - 1);
          // Linear interpolation for x/y
          const interp = (a, b) => a + (b - a) * t;
          const x = interp(prev.x, point.x);
          const y = interp(prev.y, point.y);
          const cp1x = interp(prevCPx, prev.x);
          const cp1y = interp(prevCPy, prev.y);
          const cp2x = interp(currCPx, point.x);
          const cp2y = interp(currCPy, point.y);
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
          break;
        } else {
          // Draw full bezier to this point
          const prev = points[i - 1];
          const prevCPx = prev.controlPointNextX ?? prev.x;
          const prevCPy = prev.controlPointNextY ?? prev.y;
          const currCPx = point.controlPointPreviousX ?? point.x;
          const currCPy = point.controlPointPreviousY ?? point.y;
          ctx.bezierCurveTo(prevCPx, prevCPy, currCPx, currCPy, point.x, point.y);
        }
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
    // Fetch all public repos, then fetch commit activity for each, and sum per week
    const fetchAllCommits = async () => {
      try {
        // Step 1: Fetch all public repos
        const reposResponse = await fetch('https://api.github.com/users/ayushkumawat/repos?per_page=100');
        const repos = await reposResponse.json();
        const repoNames = Array.isArray(repos) ? repos.map(repo => repo.name) : [];
        // Step 2: For each repo, fetch commit activity
        const commitPromises = repoNames.map(name =>
          fetch(`https://api.github.com/repos/ayushkumawat/${name}/stats/commit_activity`).then(res => res.json())
        );
        const allCommitData = await Promise.all(commitPromises);
        // Step 3: Aggregate the last 8 weeks across all repos
        const weeksToShow = 8;
        // Find the most recent 8 week timestamps from any repo with data
        let weekTimestamps = [];
        for (let repoData of allCommitData) {
          if (Array.isArray(repoData) && repoData.length > 0) {
            weekTimestamps = repoData.slice(-weeksToShow).map(w => w.week);
            break;
          }
        }
        if (weekTimestamps.length === 0) {
          // fallback: use current week and go back
          const now = new Date();
          weekTimestamps = Array.from({ length: weeksToShow }, (_, i) =>
            Math.floor(new Date(now.getTime() - (weeksToShow - 1 - i) * 7 * 24 * 60 * 60 * 1000).getTime() / 1000)
          );
        }
        // Sum commits for each week across all repos
        const weekTotals = Array(weeksToShow).fill(0);
        allCommitData.forEach(repoData => {
          if (Array.isArray(repoData) && repoData.length > 0) {
            // Align the last N weeks to the global weekTimestamps
            const repoWeeks = repoData.slice(-weeksToShow);
            repoWeeks.forEach((weekObj, i) => {
              // Only add if the week timestamp matches (to avoid misalignment)
              if (weekObj.week === weekTimestamps[i]) {
                weekTotals[i] += weekObj.total;
              }
            });
          }
        });
        const labels = weekTimestamps.map(ts => {
          const date = new Date(ts * 1000);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        setData({
          labels,
          datasets: [
            {
              label: 'Commits',
              data: weekTotals,
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
    fetchAllCommits();
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
              borderWidth: animateLine ? 0 : 3,
            },
            point: {
              radius: window.innerHeight < 600 ? 3 : 4,
              backgroundColor: 'rgba(236, 33, 70, 0.9)',
              borderWidth: 0,
            },
          },
          scales: {
            x: { 
              grid: { display: false },
              ticks: {
                font: {
                  size: window.innerHeight < 600 ? 9 : 11
                },
                padding: window.innerHeight < 600 ? 3 : 5
              }
            },
            y: { 
              beginAtZero: true, 
              ticks: { 
                stepSize: 5,
                font: {
                  size: window.innerHeight < 600 ? 9 : 11
                },
                padding: window.innerHeight < 600 ? 3 : 5
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            },
          },
        }}
      />
    </div>
  );
};

export default WeeklyCommitsChart; 