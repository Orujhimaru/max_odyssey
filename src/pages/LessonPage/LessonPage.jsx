import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./LessonPage.css";

// Mock lesson content
const mockLessonContent = `
# What Is Docker?

## Introduction to Docker

Docker makes development efficient and predictable.

Docker takes away repetitive, mundane configuration tasks and is used throughout the development lifecycle for fast, easy and portable application development – desktop and cloud. Docker's comprehensive end to end platform includes UIs, CLIs, APIs and security that are engineered to work together across the entire application delivery lifecycle.

-- The Docker team

### Key Benefits of Docker

- **Portability**: "It works on my machine" becomes "It works on any machine"
- **Isolation**: Applications run in their own environment without conflicts
- **Efficiency**: Lightweight compared to full virtual machines
- **Scalability**: Easy to deploy multiple instances of the same application

## How Docker Works

To put it more simply: Docker allows us to deploy our applications inside "containers" which can be thought of as very lightweight virtual machines. Instead of just shipping an application, we can ship an application and the environment it's meant to run within.

### Containers vs Virtual Machines

Containers share the host system's kernel but run in isolated user spaces. This makes them:

1. Faster to start
2. More resource-efficient
3. Easier to distribute

### Core Concepts

- **Images**: Read-only templates with instructions for creating Docker containers
- **Containers**: Runnable instances of images
- **Dockerfile**: Text file with instructions to build a Docker image
- **Registry**: Storage for Docker images (like Docker Hub)

## Getting Started

In the next lesson, we'll learn how to install Docker and run our first container.
`;

// Mock course data with lessons
const coursesData = {
  1: {
    id: 1,
    title: "SAT Verbal",
    chapters: [
      {
        id: 1,
        title: "Reading Comprehension",
        description:
          "Learn to analyze and interpret complex passages effectively.",
        lessons: [
          { id: 101, title: "Understanding Main Ideas", completed: true },
          { id: 102, title: "Identifying Supporting Details", completed: true },
          { id: 103, title: "Drawing Inferences", completed: false },
          { id: 104, title: "Author's Purpose and Tone", completed: false },
        ],
      },
      {
        id: 2,
        title: "Writing and Language",
        description:
          "Develop skills to identify and fix grammatical errors in passages.",
        lessons: [
          { id: 201, title: "Sentence Structure", completed: true },
          { id: 202, title: "Punctuation Rules", completed: true },
          { id: 203, title: "Verb Tense and Agreement", completed: true },
          { id: 204, title: "Parallelism", completed: false },
        ],
      },
    ],
  },
  2: {
    id: 2,
    title: "SAT Math",
    chapters: [
      {
        id: 1,
        title: "Heart of Algebra",
        description: "Master linear equations, inequalities, and functions.",
        lessons: [
          { id: 101, title: "Linear Equations", completed: true },
          { id: 102, title: "Systems of Equations", completed: true },
          { id: 103, title: "Linear Inequalities", completed: true },
          { id: 104, title: "Graphing Linear Functions", completed: true },
        ],
      },
    ],
  },
};

// Mock questions for lessons
const mockQuestions = {
  101: {
    id: 1,
    passage:
      "The main idea of a text is the central point or concept that the author wants to communicate to the readers. The main idea is usually reinforced throughout the text and supported by details, arguments, and examples.",
    text: "Which of the following best describes the main idea of a passage?",
    choices: [
      {
        id: "a",
        text: "The first sentence of any paragraph.",
      },
      {
        id: "b",
        text: "Any statement that contains factual information.",
      },
      {
        id: "c",
        text: "The central concept that the author wants to communicate.",
      },
      {
        id: "d",
        text: "The concluding statement of the text.",
      },
    ],
    correctAnswer: "c",
    explanation:
      "The main idea is the central concept or point that the author is trying to convey throughout the text. It is supported by details, examples, and arguments, but is not necessarily located in any specific part of the text (like the first sentence or conclusion).",
  },
  102: {
    id: 1,
    passage:
      "Supporting details provide evidence for the main idea. These details can include facts, examples, descriptions, or explanations that help readers understand the main concept.",
    text: "What is the primary purpose of supporting details in a passage?",
    choices: [
      {
        id: "a",
        text: "To introduce new topics unrelated to the main idea.",
      },
      {
        id: "b",
        text: "To provide evidence that helps understand the main idea.",
      },
      {
        id: "c",
        text: "To contradict the main idea and offer alternative views.",
      },
      {
        id: "d",
        text: "To conclude the passage with a summary.",
      },
    ],
    correctAnswer: "b",
    explanation:
      "Supporting details serve to provide evidence, examples, or explanations that help readers understand and validate the main idea of a passage. They strengthen the author's central point rather than introducing unrelated topics or contradicting the main idea.",
  },
  201: {
    id: 1,
    passage:
      "Sentence structure refers to how the different parts of a sentence are arranged. Understanding sentence structure helps identify and correct grammatical errors.",
    text: "Which of the following is an example of a complex sentence?",
    choices: [
      {
        id: "a",
        text: "The dog barked.",
      },
      {
        id: "b",
        text: "The dog barked and the cat hissed.",
      },
      {
        id: "c",
        text: "Although the dog barked, the cat didn't move.",
      },
      {
        id: "d",
        text: "The dog barked; the cat hissed.",
      },
    ],
    correctAnswer: "c",
    explanation:
      "A complex sentence contains one independent clause and at least one dependent clause. 'Although the dog barked, the cat didn't move' is a complex sentence because it has the dependent clause 'Although the dog barked' and the independent clause 'the cat didn't move.'",
  },
};

