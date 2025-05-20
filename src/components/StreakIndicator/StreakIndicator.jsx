import React from "react";
import "./StreakIndicator.css";
import targetIcon from "../../assets/target.svg";

const StreakIndicator = ({ streak = 26, progress = 0.7 }) => {
  // Ensure progress is between 0 and 1
  const normalizedProgress = Math.max(0, Math.min(1, progress));

  return (
    <div className="streak-indicator">
      <div className="streak-icon">
        <img className="streak-icon-img" src={targetIcon} alt="Target icon" />
      </div>

      <div className="streak-number">{streak}</div>

      <div className="streak-progress-container">
        <div
          className="streak-progress-fill"
          style={{ width: `${normalizedProgress * 100}%` }}
        />
      </div>
    </div>
  );
};

export default StreakIndicator;
