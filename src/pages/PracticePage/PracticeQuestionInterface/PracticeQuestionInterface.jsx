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
            <div className="difficulty-indicator">
              <span className={`difficulty-badge ${question.difficulty}`}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
              </span>
              <span className="difficulty-text">{question.difficulty}</span>
            </div>
            {question.topics?.map((topic) => (
              <span key={topic} className="topic">
                {topic}
              </span>
            ))}
          </div>
        </div>
        <div className="question-controls">
          <button className="bookmark-button" disabled>
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
            <p>
              The table below shows the distribution of test scores for two
              different classes.
            </p>
            <div className="question-table">
              <table>
                <thead>
                  <tr>
                    <th>Score Range</th>
                    <th>Class A</th>
                    <th>Class B</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>90-100</td>
                    <td>15%</td>
                    <td>25%</td>
                  </tr>
                  <tr>
                    <td>80-89</td>
                    <td>30%</td>
                    <td>35%</td>
                  </tr>
                  <tr>
                    <td>70-79</td>
                    <td>40%</td>
                    <td>30%</td>
                  </tr>
                  <tr>
                    <td>Below 70</td>
                    <td>15%</td>
                    <td>10%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              What is the percentage of students who scored 80 or above in Class
              B?
            </p>
          </div>
          <div className="answer-options">
            <div
              className={`answer-option ${
                selectedAnswer === "A" ? "selected" : ""
              }`}
              onClick={() => setSelectedAnswer("A")}
            >
              <div className="option-letter">A</div>
              <div className="option-text">50%</div>
            </div>
            <div
              className={`answer-option ${
                selectedAnswer === "B" ? "selected" : ""
              }`}
              onClick={() => setSelectedAnswer("B")}
            >
              <div className="option-letter">B</div>
              <div className="option-text">60%</div>
            </div>
            <div
              className={`answer-option ${
                selectedAnswer === "C" ? "selected" : ""
              }`}
              onClick={() => setSelectedAnswer("C")}
            >
              <div className="option-letter">C</div>
              <div className="option-text">65%</div>
            </div>
            <div
              className={`answer-option ${
                selectedAnswer === "D" ? "selected" : ""
              }`}
              onClick={() => setSelectedAnswer("D")}
            >
              <div className="option-letter">D</div>
              <div className="option-text">75%</div>
            </div>
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
