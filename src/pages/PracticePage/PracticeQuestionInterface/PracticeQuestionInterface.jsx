import React, { useState, useEffect, useRef } from "react";
import { api } from "../../../services/api";
import "./PracticeQuestionInterface.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  const questionContentRef = useRef(null);

  // Reset selected answer and explanation when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, [question.id]);

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

  // Wrap the navigation handlers to include scrolling
  const handleNext = () => {
    onNextQuestion();
    if (questionContentRef.current) {
      questionContentRef.current.scrollTo({
        top: 0,
      });
    }
  };

  const handlePrevious = () => {
    onPreviousQuestion();
    if (questionContentRef.current) {
      questionContentRef.current.scrollTo({
        top: 0,
      });
    }
  };

  return (
    <div className="practice-question-interface">
      <div className="practice-question-header">
        <div className="question-info">
          <div className="header-left">
            <span className="question-number">#{question.id}</span>
          </div>
          <div className="question-meta">
            <div className="difficulty-indicator-interface">
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
      </div>

      <div className="practice-question-content" ref={questionContentRef}>
        <div className="question-area-interface">
          <div className="question-text-flex">
            {/* Passage section */}
            {question.passage && (
              <div className="passage-text">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ node, className, children, ...props }) => {
                      // if (className === "passage-title") {
                      //   return (
                      //     <p className="passage-title" {...props}>
                      //       {children}
                      //     </p>
                      //   );
                      // } else if (className === "underline") {
                      //   return <span className="underline">{children}</span>;
                      // }
                      return <p {...props}>{children}</p>;
                    },
                  }}
                >
                  {question.passage
                    .replace(/Text 1/g, "# Text 1\n\n")
                    .replace(/Text 2/g, "\n\n# Text 2\n\n")
                    .replace(/==(.+?)==/g, "_**$1**_")}
                </ReactMarkdown>
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

          {/* Question text section */}

          <div className="question-flex-1">
            <div className="question-prompt">
              {/* <h2 className="question-title interface">Question:</h2> */}
              <div className="question-text">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {question.question_text}
                </ReactMarkdown>
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
          </div>
        </div>
      </div>

      <div className="practice-question-footer">
        <div className="question-navigator-interface">
          <button
            onClick={handlePrevious}
            disabled={!hasPrevious}
            className="nav-button prev"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
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
