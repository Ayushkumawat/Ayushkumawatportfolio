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
import './RepoCreationChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RepoCreationChart = ({ instanceKey }) => {
  const [data, setData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch('https://api.github.com/users/Ayushkumawat/repos?per_page=100');
        const repos = await response.json();
        // Group by month-year
        const counts = {};
        repos.forEach(repo => {
          const date = new Date(repo.created_at);
          const key = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
          counts[key] = (counts[key] || 0) + 1;
        });
        // Sort labels
        const labels = Object.keys(counts).sort((a, b) => new Date(a) - new Date(b));
        const dataset = labels.map(label => counts[label]);

        setData({
          labels,
          datasets: [
            {
              label: 'Repos Created',
              data: dataset,
              backgroundColor: 'rgba(124, 58, 237, 0.8)',
            },
          ],
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching repos', err);
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  if (loading) {
    return <p>Loading Repositories...</p>;
  }

  const isSmallCharts = window.innerHeight < 600 || window.innerWidth < 480;

  return (
    <div className="repo-creation-chart-container">
      <Bar
        key={instanceKey}
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            title: {
              display: false,
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                font: {
                  size: isSmallCharts ? 8 : 12,
                },
                padding: isSmallCharts ? 2 : 5,
              },
            },
            y: { beginAtZero: true, ticks: { stepSize: 1 } },
          },
        }}
      />
    </div>
  );
};

export default RepoCreationChart; 