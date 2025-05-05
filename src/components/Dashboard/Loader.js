import React from 'react';
import './Loader.css';

export default function Loader() {
  return (
    <div className="loader-overlay">
      <div className="spinner" />
      <span className="loader-text">Loading Dashboard...</span>
    </div>
  );
} 