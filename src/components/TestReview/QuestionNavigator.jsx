import React from "react";
import "./QuestionNavigator.css";

const QuestionNavigator = ({ questions, currentQuestion, onSelect }) => {
  const getQuestionStatus = (index) => {
    const question = questions[index];
    if (question.isBookmarked) return "marked";
    if (question.userAnswer) return "answered";
    return "unanswered";
  };

  return (
    <div className="question-navigator-review">
      <h3>Question Navigator</h3>

      <div className="question-status">
        <div className="status-item">
          <div className="status-indicator answered"></div>
          <span className="status-label">Answered</span>
        </div>
        <div className="status-item">
          <div className="status-indicator unanswered"></div>
          <span className="status-label">Unanswered</span>
        </div>
        <div className="status-item">
          <div className="status-indicator marked"></div>
          <span className="status-label">Marked</span>
        </div>
      </div>

      <div className="question-grid">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`question-number ${getQuestionStatus(index)} ${
              index === currentQuestion ? "current" : ""
            }`}
            onClick={() => onSelect(index)}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionNavigator;
