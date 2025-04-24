import React from "react";
import "./PerformanceInsights.css";
import Practice from "../../assets/Group 43.svg";

const PerformanceInsights = () => {
  const timeData = {
    verbal: {
      target: 71, // Target seconds per question
      actual: 84, // 1:24 actual seconds per question
      diff: -12, // Seconds behind target (negative means slower)
    },
    math: {
      target: 95, // Target seconds per question
      actual: 105, // 0:50 actual seconds per question
      diff: 30, // Seconds ahead of target (positive is faster)
    },
  };

  // The full bar represents 120 seconds (2 minutes)
  const TOTAL_BAR_TIME = 120;
  // Each segment represents 30 seconds
  const SEGMENT_TIME = 30;

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return "00:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const renderPerformanceBar = (actual, target, type) => {
    // Calculate fill percentage based on actual time as a portion of 120 seconds
    const fillPercentage = Math.min(100, (actual / TOTAL_BAR_TIME) * 100);

    // Define green zone based on target time rather than fixed segments
    // For verbal: green up to 71 seconds (59.17% of bar)
    // For math: green up to 95 seconds (79.17% of bar)
    const greenZonePercentage = (target / TOTAL_BAR_TIME) * 100;

    // Calculate width of green and red parts within the filled area
    let greenWidth = 0;
    let redWidth = 0;

    if (fillPercentage <= greenZonePercentage) {
      // All filled portion is within green zone
      greenWidth = fillPercentage;
      redWidth = 0;
    } else {
      // Fill extends into red zone
      greenWidth = greenZonePercentage;
      redWidth = fillPercentage - greenZonePercentage;
    }

    return (
      <div className="performance-bar-container">
        <div className="performance-bar">
          {/* Background segments for visual separation */}
          <div className="bar-segment"></div>
          <div className="bar-segment"></div>
          <div className="bar-segment"></div>
          <div className="bar-segment"></div>

          {/* Green fill (up to the target) */}
          {greenWidth > 0 && (
            <div
              className="bar-fill green"
              style={{
                width: `${greenWidth}%`,
                left: "0%",
              }}
            ></div>
          )}

          {/* Red fill (after the target) */}
          {redWidth > 0 && (
            <div
              className="bar-fill red"
              style={{
                width: `${redWidth}%`,
                left: `${greenZonePercentage}%`,
              }}
            ></div>
          )}
        </div>
      </div>
    );
  };

  const formatDiffTime = (diff) => {
    const absSeconds = Math.abs(diff);
    const minutes = Math.floor(absSeconds / 60);
    const seconds = absSeconds % 60;
    return `${diff > 0 ? "+" : "-"}${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="insights-container">
      {/* <div className="insights-header">
        <h3>Performance Insights</h3>
      </div> */}

      <div className="insights-grid">
        <div className="insight-card-mini-container">
          <div className="insight-card">
            <div className="insight-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="insight-content">
              <span className="insight-label">Score Growth</span>
              <div className="insight-value positive">+180</div>
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
        </div>

        <div className="insight-card timerr">
          <div className="insight-icon-container">
            <div className="insight-icon">
              <i className="fas fa-clock"></i>
            </div>
            <span className="insight-label">Your Speed</span>
          </div>
          <div className="insight-content timerr">
            <div className="insight-value time-insights">
              <div className="time-section">
                <div className="subject-label-container">
                  <span className="subject-label verbal">V</span>
                </div>
                <div className="time-details">
                  <div className="time-value verbal-time">
                    <div className="time-text-group">
                      <span className="speed-time">
                        {formatTime(timeData.verbal.actual)}
                      </span>
                      <div className="target-time-indicator">
                        <img
                          src={Practice}
                          alt="target"
                          className="target-icon"
                        />{" "}
                        <span className="margin-left">
                          {formatTime(timeData.math.target)}
                        </span>
                      </div>
                    </div>
                    {renderPerformanceBar(
                      timeData.verbal.actual,
                      timeData.verbal.target,
                      "verbal"
                    )}
                  </div>
                </div>
              </div>

              <div className="time-section">
                <div className="subject-label-container">
                  <span className="subject-label math">M</span>
                </div>
                <div className="time-details">
                  <div className="time-value math-time">
                    <div className="time-text-group">
                      <span className="speed-time">
                        {formatTime(timeData.math.actual)}
                      </span>
                      <div className="target-time-indicator">
                        <img
                          src={Practice}
                          alt="target"
                          className="target-icon"
                        />

                        <span>{formatTime(timeData.math.target)}</span>
                      </div>
                    </div>
                    {renderPerformanceBar(
                      timeData.math.actual,
                      timeData.math.target,
                      "math"
                    )}
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
