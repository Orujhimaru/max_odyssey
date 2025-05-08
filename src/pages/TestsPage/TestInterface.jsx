import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import "./TestInterface.css";
import { api } from "../../services/api";
import LoadingScreen from "./LoadingScreen";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { formatMathExpression } from "../../utils/mathUtils";
import QuestionTimer from "../../components/QuestionTimer/QuestionTimer";

// Debugging: Track component mount/unmount cycles and effect runs
console.log("TestInterface.jsx module loaded");
let mountCount = 0;
let effectRunCount = 0;

// Memoized QuestionContent component
const QuestionContent = memo(function QuestionContent({
  passage,
  question,
  formatMathExpression,
}) {
  return (
    <>
      {/* Passage section */}
      {passage && (
        <div className="passage">
          <div dangerouslySetInnerHTML={{ __html: passage }} />
        </div>
      )}
      <div className="question-text">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            p: ({ node, children, ...props }) => {
              const childArray = React.Children.toArray(children);
              const firstElement = childArray[0];
              const firstIsKatex =
                React.isValidElement(firstElement) &&
                firstElement.props &&
                firstElement.props.className &&
                firstElement.props.className.includes("katex");
              if (!firstIsKatex) {
                return <p {...props}>{children}</p>;
              }
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
              const hasConsecutiveKatex =
                katexIndexes.length >= 2 &&
                katexIndexes[1] === katexIndexes[0] + 1;
              return (
                <div {...props}>
                  {React.Children.map(children, (child, index) => {
                    if (
                      React.isValidElement(child) &&
                      child.props.className &&
                      child.props.className.includes("katex")
                    ) {
                      if (index === katexIndexes[0]) {
                        return React.cloneElement(child, {
                          style: {
                            display: "block",
                            marginBottom: "10px",
                          },
                        });
                      }
                      if (index === katexIndexes[1] && hasConsecutiveKatex) {
                        return React.cloneElement(child, {
                          style: {
                            display: "block",
                            marginBottom: "10px",
                          },
                        });
                      }
                    }
                    return child;
                  })}
                </div>
              );
            },
          }}
        >
          {question && formatMathExpression(question)}
        </ReactMarkdown>
      </div>
    </>
  );
});