const LessonPage = () => {
  const { courseId, lessonId } = useParams();
  const numCourseId = parseInt(courseId);
  const numLessonId = parseInt(lessonId);

  const [splitPosition, setSplitPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const splitContainerRef = useRef(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [chaptersExpanded, setChaptersExpanded] = useState(false);
  const [lessonsExpanded, setLessonsExpanded] = useState(false);

  const course = coursesData[numCourseId];

  // Find current chapter and lesson
  let currentChapter = null;
  let currentLesson = null;
  let currentLessonIndex = 0;
  let allLessons = [];

  if (course) {
    // Flatten all lessons for navigation
    course.chapters.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        allLessons.push({ ...lesson, chapter });

        if (lesson.id === numLessonId) {
          currentChapter = chapter;
          currentLesson = lesson;
          currentLessonIndex = allLessons.length - 1;
        }
      });
    });
  }

  const prevLesson =
    currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < allLessons.length - 1
      ? allLessons[currentLessonIndex + 1]
      : null;

  const question = mockQuestions[numLessonId];

  // Handle resize drag
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !splitContainerRef.current) return;

    const containerRect = splitContainerRef.current.getBoundingClientRect();
    const newPosition =
      ((e.clientX - containerRect.left) / containerRect.width) * 100;

    // Limit the range to prevent extremely small panels
    if (newPosition >= 20 && newPosition <= 80) {
      setSplitPosition(newPosition);
    }
  };

  const handleAnswerSelect = (choiceId) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(choiceId);
    }
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer) {
      setIsAnswerSubmitted(true);
    }
  };

  // Toggle dropdowns
  const toggleChaptersExpanded = () => {
    setChaptersExpanded(!chaptersExpanded);
    if (lessonsExpanded) setLessonsExpanded(false);
  };

  const toggleLessonsExpanded = () => {
    setLessonsExpanded(!lessonsExpanded);
    if (chaptersExpanded) setChaptersExpanded(false);
  };

  const isCorrectAnswer = (choiceId) => {
    return isAnswerSubmitted && choiceId === question?.correctAnswer;
  };

  const isIncorrectAnswer = (choiceId) => {
    return (
      isAnswerSubmitted &&
      selectedAnswer === choiceId &&
      choiceId !== question?.correctAnswer
    );
  };

  if (!course || !currentLesson || !currentChapter) {
    return <div className="lesson-not-found">Lesson not found</div>;
  }

  return (
    <div className="lesson-page">
      {/* Top Navigation Bar */}
      <div className="lesson-top-nav">
        <div className="nav-dropdowns">
          <div className="chapter-dropdown-container">
            <div
              className="chapter-dropdown-button"
              onClick={toggleChaptersExpanded}
            >
              <span>
                CH{currentChapter?.id}:{" "}
                {currentChapter?.title.length > 15
                  ? currentChapter?.title.substring(0, 15) + "..."
                  : currentChapter?.title}
              </span>
              <svg
                className={`dropdown-arrow ${
                  chaptersExpanded ? "expanded" : ""
                }`}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>

            {chaptersExpanded && (
              <div className="chapter-dropdown-menu">
                {course?.chapters.map((chapter) => (
                  <div key={chapter.id} className="chapter-menu-item">
                    <Link
                      to={`/course/${courseId}/lesson/${chapter.lessons[0].id}`}
                    >
                      {chapter.id}. {chapter.title}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lesson-dropdown-container">
            <div
              className="lesson-dropdown-button"
              onClick={toggleLessonsExpanded}
            >
              <span>
                L{currentLesson?.id % 100}:{" "}
                {currentLesson?.title.length > 15
                  ? currentLesson?.title.substring(0, 15) + "..."
                  : currentLesson?.title}
              </span>
              <svg
                className={`dropdown-arrow ${
                  lessonsExpanded ? "expanded" : ""
                }`}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>

            {lessonsExpanded && (
              <div className="lesson-dropdown-menu">
                {currentChapter?.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className={`lesson-menu-item ${
                      lesson.id === numLessonId ? "active" : ""
                    } ${lesson.completed ? "completed" : ""}`}
                  >
                    <Link to={`/course/${courseId}/lesson/${lesson.id}`}>
                      <span className="lesson-menu-title">
                        {index + 1}: {lesson.title}
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="nav-buttons">
          {prevLesson ? (
            <Link
              to={`/course/${courseId}/lesson/${prevLesson.id}`}
              className="lesson-nav-button prev"
              title={`Previous: ${prevLesson.title}`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Link>
          ) : (
            <div className="lesson-nav-button disabled prev">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </div>
          )}

          {nextLesson ? (
            <Link
              to={`/course/${courseId}/lesson/${nextLesson.id}`}
              className="lesson-nav-button next"
              title={`Next: ${nextLesson.title}`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          ) : (
            <div className="lesson-nav-button disabled next">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          )}
        </div>
      </div>

      <div
        className="lesson-page-container"
        ref={splitContainerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Left Panel - Course Content */}
        <div
          className="lesson-content-panel"
          style={{ width: `${splitPosition}%` }}
        >
          <div className="lesson-content">
            <div className="markdown-content">
              <ReactMarkdown>{mockLessonContent}</ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Resize Handle */}
        <div className="resize-handle" onMouseDown={handleMouseDown}>
          <div className="resize-handle-bar"></div>
        </div>

        {/* Right Panel - Practice */}
        <div
          className="practice-panel"
          style={{ width: `${100 - splitPosition}%` }}
        >
          {question ? (
            <>
              <div className="practice-header">
                <h3>Practice Question</h3>
                <div className="question-info">
                  {question.topic && (
                    <span className="question-topic">{question.topic}</span>
                  )}
                  <div className="question-difficulty">
                    <div className="difficulty-indicator medium">
                      <div className="bar"></div>
                      <div className="bar"></div>
                      <div className="bar"></div>
                    </div>
                    <span>Medium</span>
                  </div>
                </div>
              </div>

              <div className="practice-content">
                {question.passage && (
                  <div className="question-passage">{question.passage}</div>
                )}
                <div className="question-text">{question.text}</div>

                <div className="question-choices">
                  {question.choices.map((choice) => (
                    <div
                      key={choice.id}
                      className={`choice ${
                        selectedAnswer === choice.id ? "selected" : ""
                      } ${isCorrectAnswer(choice.id) ? "correct" : ""} ${
                        isIncorrectAnswer(choice.id) ? "incorrect" : ""
                      }`}
                      onClick={() => handleAnswerSelect(choice.id)}
                    >
                      <div className="choice-letter">
                        {choice.id.toUpperCase()}
                      </div>
                      <div className="choice-text">{choice.text}</div>
                    </div>
                  ))}
                </div>

                <div className="question-actions">
                  {!isAnswerSubmitted ? (
                    <button
                      className="submit-answer-btn"
                      onClick={handleAnswerSubmit}
                      disabled={!selectedAnswer}
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <div className="answer-explanation">
                      <h4>
                        {selectedAnswer === question.correctAnswer
                          ? "Correct!"
                          : "Incorrect"}
                      </h4>
                      <p>{question.explanation}</p>
                      <button
                        className="next-question-btn"
                        onClick={() => {
                          setSelectedAnswer(null);
                          setIsAnswerSubmitted(false);
                        }}
                      >
                        Next Question
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="no-practice-content">
              <div className="no-question-message">
                <i className="fas fa-book-open"></i>
                <h3>No practice questions available</h3>
                <p>Try another lesson or come back later</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
