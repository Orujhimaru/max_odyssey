import React, { useState, useEffect } from "react";
import { api } from "../../../services/api";
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
  const [fullQuestion, setFullQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Fetch the complete question data
  useEffect(() => {
    const fetchQuestionDetails = async () => {
      setLoading(true);
      try {
        // First try to use the question data we already have if it contains all needed fields
        if (question.question_text && question.choices) {
          console.log("Using existing question data:", question);
          setFullQuestion(question);
          setLoading(false);
          return;
        }

        // Otherwise fetch the full details
        console.log(`Fetching details for question ID: ${question.id}`);
        const data = await api.getQuestion(question.id);
        console.log("Fetched question details:", data);
        setFullQuestion(data);
      } catch (err) {
        console.error("Error fetching question details:", err);
        setError(
          `Could not load question details. Please try again later. (${err.message})`
        );

        // Fallback to using the partial question data we already have
        if (question) {
          console.log("Using partial question data as fallback");
          setFullQuestion(question);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionDetails();
  }, [question]);

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowExplanation(true);
    }
  };

  const handleBookmarkClick = async () => {
    if (onBookmark) {
      onBookmark(question.id);
    }
  };

  if (loading) {
    return (
      <div className="practice-question-interface">
        <div className="practice-question-header">
          <div className="question-info">
            <div className="header-left">
              <span className="question-number">#{questionNumber}</span>
            </div>
          </div>
          <div className="question-controls">
            <button className="close-button" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div className="loading-container">
          <p>Loading question details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="practice-question-interface">
        <div className="practice-question-header">
          <div className="question-info">
            <div className="header-left">
              <span className="question-number">#{questionNumber}</span>
            </div>
          </div>
          <div className="question-controls">
            <button className="close-button" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div className="error-container">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!fullQuestion) {
    return null;
  }

  return (
    <div className="practice-question-interface">
      <div className="practice-question-header">
        <div className="question-info">
          <div className="header-left">
            <span className="question-number">#{questionNumber}</span>
            <h2>{fullQuestion.question_text.split(".")[0]}</h2>
          </div>
          <div className="question-meta">
            <div className="difficulty-indicator">
              <span
                className={`difficulty-badge difficulty-${fullQuestion.difficulty_level}`}
              >
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
              </span>
              <span className="difficulty-text">
                Level {fullQuestion.difficulty_level}
              </span>
            </div>
            {fullQuestion.topic && (
              <span className="topic">{fullQuestion.topic}</span>
            )}
            {fullQuestion.subtopic && (
              <span className="topic">{fullQuestion.subtopic}</span>
            )}
          </div>
        </div>
        <div className="question-controls">
          <button className="bookmark-button" onClick={handleBookmarkClick}>
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
            <p>{fullQuestion.question_text}</p>
          </div>
          <div className="answer-options">
            {fullQuestion.choices.map((choice, index) => (
              <div
                key={index}
                className={`answer-option ${
                  selectedAnswer === index ? "selected" : ""
                } ${
                  showExplanation
                    ? index === fullQuestion.correct_answer_index
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
                <div className="option-text">{choice}</div>
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
              <p>{fullQuestion.explanation}</p>
              <div className="correct-answer">
                Correct Answer:{" "}
                {String.fromCharCode(65 + fullQuestion.correct_answer_index)} -{" "}
                {fullQuestion.choices[fullQuestion.correct_answer_index]}
              </div>
            </div>
          )}
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
