import React from "react";
import "./PracticeSwitch.css";

const PracticeSwitch = ({ isVerbal, onChange }) => {
  return (
    <div className="practice-switch-container">
      <button
        className={`practice-switch ${isVerbal ? "verbal" : "math"}`}
        onClick={() => onChange(!isVerbal)}
      >
        <div className="switch-track">
          <span className="switch-label verbal">Verbal</span>
          <span className="switch-label math">Math</span>
        </div>
        <div className="switch-thumb"></div>
      </button>
    </div>
  );
};

export default PracticeSwitch;
