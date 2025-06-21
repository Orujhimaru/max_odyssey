import React, { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./LessonPage.css"; // Make sure this CSS file is set up
import StreakIndicator from "../../components/StreakIndicator/StreakIndicator"; // Make sure this component exists

// ====================================================================================
// IMPORTANT: MOCK LESSON CONTENT WITH CORRECT LaTeX SYNTAX
// LaTeX commands like \div, \times, \color use a SINGLE backslash.
// Do NOT change these to double backslashes (\\) for commands.
// ====================================================================================
const mockLessonContent = `
<h1>1. PEMDAS</h1>
<p>In algebra, order of operations is critical to solving math questions correctly. PEMDAS is an acronym to help you remember the order of operations in algebra. The rules of PEMDAS are below:</p>
<ul>
  <li><strong>P – Parentheses:</strong> Complete any calculations inside parentheses first.</li>
  <li><strong>E – Exponents:</strong> Next, complete any exponents or square roots.</li>
  <li><strong>MD – Multiplication and Division:</strong> Complete any multiplication and division (left-to-right).</li>
  <li><strong>AS – Addition and Subtraction:</strong> Complete any addition and subtraction (left-to-right).</li>
</ul>
<p>Make sure you do the multiplication and division step <strong>left-to-right</strong>! This is where the SAT most often tries to trick students. For example, if we are given:</p>
<div class="math-display-centered">
  $16 \\div 4 \\times 2 - 3$
</div>
<p>We need to work <strong>left-to-right</strong> when completing multiplication and division. If solved correctly, we will start by dividing 16 by 4 and then multiply by 2. Once we complete the multiplication and division, we will subtract 3.</p>
<p>Correct:</p>
<div class="math-display-centered">
  $16 \\div 4 \\times 2 - 3 = 4 \\times 2 - 3 = 8 - 3 = 5$
</div>
<p>Many students make the mistake of doing the multiplication first and then dividing.</p>
<p>Incorrect:</p>
<div class="math-display-centered">
  $16 \\div 4 \\times 2 - 3 = 16 \\div 8 - 3 = 2 - 3 = -1$
</div>

<p class="example-header">✨ Example 1</p>
<p>What is the value of the expression $2^2 + (-4)^2 \\div 2 \\times (5+10)$?</p>
<p>A) 40 B) 72 C) 120 D) 142</p>
<p><strong>Solution:</strong></p>
<p>Let's follow PEMDAS step-by-step:</p>
<p>Parentheses: First, complete calculations inside parentheses. The calculation is:</p>
<div class="math-display-centered">
  $(5+10) = 15$
</div>
<p>Substituting this back, the expression becomes:</p>
<div class="math-display-centered">
  $2^2 + (-4)^2 \\div 2 \\times 15$
</div>
<p>Exponents: Next, evaluate exponents. The calculation is:</p>
<div class="math-display-centered">
  $(-4)^2 = 16$
</div>
<p>Substituting this back, the expression becomes:</p>
<div class="math-display-centered">
  $22 + 16 \\div 2 \\times 15$
</div>
<p>Multiplication and Division (from <strong>left-to-right</strong>): First, perform the division ($16 \\div 2$):</p>
<div class="math-display-centered">
  $16 \\div 2 = 8$
</div>
<p>The expression now is:</p>
<div class="math-display-centered">
  $22 + 8 \\times 15$
</div>
<p>Next, perform the multiplication ($8 \\times 15$):</p>
<div class="math-display-centered">
  $8 \\times 15 = 120$
</div>
<p>The expression now is:</p>
<div class="math-display-centered">
  $22 + 120$
</div>
<p>Addition: Finally, complete the addition. The calculation is:</p>
<div class="math-display-centered">
  $22 + 120 = 142$
</div>
<p>The answer is <strong>D) 142</strong>.</p>
<p>As long as you follow the PEMDAS steps correctly and work <strong>left-to-right</strong> correctly, these questions should be easy!</p>

<p class="example-header">💡 Shortcut Solution – Use Your Calculator</p>
<p>You can also enter these questions directly into your calculator. Your calculator is programmed to do PEMDAS correctly, so as long as you enter the equation correctly, the calculator will just tell you the answer. It's that easy! 📲</p>
`;

// ====================================================================================
// MOCK DATA
// ====================================================================================
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

const mockQuestions = {
  101: {
    id: 1,
    passage:
      "The main idea of a text is the central point or concept that the author wants to communicate to the readers. The main idea is usually reinforced throughout the text and supported by details, arguments, and examples.",
    text: "Which of the following best describes the main idea of a passage?",
    choices: [
      { id: "a", text: "The first sentence of any paragraph." },
      { id: "b", text: "Any statement that contains factual information." },
      {
        id: "c",
        text: "The central concept that the author wants to communicate.",
      },
      { id: "d", text: "The concluding statement of the text." },
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
      { id: "a", text: "To introduce new topics unrelated to the main idea." },
      {
        id: "b",
        text: "To provide evidence that helps understand the main idea.",
      },
      {
        id: "c",
        text: "To contradict the main idea and offer alternative views.",
      },
      { id: "d", text: "To conclude the passage with a summary." },
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
      { id: "a", text: "The dog barked." },
      { id: "b", text: "The dog barked and the cat hissed." },
      { id: "c", text: "Although the dog barked, the cat didn't move." },
      { id: "d", text: "The dog barked; the cat hissed." },
    ],
    correctAnswer: "c",
    explanation:
      "A complex sentence contains one independent clause and at least one dependent clause. 'Although the dog barked, the cat didn't move' is a complex sentence because it has the dependent clause 'Although the dog barked' and the independent clause 'the cat didn't move.'",
  },
};

// ====================================================================================
// LessonPage COMPONENT
// ====================================================================================
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

  let currentChapter = null;
  let currentLesson = null;
  let currentLessonIndex = -1;
  let allLessons = [];

  if (course) {
    let flatIndex = 0;
    course.chapters.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        allLessons.push({
          ...lesson,
          chapterId: chapter.id,
          chapterTitle: chapter.title,
        });
        if (lesson.id === numLessonId) {
          // Basic matching, assumes lessonId is unique enough for this mock data
          // For more complex scenarios, you might need to match based on chapterId as well
          currentChapter = chapter;
          currentLesson = lesson;
          currentLessonIndex = flatIndex;
        }
        flatIndex++;
      });
    });
  }

  const prevLesson =
    currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < allLessons.length - 1 && currentLessonIndex !== -1
      ? allLessons[currentLessonIndex + 1]
      : null;

  const question = mockQuestions[numLessonId]; // Assumes lessonId is key for questions
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
    let newPosition =
      ((e.clientX - containerRect.left) / containerRect.width) * 100;
    newPosition = Math.max(20, Math.min(newPosition, 80)); // Clamp
    setSplitPosition(newPosition);
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

  const toggleChaptersExpanded = (e) => {
    e.stopPropagation();
    setChaptersExpanded(!chaptersExpanded);
    setLessonsExpanded(false);
  };

  const toggleLessonsExpanded = (e) => {
    e.stopPropagation();
    setLessonsExpanded(!lessonsExpanded);
    setChaptersExpanded(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown")) {
        setChaptersExpanded(false);
        setLessonsExpanded(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const isCorrectAnswer = (choiceId) =>
    isAnswerSubmitted && choiceId === question?.correctAnswer;
  const isIncorrectAnswer = (choiceId) =>
    isAnswerSubmitted &&
    selectedAnswer === choiceId &&
    choiceId !== question?.correctAnswer;

  // Initial setup when the component mounts for the lesson page
  useEffect(() => {
    // This effect could be used for initial setup if needed,
    // but the navbar hiding is now handled by default state in App.jsx
  }, [courseId]);

  if (!course || !currentLesson || !currentChapter) {
    return (
      <div className="lesson-not-found">
        Lesson not found. Check courseId and lessonId.
      </div>
    );
  }

  return (
    <div className="lesson-page">
      {/* Top Navigation Bar */}
      <div className="lesson-top-nav">
        <div className="nav-dropdowns">
          {/* Chapter Dropdown */}
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
                {course?.chapters?.map((chapter) => (
                  <div
                    className={`chapter-menu-item ${
                      chapter.id === currentChapter?.id ? "active" : ""
                    }`}
                    key={chapter.id}
                  >
                    <Link
                      to={`/course/${courseId}/lesson/${chapter.lessons[0].id}`}
                      onClick={() => setChaptersExpanded(false)}
                      className="flex"
                    >
                      <span
                        className={`chapter-dot ${
                          chapter.id === currentChapter?.id ? "active" : ""
                        }`}
                      ></span>
                      <span className="chapter-title">{chapter.title}</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lesson Dropdown */}
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
                {currentChapter?.lessons?.map((lesson) => (
                  <div
                    className={`lesson-menu-item ${
                      lesson.id === numLessonId ? "active" : ""
                    } ${lesson.completed ? "completed" : ""}`}
                    key={lesson.id}
                  >
                    <Link
                      to={`/course/${courseId}/lesson/${lesson.id}`}
                      onClick={() => setLessonsExpanded(false)}
                      className="flex items-center"
                    >
                      <span
                        className={`lesson-dot ${
                          lesson.id === numLessonId ? "active" : ""
                        }`}
                      ></span>
                      <span className="lesson-number">{lesson.id % 100}:</span>
                      <span className="lesson-title">{lesson.title}</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <StreakIndicator streak={26} progress={0.7} /> {/* Example values */}
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
              <div dangerouslySetInnerHTML={{ __html: mockLessonContent }} />
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
                {/* <div className="question-info">
                  {question.topic && <span className="question-topic">{question.topic}</span>}
                  </div> */}
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
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAnswerSelect(choice.id)
                      }
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
                          // Add logic to load the next question if applicable
                        }}
                      >
                        Try Another / Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="no-practice-content">
              <div className="no-question-message">
                {/* <i className="fas fa-book-open"></i> Ensure Font Awesome is loaded if you use this icon */}
                <h3>No practice questions available for this lesson.</h3>
                <p>Please select another lesson.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
