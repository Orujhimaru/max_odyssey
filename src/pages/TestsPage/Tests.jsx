import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Tests.css";
import TestInterface from "./TestInterface";
import TestReview from "../../components/TestReview/TestReview";
import { api } from "../../services/api";

const Tests = () => {
  const [showNewTestModal, setShowNewTestModal] = useState(false);
  const [activeTest, setActiveTest] = useState(null);
  const [testInProgress, setTestInProgress] = useState(false);
  const [reviewingTest, setReviewingTest] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch exam results when component mounts
  useEffect(() => {
    const fetchExamResults = async () => {
      try {
        setLoading(true);
        const results = await api.getUserExamResults();
        // Check if results is an array, if not, handle accordingly
        if (Array.isArray(results)) {
          setExamResults(results);
        } else if (results && Array.isArray(results.data)) {
          // If the API returns { data: [...] } structure
          setExamResults(results.data);
        } else {
          // If it's not an array at all, set to empty array
          console.error("API returned unexpected format:", results);
          setExamResults([]);
        }
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch exam results:", err);
        setExamResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExamResults();
  }, []);

  // Add this to debug the structure
  console.log("Exam results structure:", examResults);

  // Mock data for recent tests
  // const recentTests = [
  //   {
  //     id: 1,
  //     name: "Practice Test #1",
  //     date: "May 15, 2023",
  //     score: 1420,
  //     verbal: 710,
  //     math: 710,
  //     completed: true,
  //   },
  //   {
  //     id: 2,
  //     name: "Practice Test #2",
  //     date: "June 3, 2023",
  //     score: 1480,
  //     verbal: 730,
  //     math: 750,
  //     completed: true,
  //   },
  //   {
  //     id: 3,
  //     name: "Practice Test #3",
  //     date: "June 28, 2023",
  //     score: 1510,
  //     verbal: 750,
  //     math: 760,
  //     completed: true,
  //   },
  //   {
  //     id: 4,
  //     name: "Official SAT Practice Test",
  //     date: "July 12, 2023",
  //     score: null,
  //     verbal: null,
  //     math: null,
  //     completed: false,
  //   },
  // ];

  const openNewTestModal = () => {
    setShowNewTestModal(true);
  };

  const closeNewTestModal = () => {
    setShowNewTestModal(false);
  };

  const startTest = (testType) => {
    setActiveTest(testType);
    setTestInProgress(true);
    setShowNewTestModal(false);
  };

  const exitTest = () => {
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

  if (testInProgress) {
    return <TestInterface testType={activeTest} onExit={exitTest} />;
  }

  return (
    <div className="tests-page">
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

            {loading ? (
              <div className="loading-message">Loading exam results...</div>
            ) : error ? (
              <div className="error-message">Error: {error}</div>
            ) : !examResults || examResults.length === 0 ? (
              <div className="no-tests-message">
                No test results found. Take a test to see your results here.
              </div>
            ) : (
              examResults.map((test, index) => (
                <div className="test-item" key={index}>
                  <div className="test-name">
                    Practice Test #{test.exam_number}
                  </div>
                  <div className="test-date">
                    {new Date(test.created_at.Time).toLocaleDateString()}
                  </div>
                  <div className="test-score">
                    {test.verbal_score && test.math_score
                      ? test.verbal_score.Int32 + test.math_score.Int32
                      : "In Progress"}
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
                        <button className="delete-button">
                          <i className="fas fa-trash"></i>
                        </button>
                      </>
                    ) : (
                      <button className="continue-button">
                        <i className="fas fa-play"></i> Continue
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="new-test-button" onClick={openNewTestModal}>
            <i className="fas fa-plus"></i> Take a New Test
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
                className="test-option"
                onClick={() => startTest("official")}
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

              <div className="test-option" onClick={() => startTest("quick")}>
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
                className="test-option"
                onClick={() => startTest("challenge")}
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
              <button
                className="start-test-button"
                onClick={() => startTest("official")}
              >
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
