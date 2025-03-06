import React from "react";
import "./QuestionNavigator.css";

const QuestionNavigator = ({ questions, currentQuestion, onSelect }) => {
  return (
    <div className="question-navigator">
      <div className="question-grid">
        {questions.map((q, index) => (
          <button
            key={index}
            className={`question-number ${
              index === currentQuestion ? "current" : ""
            } ${q.isIncorrect ? "incorrect" : ""} ${
              q.isBookmarked ? "bookmarked" : ""
            }`}
            onClick={() => onSelect(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionNavigator;
