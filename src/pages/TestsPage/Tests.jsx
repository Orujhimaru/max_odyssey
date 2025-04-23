import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Tests.css";
import TestInterface from "./TestInterface";
import TestReview from "../../components/TestReview/TestReview";
import { api } from "../../services/api";

// Debug logging
console.log("Tests.jsx module loaded");
let testsComponentMountCount = 0;

const Tests = () => {
  // Create component instance ID for tracking
  const componentIdRef = useRef(`Tests_${++testsComponentMountCount}`);
  const componentId = componentIdRef.current;

  console.log(`${componentId}: Component rendering`);

  const [showNewTestModal, setShowNewTestModal] = useState(false);
  const [activeTest, setActiveTest] = useState(null);
  const [testInProgress, setTestInProgress] = useState(false);
  const [reviewingTest, setReviewingTest] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasOngoingTest, setHasOngoingTest] = useState(false);
  const [selectedTestType, setSelectedTestType] = useState("official"); // Default selection
  const navigate = useNavigate();

  // Track component lifecycle
  useEffect(() => {
    console.log(`${componentId}: Component mounted`);

    return () => {
      console.log(`${componentId}: Component unmounting`);
    };
  }, [componentId]);

  // Fetch exam results when component mounts
  useEffect(() => {
    console.log(`${componentId}: Fetching exam results effect running`);

    const fetchExamResults = async () => {
      try {
        console.log(`${componentId}: Starting exam results fetch`);
        setLoading(true);
        const results = await api.getUserExamResults();
        console.log(`${componentId}: Received exam results:`, results);

        // Check if results is an array, if not, handle accordingly
        if (Array.isArray(results)) {
          setExamResults(results);
          // Check if there's an ongoing test
          const ongoingTest = results.some(
            (test) => !test.verbal_score || !test.math_score
          );
          setHasOngoingTest(ongoingTest);
        } else if (results && Array.isArray(results.data)) {
          // If the API returns { data: [...] } structure
          setExamResults(results.data);
          // Check if there's an ongoing test
          const ongoingTest = results.data.some(
            (test) => !test.verbal_score || !test.math_score
          );
          setHasOngoingTest(ongoingTest);
        } else {
          // If it's not an array at all, set to empty array
          console.error(
            `${componentId}: API returned unexpected format:`,
            results
          );
          setExamResults([]);
          setHasOngoingTest(false);
        }
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error(`${componentId}: Failed to fetch exam results:`, err);
        setExamResults([]);
        setHasOngoingTest(false);
      } finally {
        setLoading(false);
      }
    };

    fetchExamResults();

    return () => {
      console.log(`${componentId}: Exam results fetch effect cleanup`);
    };
  }, [componentId]);

  // Add this to debug the structure
  console.log(`${componentId}: Exam results structure:`, examResults);

  const openNewTestModal = () => {
    console.log(`${componentId}: Opening new test modal`);
    if (hasOngoingTest) {
      alert(
        "You already have a test in progress. Please complete or delete it before starting a new one."
      );
      return;
    }
    setShowNewTestModal(true);
  };

  const closeNewTestModal = () => {
    console.log(`${componentId}: Closing new test modal`);
    setShowNewTestModal(false);
    setSelectedTestType("official"); // Reset to default selection
  };

  // Just select the test type without starting
  const handleSelectTestType = (testType) => {
    console.log(`${componentId}: Selected test type:`, testType);
    setSelectedTestType(testType);
  };

  // Start the test with the selected type
  const startTest = () => {
    console.log(`${componentId}: Starting test of type:`, selectedTestType);
    setActiveTest({ type: selectedTestType });
    setTestInProgress(true);
    setShowNewTestModal(false);
  };

  const continueTest = async (test) => {
    console.log(`${componentId}: Continuing test:`, test.id);
    try {
      setLoading(true);
      // Fetch the complete exam data using the test ID
      const examData = await api.getExamById(test.id);
      console.log(
        `${componentId}: Retrieved exam data for continuing:`,
        examData
      );

      // Check if we have user progress data in the new format
      if (examData.user_progress && examData.user_progress.modules) {
        console.log("Found user progress data:", examData.user_progress);

        // Keep track of the current module from user progress
        const currentModule = examData.user_progress.current_module || 1;

        // Update the current_module in the exam data
        examData.current_module = currentModule;

        // Save the user progress to localStorage in the exact format
        localStorage.setItem(
          "testUserProgress",
          JSON.stringify({ user_progress: examData.user_progress })
        );

        // Convert the user progress to the format needed for selectedAnswers in TestInterface
        const userAnswers = {};
        let lastQuestionIndex = 0;
        let lastModuleIndex = 0;
        let foundAnsweredQuestions = false;

        // Process each module's questions to find the last answered question
        Object.entries(examData.user_progress.modules).forEach(
          ([moduleKey, moduleData]) => {
            // Get module index (0-based)
            const moduleIndex = parseInt(moduleKey.replace("module_", "")) - 1;

            if (moduleData.questions && Array.isArray(moduleData.questions)) {
              moduleData.questions.forEach((question) => {
                const questionId = question.question_id;
                const questionIndex = questionId - 1; // Convert 1-based to 0-based

                // Create a key for this answer
                const storageKey = `${questionIndex}`;

                // Store the answer
                userAnswers[storageKey] = {
                  module_index: moduleIndex,
                  question_index: questionIndex,
                  selected_option: question.answer,
                };

                // Keep track of the last question answered in the current module
                if (moduleIndex === currentModule - 1) {
                  foundAnsweredQuestions = true;
                  if (questionIndex > lastQuestionIndex) {
                    lastQuestionIndex = questionIndex;
                  }
                }

                // Also track the last module with any answers
                if (moduleIndex > lastModuleIndex) {
                  lastModuleIndex = moduleIndex;
                }
              });
            }
          }
        );

        // If we didn't find any answered questions in the current module,
        // we'll default to the first question (which is already 0)
        console.log(
          `Last question index identified: ${lastQuestionIndex} in module ${currentModule}`
        );

        // Save the converted user answers to localStorage
        localStorage.setItem("testUserAnswers", JSON.stringify(userAnswers));

        // Set the active test with the retrieved data
        // Include the last question position so we can jump directly to it
        setActiveTest({
          type: "continue",
          examData: examData,
          testId: test.id,
          lastQuestionIndex: lastQuestionIndex,
          lastModuleIndex: lastModuleIndex,
        });
      } else {
        console.warn("No user progress data found or in unexpected format");

        // Set the active test with just the exam data
        setActiveTest({
          type: "continue",
          examData: examData,
          testId: test.id,
        });
      }

      // Store the exam ID in localStorage for resuming later if needed
      localStorage.setItem("currentExamId", test.id);

      setTestInProgress(true);
    } catch (error) {
      console.error(`${componentId}: Failed to load test:`, error);
      alert(`Failed to load test: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const exitTest = () => {
    console.log(`${componentId}: Exiting test`);
    if (
      window.confirm(
        "Are you sure you want to exit? Your progress will be saved."
      )
    ) {
      setTestInProgress(false);
      setActiveTest(null);
    }
  };

  const handleReviewClick = (test) => {
    setReviewingTest(test);
  };

  const handleCloseReview = () => {
    setReviewingTest(null);
  };

  const handleDeleteTest = async (test) => {
    if (
      window.confirm(
        `Are you sure you want to delete Practice Test #${test.id}? This action cannot be undone.`
      )
    ) {
      try {
        await api.removeExamById(test.id);
        // After successful deletion, refresh the exam results
        const results = await api.getUserExamResults();

        if (Array.isArray(results)) {
          setExamResults(results);
          const ongoingTest = results.some(
            (test) => !test.verbal_score || !test.math_score
          );
          setHasOngoingTest(ongoingTest);
        } else if (results && Array.isArray(results.data)) {
          setExamResults(results.data);
          const ongoingTest = results.data.some(
            (test) => !test.verbal_score || !test.math_score
          );
          setHasOngoingTest(ongoingTest);
        } else {
          setExamResults([]);
          setHasOngoingTest(false);
        }
      } catch (error) {
        console.error("Failed to delete test:", error);
        alert(`Failed to delete test: ${error.message}`);
      }
    }
  };

  if (testInProgress) {
    return <TestInterface testType={activeTest} onExit={exitTest} />;
  }

  return (
    <div className="tests-page">
      {loading && (
        <div className="global-loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {reviewingTest ? (
        <TestReview />
      ) : (
        <div className="tests-container">
          <div className="tests-header">
            <div className="header-with-icon">
              <h1>Test Center</h1>
              <span className="header-emoji">✍️</span>
            </div>
          </div>

          <div className="tests-tabs">
            <div className="tab active">Recent Tests</div>
            {/* <div className="tab">Saved Tests</div>
            <div className="tab">Test History</div> */}
          </div>

          <div className="tests-list">
            <div className="tests-list-header">
              <span className="test-name-header">Test Name</span>
              <span className="test-date-header">Date</span>
              <span className="test-score-header">Total Score</span>
              <span className="test-verbal-header">Verbal</span>
              <span className="test-math-header">Math</span>
              <span className="test-actions-header pleft">Actions</span>
            </div>

            {loading && !examResults.length ? (
              <div className="loading-message">Loading exam results...</div>
            ) : error ? (
              <div className="error-message">Error: {error}</div>
            ) : !examResults || examResults.length === 0 ? (
              <div className="no-tests-message">
                No test results found. Take a test to see your results here.
              </div>
            ) : (
              examResults.map((test, index) => {
                const isInProgress = !test.verbal_score || !test.math_score;
                return (
                  <div
                    className={`test-item ${isInProgress ? "in-progress" : ""}`}
                    key={index}
                  >
                    <div className="test-name">
                      Practice Test #{test.id}
                      {isInProgress && (
                        <span className="in-progress-badge">In Progress</span>
                      )}
                    </div>
                    <div className="test-date">
                      {new Date(test.created_at.Time).toLocaleDateString()}
                    </div>
                    <div className="test-score">
                      {test.verbal_score && test.math_score
                        ? test.verbal_score.Int32 + test.math_score.Int32
                        : "-"}
                    </div>
                    <div className="test-verbal">
                      {test.verbal_score ? test.verbal_score.Int32 : "-"}
                    </div>
                    <div className="test-math">
                      {test.math_score ? test.math_score.Int32 : "-"}
                    </div>
                    <div className="test-actions">
                      {test.verbal_score && test.math_score ? (
                        <>
                          <button
                            className="review-button"
                            onClick={() => handleReviewClick(test)}
                          >
                            <i className="fas fa-eye"></i> Review
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteTest(test)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="continue-button"
                            onClick={() => continueTest(test)}
                          >
                            <i className="fas fa-play"></i> Continue
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteTest(test)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <button
            className={`new-test-button ${hasOngoingTest ? "disabled" : ""}`}
            onClick={openNewTestModal}
            disabled={hasOngoingTest}
          >
            <i className="fas fa-plus"></i> Take a New Test
            {hasOngoingTest && (
              <span className="tooltip">
                Complete or delete your ongoing test first
              </span>
            )}
          </button>
        </div>
      )}

      {showNewTestModal && (
        <div className="modal-overlay">
          <div className="new-test-modal">
            <div className="modal-header">
              <h2>Select a Test</h2>
              <button className="close-button" onClick={closeNewTestModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="test-options">
              <div
                className={`test-option ${
                  selectedTestType === "official" ? "selected" : ""
                }`}
                onClick={() => handleSelectTestType("official")}
              >
                <div className="test-option-icon">
                  <i className="fas fa-book"></i>
                </div>
                <div className="test-option-details">
                  <h3>Official SAT Practice Test</h3>
                  <p>Complete full-length SAT test with all sections</p>
                </div>
                <div className="test-option-time">
                  <i className="far fa-clock"></i> 3h 15m
                </div>
              </div>

              <div
                className={`test-option ${
                  selectedTestType === "quick" ? "selected" : ""
                }`}
                onClick={() => handleSelectTestType("quick")}
              >
                <div className="test-option-icon">
                  <i className="fas fa-stopwatch"></i>
                </div>
                <div className="test-option-details">
                  <h3>Quick Practice Test</h3>
                  <p>Shorter version with key question types</p>
                </div>
                <div className="test-option-time">
                  <i className="far fa-clock"></i> 1h 30m
                </div>
              </div>

              <div
                className={`test-option ${
                  selectedTestType === "challenge" ? "selected" : ""
                }`}
                onClick={() => handleSelectTestType("challenge")}
              >
                <div className="test-option-icon">
                  <i className="fas fa-fire"></i>
                </div>
                <div className="test-option-details">
                  <h3>Challenge Test</h3>
                  <p>Advanced difficulty questions for high scorers</p>
                </div>
                <div className="test-option-time">
                  <i className="far fa-clock"></i> 2h 45m
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-button" onClick={closeNewTestModal}>
                Cancel
              </button>
              <button className="start-test-button" onClick={startTest}>
                Start Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tests;
