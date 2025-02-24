import React from "react";
import "./PredictedScore.css";

const PredictedScore = ({ verbalScore, mathScore }) => {
  // Round to nearest 10
  const roundToTen = (num) => Math.round(num / 10) * 10;

  const roundedVerbal = roundToTen(verbalScore);
  const roundedMath = roundToTen(mathScore);
  const predictedScore = roundedVerbal + roundedMath;

  return (
    <div className="predicted-score-container">
      <div className="score-header">
        <h3>Predicted Total Score</h3>
        <div className="score-details">
          <div className="score-item">
            <span className="score-label">Verbal</span>
            <span className="score-value verbal">{roundedVerbal}</span>
          </div>
          <div className="score-item">
            <span className="score-label">Math</span>
            <span className="score-value math">{roundedMath}</span>
          </div>
          <div className="score-item predicted">
            <span className="score-label">Total</span>
            <span className="score-value">{predictedScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictedScore;
