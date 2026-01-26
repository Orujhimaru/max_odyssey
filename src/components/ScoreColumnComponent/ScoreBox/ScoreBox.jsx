import React from "react";
import "./ScoreBox.css";

const ScoreBox = ({ title, score, type, isHighlighted }) => {
  return (
    <div className={`score-badge ${type} ${isHighlighted ? "highlighted" : ""}`}>
      <span className="badge-label">{type === "verbal" ? "V" : "M"}</span>
      <span className="badge-score">{score}</span>
    </div>
  );
};

export default ScoreBox;
