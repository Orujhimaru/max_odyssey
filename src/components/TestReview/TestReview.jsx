import React, { useState, useEffect } from "react";
import QuestionNavigator from "./QuestionNavigator";
import { mockQuestions } from "../../data/mockQuestions";
import "./TestReview.css";
import { api } from "../../services/api";

const TestReview = ({ testId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);

  // Use effect to fetch exam data when component mounts
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setLoading(true);

        // If testId is provided, use it directly
        let id = testId;

        // If no testId is provided, get it from state or localStorage
        if (!id) {
          const storedId = localStorage.getItem("reviewingTestId");
          if (storedId) {
            id = parseInt(storedId);
          }
        }

        if (!id) {
          throw new Error("No test ID provided for review");
        }

        // Store the ID for future use
        localStorage.setItem("reviewingTestId", id.toString());

        // Fetch exam data
        console.log(`TestReview: Fetching exam data for ID ${id}`);
        const data = await api.getExamById(id);
        console.log(`TestReview: Received exam data:`, data);
        setExamData(data);

        // Process questions for display
        if (data && data.exam_data && Array.isArray(data.exam_data)) {
          console.log(
            `TestReview: Processing ${data.exam_data.length} modules`
          );
          const allQuestions = [];

          // Process each module's questions
          data.exam_data.forEach((module, moduleIndex) => {
            try {
              console.log(`TestReview: Processing module ${moduleIndex + 1}`);

              if (!module) {
                console.warn(
                  `TestReview: Module ${moduleIndex + 1} is undefined`
                );
                return;
              }

              if (!module.questions) {
                console.warn(
                  `TestReview: No questions in module ${moduleIndex + 1}`
                );
                return;
              }

              if (!Array.isArray(module.questions)) {
                console.warn(
                  `TestReview: Questions in module ${
                    moduleIndex + 1
                  } is not an array:`,
                  module.questions
                );
                return;
              }

              console.log(
                `TestReview: Processing ${
                  module.questions.length
                } questions in module ${moduleIndex + 1}`
              );

              module.questions.forEach((q, qIndex) => {
                try {
                  if (!q) {
                    console.warn(
                      `TestReview: Question ${qIndex} in module ${
                        moduleIndex + 1
                      } is undefined`
                    );
                    return;
                  }

                  console.log(
                    `TestReview: Processing question ID ${q.id || "unknown"}`
                  );

                  // Find user's answer for this question
                  let userAnswer = null;
                  if (data.user_progress && data.user_progress.modules) {
                    const moduleKey = `module_${moduleIndex + 1}`;
                    const moduleData = data.user_progress.modules[moduleKey];

                    if (moduleData && moduleData.questions) {
                      const answerData = moduleData.questions.find(
                        (a) => a.question_id === q.id
                      );
                      if (answerData) {
                        userAnswer = answerData.answer;
                      }
                    }
                  }

                  // Create processed question
                  allQuestions.push({
                    id: q.id,
                    question: q.question,
                    choices:
                      q.options && Array.isArray(q.options)
                        ? q.options.map((o) => `${o.id}) ${o.text}`)
                        : [],
                    correctAnswer: q.correct_answer,
                    userAnswer: userAnswer,
                    explanation: q.explanation || "No explanation available",
                    isBookmarked: false,
                    difficulty: q.difficulty || "medium",
                    topic: q.topic || "General",
                    subtopic: q.subtopic || "",
                    moduleIndex: moduleIndex,
                    moduleName: `Section ${moduleIndex + 1}, Module ${
                      moduleIndex + 1
                    }: ${moduleIndex < 2 ? "Reading and Writing" : "Math"}`,
                  });
                } catch (qError) {
                  console.error(
                    `TestReview: Error processing question ${qIndex} in module ${
                      moduleIndex + 1
                    }:`,
                    qError
                  );
                }
              });
            } catch (moduleError) {
              console.error(
                `TestReview: Error processing module ${moduleIndex + 1}:`,
                moduleError
              );
            }
          });

          console.log(
            `TestReview: Processed ${allQuestions.length} questions total`
          );
          setQuestions(allQuestions);
        } else {
          console.warn("TestReview: Invalid exam data structure:", data);
          setError("Invalid exam data structure");
        }

        setLoading(false);
      } catch (error) {
        console.error("TestReview: Error fetching exam data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchExamData();
  }, [testId]);

  // If loading or error, show appropriate message
  if (loading) {
    return <div className="loading">Loading test data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!questions || questions.length === 0) {
    return <div className="error">No questions found for review</div>;
  }

  // Safely get the current question with a fallback
  const question = questions[currentQuestion] || {
    id: "unknown",
    question: "Question data unavailable",
    choices: [],
    correctAnswer: "",
    userAnswer: "",
    explanation: "No explanation available",
    isBookmarked: false,
    difficulty: "medium",
    topic: "General",
    subtopic: "",
    moduleIndex: 0,
    moduleName: "Unknown module",
  };

  return (
    <div className="test-review-container">
      {/* Header Section */}
      <div className="test-review-header">
        <div className="test-info">
          <h2>Practice Test #{examData?.id || "N/A"}</h2>
          <span>
            Date:{" "}
            {examData?.created_at?.Time
              ? new Date(examData.created_at.Time).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
        <h2 className="test-review-header-h2 ">
          {question?.moduleName || "Test Review"}
        </h2>
      </div>

      {/* Navigation Button */}
      <div className="navigation-controls">
        <button
          className="nav-button"
          onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
        >
          <i className="fas fa-chevron-left"></i>
          Previous
        </button>

        <button
          className="question-counter"
          onClick={() => setIsNavigatorOpen(!isNavigatorOpen)}
        >
          Question {currentQuestion + 1} of {questions.length}
          <i
            className={`review-dropdown fas fa-chevron-${
              isNavigatorOpen ? "up" : "down"
            }`}
          ></i>
        </button>

        <button
          className="nav-button"
          onClick={() =>
            setCurrentQuestion((prev) =>
              Math.min(questions.length - 1, prev + 1)
            )
          }
          disabled={currentQuestion === questions.length - 1}
        >
          Next
          <i className="fas fa-chevron-right"></i>
        </button>

        {isNavigatorOpen && (
          <QuestionNavigator
            questions={questions}
            currentQuestion={currentQuestion}
            onSelect={(index) => {
              setCurrentQuestion(index);
              setIsNavigatorOpen(false);
            }}
          />
        )}
      </div>

      {/* Main Content */}
      <div className="test-review-content">
        {/* Question Section */}
        <div className="question-section">
          <div className="question-type">
            <div className="dif-indicator-container">
              <span
                className={`difficulty-indicator ${question.difficulty.toLowerCase()}`}
              >
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
              </span>
            </div>
            <span className="topic">{question.topic}</span>
            <span className="subtopic">{question.subtopic}</span>
          </div>

          {question.passage && (
            <div className="passage">{question.passage}</div>
          )}
          <div className="question">
            <p>{question.question}</p>
            <div className="choices">
              {question.choices.map((choice, index) => {
                // Add defensive coding to handle potentially invalid format
                let letter = "";
                let text = "";

                try {
                  const parts = choice.split(") ");
                  letter = parts[0] || "";
                  text = parts.length > 1 ? parts.slice(1).join(") ") : "";
                } catch (err) {
                  console.error("Error parsing choice:", choice, err);
                  letter = `Option ${index + 1}`;
                  text = choice || "";
                }

                return (
                  <div
                    key={index}
                    className={`choice ${
                      choice.startsWith(question.correctAnswer)
                        ? "correct"
                        : choice.startsWith(question.userAnswer)
                        ? "incorrect"
                        : ""
                    }`}
                  >
                    <span className="choice-letter">{letter}</span>
                    <span>{text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Explanation Section */}
        <div className="explanation-section">
          <h3>Explanation</h3>
          <p>{question.explanation}</p>
          <div className="question-actions">
            <button className="bookmark-btn">
              <i
                className={`fas fa-bookmark ${
                  question.isBookmarked ? "active" : ""
                }`}
              ></i>
              Bookmark
            </button>
            <button className="report-btn">
              <i className="fas fa-flag"></i>
              Report Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestReview;
