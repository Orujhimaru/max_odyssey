import React from "react";
import { VerbalIcon, MathIcon } from "../../Icons/SubjectIcons";
import "./ScoreBox.css";

const ScoreBox = ({ title, score, improvement, type, isHighlighted }) => {
  const isIncrease = improvement >= 0;

  return (
    <div className={`score-box ${type}`}>
      <h2>
        <div
          className={`subject-icon ${type} ${
            isHighlighted ? "highlighted" : ""
          }`}
        >
          {type === "verbal" ? <VerbalIcon /> : <MathIcon />}
        </div>
        <span>average</span>
      </h2>
      <div className={`score-row ${type}`}>
        <h3 className={`score ${type}`}>{score}</h3>
        <div className={`improvement ${isIncrease ? "increase" : "decrease"}`}>
          <div className={`triangle ${isIncrease ? "increase" : "decrease"}`} />
          <span>
            {isIncrease ? "+" : "-"}
            {Math.abs(improvement)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScoreBox;
