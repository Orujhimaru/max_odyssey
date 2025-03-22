import React, { useState, useEffect } from "react";
import { api } from "../../../services/api";
import "./PracticeQuestionInterface.css";
import ReactMarkdown from "react-markdown";

const PracticeQuestionInterface = ({
  question,
  onClose,
  onNextQuestion,
  onPreviousQuestion,
  hasNext = false,
  hasPrevious = false,
  questionNumber,
  onBookmark = () => {},
  isBookmarked,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // New state for tracking user's question interactions
  const [userQuestionState, setUserQuestionState] = useState({
    questionId: question.id,
    isBookmarked: isBookmarked || false,
    isSolved: false,
    isIncorrect: false,
    selectedOption: null,
  });

  // Add this at the beginning of the component
  console.log("Full question object:", question);

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowExplanation(true);
    }
  };

  // Update bookmark handler to use local state
  const handleBookmarkClick = () => {
    setUserQuestionState((prev) => {
      const newState = {
        ...prev,
        isBookmarked: !prev.isBookmarked,
      };

      // Update localStorage
      const storedQuestions = JSON.parse(
        localStorage.getItem("userQuestionStates") || "[]"
      );
      const existingIndex = storedQuestions.findIndex(
        (q) => q.questionId === question.id
      );

      if (existingIndex >= 0) {
        storedQuestions[existingIndex] = newState;
      } else {
        storedQuestions.push(newState);
      }

      localStorage.setItem(
        "userQuestionStates",
        JSON.stringify(storedQuestions)
      );
      return newState;
    });
  };

  return (
    <div className="practice-question-interface">
      <div className="practice-question-header">
        <div className="question-info">
          <div className="header-left">
            <span className="question-number">#{question.id}</span>
          </div>
          <div className="question-meta">
            <div className="difficulty-indicator">
              <span
                className={`difficulty-badge difficulty-${question.difficulty_level}`}
              >
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
              </span>
              <span className="difficulty-text">
                {question.difficulty_level === 1
                  ? "Easy"
                  : question.difficulty_level === 2
                  ? "Medium"
                  : "Hard"}
              </span>
            </div>
            {question.topic && <span className="topic">{question.topic}</span>}
            {question.subtopic && (
              <span className="topic">{question.subtopic}</span>
            )}
          </div>
        </div>
        <div className="header-actions">
          <div
            id="bookmark-action"
            style={{
              position: "absolute",
              right: "50px",
              top: "10px",
              zIndex: 9999,
              background: "red",
              color: "white",
              padding: "10px",
              border: "2px solid black",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
              pointerEvents: "auto",
            }}
            onClick={handleBookmarkClick}
          >
            <i
              className={`${
                userQuestionState.isBookmarked ? "fas" : "far"
              } fa-bookmark`}
            ></i>
            {" Bookmark"}
          </div>

          <div
            id="close-action"
            style={{
              position: "absolute",
              right: "10px",
              top: "10px",
              zIndex: 9999,
              background: "#333",
              color: "white",
              padding: "10px",
              border: "2px solid black",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
              pointerEvents: "auto",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <i className="fas fa-times"></i>
            {" Close"}
          </div>
        </div>
      </div>

      <div className="practice-question-content">
        <div className="question-area-interface">
          {/* Passage section */}
          {question.passage && (
            <div className="passage-text">
              <ReactMarkdown>
                {question.passage
                  .replace(/\\n/g, "\n")
                  .replace(/Text 1/g, "**Text 1**")
                  .replace(/Text 2/g, "**Text 2**")}
              </ReactMarkdown>
            </div>
          )}

          {/* Question text section */}
          <div className="question-prompt">
            <h2 className="question-title">Question:</h2>
            <div className="question-text">
              <ReactMarkdown>{question.question_text}</ReactMarkdown>
            </div>
          </div>

          <div className="answer-options">
            {question.choices.map((choice, index) => (
              <div
                key={index}
                className={`answer-option ${
                  selectedAnswer === index ? "selected" : ""
                } ${
                  showExplanation
                    ? index === question.correct_answer_index
                      ? "correct"
                      : selectedAnswer === index
                      ? "incorrect"
                      : ""
                    : ""
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                <div className="option-letter">
                  {String.fromCharCode(65 + index)}
                </div>
                <div className="option-text">{choice.slice(2).trim()}</div>
              </div>
            ))}
          </div>

          {!showExplanation && (
            <div className="submit-container">
              <button
                className="submit-button"
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
              >
                Submit Answer
              </button>
            </div>
          )}

          {showExplanation && (
            <div className="explanation-container">
              <h3>Explanation</h3>
              <p>{question.explanation}</p>
              <div className="correct-answer">
                Correct Answer:{" "}
                {String.fromCharCode(65 + question.correct_answer_index)} -{" "}
                {question.choices[question.correct_answer_index]}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="practice-question-footer">
        <div className="question-navigator-interface">
          <button
            onClick={onPreviousQuestion}
            disabled={!hasPrevious}
            className="nav-button prev"
          >
            Previous
          </button>
          <button
            onClick={onNextQuestion}
            disabled={!hasNext}
            className="nav-button next"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeQuestionInterface;
