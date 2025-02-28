import React from "react";
import "./PerformanceInsights.css";

const PerformanceInsights = () => {
  return (
    <div className="insights-container">
      <div className="insights-header">
        <h3>Performance Insights</h3>
      </div>

      <div className="insights-grid">
        <div className="insight-card">
          <div className="insight-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="insight-content">
            <span className="insight-label">Score Growth</span>
            <div className="insight-value positive">
              +180 <span className="insight-period">points</span>
            </div>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="insight-content">
            <span className="insight-label">Q# Solved</span>
            <div className="insight-value">
              847 <span className="insight-period">total</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceInsights;
