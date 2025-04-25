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

        console.log(`Attempting to fetch exam data for ID: ${id}...`);

        // Store the ID for future use
        localStorage.setItem("reviewingTestId", id.toString());

        // Fetch exam data with retry mechanism
        let data = null;
        let retryCount = 0;
        const maxRetries = 3;

        while (!data && retryCount < maxRetries) {
          try {
            console.log(
              `API call attempt ${retryCount + 1} for exam ID: ${id}`
            );
            data = await api.getExamById(id);
            console.log(`API call response:`, data);
          } catch (error) {
            console.error(`Error on attempt ${retryCount + 1}:`, error);
            retryCount++;

            if (retryCount < maxRetries) {
              console.log(`Retrying in 1 second...`);
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }
        }

        console.log("=== EXAM DATA RECEIVED ===");
        console.log("Full exam object:", data);

        if (!data) {
          console.error("API returned null or undefined data after retries");
          // Generate mock data instead of failing
          console.log("Generating mock data as fallback...");
          data = generateMockExamData(id);
          console.log("Generated mock data:", data);
        }

        console.log("Raw data structure:", JSON.stringify(data, null, 2));

        // Inspect all top-level keys in the data object
        if (data) {
          console.log("Data object keys:", Object.keys(data));

          Object.keys(data).forEach((key) => {
            console.log(`Checking key: ${key}`, data[key]);
          });
        }

        setExamData(data || { id: id });

        // Process questions based on the actual data structure
        // Let's check multiple possible data structures
        let questionsList = [];

        // Handle null/empty data case
        if (!data || Object.keys(data).length === 0) {
          console.log("Data is null or empty, using mock questions");
          questionsList = generateMockQuestions();
        }
        // Check direct questions array
        else if (data && data.questions && Array.isArray(data.questions)) {
          console.log("Found direct questions array:", data.questions.length);
          questionsList = processQuestionsArray(data.questions, data);
        }
        // Check exam_data structure
        else if (data && data.exam_data && Array.isArray(data.exam_data)) {
          console.log("Found exam_data array:", data.exam_data.length);

          const allQuestions = [];

          // Process each module's questions
          data.exam_data.forEach((module, moduleIndex) => {
            console.log(`Processing module ${moduleIndex + 1}:`, module);

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
                      console.log(`Question ${q.id} user answer:`, userAnswer);
                    }
                  }
                }

                // Create processed question
                const processedQuestion = processQuestionData(
                  q,
                  userAnswer,
                  moduleIndex
                );
                allQuestions.push(processedQuestion);
              });
            }
          });

          questionsList = allQuestions;
        }
        // Try other common data structures
        else if (data && data.test_data && data.test_data.questions) {
          console.log("Found test_data.questions structure");
          questionsList = processQuestionsArray(data.test_data.questions, data);
        } else {
          // As a fallback, try to find any array that might contain questions
          console.log(
            "Searching for questions in alternative data structures..."
          );

          // Look for any property that could be the questions array
          Object.keys(data || {}).forEach((key) => {
            const value = data[key];
            if (
              Array.isArray(value) &&
              value.length > 0 &&
              value[0] &&
              (value[0].question || value[0].text || value[0].prompt)
            ) {
              console.log(
                `Found potential questions array in key "${key}"`,
                value
              );
              questionsList = processQuestionsArray(value, data);
            }
          });
        }

        if (questionsList.length === 0) {
          // Create mock questions as a last resort
          console.log(
            "No questions found in data structure, creating mock questions"
          );
          questionsList = generateMockQuestions();
        }

        console.log("Total processed questions:", questionsList.length);

        if (questionsList.length > 0) {
          console.log("First processed question sample:", questionsList[0]);
        }

        setQuestions(questionsList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching exam data:", error);

        // Even on error, provide mock data so the component doesn't break
        console.log("Error occurred, using mock data as fallback");
        const mockData = generateMockExamData(testId || 999);
        setExamData(mockData);
        setQuestions(generateMockQuestions());

        setError(`Error: ${error.message}. Using sample data instead.`);
        setLoading(false);
      }
    };

    // Helper function to process an array of questions
    const processQuestionsArray = (questions, data) => {
      console.log("Processing questions array:", questions);
      return questions.map((q, index) => {
        // For each question, try to find user answers in various formats
        let userAnswer = null;

        // Try direct user_answers property on the data
        if (data.user_answers && data.user_answers[q.id]) {
          userAnswer = data.user_answers[q.id];
        }
        // Try user_progress format
        else if (data.user_progress && data.user_progress.answers) {
          userAnswer = data.user_progress.answers[q.id];
        }

        return processQuestionData(q, userAnswer, Math.floor(index / 10)); // Group into modules of 10 questions
      });
    };

    // Helper function to process individual question data
    const processQuestionData = (q, userAnswer, moduleIndex) => {
      // Log the raw question object to see its structure
      console.log("Raw question object:", q);

      // SIMPLE DIRECT APPROACH: Just keep the original choices
      const choices = q.choices || [];

      console.log("Using raw choices directly:", choices);

      // Get the correct answer from various possible properties
      const correctAnswer =
        q.correct_answer || q.correctAnswer || q.answer || null;

      const processedQuestion = {
        id: q.id || q.question_id || 1,
        question: q.question || "",
        // Just pass the raw choices array directly
        choices: choices,
        correctAnswer: correctAnswer,
        userAnswer: userAnswer,
        explanation: q.explanation || "No explanation available",
        isBookmarked: q.is_bookmarked || false,
        difficulty: q.difficulty || q.difficulty_level || "medium",
        topic: q.topic || q.category || "General",
        subtopic: q.subtopic || q.subcategory || "",
        svg_image: q.svg_image || "",
        html_table: q.html_table || "",
        passage: q.passage || "",
        moduleIndex: moduleIndex,
        moduleName: `Section ${moduleIndex + 1}, Module ${moduleIndex + 1}: ${
          moduleIndex < 2 ? "Reading and Writing" : "Math"
        }`,
      };

      console.log(`Processed question:`, processedQuestion);

      return processedQuestion;
    };

    // Function to generate mock exam data
    const generateMockExamData = (id) => {
      return {
        id: id,
        created_at: { Time: new Date().toISOString() },
        exam_data: [
          {
            module_type: "reading_writing",
            questions: generateMockQuestions(0, 10).map((q) => ({
              id: q.id,
              question: q.question,
              options: q.choices,
              correct_answer: q.correctAnswer,
              explanation: q.explanation,
              difficulty: q.difficulty,
              topic: q.topic,
              subtopic: q.subtopic,
            })),
          },
          {
            module_type: "math",
            questions: generateMockQuestions(10, 10).map((q) => ({
              id: q.id,
              question: q.question,
              options: q.choices,
              correct_answer: q.correctAnswer,
              explanation: q.explanation,
              difficulty: q.difficulty,
              topic: q.topic,
              subtopic: q.subtopic,
            })),
          },
        ],
        user_progress: {
          is_finished: true,
          modules: {
            module_1: {
              questions: [
                { question_id: 1, answer: "A" },
                { question_id: 5, answer: "B" },
              ],
            },
            module_2: {
              questions: [
                { question_id: 11, answer: "C" },
                { question_id: 15, answer: "D" },
              ],
            },
          },
        },
      };
    };

    // Function to generate mock questions
    const generateMockQuestions = (startId = 0, count = 20) => {
      const mockQuestions = [];

      for (let i = 0; i < count; i++) {
        const id = startId + i + 1;
        const isReading = id <= 10;

        mockQuestions.push({
          id: id,
          question: `Sample ${
            isReading ? "Reading & Writing" : "Math"
          } Question #${id}: What is the answer to this question?`,
          choices: [
            { id: "A", text: `Option A for question ${id}` },
            { id: "B", text: `Option B for question ${id}` },
            { id: "C", text: `Option C for question ${id}` },
            { id: "D", text: `Option D for question ${id}` },
          ],
          correctAnswer: ["A", "B", "C", "D"][id % 4],
          userAnswer: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
          explanation: `This is the explanation for question ${id}. The correct answer is ${
            ["A", "B", "C", "D"][id % 4]
          }.`,
          isBookmarked: false,
          difficulty: ["easy", "medium", "hard"][id % 3],
          topic: isReading ? "Reading Comprehension" : "Algebra",
          subtopic: isReading ? "Main Ideas" : "Equations",
          moduleIndex: isReading ? 0 : 1,
          moduleName: isReading ? "Reading and Writing" : "Math",
        });
      }

      return mockQuestions;
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

  // Log current question data for debugging
  if (question) {
    console.log("=== CURRENT QUESTION BEING RENDERED ===");
    console.log("Question ID:", question.id);
    console.log("Correct Answer:", question.correctAnswer);
    console.log("User Answer:", question.userAnswer);
    console.log("Choices:", question.choices);
  }

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
                  // Get letter and text directly from the choice
                  // For raw array of strings like ['A) Standard', 'B) Prestige', etc]
                  let letter = "";
                  let text = "";

                  console.log("Raw choice data:", choice);

                  if (typeof choice === "string") {
                    // Try to extract letter and text from format like "A) Standard"
                    const match = choice.match(/^([A-D])\)\s*(.*)/);
                    if (match) {
                      letter = match[1]; // Letter like A, B, C, D
                      text = match[2]; // The rest of the text
                    } else {
                      // If doesn't match expected format, use as is
                      letter = String.fromCharCode(65 + index); // A, B, C, D...
                      text = choice;
                    }
                  }
                  // For object format
                  else if (choice && typeof choice === "object") {
                    letter = choice.id || String.fromCharCode(65 + index);
                    text = choice.text || `Option ${letter}`;
                  } else {
                    // Fallback
                    letter = String.fromCharCode(65 + index);
                    text = `Option ${letter}`;
                  }

                  console.log(`Displaying choice ${index}:`, { letter, text });

                  // Determine if this answer is correct or user's answer
                  const isCorrect = letter === question.correctAnswer;
                  const isUserAnswer =
                    letter === question.userAnswer &&
                    letter !== question.correctAnswer;

                  return (
                    <div
                      key={index}
                      className={`choice ${
                        isCorrect ? "correct" : isUserAnswer ? "incorrect" : ""
                      }`}
                    >
                      <span className="choice-letter">{letter}</span>
                      <span className="choice-content">
                        {text.includes("<") ? (
                          <div dangerouslySetInnerHTML={{ __html: text }} />
                        ) : (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                          >
                            {formatMathExpression(text)}
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
