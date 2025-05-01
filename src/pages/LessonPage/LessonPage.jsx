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

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

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

  const toggleChaptersExpanded = () => {
    setChaptersExpanded(!chaptersExpanded);
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
    <div
      className="lesson-page-container"
      ref={splitContainerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Left Panel - Course Content */}
      <div
        className="lesson-content-panel"
        style={{ width: `${splitPosition}%` }}
      >
        <div className="lesson-navigation">
          <div className="lesson-navigation-header">
            <div className="lesson-title">{course.title}</div>
            <div className="navigation-controls">
              {prevLesson && (
                <Link
                  to={`/course/${numCourseId}/lesson/${prevLesson.id}`}
                  className="nav-button prev-lesson"
                >
                  <i className="fas fa-chevron-left"></i>
                  Previous
                </Link>
              )}
              {nextLesson && (
                <Link
                  to={`/course/${numCourseId}/lesson/${nextLesson.id}`}
                  className="nav-button next-lesson"
                >
                  Next
                  <i className="fas fa-chevron-right"></i>
                </Link>
              )}
            </div>
          </div>

          <div className="chapter-selector">
            <div className="chapter-dropdown" onClick={toggleChaptersExpanded}>
              <div className="current-chapter">
                <span className="chapter-indicator">
                  {currentChapter.title}
                </span>
                <span className="lesson-indicator">
                  : {currentLesson.title}
                </span>
              </div>
              <i
                className={`fas fa-chevron-${chaptersExpanded ? "up" : "down"}`}
              ></i>
            </div>

            {chaptersExpanded && (
              <div className="chapters-dropdown-content">
                {course.chapters.map((chapter) => (
                  <div key={chapter.id} className="chapter-item">
                    <div
                      className={`chapter-header ${
                        currentChapter.id === chapter.id ? "active" : ""
                      }`}
                    >
                      {chapter.title}
                    </div>
                    <div className="lesson-list">
                      {chapter.lessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          to={`/course/${numCourseId}/lesson/${lesson.id}`}
                          className={`lesson-item ${
                            currentLesson.id === lesson.id ? "active" : ""
                          } ${lesson.completed ? "completed" : ""}`}
                          onClick={() => {
                            setChaptersExpanded(false);
                            setSelectedAnswer(null);
                            setIsAnswerSubmitted(false);
                          }}
                        >
                          <div className="lesson-info">
                            <div className="lesson-status">
                              {lesson.completed ? (
                                <i className="fas fa-check-circle"></i>
                              ) : (
                                <i className="far fa-circle"></i>
                              )}
                            </div>
                            <div className="lesson-title">{lesson.title}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lesson-content">
          <div className="markdown-content">
            <ReactMarkdown>{mockLessonContent}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Resize Handler */}
      <div className="resize-handle" onMouseDown={handleMouseDown}>
        <div className="resize-handle-bar"></div>
      </div>

      {/* Right Panel - Practice Questions */}
      <div
        className="practice-panel"
        style={{ width: `${100 - splitPosition}%` }}
      >
        {question ? (
          <>
            <div className="practice-header">
              <h3>Practice Question</h3>
              <div className="question-info">
                <span className="question-topic">{currentChapter.title}</span>
                <span className="question-difficulty">
                  <div className="difficulty-indicator medium">
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                  </div>
                  Medium
                </span>
              </div>
            </div>

            <div className="practice-content">
              {question.passage && (
                <div className="question-passage">
                  <p>{question.passage}</p>
                </div>
              )}

              <div className="question-text">
                <p>{question.text}</p>
              </div>

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

              {isAnswerSubmitted ? (
                <div className="answer-explanation">
                  <h4>Explanation:</h4>
                  <p>{question.explanation}</p>
                  {nextLesson && (
                    <Link
                      to={`/course/${numCourseId}/lesson/${nextLesson.id}`}
                      className="next-question-btn"
                    >
                      Next Lesson
                    </Link>
                  )}
                </div>
              ) : (
                <div className="question-actions">
                  <button
                    className="submit-answer-btn"
                    onClick={handleAnswerSubmit}
                    disabled={!selectedAnswer}
                  >
                    Submit Answer
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="no-practice-content">
            <div className="no-question-message">
              <i className="fas fa-book-open"></i>
              <h3>No practice questions</h3>
              <p>This lesson doesn't have practice questions yet.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPage;
