import React, { useState, useEffect, useRef } from "react";
import "./TestInterface.css";
import { api } from "../../services/api";
import LoadingScreen from "./LoadingScreen";

// Debugging: Track component mount/unmount cycles and effect runs
console.log("TestInterface.jsx module loaded");
let mountCount = 0;
let effectRunCount = 0;

const TestInterface = ({ testType, onExit }) => {
  // Create a ref to track component instance
  const componentIdRef = useRef(`TestInterface_${++mountCount}`);
  const componentId = componentIdRef.current;

  console.log(`${componentId}: Component rendering with testType:`, testType);

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
    testTypeRef: null,
    effectRunCount: 0,
  });

  // Track when testType changes
  useEffect(() => {
    console.log(`${componentId}: testType changed:`, testType);
    debugRef.current.testTypeRef = testType;
  }, [testType, componentId]);

  // Load saved answers from localStorage when component mounts
  useEffect(() => {
    console.log(`${componentId}: Load saved answers effect running`);

    // Check if we have data in the user progress format
    const savedProgress = localStorage.getItem("testUserProgress");

    if (savedProgress) {
      try {
        const parsedData = JSON.parse(savedProgress);

        if (parsedData.user_progress && parsedData.user_progress.modules) {
          const progress = parsedData.user_progress;
          console.log("Loading user progress:", progress);

          // Rebuild userAnswers from the module data
          const answers = {};
          const reconstructedAnswers = {};

          // Process each module's questions
          Object.entries(progress.modules).forEach(
            ([moduleKey, moduleData]) => {
              // Get module index (convert from 1-based to 0-based)
              const moduleIndex =
                parseInt(moduleKey.replace("module_", "")) - 1;

              if (moduleData.questions && Array.isArray(moduleData.questions)) {
                moduleData.questions.forEach((question) => {
                  // Get the question details
                  const questionId = question.question_id;
                  const answer = question.answer;

                  // Convert to 0-based for internal use
                  const questionIndex = questionId - 1;

                  // Store the answer using the question index as key for UI
                  answers[questionIndex] = answer;

                  // Build the complete answer object for state
                  reconstructedAnswers[questionIndex] = {
                    module_index: moduleIndex,
                    question_index: questionIndex,
                    selected_option: answer,
                  };
                });
              }
            }
          );

          // Update state with the loaded answers
          setSelectedAnswers(answers);
          setUserAnswers(reconstructedAnswers);

          return; // Exit early since we loaded the answers
        }
      } catch (e) {
        console.error("Error loading saved progress:", e);
      }
    }

    // If no saved progress was found, or there was an error, start with empty state
    setSelectedAnswers({});
    setUserAnswers({});
  }, [componentId]);

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
    const thisEffectRun = ++effectRunCount;
    debugRef.current.effectRunCount = thisEffectRun;

    console.log(`${componentId}: Fetch exam effect running #${thisEffectRun}`, {
      testType,
      testTypeRef: debugRef.current.testTypeRef,
      mountCount,
    });

    const fetchExamData = async () => {
      try {
        console.log(
          `${componentId}: Starting exam data fetch #${thisEffectRun}`
        );
        setLoading(true);

        // Check if we're continuing an existing test
        if (testType.type === "continue" && testType.examData) {
          console.log(
            `${componentId}: Continuing existing test #${thisEffectRun}:`,
            testType.examData
          );

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
        console.log(
          `${componentId}: Calling api.generateExam() #${thisEffectRun}`
        );
        const examData = await api.generateExam();
        console.log(
          `${componentId}: Generated Exam Response #${thisEffectRun}:`,
          examData
        );

        // Diagnostic log to see module structure
        if (examData && examData.exam_data) {
          console.log(
            `${componentId}: Module structure #${thisEffectRun}:`,
            examData.exam_data.map(
              (m, index) =>
                `Module ${index + 1}: ${m.module_type} (${
                  m.questions?.length || 0
                } questions)`
            )
          );

          // Check if current_module is set correctly
          if (!examData.current_module) {
            console.warn(
              `${componentId}: No current_module set in exam data, defaulting to 1`
            );
            examData.current_module = 1; // Default to first module if not set
          }
        }

        if (examData && examData.exam_data && examData.exam_data.length > 0) {
          console.log(`${componentId}: Setting exam data #${thisEffectRun}`);
          setExamData(examData);
          setCurrentQuestion(0); // Start with first question of first module

          // Save exam ID to localStorage
          console.log(
            `${componentId}: Saving exam ID to localStorage: ${examData.id}`
          );
          localStorage.setItem("currentExamId", examData.id);
        } else {
          throw new Error("Invalid exam data structure");
        }

        // Always show the loading screen for at least 12 seconds to allow the full animation sequence
        setTimeout(() => {
          setLoading(false);
        }, 12000);
      } catch (err) {
        console.error(`${componentId}: Error details #${thisEffectRun}:`, err);
        setError("Error loading exam: " + err.message);

        // Even on error, show loading for the full animation sequence
        setTimeout(() => {
          setLoading(false);
        }, 12000);
      }
    };

    fetchExamData();

    // Cleanup function
    return () => {
      console.log(
        `${componentId}: Fetch exam effect cleanup #${thisEffectRun}`
      );
    };
  }, [testType, componentId]);

  // Add class to body when component mounts
  useEffect(() => {
    console.log(`${componentId}: Body class effect running`);
    document.body.classList.add("taking-test");

    // Remove class when component unmounts
    return () => {
      console.log(`${componentId}: Body class effect cleanup`);
      document.body.classList.remove("taking-test");
    };
  }, [componentId]);

  // Log when component unmounts
  useEffect(() => {
    return () => {
      console.log(`${componentId}: Component unmounting`);
    };
  }, [componentId]);

  // Handle exit button click
  const handleExitClick = () => {
    setShowExitDialog(true);
    // Prevent scrolling of the underlying content
    document.body.style.overflow = "hidden";
  };

  // Helper function to organize user progress data into modules
  const organizeUserProgress = (userAnswers) => {
    // Create the structure exactly as requested - 4 empty modules
    const userProgress = {
      current_module: examData ? examData.current_module : 1,
      modules: {
        module_1: {
          questions: [],
        },
        module_2: {
          questions: [],
        },
        module_3: {
          questions: [],
        },
        module_4: {
          questions: [],
        },
      },
    };

    // Move all answers to their correct module based on module_index
    Object.values(userAnswers).forEach((answer) => {
      const { module_index, question_index, selected_option } = answer;

      // Make sure the module index is valid
      if (module_index >= 0 && module_index < 4) {
        const moduleKey = `module_${module_index + 1}`;

        // Add the question to the appropriate module
        userProgress.modules[moduleKey].questions.push({
          question_id: question_index + 1, // Use 1-based question IDs
          answer: selected_option,
        });
      }
    });

    return userProgress;
  };

  const handleAnswerSelect = (optionId, questionId, questionIndex) => {
    if (!examData) return;

    // Get current module index (0-based)
    const moduleIndex = examData.current_module - 1;

    // Update local state for rendering
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionId,
    }));

    // Update userAnswers with the new selection
    setUserAnswers((prev) => {
      const updated = { ...prev };

      // Add or update the answer
      updated[questionIndex] = {
        module_index: moduleIndex,
        question_index: questionIndex,
        selected_option: optionId,
      };

      // Organize the updated answers
      const userProgress = organizeUserProgress(updated);

      // Save to localStorage
      localStorage.setItem(
        "testUserProgress",
        JSON.stringify({ user_progress: userProgress })
      );

      return updated;
    });
  };

  // Handle exit confirmation
  const handleExitConfirm = async () => {
    // Restore scrolling
    document.body.style.overflow = "";
    document.body.classList.remove("taking-test");

    try {
      // Get the exam ID from localStorage
      const examId = localStorage.getItem("currentExamId");

      if (examId && examData) {
        // Create user progress with our simplified approach
        const userProgress = organizeUserProgress(userAnswers);

        // Convert to the format expected by API
        const apiUserProgress = [];

        // Extract answers from each module
        Object.entries(userProgress.modules).forEach(
          ([moduleKey, moduleData]) => {
            // Get module index (0-based)
            const moduleIndex = parseInt(moduleKey.replace("module_", "")) - 1;

            if (moduleData.questions && Array.isArray(moduleData.questions)) {
              moduleData.questions.forEach((question) => {
                apiUserProgress.push({
                  module_index: moduleIndex,
                  question_index: question.question_id - 1, // Convert to 0-based for API
                  selected_option: question.answer,
                });
              });
            }
          }
        );

        // Send user answers to the server
        await api.updateExam(examId, examData.current_module, apiUserProgress);

        // Clear the localStorage items for this exam
        localStorage.removeItem("currentExamId");
        localStorage.removeItem("testUserProgress");
      }
    } catch (error) {
      console.error("Error updating exam:", error);
    }

    onExit();
  };

  // Handle exit cancellation
  const handleExitCancel = () => {
    setShowExitDialog(false);
    // Restore scrolling
    document.body.style.overflow = "";
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

  // Get the current question's info
  const currentQuestionId = currentQ.id;
  const moduleIndex = examData.current_module - 1;

  // Just use the question index as the key for simplicity
  const questionKey = currentQuestion;

  // Get the current answer for this specific question using the key
  const currentQuestionAnswer = selectedAnswers[questionKey] || null;

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
              // Simply use the question index as key
              const qKey = index;

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
