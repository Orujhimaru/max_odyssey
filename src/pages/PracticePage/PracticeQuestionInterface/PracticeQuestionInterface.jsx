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
    setSelectedAnswer(null);
    setPreviouslyAnswered(false);
    setPreviousAnswer(null);
    setWasCorrect(false);

    // First check if the question object from props has selected_option
    if (
      question.selected_option !== undefined &&
      question.selected_option !== null
    ) {
      console.log(
        "Found selected_option in question object:",
        question.selected_option
      );
      const selectedOption = Number(question.selected_option);
      const isCorrect = selectedOption === question.correct_answer_index;

      setPreviouslyAnswered(true);
      setPreviousAnswer(selectedOption);
      setWasCorrect(!question.incorrect || isCorrect);
      setSelectedAnswer(selectedOption);
      setShowExplanation(true);

      setUserQuestionState({
        questionId: question.id,
        isBookmarked: question.is_bookmarked || false,
        isSolved: true,
        isIncorrect: question.incorrect || !isCorrect,
        selectedOption: selectedOption,
      });
    }
    // If not in question object, check localStorage
    else {
      // Get user question states from localStorage
      const userQuestionStates = JSON.parse(
        localStorage.getItem("userQuestionStates") || "[]"
      );

      // Find if this question exists in localStorage
      const existingState = userQuestionStates.find(
        (q) => q.questionId === question.id
      );

      if (existingState && existingState.isSolved) {
        console.log("Found question state in localStorage:", existingState);
        const selectedOption = existingState.selectedOption;
        const isCorrect = selectedOption === question.correct_answer_index;

        setPreviouslyAnswered(true);
        setPreviousAnswer(selectedOption);
        setWasCorrect(!existingState.isIncorrect);
        setSelectedAnswer(selectedOption);
        setShowExplanation(true);

        setUserQuestionState({
          ...existingState,
          questionId: question.id,
        });
      }
      // If not found in localStorage, check if question.is_solved is true
      else if (question.is_solved) {
        console.log(
          "Question marked as solved in props, setting states accordingly"
        );
        // This handles backward compatibility with the backend data
        setPreviouslyAnswered(true);

        // For backward compatibility with old data structure
        const selectedOption =
          question.selected_option !== undefined
            ? Number(question.selected_option)
            : null;

        setPreviousAnswer(selectedOption);
        setWasCorrect(!question.incorrect);
        setSelectedAnswer(selectedOption);
        setShowExplanation(true);

        setUserQuestionState({
          questionId: question.id,
          isBookmarked: question.is_bookmarked || false,
          isSolved: true,
          isIncorrect: question.incorrect,
          selectedOption: selectedOption,
        });
      } else {
        // Initialize user question state for new questions
        setUserQuestionState({
          questionId: question.id,
          isBookmarked: question.is_bookmarked || false,
          isSolved: false,
          isIncorrect: false,
          selectedOption: null,
        });
      }
    }
  }, [question]);

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
  console.log("Has table:", hasTable, "Has image:", hasImage);
  console.log(question);

  // Check if an answer choice contains HTML
  const containsHtml = (text) => {
    if (!text) return false;
    return text.includes("<table") || text.includes("<figure");
  };

  // Log the question choices to diagnose the issue
  if (question.choices) {
    console.log("Question choices:", question.choices);
    question.choices.forEach((choice, index) => {
      console.log(`Choice ${index + 1}:`, choice);
      console.log(`Contains HTML:`, containsHtml(choice));
    });
  }

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

    // Call the original onClose function with refreshNeeded=true
    onClose(true);
  };

  // Update the function to process the passage HTML
  // const processPassageHtml = (html) => {
  //   if (!html) return "";

  //   // Replace HTML entities with actual characters
  //   let processed = html
  //     // First handle the em spaces (\u2003) that create extra gaps
  //     .replace(/\u2003/g, " ")
  //     // Then handle HTML entities
  //     .replace(/&ensp;/g, " ")
  //     .replace(/&emsp;/g, " ")
  //     // Add line breaks at semicolons and periods (but not if followed by quotation marks)
  //     .replace(/([;.])\s+(?!["'])/g, "$1<br><br>")
  //     // Clean up any multiple spaces
  //     .replace(/\s+/g, " ")
  //     // Finally handle line breaks
  //     .replace(/\n/g, "<br>");

  //   // If the passage doesn't have proper paragraph tags, wrap it
  //   if (!processed.includes("<p>")) {
  //     // Split by <br> tags and wrap each section in paragraph tags
  //     const paragraphs = processed.split(/<br\s*\/?>/i);
  //     processed = paragraphs
  //       .map((p) => (p.trim() ? `<p style="margin-bottom: 1em">${p}</p>` : ""))
  //       .join("    ");
  //   }

  //   return processed;
  // };

  return (
    <div className="practice-question-interface">
      <div className="practice-question-header">
        <div className="question-info">
          <div className="header-left">
            <span className="practice-question-number">#{question.id}</span>
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
            {/* Image section */}
            {question.svg_image && (
              <div className="images-container">
                {question.svg_image.startsWith("data:image") ? (
                  <img
                    src={question.svg_image}
                    alt="Question visual"
                    className="question-image"
                  />
                ) : (
                  <div
                    className="question-image"
                    dangerouslySetInnerHTML={{ __html: question.svg_image }}
                  />
                )}
              </div>
            )}
            {question.html_table && (
              <div className="images-container">
                <div
                  className="question-image"
                  dangerouslySetInnerHTML={{ __html: question.html_table }}
                />
              </div>
            )}
            {/* Passage section */}
            {question.passage && (
              <div className="passage-text">
                <div dangerouslySetInnerHTML={{ __html: question.passage }} />
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
                      const childArray = React.Children.toArray(children);

                      // Check if the first element is a KaTeX element
                      const firstElement = childArray[0];
                      const firstIsKatex =
                        React.isValidElement(firstElement) &&
                        firstElement.props &&
                        firstElement.props.className &&
                        firstElement.props.className.includes("katex");

                      // If the first element is not KaTeX, don't apply display:block to any KaTeX elements
                      if (!firstIsKatex) {
                        return <p {...props}>{children}</p>;
                      }

                      // Find indexes of KaTeX elements
                      const katexIndexes = [];
                      childArray.forEach((child, index) => {
                        if (
                          React.isValidElement(child) &&
                          child.props.className &&
                          child.props.className.includes("katex")
                        ) {
                          katexIndexes.push(index);
                        }
                      });

                      // Check if we have at least two KaTeX elements and if they're consecutive
                      const hasConsecutiveKatex =
                        katexIndexes.length >= 2 &&
                        katexIndexes[1] === katexIndexes[0] + 1;

                      // Apply styles only to first element, and to second if it's consecutive
                      return (
                        <div {...props}>
                          {React.Children.map(children, (child, index) => {
                            // Check if this is a KaTeX element
                            if (
                              React.isValidElement(child) &&
                              child.props.className &&
                              child.props.className.includes("katex")
                            ) {
                              // First element always gets block display
                              if (index === katexIndexes[0]) {
                                return React.cloneElement(child, {
                                  style: {
                                    display: "block",
                                    marginBottom: "10px",
                                  },
                                });
                              }

                              // Second element gets block display only if consecutive to first
                              if (
                                index === katexIndexes[1] &&
                                hasConsecutiveKatex
                              ) {
                                return React.cloneElement(child, {
                                  style: {
                                    display: "block",
                                    marginBottom: "10px",
                                  },
                                });
                              }
                            }

                            // Return all other elements unchanged
                            return child;
                          })}
                        </div>
                      );
                    },
                  }}
                >
                  {formatMathExpression(question.question_text)}
                </ReactMarkdown>
              </div>
            </div>
            <div className="answer-options">
              {question.choices.map((choice, index) => {
                // Determine if this option should be shown as correct or incorrect
                const isCorrectOption = index === question.correct_answer_index;
                const isSelectedOption =
                  selectedAnswer === index ||
                  (userQuestionState &&
                    userQuestionState.selectedOption === index);
                const showAsIncorrect =
                  showExplanation && isSelectedOption && !isCorrectOption;

                // For the letter label
                const optionLetterClass =
                  isCorrectOption && showExplanation
                    ? "option-letter correct-letter"
                    : showAsIncorrect
                    ? "option-letter incorrect-letter"
                    : "option-letter";

                return (
                  <div
                    key={index}
                    className={`answer-option 
                      ${isSelectedOption ? "selected" : ""} 
                      ${showExplanation && isCorrectOption ? "correct" : ""} 
                      ${showAsIncorrect ? "incorrect" : ""}
                      ${previouslyAnswered ? "disabled" : ""}
                      ${isOptionCrossed(index) ? "crossed" : ""}
                    `}
                    onClick={() =>
                      isCrossModeActive()
                        ? toggleCrossOption(index)
                        : !previouslyAnswered && handleAnswerSelect(index)
                    }
                  >
                    <div className={optionLetterClass}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div className="option-text">
                      {choice.slice(2).trim().startsWith("<figure") ||
                      choice.slice(2).trim().startsWith("<table") ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: choice.slice(2) }}
                        />
                      ) : choice.slice(2).trim().startsWith("data:image") ? (
                        <img
                          src={choice.slice(2).trim()}
                          alt="Answer option visual"
                          className="option-image"
                        />
                      ) : (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {choice.slice(2)}
                        </ReactMarkdown>
                      )}
                    </div>

                    {/* Indicators for correct/incorrect answers */}
                    {showExplanation && isCorrectOption && (
                      <div className="correct-indicator">✓</div>
                    )}
                    {showAsIncorrect && (
                      <div className="incorrect-indicator">✗</div>
                    )}
                  </div>
                );
              })}
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
              <div
                className={`previously-answered-message ${
                  wasCorrect ? "correct" : "incorrect"
                }`}
              >
                <p>
                  You've already answered this question{" "}
                  {!wasCorrect && (
                    <>
                      . The correct answer is{" "}
                      <strong>
                        {String.fromCharCode(
                          65 + question.correct_answer_index
                        )}
                      </strong>
                    </>
                  )}
                  .
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
