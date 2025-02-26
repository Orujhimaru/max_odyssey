import React from "react";
import { getPercentile } from "../../../utils/scorePercentiles";
import { useCountUp } from "../../../hooks/useCountUp";
import "./PredictedScore.css";

const PredictedScore = ({ verbalScore, mathScore }) => {
  // Round to nearest 10
  const roundToTen = (num) => Math.round(num / 10) * 10;

  const roundedVerbal = roundToTen(verbalScore);
  const roundedMath = roundToTen(mathScore);
  const predictedScore = roundedVerbal + roundedMath;
  const targetPercentile = getPercentile(predictedScore);

  const animatedScore = useCountUp(predictedScore, 1500, 400);
  const animatedPercentile = useCountUp(targetPercentile, 1500, 1);

  return (
    <div className="predicted-score-container">
      <div className="score-header">
        <div className="score-header-gap">
          <div className="score-header-flex">
            <div className="digital-sat">Digital SAT</div>

            <h3>
              Predicted Total Score
              <i className="fas fa-crown"></i>
            </h3>
          </div>
        </div>
        <div className="score-details">
          {/* <span className="score-label total">Total:</span> */}

          <div className="predicted-flex column">
            <div className="predicted-flex center">
              <span className="score-value">{animatedScore}</span>
              <span className="percentile-badge">
                {animatedPercentile}th
              </span>{" "}
            </div>
            <span className="score-max-min">(400-1600)</span>
          </div>

          <div className="predicted-flex score-800">
            <div className="score-item">
              <span className="score-label">Verbal</span>
              <span className="score-value verbal">{roundedVerbal}</span>
            </div>
            <div className="score-item">
              <span className="score-label">Math</span>
              <span className="score-value math">{roundedMath}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="percentile-footnote">
        If a student's score is in the 75th percentile, about 75% of a
        comparison group achieved scores at or below that student's score
      </div>
    </div>
  );
};

export default PredictedScore;
