import React, { useState, useEffect, useRef } from "react";
import "./TestInterface.css";
import { api } from "../../services/api";
import LoadingScreen from "./LoadingScreen";

const TestInterface = ({ testType, onExit }) => {
  const [examData, setExamData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [userAnswers, setUserAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState([]);
  const [crossedOptions, setCrossedOptions] = useState({});
  const [timeRemaining, setTimeRemaining] = useState("2:45:00");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [navigatorOpen, setNavigatorOpen] = useState(false);

  // Debug ref to track state changes
  const debugRef = useRef({
    selectedAnswers: {},
    userAnswers: {},
  });

  // Helper function to generate a unique key for a question
  const getQuestionKey = (moduleIndex, questionIndex, questionId) => {
    // Use the question ID if available, otherwise create a composite key
    return questionId
      ? `q_${questionId}`
      : `m_${moduleIndex}_q_${questionIndex}`;
  };

  // Load saved answers from localStorage when component mounts
  useEffect(() => {
    const savedAnswers = localStorage.getItem("testUserAnswers");
    console.log("Loading saved answers from localStorage:", savedAnswers);

    if (savedAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedAnswers);
        setUserAnswers(parsedAnswers);

        // Also populate the selectedAnswers state from the loaded answers
        const answers = {};
        Object.values(parsedAnswers).forEach((answer) => {
          if (answer) {
            // Create question key using our helper function
            const questionKey = getQuestionKey(
              answer.module_index,
              answer.question_index,
              answer.question_id
            );
            answers[questionKey] = answer.selected_option;
          }
        });

        console.log("Loaded answers mapped to selectedAnswers:", answers);
        setSelectedAnswers(answers);

        // Update debug ref
        debugRef.current.selectedAnswers = answers;
        debugRef.current.userAnswers = parsedAnswers;
      } catch (e) {
        console.error("Error parsing saved answers:", e);
      }
    }
  }, []);

  // Update debug ref when selectedAnswers changes
  useEffect(() => {
    debugRef.current.selectedAnswers = selectedAnswers;
    console.log("selectedAnswers updated:", selectedAnswers);
  }, [selectedAnswers]);

  // Update debug ref when userAnswers changes
  useEffect(() => {
    debugRef.current.userAnswers = userAnswers;
    console.log("userAnswers updated:", userAnswers);
  }, [userAnswers]);

  // Fetch exam data when component mounts
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setLoading(true);

        // Check if we're continuing an existing test
        if (testType.type === "continue" && testType.examData) {
          console.log("Continuing existing test:", testType.examData);

          // Use the provided exam data for continuing
          const examData = testType.examData;

          // Validate the data
          if (examData && examData.exam_data && examData.exam_data.length > 0) {
            setExamData(examData);

            // Set the correct module and question
            if (!examData.current_module) {
              console.warn(
                "No current_module set in exam data, defaulting to 1"
              );
              examData.current_module = 1;
            }

            setCurrentQuestion(0); // Start with first question of the current module
          } else {
            throw new Error("Invalid exam data structure for continued test");
          }

          // Always show the loading screen for at least 5 seconds for continued tests
          setTimeout(() => {
            setLoading(false);
          }, 5000);

          return; // Exit early since we already have the data
        }

        // For new tests, generate a new exam
        const examData = await api.generateExam();
        console.log("Generated Exam Response:", examData);

        // Diagnostic log to see module structure
        if (examData && examData.exam_data) {
          console.log(
            "Module structure:",
            examData.exam_data.map(
              (m, index) =>
                `Module ${index + 1}: ${m.module_type} (${
                  m.questions?.length || 0
                } questions)`
            )
          );

          // Check if current_module is set correctly
          if (!examData.current_module) {
            console.warn("No current_module set in exam data, defaulting to 1");
            examData.current_module = 1; // Default to first module if not set
          }
        }

        if (examData && examData.exam_data && examData.exam_data.length > 0) {
          setExamData(examData);
          setCurrentQuestion(0); // Start with first question of first module

          // Save exam ID to localStorage
          localStorage.setItem("currentExamId", examData.id);
        } else {
          throw new Error("Invalid exam data structure");
        }

        // Always show the loading screen for at least 12 seconds to allow the full animation sequence
        setTimeout(() => {
          setLoading(false);
        }, 12000);
      } catch (err) {
        console.error("Error details:", err);
        setError("Error loading exam: " + err.message);

        // Even on error, show loading for the full animation sequence
        setTimeout(() => {
          setLoading(false);
        }, 12000);
      }
    };

    fetchExamData();
  }, [testType]);

  // Add class to body when component mounts
  useEffect(() => {
    document.body.classList.add("taking-test");

    // Remove class when component unmounts
    return () => {
      document.body.classList.remove("taking-test");
    };
  }, []);

  // Handle exit button click
  const handleExitClick = () => {
    setShowExitDialog(true);
  };

  // Handle exit confirmation
  const handleExitConfirm = async () => {
    document.body.classList.remove("taking-test");

    try {
      // Get the exam ID from localStorage
      const examId = localStorage.getItem("currentExamId");

      if (examId && examData) {
        // Prepare user progress array from userAnswers object
        const userProgress = Object.values(userAnswers);
        console.log("Saving user progress to server:", userProgress);

        // Send user answers to the server
        await api.updateExam(examId, examData.current_module, userProgress);
        console.log("Exam updated successfully with user answers");

        // Clear the localStorage items for this exam
        localStorage.removeItem("currentExamId");
        localStorage.removeItem("testUserAnswers");
      } else {
        console.error(
          "No exam ID found in localStorage or examData is missing"
        );
      }
    } catch (error) {
      console.error("Error updating exam:", error);
    }

    onExit();
  };

  // Handle exit cancellation
  const handleExitCancel = () => {
    setShowExitDialog(false);
  };

  const handleAnswerSelect = (optionId, questionId, questionIndex) => {
    if (!examData) return;

    // Get current module index (0-based)
    const moduleIndex = examData.current_module - 1;

    // Create unique key for this question
    const questionKey = getQuestionKey(moduleIndex, questionIndex, questionId);

    console.log(
      `Selecting answer ${optionId} for question key ${questionKey} (module: ${moduleIndex}, index: ${questionIndex}, id: ${questionId})`
    );

    // Create a new object for the selected answers to avoid mutation issues
    const newSelectedAnswers = { ...selectedAnswers, [questionKey]: optionId };

    // Update selected answers state for this specific question
    setSelectedAnswers(newSelectedAnswers);

    // Create a standardized answer object
    const answerObject = {
      module_index: moduleIndex,
      question_index: questionIndex,
      question_id: questionId,
      selected_option: optionId,
    };

    // Create a storage key for userAnswers
    const storageKey = questionId
      ? questionId
      : `m${moduleIndex}_q${questionIndex}`;

    // Update user answers object with the new format
    const updatedAnswers = {
      ...userAnswers,
      [storageKey]: answerObject,
    };

    // Save to state
    setUserAnswers(updatedAnswers);

    // Save to localStorage - stringify and then immediately parse to verify format
    const stringified = JSON.stringify(updatedAnswers);
    console.log("Saving to localStorage:", stringified);
    localStorage.setItem("testUserAnswers", stringified);

    // Verify what was saved
    const savedAgain = localStorage.getItem("testUserAnswers");
    console.log("Verified localStorage after save:", savedAgain);
    try {
      const parsed = JSON.parse(savedAgain);
      console.log("Parsed from localStorage:", parsed);
    } catch (e) {
      console.error("Error parsing saved answers during verification:", e);
    }
  };

  const handleNextQuestion = () => {
    if (!examData) return;

    // Get the current module using array indexing
    const currentModule = examData.exam_data[examData.current_module - 1];
    if (!currentModule || !currentModule.questions) return;

    if (currentQuestion < currentModule.questions.length - 1) {
      const nextQuestionIndex = currentQuestion + 1;
      console.log(`Moving to next question: ${nextQuestionIndex}`);
      setCurrentQuestion(nextQuestionIndex);
    }

    // Add logging to help with debugging
    console.log(`Current selected answers:`, selectedAnswers);
  };

  const handlePreviousQuestion = () => {
    if (!examData) return;

    // Access current module using array indexing
    const currentModule = examData.exam_data[examData.current_module - 1];
    if (!currentModule || !currentModule.questions) return;

    if (currentQuestion > 0) {
      const prevQuestionIndex = currentQuestion - 1;
      console.log(`Moving to previous question: ${prevQuestionIndex}`);
      setCurrentQuestion(prevQuestionIndex);

      // Add logging for debugging
      console.log(`Current selected answers:`, selectedAnswers);
    }
  };

  // New function to handle module navigation
  const handleNextModule = () => {
    if (!examData) return;

    console.log(
      "Navigating to next module. Current module:",
      examData.current_module
    );

    // Check if there's a next module
    if (examData.current_module < examData.exam_data.length) {
      // Increment the current module
      const newModuleNumber = examData.current_module + 1;
      console.log("Moving to module:", newModuleNumber);

      // Update the current module in the exam data
      setExamData((prev) => ({
        ...prev,
        current_module: newModuleNumber,
      }));

      // Reset to the first question of the new module
      setCurrentQuestion(0);

      console.log(
        "Current selected answers after module change:",
        selectedAnswers
      );
    } else {
      console.log("Already at the last module:", examData.current_module);
    }
  };

  const toggleMarkQuestion = () => {
    if (markedQuestions.includes(currentQuestion)) {
      setMarkedQuestions(markedQuestions.filter((q) => q !== currentQuestion));
    } else {
      setMarkedQuestions([...markedQuestions, currentQuestion]);
    }
  };

  const toggleCrossMode = () => {
    const currentCrossMode =
      crossedOptions[currentQuestion]?.crossMode || false;
    setCrossedOptions({
      ...crossedOptions,
      [currentQuestion]: {
        ...crossedOptions[currentQuestion],
        crossMode: !currentCrossMode,
      },
    });
  };

  const toggleCrossOption = (optionId) => {
    if (!crossedOptions[currentQuestion]?.crossMode) return;

    const currentCrossed = crossedOptions[currentQuestion]?.crossed || [];
    const newCrossed = currentCrossed.includes(optionId)
      ? currentCrossed.filter((id) => id !== optionId)
      : [...currentCrossed, optionId];

    setCrossedOptions({
      ...crossedOptions,
      [currentQuestion]: {
        ...crossedOptions[currentQuestion],
        crossed: newCrossed,
      },
    });
  };

  const isOptionCrossed = (optionId) => {
    return (
      crossedOptions[currentQuestion]?.crossed?.includes(optionId) || false
    );
  };

  const isCrossModeActive = () => {
    return crossedOptions[currentQuestion]?.crossMode || false;
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!examData || !examData.exam_data) {
    return <div className="error">Invalid exam data structure</div>;
  }

  // Find the current module based on current_module property (1-based index)
  const currentModule = examData.exam_data[examData.current_module - 1];

  if (!currentModule) {
    return <div className="error">Current module not found</div>;
  }

  // Check if we're on the last module
  const isLastModule = examData.current_module === examData.exam_data.length;

  // Check if the current module has questions
  const hasQuestions =
    currentModule.questions && currentModule.questions.length > 0;

  // If no questions in this module, show a message and next module button
  if (!hasQuestions) {
    return (
      <div className="test-interface">
        <div className="test-header">
          <div className="test-info">
            <h1>
              Module {examData.current_module}: {currentModule.module_type}
            </h1>
          </div>
          <div className="timer">
            <i className="far fa-clock"></i> {timeRemaining}
          </div>
          <div className="test-controls">
            <button className="exit-button" onClick={handleExitClick}>
              <i className="fas fa-times"></i> Exit
            </button>
          </div>
        </div>

        <div className="test-content empty-module">
          <div className="no-questions-message">
            <h2>No questions available in this module</h2>
            <p>
              This module is currently empty. Please proceed to the next module.
            </p>
          </div>
        </div>

        <div className="test-footer">
          {!isLastModule && (
            <button
              className="nav-button next-module"
              onClick={handleNextModule}
            >
              Next Module <i className="fas fa-arrow-right"></i>
            </button>
          )}
          {isLastModule && (
            <button className="nav-button finish" onClick={handleExitClick}>
              Finish Test <i className="fas fa-check"></i>
            </button>
          )}
        </div>

        {showExitDialog && (
          <div className="exit-dialog-overlay">
            <div className="exit-dialog">
              <p>Are you sure you want to exit? Your progress will be saved.</p>
              <div className="exit-dialog-buttons">
                <button className="cancel-button" onClick={handleExitCancel}>
                  Cancel
                </button>
                <button className="confirm-button" onClick={handleExitConfirm}>
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // If there are questions, continue with regular rendering
  const currentQ = currentModule.questions[currentQuestion];
  const isMarked = markedQuestions.includes(currentQuestion);

  // Add safety check for choices
  if (!currentQ || !currentQ.choices || !Array.isArray(currentQ.choices)) {
    return <div className="error">Invalid question data structure</div>;
  }

  // Transform choices into the format we need
  const options = currentQ.choices.map((choice, index) => ({
    id: String.fromCharCode(65 + index), // Convert 0 to 'A', 1 to 'B', etc.
    text: choice.substring(3).trim(), // Remove first 2 chars and any whitespace
  }));

  // Get the current question's info for generating its key
  const currentQuestionId = currentQ.id;
  const moduleIndex = examData.current_module - 1;
  const questionKey = getQuestionKey(
    moduleIndex,
    currentQuestion,
    currentQuestionId
  );

  // Get the current answer for this specific question using the key
  const currentQuestionAnswer = selectedAnswers[questionKey] || null;

  console.log(
    `Current question key: ${questionKey}, Selected answer: ${currentQuestionAnswer}`
  );
  console.log(`Question ID from data: ${currentQuestionId}`);

  return (
    <div className="test-interface">
      {showExitDialog && (
        <div className="exit-dialog-overlay">
          <div className="exit-dialog">
            <p>Are you sure you want to exit? Your progress will be saved.</p>
            <div className="exit-dialog-buttons">
              <button className="cancel-button" onClick={handleExitCancel}>
                Cancel
              </button>
              <button className="confirm-button" onClick={handleExitConfirm}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Debug info - you can set display to block to enable */}
      <div
        className="debug-info"
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          background: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "10px",
          fontSize: "12px",
          maxWidth: "300px",
          maxHeight: "200px",
          overflow: "auto",
          zIndex: 9999,
          display: "none",
        }}
      >
        <p>Current Module: {examData.current_module}</p>
        <p>Current Question: {currentQuestion}</p>
        <p>Question ID: {currentQuestionId || "undefined"}</p>
        <p>Question Key: {questionKey}</p>
        <p>Selected Answer: {currentQuestionAnswer}</p>
        <pre>{JSON.stringify(selectedAnswers, null, 2)}</pre>
      </div>

      {/* Navigator overlay */}

      <div className="test-header">
        <div className="test-info">
          <h1>
            Module {examData.current_module}: {currentModule.module_type}
          </h1>
          <h2>{currentQ.question_topic}</h2>
        </div>

        <div className="timer">
          <i className="far fa-clock"></i> {timeRemaining}
        </div>

        <div className="test-controls">
          <button
            className="navigator-toggle-button"
            onClick={() => setNavigatorOpen(!navigatorOpen)}
            title={navigatorOpen ? "Close navigator" : "Open navigator"}
          >
            <i className="fas fa-list-ol"></i>
          </button>
          <button className="exit-button" onClick={handleExitClick}>
            <i className="fas fa-times"></i> Exit
          </button>
        </div>
      </div>

      <div className="test-content">
        <div className="question-area">
          <div>
            <div className="question-text">
              {currentQ.passage && (
                <div className="passage">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: currentQ.passage,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="exam-question-container">
              <div className="exam-question-number">
                <span>{currentQuestion + 1}</span>
              </div>
              <div className="question-tools">
                <button
                  className={`mark-button ${isMarked ? "marked" : ""}`}
                  onClick={toggleMarkQuestion}
                  title="Mark for review"
                >
                  <i className={`${isMarked ? "fas" : "far"} fa-bookmark`}></i>
                </button>
                <button
                  className={`cross-button ${
                    isCrossModeActive() ? "active" : ""
                  }`}
                  onClick={toggleCrossMode}
                  title="Toggle cross-out mode"
                >
                  <span className="cross-text">Abc</span>
                </button>
                {isCrossModeActive() && (
                  <div className="cross-mode-indicator">
                    Click on options to cross them out
                  </div>
                )}
              </div>
            </div>
            <p>{currentQ.question}</p>
            <div className="answer-options">
              {options.map((option) => (
                <div
                  key={option.id}
                  className={`answer-option ${
                    currentQuestionAnswer === option.id ? "selected" : ""
                  } ${isOptionCrossed(option.id) ? "crossed" : ""}`}
                  onClick={() =>
                    isCrossModeActive()
                      ? toggleCrossOption(option.id)
                      : handleAnswerSelect(
                          option.id,
                          currentQuestionId,
                          currentQuestion
                        )
                  }
                >
                  <div className="option-letter">{option.id}</div>
                  <div className="option-text">{option.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`sliding-question-navigator ${
            navigatorOpen ? "open" : "closed"
          }`}
        >
          <div className="navigator-header">
            <h3>Question Navigator</h3>
            <button
              className="close-navigator"
              onClick={() => setNavigatorOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
            <div className="navigator-legend">
              <div className="legend-item">
                <div className="legend-marker answered"></div>
                <span>Answered</span>
              </div>
              <div className="legend-item">
                <div className="legend-marker unanswered"></div>
                <span>Unanswered</span>
              </div>
              <div className="legend-item">
                <div className="legend-marker marked"></div>
                <span>Marked</span>
              </div>
            </div>
          </div>
          <div className="question-buttons">
            {currentModule.questions.map((q, index) => {
              // Create consistent key for this question
              const qKey = getQuestionKey(moduleIndex, index, q.id);

              // Check if this question has been answered
              const isAnswered = !!selectedAnswers[qKey];

              return (
                <button
                  key={q.id || index}
                  className={`question-button ${
                    index === currentQuestion ? "current" : ""
                  } ${markedQuestions.includes(index) ? "marked" : ""} ${
                    isAnswered ? "answered" : ""
                  }`}
                  onClick={() => {
                    setCurrentQuestion(index);
                    setNavigatorOpen(false);
                  }}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="test-footer">
        <button
          className="nav-button previous"
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0}
        >
          <i className="fas fa-chevron-left"></i> Previous
        </button>

        {/* Show Next button if not at last question */}
        {currentQuestion < currentModule.questions.length - 1 && (
          <button className="nav-button next" onClick={handleNextQuestion}>
            Next <i className="fas fa-chevron-right"></i>
          </button>
        )}

        {/* Show Next Module button only if at the last question and not the last module */}
        {currentQuestion === currentModule.questions.length - 1 &&
          !isLastModule && (
            <button
              className="nav-button next-module"
              onClick={handleNextModule}
            >
              Next Module <i className="fas fa-arrow-right"></i>
            </button>
          )}
      </div>
    </div>
  );
};

export default TestInterface;
