import React from "react";
import "./PerformanceInsights.css";
import SpeedometerIcon from "../SpeedometerIcon/SpeedometerIcon";

const PerformanceInsights = () => {
  const timeData = {
    verbal: {
      target: 72, // 1.2 minutes in seconds
      actual: 84, // 1.4 minutes in seconds
    },
    math: {
      target: 80, // 1.6 minutes in seconds
      actual: 50, // 1.8 minutes in seconds
    },
  };

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return "00:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")} `;
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
                    <div className="time-text-group">
                      <span>{formatTime(timeData.verbal.actual)}</span>
                      <div className="target-time">
                        target: {formatTime(timeData.verbal.target)}
                      </div>
                    </div>
                    <div className="speed-indicator">
                      <SpeedometerIcon ratio={timeData.verbal.actual} />
                    </div>
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
                    <div className="time-text-group">
                      <span>{formatTime(timeData.math.actual)}</span>
                      <div className="target-time">
                        target: {formatTime(timeData.math.target)}
                      </div>
                    </div>
                    <div className="speed-indicator">
                      <SpeedometerIcon ratio={timeData.math.actual} />
                    </div>
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
