import React, { useState } from "react";
import "./PracticeQuestionInterface.css";

const PracticeQuestionInterface = ({
  question,
  onClose,
  onNext,
  onPrevious,
  questionNumber,
  onBookmark,
  isBookmarked,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isMarked, setIsMarked] = useState(false);

  return (
    <div className="practice-question-interface">
      <div className="practice-question-header">
        <div className="question-info">
          <div className="header-left">
            <span className="question-number">#{questionNumber}</span>
            <h2>{question.title}</h2>
          </div>
          <div className="question-meta">
            <span className={`subject-badge ${question.type}`}>
              {question.type === "math" ? "M" : "V"}
            </span>
            <span className="difficulty">{question.difficulty}</span>
            {question.topics?.map((topic) => (
              <span key={topic} className="topic">
                {topic}
              </span>
            ))}
          </div>
        </div>
        <div className="question-controls">
          <button
            className={`bookmark-button ${isBookmarked ? "bookmarked" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onBookmark(question.id);
            }}
          >
            <i className={`${isBookmarked ? "fas" : "far"} fa-bookmark`}></i>
          </button>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div className="practice-question-content">
        <div className="question-area">
          <div className="question-text">
            <p>{question.title}</p>
          </div>
          <div className="answer-options">
            {question.options?.map((option) => (
              <div
                key={option.id}
                className={`answer-option ${
                  selectedAnswer === option.id ? "selected" : ""
                }`}
                onClick={() => setSelectedAnswer(option.id)}
              >
                <div className="option-letter">{option.id}</div>
                <div className="option-text">{option.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="practice-question-footer">
        <button className="nav-button previous" onClick={onPrevious}>
          <i className="fas fa-chevron-left"></i> Previous
        </button>
        <button className="nav-button next" onClick={onNext}>
          Next <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default PracticeQuestionInterface;
