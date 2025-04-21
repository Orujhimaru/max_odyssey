import React, { useState, useEffect } from "react";
import "./TestInterface.css";
import { api } from "../../services/api";
import LoadingScreen from "./LoadingScreen";

const TestInterface = ({ testType, onExit }) => {
  const [examData, setExamData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [markedQuestions, setMarkedQuestions] = useState([]);
  const [crossedOptions, setCrossedOptions] = useState({});
  const [timeRemaining, setTimeRemaining] = useState("2:45:00");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [navigatorOpen, setNavigatorOpen] = useState(false);

  // Fetch exam data when component mounts
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setLoading(true);

        // Load the exam data
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
  const handleExitConfirm = () => {
    document.body.classList.remove("taking-test");
    onExit();
  };

  // Handle exit cancellation
  const handleExitCancel = () => {
    setShowExitDialog(false);
  };

  const handleAnswerSelect = (optionId) => {
    setSelectedAnswer(optionId);
  };

  const handleNextQuestion = () => {
    if (!examData) return;

    // Get the current module using array indexing
    const currentModule = examData.exam_data[examData.current_module - 1];
    if (!currentModule || !currentModule.questions) return;

    if (currentQuestion < currentModule.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }

    // Add logging to help with debugging
    console.log(
      `Moving to question ${currentQuestion + 1} in module ${
        examData.current_module
      }`
    );
  };

  const handlePreviousQuestion = () => {
    if (!examData) return;

    // Access current module using array indexing
    const currentModule = examData.exam_data[examData.current_module - 1];
    if (!currentModule || !currentModule.questions) return;

    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);

      // Add logging for debugging
      console.log(
        `Moving to question ${currentQuestion - 1} in module ${
          examData.current_module
        }`
      );
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
                    selectedAnswer === option.id ? "selected" : ""
                  } ${isOptionCrossed(option.id) ? "crossed" : ""}`}
                  onClick={() =>
                    isCrossModeActive()
                      ? toggleCrossOption(option.id)
                      : handleAnswerSelect(option.id)
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
            {currentModule.questions.map((q, index) => (
              <button
                key={q.id || index}
                className={`question-button ${
                  index === currentQuestion ? "current" : ""
                } ${markedQuestions.includes(index) ? "marked" : ""}`}
                onClick={() => {
                  setCurrentQuestion(index);
                  setNavigatorOpen(false);
                }}
              >
                {index + 1}
              </button>
            ))}
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
