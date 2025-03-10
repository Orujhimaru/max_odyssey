import React, { useState } from "react";
import QuestionNavigator from "./QuestionNavigator";
import { mockQuestions } from "../../data/mockQuestions";
import "./TestReview.css";

const TestReview = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);

  const question = mockQuestions[currentQuestion];

  return (
    <div className="test-review-container">
      {/* Header Section */}
      <div className="test-review-header">
        <div className="test-info">
          <h2>Practice Test #3</h2>
          <span>Date: Apr 15, 2024</span>
        </div>
        <h2 className="test-review-header-h2 ">
          Section 1, Module 1: Reading and Writing
        </h2>
        {/* <div className="test-stats">
            <span>Date: Apr 15, 2024</span>
            {/* <span>Score: 720</span> */}
        {/* <span>Time: 1h 45m</span>    </div> */}
      </div>

      {/* Navigation Button */}
      <div className="navigation-controls">
        <button
          className="nav-button"
          onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
        >
          <i className="fas fa-chevron-left"></i>
          Previous
        </button>

        <button
          className="question-counter"
          onClick={() => setIsNavigatorOpen(!isNavigatorOpen)}
        >
          Question {currentQuestion + 1} of {mockQuestions.length}
          <i
            className={`review-dropdown fas fa-chevron-${
              isNavigatorOpen ? "up" : "down"
            }`}
          ></i>
        </button>

        <button
          className="nav-button"
          onClick={() =>
            setCurrentQuestion((prev) =>
              Math.min(mockQuestions.length - 1, prev + 1)
            )
          }
          disabled={currentQuestion === mockQuestions.length - 1}
        >
          Next
          <i className="fas fa-chevron-right"></i>
        </button>

        {isNavigatorOpen && (
          <QuestionNavigator
            questions={mockQuestions}
            currentQuestion={currentQuestion}
            onSelect={(index) => {
              setCurrentQuestion(index);
              setIsNavigatorOpen(false);
            }}
          />
        )}
      </div>

      {/* Main Content */}

      <div className="test-review-content">
        {/* Question Section */}
        <div className="question-section">
          <div className="question-type">
            <div className="dif-indicator-container">
              <span
                className={`difficulty-indicator ${question.difficulty.toLowerCase()}`}
              >
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
              </span>
            </div>
            <span className="topic">{question.topic}</span>
            <span className="subtopic">{question.subtopic}</span>
          </div>

          {question.passage && (
            <div className="passage">{question.passage}</div>
          )}
          <div className="question">
            <p>{question.question}</p>
            <div className="choices">
              {question.choices.map((choice, index) => {
                const [letter, ...text] = choice.split(") ");
                return (
                  <div
                    key={index}
                    className={`choice ${
                      choice.startsWith(question.correctAnswer)
                        ? "correct"
                        : choice.startsWith(question.userAnswer)
                        ? "incorrect"
                        : ""
                    }`}
                  >
                    <span className="choice-letter">{letter}</span>
                    <span>{text.join(") ")}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Explanation Section */}
        <div className="explanation-section">
          <h3>Explanation</h3>
          <p>{question.explanation}</p>
          <div className="question-actions">
            <button className="bookmark-btn">
              <i
                className={`fas fa-bookmark ${
                  question.isBookmarked ? "active" : ""
                }`}
              ></i>
              Bookmark
            </button>
            <button className="report-btn">
              <i className="fas fa-flag"></i>
              Report Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestReview;
