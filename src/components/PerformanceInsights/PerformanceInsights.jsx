import React from "react";
import "./PerformanceInsights.css";

const PerformanceInsights = () => {
  const timeData = {
    verbal: {
      target: 72, // 1.2 minutes in seconds
      actual: 1, // 1.4 minutes in seconds
    },
    math: {
      target: 96, // 1.6 minutes in seconds
      actual: 118, // 1.8 minutes in seconds
    },
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const SpeedometerIcon = ({ ratio }) => {
    const [currentAngle, setCurrentAngle] = React.useState(-180);

    React.useEffect(() => {
      // Start from leftmost position (-180 degrees)
      setCurrentAngle(-180);

      // Calculate final angle
      const actualTime = ratio;
      const MAX_TIME = 120;
      const normalizedTime = Math.min(actualTime, MAX_TIME);
      const targetAngle = -180 + (normalizedTime / MAX_TIME) * 180;

      // Animate to final position after a brief delay
      const timer = setTimeout(() => {
        setCurrentAngle(targetAngle);
      }, 200); // Slightly longer delay for better visibility

      return () => clearTimeout(timer);
    }, [ratio]);

    return (
      <svg viewBox="0 0 100 60" className="speedometer-icon">
        {/* Gray background arc */}
        <path
          d="M10 50 A40 40 0 0 1 90 50"
          className="speedometer-bg"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Colored sections - perfect half circles */}
        <path
          d="M10 50 A40 40 0 0 1 37 20"
          className="speed-section fast"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M37 20 A40 40 0 0 1 63 20"
          className="speed-section okay"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M63 20 A40 40 0 0 1 90 50"
          className="speed-section slow"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Needle */}
        <g
          transform={`rotate(${currentAngle + 90}, 50, 50)`}
          className="speedometer-needle-group"
        >
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="15"
            strokeWidth="2"
            className="speedometer-needle"
          />
          <circle cx="50" cy="50" r="3" className="speedometer-center" />
        </g>
      </svg>
    );
  };

  const getSpeedIndicator = (actual, target) => {
    if (actual <= target * 0.7) return "fast";
    if (actual <= target) return "okay";
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
              847<span className="insight-period">/ 2130 </span>
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
                    {formatTime(timeData.verbal.actual)}
                    <div className="speed-indicator">
                      <SpeedometerIcon ratio={timeData.verbal.actual} />
                    </div>
                  </div>
                  <div className="target-time">
                    target: {formatTime(timeData.verbal.target)}
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
                    {formatTime(timeData.math.actual)}
                    <div className="speed-indicator">
                      <SpeedometerIcon ratio={timeData.math.actual} />
                    </div>
                  </div>
                  <div className="target-time">
                    target: {formatTime(timeData.math.target)}
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
