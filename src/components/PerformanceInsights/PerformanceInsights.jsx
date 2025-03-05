import React from "react";
import "./PerformanceInsights.css";

const PerformanceInsights = () => {
  const timeData = {
    verbal: {
      target: 72, // 1.2 minutes in seconds
      actual: 84, // 1.4 minutes in seconds
    },
    math: {
      target: 96, // 1.6 minutes in seconds
      actual: 108, // 1.8 minutes in seconds
    },
  };

  const SpeedometerIcon = ({ ratio }) => {
    // Calculate rotation angle based on ratio (0 to 180 degrees)
    const angle = Math.min(180, Math.max(0, (ratio - 0.7) * 180));

    return (
      <svg viewBox="0 0 100 60" className="speedometer-icon">
        {/* Gray background arc */}
        <path
          d="M10 50 A40 40 0 0 1 90 50"
          className="speedometer-bg"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Colored sections */}
        <path
          d="M10 50 A40 40 0 0 1 50 10"
          className="speed-section fast"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M50 10 A40 40 0 0 1 70 20"
          className="speed-section okay"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M70 20 A40 40 0 0 1 90 50"
          className="speed-section slow"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Needle */}
        <g transform={`rotate(${angle}, 50, 50)`}>
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="20"
            strokeWidth="2"
            className="speedometer-needle"
          />
          <circle cx="50" cy="50" r="4" className="speedometer-center" />
        </g>
      </svg>
    );
  };

  const getSpeedIndicator = (actual, target) => {
    const ratio = actual / target;
    if (ratio <= 1.1) return "fast";
    if (ratio <= 1.3) return "okay";
    return "slow";
  };

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
              <span className="insight-period">2130/</span>847
            </div>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="insight-content">
            <span className="insight-label">Avg. Time/Q</span>
            <div className="insight-value time-insights">
              <div className="time-section">
                <span className="subject-label verbal">V</span>
                <div className="time-details">
                  <div
                    className={`time-value ${getSpeedIndicator(
                      timeData.verbal.actual,
                      timeData.verbal.target
                    )}`}
                  >
                    {timeData.verbal.actual}"
                    <div className="speed-indicator">
                      <SpeedometerIcon
                        ratio={timeData.verbal.actual / timeData.verbal.target}
                      />
                    </div>
                  </div>
                  <div className="target-time">
                    target: {timeData.verbal.target}"
                  </div>
                </div>
              </div>
              <div className="time-section">
                <span className="subject-label math">M</span>
                <div className="time-details">
                  <div
                    className={`time-value ${getSpeedIndicator(
                      timeData.math.actual,
                      timeData.math.target
                    )}`}
                  >
                    {timeData.math.actual}"
                    <div className="speed-indicator">
                      <SpeedometerIcon
                        ratio={timeData.math.actual / timeData.math.target}
                      />
                    </div>
                  </div>
                  <div className="target-time">
                    target: {timeData.math.target}"
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceInsights;
