import React, { useState, useEffect, useRef } from "react";
import "./PracticeQuestionInterface.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
// import "katex/dist/katex.min.css";
import { formatMathExpression } from "../../../utils/mathUtils";
import { api } from "../../../services/api"; // Import the API service

const PracticeQuestionInterface = ({
  question,
  onClose,
  onNextQuestion,
  onPreviousQuestion,
  hasNext = false,
  hasPrevious = false,
  questionNumber,
  isBookmarked,
  onSubmit,
  onBookmark,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const questionContentRef = useRef(null);
  const [previouslyAnswered, setPreviouslyAnswered] = useState(false);
  const [previousAnswer, setPreviousAnswer] = useState(null);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [crossedOptions, setCrossedOptions] = useState({});

  // New state for tracking user's question interactions
  const [userQuestionState, setUserQuestionState] = useState({
    questionId: question.id,
    isBookmarked: isBookmarked || false,
    isSolved: false,
    isIncorrect: false,
    selectedOption: null,
  });
  console.log("State:", userQuestionState); // Correct - will show the object properties

  // Update the useEffect that handles question state
  useEffect(() => {
    // Reset states when question changes
    setShowExplanation(false);

    // Check if this question was previously answered
    console.log("Question data:", question);
    console.log("is_solved:", question.is_solved);
    console.log("selected_option:", question.selected_option);

    if (question.is_solved) {
      console.log("Question was previously solved, setting states accordingly");
      setPreviouslyAnswered(true);

      // Convert selected_option from sql.NullInt32 to a regular number
      const selectedOption = question.selected_option
        ? Number(question.selected_option)
        : null;
      setPreviousAnswer(selectedOption);
      setWasCorrect(!question.incorrect);
      setSelectedAnswer(selectedOption);
      setShowExplanation(true); // Show explanation for previously solved questions

      // Update user question state
      setUserQuestionState({
        ...userQuestionState,
        questionId: question.id,
        isBookmarked: question.is_bookmarked || false,
        isSolved: true,
        isIncorrect: question.incorrect,
        selectedOption: selectedOption,
      });
    } else {
      // Reset all states for new questions
      setPreviouslyAnswered(false);
      setPreviousAnswer(null);
      setWasCorrect(false);
      setSelectedAnswer(null);

      // Initialize user question state for new questions
      setUserQuestionState({
        questionId: question.id,
        isBookmarked: question.is_bookmarked || false,
        isSolved: false,
        isIncorrect: false,
        selectedOption: null,
      });
    }
  }, [
    question.id,
    question.is_solved,
    question.selected_option,
    question.incorrect,
    question.is_bookmarked,
  ]);

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
      return newState;
    });
    onBookmark(question.id);
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

  const toggleCrossMode = () => {
    const currentCrossMode = crossedOptions[question.id]?.crossMode || false;
    setCrossedOptions({
      ...crossedOptions,
      [question.id]: {
        ...crossedOptions[question.id],
        crossMode: !currentCrossMode,
      },
    });
  };

  const toggleCrossOption = (optionId) => {
    if (!crossedOptions[question.id]?.crossMode) return;

    const currentCrossed = crossedOptions[question.id]?.crossed || [];
    const newCrossed = currentCrossed.includes(optionId)
      ? currentCrossed.filter((id) => id !== optionId)
      : [...currentCrossed, optionId];

    setCrossedOptions({
      ...crossedOptions,
      [question.id]: {
        ...crossedOptions[question.id],
        crossed: newCrossed,
      },
    });
  };

  const isOptionCrossed = (optionId) => {
    return crossedOptions[question.id]?.crossed?.includes(optionId) || false;
  };

  const isCrossModeActive = () => {
    return crossedOptions[question.id]?.crossMode || false;
  };

  // Handle close with API call
  const handleClose = async () => {
    try {
      // Get user question states from localStorage
      const userQuestionStates = JSON.parse(
        localStorage.getItem("userQuestionStates") || "[]"
      );

      // Only send if there's data to send
      if (userQuestionStates.length > 0) {
        console.log("Sending user question states to API:", userQuestionStates);

        // Use the new API method
        await api.batchUpdateQuestions(userQuestionStates);

        // Clear localStorage on success
        localStorage.removeItem("userQuestionStates");
        console.log("Questions synced successfully");
      }
    } catch (error) {
      console.error("Error saving user question states:", error);
    }

    // Call the original onClose function
    onClose();
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

        {/* Update the close button to use our new handler */}
        <div className="header-right">
          <button
            className="close-button"
            onClick={handleClose}
            title="Close question and save progress"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
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
            <div className="practice-actions">
              <div
                onClick={() => {
                  console.log("BOOKMARK DIV CLICKED");
                  handleBookmarkClick();
                }}
                style={{
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "10px",
                  padding: "5px",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={isBookmarked ? "gold" : "none"}
                  stroke={isBookmarked ? "gold" : "currentColor"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>

              <div
                className={`cross-button ${
                  isCrossModeActive() ? "active" : ""
                }`}
                onClick={toggleCrossMode}
                title="Toggle cross-out mode"
                style={{
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "10px",
                  padding: "5px",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                <span className="cross-text">Abc</span>
              </div>

              {isCrossModeActive() && (
                <div
                  className="cross-mode-indicator"
                  style={{ marginLeft: "10px" }}
                >
                  Click on options to cross them out
                </div>
              )}
            </div>
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
                        React.isValidElement(children[0]) &&
                        children[0].props.className &&
                        children[0].props.className.includes("katex");

                      // Check if the second child is also a KaTeX span
                      const hasKatexSecond =
                        React.isValidElement(children[1]) &&
                        children[1].props.className &&
                        children[1].props.className.includes("katex");

                      // If the first child is a KaTeX span, apply special styling
                      if (hasKatexFirst) {
                        // Special case for question ID 2309 - don't use flex
                        return (
                          <div {...props}>
                            {/* Render the KaTeX span as a block element */}
                            {React.cloneElement(children[0], {
                              style: {
                                display: "block",
                                marginBottom: "10px",
                              },
                            })}

                            {/* If second child is also KaTeX, render it as block too */}
                            {hasKatexSecond
                              ? React.cloneElement(children[1], {
                                  style: {
                                    display: "block",
                                    marginBottom: "10px",
                                  },
                                })
                              : null}

                            {/* Group all remaining children in a single div */}
                            {children.length > (hasKatexSecond ? 2 : 1) && (
                              <div className="question-text-content">
                                <p>{children.slice(hasKatexSecond ? 2 : 1)}</p>
                              </div>
                            )}
                          </div>
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
                    ${isOptionCrossed(index) ? "crossed" : ""}
                  `}
                  onClick={() =>
                    isCrossModeActive()
                      ? toggleCrossOption(index)
                      : !previouslyAnswered && handleAnswerSelect(index)
                  }
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
