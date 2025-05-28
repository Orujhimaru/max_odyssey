import React, { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "./LessonPage.css";
import StreakIndicator from "../../components/StreakIndicator/StreakIndicator";

// Mock lesson content
const mockLessonContent = `
## Chapter 5: Algebra Skills

Many SAT questions test your core algebra skills. To answer these questions correctly, you need to be able to isolate the unknown variable, such as $x$ or $y$, or solve for a more complex term, such as $3a + b$. For any algebra question, take your time, write out each step of your analysis and calculation, and use the calculator to avoid silly mistakes like making a mental math error or forgetting to distribute a negative sign.

In this section, we will cover the algebra skills that you need in your toolbox for test day.

---

### 1. PEMDAS

In algebra, order of operations is critical to solving math questions correctly. PEMDAS is an acronym to help you remember the order of operations in algebra. The rules of PEMDAS are below:

1.  **P – Parentheses**: Complete any calculations inside parentheses first.
2.  **E – Exponents**: Next, complete any exponents or square roots.
3.  **MD – Multiplication and Division**: Complete any multiplication and division ($\\color{darkorange}{\\text{left-to-right}}$).
4.  **AS – Addition and Subtraction**: Complete any addition and subtraction ($\\color{darkorange}{\\text{left-to-right}}$).

Make sure you do the multiplication and division step $\\color{darkorange}{\\text{left-to-right}}$! This is where the SAT most often tries to trick students. For example, if we are given:

$$16 \\div 4 \\times 2 – 3$$

We need to work $\\color{darkorange}{\\text{left-to-right}}$ when completing multiplication and division. If solved correctly, we will start by dividing 16 by 4 and then multiply by 2. Once we complete the multiplication and division, we will subtract 3.

**Correct:**
$$16 \\div 4 \\times 2 – 3 = 4 \\times 2 – 3 = 8 – 3 = \\color{blue}{5}$$

Many students make the mistake of doing the multiplication first and then dividing.

**Incorrect:**
$$16 \\div 4 \\times 2 – 3 = 16 \\div 8 – 3 = 2 – 3 = \\color{red}{-1}$$

---

### ✨ Example 1

What is the value of the expression $22 + (-4)^2 \\div 2 \\times (5 + 10)$?

A) 40 B) 72 C) 120 D) 142

**Solution:**

Let's follow PEMDAS step-by-step:

1.  **P**arentheses: First, complete calculations inside parentheses.
    The calculation is:
    $$(5 + 10) = \\color{green}{15}$$
    Substituting this back, the expression becomes:
    $$22 + (-4)^2 \\div 2 \\times \\color{green}{15}$$

2.  **E**xponents: Next, evaluate exponents.
    The calculation is:
    $$(-4)^2 = \\color{green}{16}$$
    Substituting this back, the expression becomes:
    $$22 + \\color{green}{16} \\div 2 \\times 15$$

3.  **M**ultiplication and **D**ivision (from $\\color{darkorange}{\\text{left-to-right}}$):
    First, perform the division ($16 \\div 2$):
    $$16 \\div 2 = \\color{green}{8}$$
    The expression now is:
    $$22 + \\color{green}{8} \\times 15$$
    Next, perform the multiplication ($8 \\times 15$):
    $$8 \\times 15 = \\color{green}{120}$$
    The expression now is:
    $$22 + \\color{green}{120}$$

4.  **A**ddition: Finally, complete the addition.
    The calculation is:
    $$22 + 120 = \\color{blue}{142}$$

The answer is **D) 142**.

As long as you follow the PEMDAS steps correctly and work $\\color{darkorange}{\\text{left-to-right}}$ correctly, these questions should be easy!

---

### 💡 Shortcut Solution – Use Your Calculator

You can also enter these questions directly into your calculator. Your calculator is programmed to do PEMDAS correctly, so as long as you enter the equation correctly, the calculator will just tell you the answer. It’s that easy! 📲
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

const LessonPage = ({ onNavbarToggle }) => {
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

  const navigate = useNavigate();

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
  const toggleChaptersExpanded = (e) => {
    e.stopPropagation();
    setChaptersExpanded(!chaptersExpanded);
    setLessonsExpanded(false);
  };

  const toggleLessonsExpanded = (e) => {
    e.stopPropagation();
    setChaptersExpanded(false);
    setLessonsExpanded(!lessonsExpanded);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown")) {
        setChaptersExpanded(false);
        setLessonsExpanded(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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

  // Handle navbar toggle
  const handleNavbarToggle = () => {
    console.log("Toggle navbar triggered");
    if (onNavbarToggle) {
      onNavbarToggle();
    }
  };

  // Force navbar to be hidden when entering lesson page
  useEffect(() => {
    if (onNavbarToggle) {
      // Use course-specific key to track navbar state
      const storageKey = `navbar-hidden-course-${courseId}`;
      const navbarShouldBeHidden = localStorage.getItem(storageKey);

      if (!navbarShouldBeHidden) {
        // First time user enters this course, mark navbar as hidden
        localStorage.setItem(storageKey, "true");
      }

      // Hide the navbar (pass false to explicitly hide)
      console.log(`Hiding navbar for course ${courseId}`);
      onNavbarToggle(false);
    }
  }, [courseId]);

  // Add edge detection effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientX <= 20) {
        // If mouse is within 20px of left edge
        if (onNavbarToggle) {
          console.log("Mouse near edge detected, showing navbar");
          onNavbarToggle(true); // Pass true to explicitly show navbar
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [onNavbarToggle]);

  if (!course || !currentLesson || !currentChapter) {
    return <div className="lesson-not-found">Lesson not found</div>;
  }

  return (
    <div className="lesson-page">
      {/* Navbar toggle area - shows navbar on hover */}
      <div
        className="navbar-toggle-area"
        onMouseEnter={handleNavbarToggle}
        onMouseMove={handleNavbarToggle}
        onClick={handleNavbarToggle}
        aria-label="Show navigation sidebar"
      ></div>

      {/* Top Navigation Bar */}
      <div className="lesson-top-nav">
        <div className="nav-dropdowns">
          <div className="dropdown">
            <button
              onClick={toggleChaptersExpanded}
              aria-haspopup="true"
              aria-expanded={chaptersExpanded}
            >
              {currentChapter
                ? `CH${currentChapter.id}: ${currentChapter.title}`
                : "Select Chapter"}
              <svg
                className="dropdown-arrow"
                width="12"
                height="6"
                viewBox="0 0 12 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L6 5L11 1"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className={chaptersExpanded ? "menu-open" : "menu-closed"}>
              <div className="dropdown-content chapters-dropdown-content">
                {course?.chapters?.map((chapter, index) => (
                  <div
                    className={`chapter-menu-item ${
                      chapter.id === currentChapter?.id ? "active" : ""
                    }`}
                    key={chapter.id}
                  >
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(
                          `/course/${courseId}/lesson/${chapter.lessons[0].id}`
                        );
                        setChaptersExpanded(false);
                      }}
                      className="flex"
                    >
                      <span
                        className={`chapter-dot ${
                          chapter.id === currentChapter?.id ? "active" : ""
                        }`}
                      ></span>
                      {/* <span className="chapter-number">CH{chapter.id}:</span> */}
                      <span className="chapter-title">{chapter.title}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dropdown">
            <button
              onClick={toggleLessonsExpanded}
              aria-haspopup="true"
              aria-expanded={lessonsExpanded}
            >
              {currentLesson
                ? `L${currentLesson.id % 100}: ${currentLesson.title}`
                : "Select Lesson"}
              <svg
                className="dropdown-arrow"
                width="12"
                height="6"
                viewBox="0 0 12 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L6 5L11 1"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className={lessonsExpanded ? "menu-open" : "menu-closed"}>
              <div className="dropdown-content lessons-dropdown-content">
                {currentChapter?.lessons?.map((lesson, index) => (
                  <div
                    className={`lesson-menu-item ${
                      lesson.id === numLessonId ? "active" : ""
                    } ${lesson.completed ? "completed" : ""}`}
                    key={lesson.id}
                  >
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/course/${courseId}/lesson/${lesson.id}`);
                        setLessonsExpanded(false);
                      }}
                      className="flex items-center"
                    >
                      <span
                        className={`lesson-dot ${
                          lesson.id === numLessonId ? "active" : ""
                        }`}
                      ></span>
                      <span className="lesson-number">{lesson.id % 100}:</span>
                      <span className="lesson-title">{lesson.title}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Streak Indicator */}
        <StreakIndicator streak={26} progress={0.7} />

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
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {mockLessonContent}
              </ReactMarkdown>
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
              <div className="lesson-practice-header">
                <h3>Practice Question</h3>
                <div className="question-info">
                  {question.topic && (
                    <span className="question-topic">{question.topic}</span>
                  )}
                  {/* <div className="question-difficulty">
                    <div className="difficulty-indicator-bars medium">
                      <div className="bar"></div>
                      <div className="bar"></div>
                      <div className="bar"></div>
                    </div>
                  </div> */}
                </div>
              </div>

              <div className="practice-content">
                {question.passage && (
                  <div className="question-passage">{question.passage}</div>
                )}
                <div className="lesson-question-text">{question.text}</div>

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
