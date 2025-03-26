import React, { useState, useEffect, useRef } from "react";
import { api } from "../../../services/api";
import "./PracticeQuestionInterface.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { formatMathExpression } from "../../../utils/mathUtils";

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
  onSubmit,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const questionContentRef = useRef(null);
  const [previouslyAnswered, setPreviouslyAnswered] = useState(false);
  const [previousAnswer, setPreviousAnswer] = useState(null);
  const [wasCorrect, setWasCorrect] = useState(false);

  // Check localStorage when question changes
  useEffect(() => {
    // Reset states when question changes
    setShowExplanation(false);

    // Check if this question was previously answered
    const storedQuestions = JSON.parse(
      localStorage.getItem("userQuestionStates") || "[]"
    );

    const existingQuestion = storedQuestions.find(
      (q) => q.questionId === question.id
    );

    if (existingQuestion && existingQuestion.isSolved) {
      setPreviouslyAnswered(true);
      setPreviousAnswer(existingQuestion.selectedOption);
      setWasCorrect(existingQuestion.isCorrect);
      setSelectedAnswer(existingQuestion.selectedOption);
      setShowExplanation(true);
    } else {
      // Important: Reset all states for new questions
      setPreviouslyAnswered(false);
      setPreviousAnswer(null);
      setWasCorrect(false);
      setSelectedAnswer(null);
    }
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
    if (!previouslyAnswered) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null && !previouslyAnswered) {
      const isCorrect = onSubmit ? onSubmit(selectedAnswer) : false;
      setShowExplanation(true);
      setWasCorrect(isCorrect);
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

  // Check if question has table or image
  const hasTable = question.html_table && question.html_table.trim() !== "";
  const hasImage = question.svg_image && question.svg_image.trim() !== "";
  console.log(hasTable, hasImage);
  console.log(question);

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
                className={`difficulty-indicator-bars difficulty-badge difficulty-${question.difficulty_level}`}
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
            {/* Table section */}
            {hasTable && (
              <div className="tables-container">
                <div
                  className="question-table"
                  dangerouslySetInnerHTML={{ __html: question.html_table }}
                />
              </div>
            )}

            {/* Image section */}
            {hasImage && (
              <div className="images-container">
                <div
                  className="question-image"
                  dangerouslySetInnerHTML={{ __html: question.svg_image }}
                />
              </div>
            )}

            {/* Passage section */}
            {question.passage && (
              <div className="passage-text">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    p: ({ node, className, children, ...props }) => {
                      return <p {...props}>{children}</p>;
                    },
                  }}
                >
                  {question.passage
                    .replace(/Text 1/g, "# Text 1\n\n")
                    .replace(/Text 2/g, "\n\n# Text 2\n\n")
                    .replace(/______\s*blank/g, " ______ ")
                    .replace(/______/g, " ______ ")
                    .replace(/==(.+?)==/g, " _**$1**_")}
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
              <div className="question-text">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    // Custom paragraph component to handle KaTeX spans
                    p: ({ node, children, ...props }) => {
                      // Check if the first child is a KaTeX span
                      const hasKatexFirst =
                        children &&
                        children[0] &&
                        React.isValidElement(children[0]) &&
                        children[0].props.className &&
                        children[0].props.className.includes("katex");

                      // If the first child is a KaTeX span, apply special styling
                      if (hasKatexFirst) {
                        return (
                          <p
                            {...props}
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            {/* Render the KaTeX span as a block element */}
                            {React.cloneElement(children[0], {
                              style: { display: "block", marginBottom: "10px" },
                            })}

                            {/* Render the rest of the children */}
                            {children.slice(1)}
                          </p>
                        );
                      }

                      // Otherwise, render the paragraph normally
                      return <p {...props}>{children}</p>;
                    },
                  }}
                >
                  {formatMathExpression(question.question_text)}
                </ReactMarkdown>
              </div>
            </div>
            <div className="answer-options">
              {question.choices.map((choice, index) => (
                <div
                  key={index}
                  className={`answer-option 
                    ${selectedAnswer === index ? "selected" : ""} 
                    ${
                      showExplanation && index === question.correct_answer_index
                        ? "correct"
                        : ""
                    } 
                    ${
                      showExplanation &&
                      selectedAnswer === index &&
                      index !== question.correct_answer_index
                        ? "incorrect"
                        : ""
                    }
                    ${previouslyAnswered ? "disabled" : ""}
                  `}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="option-text">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {formatMathExpression(choice)}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
            {!showExplanation && !previouslyAnswered && (
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
            {previouslyAnswered && (
              <div className="previously-answered-message">
                <p>
                  You've already answered this question{" "}
                  {wasCorrect ? "correctly" : "incorrectly"}.
                </p>
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