const QuestionSVG = React.memo(function QuestionSVG({ svg }) {
  if (!svg || svg === "") return null;

  // Check if the svg string is actually a base64 encoded image
  const isBase64Image = typeof svg === "string" && svg.startsWith("data:image");

  return (
    <div className="images-container">
      {isBase64Image ? (
        <div className="question-image">
          <img src={svg} alt="Question visual" className="base64-image" />
        </div>
      ) : (
        <div
          className="question-image question-image-with-svg"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
    </div>
  );
});

const TestInterface = ({ testType, onExit }) => {
  // Create a ref to track component instance
  const componentIdRef = useRef(`TestInterface_${++mountCount}`);
  const componentId = componentIdRef.current;

  // console.log(`${componentId}: Component rendering with testType:`, testType);

  const [examData, setExamData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [userAnswers, setUserAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState([]);
  const [crossedOptions, setCrossedOptions] = useState({});
  const [timeRemaining, setTimeRemaining] = useState("2:45:00");
  const [moduleTimeSeconds, setModuleTimeSeconds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // Module timer ref
  const moduleTimerRef = useRef(null);
  const moduleTimerActiveRef = useRef(false);

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

  // Load saved answers and timers from localStorage when component mounts
  useEffect(() => {
    console.log(`${componentId}: Load saved answers effect running`);

    // Check if we have data in the user progress format
    const savedProgress = localStorage.getItem("testUserProgress");
    const savedTimers = localStorage.getItem("testQuestionTimers");
    const savedModuleTime = localStorage.getItem("moduleTimeRemaining");

    // Load saved module time if available
    if (savedModuleTime) {
      try {
        const parsedModuleTime = JSON.parse(savedModuleTime);
        console.log("Loaded module time:", parsedModuleTime);
        if (parsedModuleTime.seconds > 0) {
          setModuleTimeSeconds(parsedModuleTime.seconds);
          const minutes = Math.floor(parsedModuleTime.seconds / 60);
          const seconds = parsedModuleTime.seconds % 60;
          setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`);
        }
      } catch (e) {
        console.error("Error loading saved module time:", e);
      }
    }

    if (savedTimers) {
      try {
        const parsedTimers = JSON.parse(savedTimers);
        console.log("Loaded question timers:", parsedTimers);
      } catch (e) {
        console.error("Error loading saved timers:", e);
      }
    }

    if (savedProgress) {
      try {
        const parsedData = JSON.parse(savedProgress);

        if (parsedData.user_progress && parsedData.user_progress.modules) {
          const progress = parsedData.user_progress;
          console.log("Loading user progress:", progress);

          // Load question times from user progress if available
          if (
            progress.question_times &&
            Object.keys(progress.question_times).length > 0
          ) {
            console.log(
              "Loading question times from user progress:",
              progress.question_times
            );
            // Save to localStorage for future use
            localStorage.setItem(
              "testQuestionTimers",
              JSON.stringify(progress.question_times)
            );
          }

          // Rebuild userAnswers and selectedAnswers from the module data
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

                  // Store the answer using the questionId as key for UI
                  if (answer !== null && answer !== undefined) {
                    answers[questionId] = answer;
                  }

                  // Build the complete answer object for state
                  reconstructedAnswers[questionId] = {
                    module_index: moduleIndex,
                    question_index: questionId, // Not used for lookup, but keep for structure
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

  // Module timer functionality
  useEffect(() => {
    // Only run the module timer when exam data is loaded and not in loading state
    if (examData && !loading) {
      // Initialize module timer if not set
      if (moduleTimeSeconds === null) {
        const moduleNumber = examData.current_module;
        // Set time based on module number
        const initialSeconds = moduleNumber <= 2 ? 32 * 60 : 35 * 60;
        setModuleTimeSeconds(initialSeconds);

        // Format for display
        const minutes = Math.floor(initialSeconds / 60);
        const seconds = initialSeconds % 60;
        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      }

      // Start the module timer
      startModuleTimer();

      // Set timer as active
      moduleTimerActiveRef.current = true;
    }

    return () => {
      // Pause the module timer when component unmounts
      pauseModuleTimer();
      moduleTimerActiveRef.current = false;
    };
  }, [examData, loading]);

  // Start the module timer
  const startModuleTimer = () => {
    // Clear any existing timer
    if (moduleTimerRef.current) {
      clearInterval(moduleTimerRef.current);
    }

    // Start countdown
    moduleTimerRef.current = setInterval(() => {
      setModuleTimeSeconds((prevTime) => {
        if (prevTime <= 0) {
          // Time's up, clear interval and move to next module
          clearInterval(moduleTimerRef.current);
          handleTimeExpired();
          return 0;
        }

        const newTime = prevTime - 1;

        // Update display format
        const minutes = Math.floor(newTime / 60);
        const seconds = newTime % 60;
        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`);

        // Save current time to localStorage
        localStorage.setItem(
          "moduleTimeRemaining",
          JSON.stringify({
            moduleIndex: examData?.current_module,
            seconds: newTime,
          })
        );

        return newTime;
      });
    }, 1000);
  };

  // Pause the module timer
  const pauseModuleTimer = () => {
    if (moduleTimerRef.current) {
      clearInterval(moduleTimerRef.current);
      moduleTimerRef.current = null;
    }
  };

  // Handle time expired - move to next module
  const handleTimeExpired = () => {
    console.log("Module time expired, moving to next module");
    // Check if there's a next module
    if (examData && examData.current_module < examData.exam_data.length) {
      // Move to next module
      handleNextModule();
    } else {
      // If this is the last module, finish the test
      handleFinishTest();
    }
  };

  // Format seconds to MM:SS
  const formatTime = (timeInMs) => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

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

            // Check if the backend provided module time remaining
            if (
              examData.user_progress &&
              examData.user_progress.module_time_remaining
            ) {
              console.log(
                "Using module time remaining from backend:",
                examData.user_progress.module_time_remaining
              );
              const timeInSeconds =
                examData.user_progress.module_time_remaining;
              setModuleTimeSeconds(timeInSeconds);

              // Format for display
              const minutes = Math.floor(timeInSeconds / 60);
              const seconds = timeInSeconds % 60;
              setTimeRemaining(
                `${minutes}:${seconds.toString().padStart(2, "0")}`
              );

              // Save to localStorage
              localStorage.setItem(
                "moduleTimeRemaining",
                JSON.stringify({
                  moduleIndex: examData.current_module,
                  seconds: timeInSeconds,
                })
              );
            }
            // Check for saved module time in localStorage
            else {
              const savedModuleTime = localStorage.getItem(
                "moduleTimeRemaining"
              );
              if (savedModuleTime) {
                try {
                  const parsedModuleTime = JSON.parse(savedModuleTime);
                  // Verify the saved module matches the current module
                  if (
                    parsedModuleTime.moduleIndex === examData.current_module
                  ) {
                    // Use the saved time
                    setModuleTimeSeconds(parsedModuleTime.seconds);
                    const minutes = Math.floor(parsedModuleTime.seconds / 60);
                    const seconds = parsedModuleTime.seconds % 60;
                    setTimeRemaining(
                      `${minutes}:${seconds.toString().padStart(2, "0")}`
                    );
                  } else {
                    // If module doesn't match, set new timer
                    const moduleNumber = examData.current_module;
                    const initialSeconds =
                      moduleNumber <= 2 ? 32 * 60 : 35 * 60;
                    setModuleTimeSeconds(initialSeconds);
                    setTimeRemaining(moduleNumber <= 2 ? "32:00" : "35:00");
                  }
                } catch (e) {
                  console.error("Error parsing saved module time:", e);
                  // Set default time based on module
                  const moduleNumber = examData.current_module;
                  setTimeRemaining(moduleNumber <= 2 ? "32:00" : "35:00");
                }
              } else {
                // No saved time, set appropriate timer based on module number
                const moduleNumber = examData.current_module;
                const initialSeconds = moduleNumber <= 2 ? 32 * 60 : 35 * 60;
                setModuleTimeSeconds(initialSeconds);
                setTimeRemaining(moduleNumber <= 2 ? "32:00" : "35:00");
              }
            }

            // If lastQuestionIndex is provided, use it to set the current question
            if (testType.lastQuestionIndex !== undefined) {
              console.log(
                `Setting current question to last position: ${testType.lastQuestionIndex}`
              );
              setCurrentQuestion(testType.lastQuestionIndex);
            } else {
              setCurrentQuestion(0); // Default to first question if no last position
            }
          } else {
            throw new Error("Invalid exam data structure for continued test");
          }

          // No need to show loading screen for continued tests
          setLoading(false);

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

          // Set appropriate timer based on module number
          const moduleNumber = examData.current_module;
          const initialSeconds = moduleNumber <= 2 ? 32 * 60 : 35 * 60;
          setModuleTimeSeconds(initialSeconds);
          setTimeRemaining(moduleNumber <= 2 ? "32:00" : "35:00");

          // Clear any previous module time
          localStorage.removeItem("moduleTimeRemaining");
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

        // Shorter delay for loading screen animation
        setTimeout(() => {
          setLoading(false);
        }, 12000);
      } catch (err) {
        console.error(`${componentId}: Error details #${thisEffectRun}:`, err);
        setError("Error loading exam: " + err.message);

        // Shorter delay even on error
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

  // After examData is loaded and validated, initialize all timers to 0 if not present
  useEffect(() => {
    if (examData && examData.exam_data) {
      // Log the full examData object from backend
      console.log("[BACKEND examData]", examData);
      // Log all questions' topic and subtopic
      examData.exam_data.forEach((module, mIdx) => {
        const difficultyCounts = { easy: 0, medium: 0, hard: 0, unknown: 0 };
        if (module.questions && Array.isArray(module.questions)) {
          module.questions.forEach((q, qIdx) => {
            console.log(
              `[Q] Module ${mIdx + 1} Q${qIdx + 1}: topic='${
                q.question_topic
              }', subtopic='${q.question_subtopic}', difficulty='${
                q.difficulty_level
              }'`
            );
            // Count difficulties
            const difficulty = q.difficulty_level?.toLowerCase();
            if (difficulty === "easy") {
              difficultyCounts.easy++;
            } else if (difficulty === "medium") {
              difficultyCounts.medium++;
            } else if (difficulty === "hard") {
              difficultyCounts.hard++;
            } else {
              difficultyCounts.unknown++;
            }
          });
          // Log difficulty counts for the module
          console.log(
            `[Module ${mIdx + 1} Difficulty Summary]: Easy: ${
              difficultyCounts.easy
            }, Medium: ${difficultyCounts.medium}, Hard: ${
              difficultyCounts.hard
            }, Unknown: ${difficultyCounts.unknown}`
          );
        }
      });
      // If backend provides per-question timers, use them
      if (examData.user_progress && examData.user_progress.question_times) {
        localStorage.setItem(
          "testQuestionTimers",
          JSON.stringify(examData.user_progress.question_times)
        );
        console.log(
          "[Timer] Initialized from backend question_times:",
          examData.user_progress.question_times
        );
      } else {
        const allTimers = JSON.parse(
          localStorage.getItem("testQuestionTimers") || "{}"
        );
        examData.exam_data.forEach((module) => {
          if (module.questions && Array.isArray(module.questions)) {
            module.questions.forEach((q, idx) => {
              const globalIndex =
                idx + (module.module_index ? module.module_index * 1000 : 0);
              if (allTimers[globalIndex] === undefined) {
                allTimers[globalIndex] = 0;
              }
            });
          }
        });
        localStorage.setItem("testQuestionTimers", JSON.stringify(allTimers));
      }
    }
  }, [examData]);

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

  // Add cleanup effect to always remove timer values on unmount
  useEffect(() => {
    return () => {
      localStorage.removeItem("testQuestionTimers");
      console.log(
        "[Timer] testQuestionTimers removed from localStorage (unmount)"
      );
    };
  }, []);

  // Handle exit button click, with optional isFinishing parameter
  const handleExitClick = () => {
    // For regular exit, isFinishing should be false
    setIsFinishing(false);
    setShowExitDialog(true);

    // Prevent scrolling of the underlying content
    document.body.style.overflow = "hidden";
  };

  // Helper function to organize user progress data into modules
  const organizeUserProgress = (userAnswers) => {
    const userProgress = {
      current_module: examData ? examData.current_module : 1,
      modules: {
        module_1: { questions: [] },
        module_2: { questions: [] },
        module_3: { questions: [] },
        module_4: { questions: [] },
      },
      question_times: {},
      module_time_remaining: moduleTimeSeconds || 0,
    };

    // Read timer data from localStorage
    const timersFromStorage = JSON.parse(
      localStorage.getItem("testQuestionTimers") || "{}"
    );
    Object.entries(timersFromStorage).forEach(([questionId, timeInMs]) => {
      userProgress.question_times[questionId] = timeInMs;
    });

    // For every question in the exam, include an entry in the questions array for its module
    if (examData && examData.exam_data) {
      examData.exam_data.forEach((module, moduleIdx) => {
        const moduleKey = `module_${moduleIdx + 1}`;
        if (module.questions && Array.isArray(module.questions)) {
          module.questions.forEach((q) => {
            const questionId = q.question_id;
            let answer = null;
            if (
              userAnswers &&
              userAnswers[questionId] &&
              userAnswers[questionId].selected_option !== undefined &&
              userAnswers[questionId].selected_option !== null
            ) {
              answer = userAnswers[questionId].selected_option;
            }
            userProgress.modules[moduleKey].questions.push({
              question_id: questionId,
              answer: answer === undefined ? null : answer,
              time_spent: timersFromStorage[questionId] || 0,
            });
          });
        }
      });
    }

    return userProgress;
  };

  const handleAnswerSelect = (optionId, questionId, questionIndex) => {
    if (!examData) return;

    // Get current module index (0-based)
    const moduleIndex = examData.current_module - 1;

    // Update local state for rendering (use questionId as key)
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));

    // Update userAnswers with the new selection, keyed by question_id
    setUserAnswers((prev) => {
      const updated = { ...prev };
      updated[questionId] = {
        module_index: moduleIndex,
        question_index: questionIndex,
        selected_option: optionId,
      };

      // Organize the updated answers
      const userProgress = organizeUserProgress(updated);

      // Check if there's an existing userProgress in localStorage
      const savedProgress = localStorage.getItem("testUserProgress");
      if (savedProgress) {
        try {
          const parsedData = JSON.parse(savedProgress);
          if (
            parsedData.user_progress &&
            parsedData.user_progress.is_finished
          ) {
            // Preserve the is_finished flag
            userProgress.is_finished = parsedData.user_progress.is_finished;
          }
        } catch (error) {
          console.error("Error preserving is_finished flag:", error);
        }
      }

      // Save to localStorage
      localStorage.setItem(
        "testUserProgress",
        JSON.stringify({ user_progress: userProgress })
      );

      // Debug log to verify userAnswers mapping
      console.log("[DEBUG] userAnswers before sending:", updated);

      return updated;
    });
  };

  // Handle exit confirmation
  const handleExitConfirm = async () => {
    try {
      // Pause the module timer
      pauseModuleTimer();

      // First hide the exit dialog
      setShowExitDialog(false);

      // Restore scrolling and remove body class
      document.body.style.overflow = "";
      document.body.classList.remove("taking-test");

      // Get the exam ID from localStorage
      const examId = localStorage.getItem("currentExamId");
      console.log("ExamID from localStorage:", examId);

      if (examId && examData) {
        // Build user_progress with latest answers and timers
        const userProgress = organizeUserProgress(userAnswers);
        userProgress.is_finished = isFinishing;
        console.log(
          `Setting is_finished=${isFinishing} based on isFinishing state`
        );
        // Create the full request payload
        const requestPayload = {
          exam_id: examId,
          user_progress: userProgress,
        };
        // Log the complete request object
        console.log("SENDING REQUEST TO SERVER:");
        console.log(JSON.stringify(requestPayload, null, 2));
        // Send user answers to the server in the exact format the backend expects
        try {
          const response = await api.updateExam(examId, {
            user_progress: userProgress,
          });
          console.log("Server response:", response);
        } catch (err) {
          console.error("Error sending user_progress to backend:", err);
        }
        // Now clear the localStorage items for this exam
        localStorage.removeItem("testQuestionTimers");
        localStorage.removeItem("testUserProgress");
        localStorage.removeItem("currentExamId");
        localStorage.removeItem("moduleTimeRemaining");
        console.log(
          "[Timer] testQuestionTimers removed from localStorage (exit)"
        );
      }
      // Exit immediately without delay
      onExit();
    } catch (error) {
      console.error("Error updating exam:", error);
      // Even if there's an error, we should still exit immediately
      onExit();
    }
  };

  // Handle exit cancellation
  const handleExitCancel = () => {
    setShowExitDialog(false);
    // Restore scrolling
    document.body.style.overflow = "";
  };

  const timerRef = useRef();

  const handleNextQuestion = () => {
    if (!examData) return;
    const currentModule = examData.exam_data[examData.current_module - 1];
    if (!currentModule || !currentModule.questions) return;
    if (currentQuestion < currentModule.questions.length - 1) {
      // Save timer value before changing question
      const currentTime = timerRef.current?.getCurrentTime?.();
      if (currentTime !== undefined) {
        const savedTimers = JSON.parse(
          localStorage.getItem("testQuestionTimers") || "{}"
        );
        savedTimers[currentQuestion] = currentTime * 1000;
        localStorage.setItem("testQuestionTimers", JSON.stringify(savedTimers));
      }
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (!examData) return;
    const currentModule = examData.exam_data[examData.current_module - 1];
    if (!currentModule || !currentModule.questions) return;
    if (currentQuestion > 0) {
      // Save timer value before changing question
      const currentTime = timerRef.current?.getCurrentTime?.();
      if (currentTime !== undefined) {
        const savedTimers = JSON.parse(
          localStorage.getItem("testQuestionTimers") || "{}"
        );
        savedTimers[currentQuestion] = currentTime * 1000;
        localStorage.setItem("testQuestionTimers", JSON.stringify(savedTimers));
      }
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // New function to handle module navigation
  const handleNextModule = () => {
    if (!examData) return;

    // Pause the module timer
    pauseModuleTimer();

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

      // Set the appropriate timer based on the new module
      const initialSeconds = newModuleNumber <= 2 ? 32 * 60 : 35 * 60;
      setModuleTimeSeconds(initialSeconds);
      setTimeRemaining(newModuleNumber <= 2 ? "32:00" : "35:00");

      // Clear and update saved module time
      localStorage.setItem(
        "moduleTimeRemaining",
        JSON.stringify({
          moduleIndex: newModuleNumber,
          seconds: initialSeconds,
        })
      );

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

  // Add new function to handle finishing the test
  const handleFinishTest = () => {
    console.log("handleFinishTest called - finishing the test");

    // Pause the current question timer
    pauseModuleTimer();

    // Set isFinishing state to true - this will be used in handleExitConfirm
    setIsFinishing(true);

    // Show the confirmation dialog
    setShowExitDialog(true);

    // Prevent scrolling of the underlying content
    document.body.style.overflow = "hidden";
  };

  // Add this effect after currentModule is defined:
  useEffect(() => {
    if (!examData || !examData.exam_data) return;
    const currentModule = examData.exam_data[examData.current_module - 1];
    if (!currentModule || !currentModule.questions) return;
    if (
      currentQuestion < 0 ||
      currentQuestion >= currentModule.questions.length
    ) {
      setCurrentQuestion(0);
    }
    // eslint-disable-next-line
  }, [examData, currentQuestion]);

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
              <p>
                {isFinishing
                  ? "Are you sure you want to finish this test? This will submit all your answers and end the test."
                  : "Are you sure you want to exit? Your progress will be saved."}
              </p>
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
              {examData.current_module <= 2
                ? `Section 1, Module ${examData.current_module}: Reading and Writing`
                : `Section 2, Module ${examData.current_module}: Math`}
            </h1>
          </div>
          <div className="timer">
            <i className="far fa-clock"></i> {timeRemaining}
          </div>
          <div className="test-controls">
            <button className="exit-button" onClick={() => handleExitClick()}>
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
            <button className="nav-button finish" onClick={handleFinishTest}>
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

  // Handle questions without choices (e.g., free response)
  if (!currentQ) {
    return (
      <div className="error">
        Invalid question data structure (missing question object)
      </div>
    );
  }
  if (!currentQ.choices || !Array.isArray(currentQ.choices)) {
    // Free response or non-multiple-choice question
    return (
      <div className="test-interface">
        <div className="test-header">
          <div className="test-info">
            <h1>
              {examData.current_module <= 2
                ? `Section 1, Module ${examData.current_module}: Reading and Writing`
                : `Section 2, Module ${examData.current_module}: Math`}
            </h1>
          </div>
          <div className="timer">
            <i className="far fa-clock"></i> {timeRemaining}
          </div>
          <div className="test-controls">
            <button className="exit-button" onClick={() => handleExitClick()}>
              <i className="fas fa-times"></i> Exit
            </button>
          </div>
        </div>
        <div className="test-content">
          <div className="question-area">
            <div>
              {/* Image section */}
              <QuestionSVG svg={currentQ.svg_image} />
              {currentQ.html_table && currentQ.html_table !== "" && (
                <div className="images-container">
                  <div
                    className="question-image"
                    dangerouslySetInnerHTML={{ __html: currentQ.html_table }}
                  />
                </div>
              )}
              {/* Passage section */}
              <QuestionContent
                passage={currentQ.passage}
                formatMathExpression={formatMathExpression}
              />
            </div>
            <div>
              <div className="exam-question-container">
                <div className="exam-question-number">
                  <span>{currentQuestion + 1}</span>
                </div>
                <div className="question-tools">
                  <QuestionTimer
                    ref={timerRef}
                    questionIndex={currentQuestion}
                  />
                  <div
                    className={`mark-question ${
                      markedQuestions[currentQuestion] ? "marked" : ""
                    }`}
                    onClick={toggleMarkQuestion}
                    title="Mark this question for review"
                  >
                    <i className="far fa-bookmark"></i>
                  </div>
                  <div
                    className={`cross-mode ${
                      isCrossModeActive() ? "active" : ""
                    }`}
                    onClick={toggleCrossMode}
                    title="Toggle cross-out mode"
                  >
                    <i className="fas fa-times"></i>
                  </div>
                </div>
              </div>
              <QuestionContent
                question={currentQ.question}
                formatMathExpression={formatMathExpression}
              />
              <div className="answer-options">
                <div className="free-response-message">
                  <em>
                    This is a free response question. Please write your answer
                    on paper or in the provided field (if available).
                  </em>
                </div>
              </div>
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
          {currentQuestion < currentModule.questions.length - 1 && (
            <button className="nav-button next" onClick={handleNextQuestion}>
              Next <i className="fas fa-chevron-right"></i>
            </button>
          )}
          {currentQuestion === currentModule.questions.length - 1 &&
            !isLastModule && (
              <button
                className="nav-button next-module"
                onClick={handleNextModule}
              >
                Next Module <i className="fas fa-arrow-right"></i>
              </button>
            )}
          {currentQuestion === currentModule.questions.length - 1 &&
            isLastModule && (
              <button
                className="nav-button finish-test"
                onClick={handleFinishTest}
              >
                Finish Test <i className="fas fa-check"></i>
              </button>
            )}
        </div>
      </div>
    );
  }

  // Transform choices into the format we need
  const options = currentQ.choices.map((choice, index) => {
    const text = choice.substring(3).trim(); // Remove first 2 chars and any whitespace
    return {
      id: String.fromCharCode(65 + index), // Convert 0 to 'A', 1 to 'B', etc.
      text: text,
      containsHtml: text.includes("<table") || text.includes("<figure"),
    };
  });

  // Get the current question's info
  const currentQuestionId = currentQ.question_id;
  const moduleIndex = examData.current_module - 1;

  // Use questionId as the key for selectedAnswers
  const currentQuestionAnswer = selectedAnswers[currentQuestionId] || null;

  return (
    <div className="test-interface">
      {showExitDialog && (
        <div className="exit-dialog-overlay">
          <div className="exit-dialog">
            <p>
              {isFinishing
                ? "Are you sure you want to finish this test? This will submit all your answers and end the test."
                : "Are you sure you want to exit? Your progress will be saved."}
            </p>
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
            {examData.current_module <= 2
              ? `Section 1, Module ${examData.current_module}: Reading and Writing`
              : `Section 2, Module ${examData.current_module}: Math`}
          </h1>
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
          <button className="exit-button" onClick={() => handleExitClick()}>
            <i className="fas fa-times"></i> Exit
          </button>
        </div>
      </div>

      <div className="test-content">
        <div className="question-area">
          <div>
            {/* Image section */}
            <QuestionSVG svg={currentQ.svg_image} />
            {currentQ.html_table && currentQ.html_table !== "" && (
              <div className="images-container">
                <div
                  className="question-image"
                  dangerouslySetInnerHTML={{ __html: currentQ.html_table }}
                />
              </div>
            )}
            {/* Passage section */}
            <QuestionContent
              passage={currentQ.passage}
              formatMathExpression={formatMathExpression}
            />
          </div>
          <div>
            <div className="exam-question-container">
              <div className="exam-question-number">
                <span>{currentQuestion + 1}</span>
              </div>
              <div className="question-tools">
                <QuestionTimer ref={timerRef} questionIndex={currentQuestion} />
                <div
                  className={`mark-question ${
                    markedQuestions[currentQuestion] ? "marked" : ""
                  }`}
                  onClick={toggleMarkQuestion}
                  title="Mark this question for review"
                >
                  <i className="far fa-bookmark"></i>
                </div>
                <div
                  className={`cross-mode ${
                    isCrossModeActive() ? "active" : ""
                  }`}
                  onClick={toggleCrossMode}
                  title="Toggle cross-out mode"
                >
                  <i className="fas fa-times"></i>
                </div>
              </div>
            </div>
            <QuestionContent
              question={currentQ.question}
              formatMathExpression={formatMathExpression}
            />
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
                  <div className="option-text">
                    {option.text && option.text.includes("<") ? (
                      <div dangerouslySetInnerHTML={{ __html: option.text }} />
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {formatMathExpression(option.text)}
                      </ReactMarkdown>
                    )}
                  </div>
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
              // Use question_id as key
              const qKey = q.question_id;

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
                    const currentTime = timerRef.current?.getCurrentTime?.();
                    if (currentTime !== undefined) {
                      const savedTimers = JSON.parse(
                        localStorage.getItem("testQuestionTimers") || "{}"
                      );
                      savedTimers[currentQuestion] = currentTime * 1000;
                      localStorage.setItem(
                        "testQuestionTimers",
                        JSON.stringify(savedTimers)
                      );
                    }
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

        {/* Add Finish Test button */}
        {currentQuestion === currentModule.questions.length - 1 &&
          isLastModule && (
            <button
              className="nav-button finish-test"
              onClick={handleFinishTest}
            >
              Finish Test <i className="fas fa-check"></i>
            </button>
          )}
      </div>
    </div>
  );
};

export default TestInterface;
