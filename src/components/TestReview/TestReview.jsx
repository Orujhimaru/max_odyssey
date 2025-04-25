import React, { useState, useEffect } from "react";
import QuestionNavigator from "./QuestionNavigator";
import { mockQuestions } from "../../data/mockQuestions";
import "./TestReview.css";
import { api } from "../../services/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { formatMathExpression } from "../../utils/mathUtils";

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
        const data = await api.getExamById(id);
        setExamData(data);

        // Process questions for display
        if (data && data.exam_data && Array.isArray(data.exam_data)) {
          const allQuestions = [];

          // Process each module's questions
          data.exam_data.forEach((module, moduleIndex) => {
            if (module && module.questions && Array.isArray(module.questions)) {
              module.questions.forEach((q) => {
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
                      ? q.options.map((o) => ({
                          id: o.id,
                          text: o.text,
                        }))
                      : [],
                  correctAnswer: q.correct_answer,
                  userAnswer: userAnswer,
                  explanation: q.explanation || "No explanation available",
                  isBookmarked: false,
                  difficulty: q.difficulty || "medium",
                  topic: q.topic || "General",
                  subtopic: q.subtopic || "",
                  svg_image: q.svg_image || "",
                  html_table: q.html_table || "",
                  passage: q.passage || "",
                  moduleIndex: moduleIndex,
                  moduleName: `Section ${moduleIndex + 1}, Module ${
                    moduleIndex + 1
                  }: ${moduleIndex < 2 ? "Reading and Writing" : "Math"}`,
                });
              });
            }
          });

          setQuestions(allQuestions);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching exam data:", error);
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

  const question = questions[currentQuestion];

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

          {/* Add SVG Image display */}
          {question.svg_image && question.svg_image.trim() !== "" && (
            <div className="images-container">
              <div
                className="question-image question-image-with-svg"
                dangerouslySetInnerHTML={{ __html: question.svg_image }}
              />
            </div>
          )}

          {/* Add HTML Table display */}
          {question.html_table && question.html_table.trim() !== "" && (
            <div className="images-container">
              <div
                className="question-image"
                dangerouslySetInnerHTML={{ __html: question.html_table }}
              />
            </div>
          )}

          {/* Passage display */}
          {question.passage && question.passage.trim() !== "" && (
            <div className="passage">
              <div dangerouslySetInnerHTML={{ __html: question.passage }} />
            </div>
          )}

          <div className="question">
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

                  // Find all KaTeX elements
                  const katexElements = childArray.filter(
                    (child) =>
                      React.isValidElement(child) &&
                      child.props &&
                      child.props.className &&
                      child.props.className.includes("katex")
                  );

                  // Apply block display to all KaTeX elements
                  return (
                    <div {...props}>
                      {React.Children.map(children, (child) => {
                        if (
                          React.isValidElement(child) &&
                          child.props &&
                          child.props.className &&
                          child.props.className.includes("katex")
                        ) {
                          return React.cloneElement(child, {
                            style: {
                              display: "block",
                              marginBottom: "10px",
                            },
                          });
                        }
                        return child;
                      })}
                    </div>
                  );
                },
              }}
            >
              {formatMathExpression(question.question)}
            </ReactMarkdown>

            <div className="choices">
              {question.choices &&
                Array.isArray(question.choices) &&
                question.choices.map((choice, index) => {
                  const choiceId = choice.id;
                  const isCorrect = choiceId === question.correctAnswer;
                  const isUserAnswer =
                    choiceId === question.userAnswer && !isCorrect;

                  return (
                    <div
                      key={index}
                      className={`choice ${isCorrect ? "correct" : ""} ${
                        isUserAnswer ? "incorrect" : ""
                      }`}
                    >
                      <span className="choice-letter">{choiceId}</span>
                      <span className="choice-content">
                        {choice.text && choice.text.includes("<") ? (
                          <div
                            dangerouslySetInnerHTML={{ __html: choice.text }}
                          />
                        ) : (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                          >
                            {formatMathExpression(choice.text)}
                          </ReactMarkdown>
                        )}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Explanation Section */}
        <div className="explanation-section">
          <h3>Explanation</h3>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {formatMathExpression(question.explanation)}
          </ReactMarkdown>
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
