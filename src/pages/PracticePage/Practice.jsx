import React, { useState } from "react";
import PracticeSwitch from "../../components/PracticeSwitch/PracticeSwitch";
import "./Practice.css";
import PracticeQuestionInterface from "./PracticeQuestionInterface/PracticeQuestionInterface";

const Practice = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [showTopicFilter, setShowTopicFilter] = useState(false);
  const [showDifficultyFilter, setShowDifficultyFilter] = useState(false);
  const [activeDifficulty, setActiveDifficulty] = useState("all");
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [showWrongAnswered, setShowWrongAnswered] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Set());
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isVerbal, setIsVerbal] = useState(false);

  // Math topics
  const mathTopics = [
    "Algebra",
    "Linear Equations",
    "Quadratic Equations",
    "Functions",
    "Exponents & Radicals",
    "Inequalities",
    "Systems of Equations",
    "Coordinate Geometry",
    "Circles",
    "Triangles",
    "Probability",
    "Statistics",
    "Data Analysis",
    "Word Problems",
    "Trigonometry",
  ];

  // Verbal topics
  const verbalTopics = [
    "Reading Comprehension",
    "Vocabulary in Context",
    "Evidence-Based Reading",
    "Command of Evidence",
    "Words in Context",
    "Expression of Ideas",
    "Standard English Conventions",
    "Grammar",
    "Punctuation",
    "Rhetoric",
    "Synthesis",
    "Analysis",
    "Main Idea",
    "Author's Purpose",
    "Inference",
  ];

  // Mock data for practice questions
  const practiceQuestions = [
    {
      id: 1,
      title: "Linear Equations in Context",
      type: "math",
      difficulty: "medium",
      topics: ["Algebra", "Linear Equations", "Word Problems"],
      completionRate: 78,
      lastAttempted: "2 days ago",
    },
    {
      id: 2,
      title: "Reading Passage: Science",
      type: "verbal",
      difficulty: "hard",
      topics: ["Reading Comprehension", "Inference", "Evidence-Based Reading"],
      completionRate: 62,
      lastAttempted: "1 week ago",
    },
    {
      id: 3,
      title: "Data Analysis with Graphs",
      type: "math",
      difficulty: "easy",
      topics: ["Statistics", "Data Analysis"],
      completionRate: 91,
      lastAttempted: "3 days ago",
    },
    {
      id: 4,
      title: "What is the value of x in the equation 2x + 5 = 13?",
      difficulty: "easy",
      subject: "math",
      topic: "Algebra",
      subtopic: "Linear Equations",
      isBookmarked: true,
      status: "completed",
      performance: "correct",
      lastAttempted: "2023-06-15",
    },
    {
      id: 5,
      title:
        "Which of the following best describes the author's tone in the passage?",
      difficulty: "medium",
      subject: "verbal",
      topic: "Reading",
      subtopic: "Author's Purpose",
      isBookmarked: false,
      status: "completed",
      performance: "incorrect",
      lastAttempted: "2023-06-18",
    },
    {
      id: 6,
      title: "If f(x) = 3x² - 2x + 1, what is the value of f(2)?",
      difficulty: "medium",
      subject: "math",
      topic: "Functions",
      subtopic: "Quadratic Functions",
      isBookmarked: true,
      status: "completed",
      performance: "correct",
      lastAttempted: "2023-06-20",
    },
    {
      id: 7,
      title: "Which sentence contains a grammatical error?",
      difficulty: "hard",
      subject: "verbal",
      topic: "Writing",
      subtopic: "Grammar",
      isBookmarked: false,
      status: "not-started",
      performance: null,
      lastAttempted: null,
    },
    {
      id: 8,
      title: "What is the area of a circle with radius 5 units?",
      difficulty: "easy",
      subject: "math",
      topic: "Geometry",
      subtopic: "Circles",
      isBookmarked: false,
      status: "completed",
      performance: "correct",
      lastAttempted: "2023-06-22",
    },
    {
      id: 9,
      title:
        "Which of the following best summarizes the main idea of the passage?",
      difficulty: "hard",
      subject: "verbal",
      topic: "Reading",
      subtopic: "Main Idea",
      isBookmarked: true,
      status: "in-progress",
      performance: null,
      lastAttempted: "2023-06-25",
    },
  ];

  // Sort questions by difficulty: easy -> medium -> hard
  const sortedQuestions = [...practiceQuestions].sort((a, b) => {
    const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
  });

  const toggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  // Filter questions based on active filter and search query
  const filteredQuestions = sortedQuestions.filter((question) => {
    const matchesFilter =
      activeFilter === "all" ||
      activeFilter === question.type ||
      activeFilter === question.subject;

    // const matchesSearch = question.title
    //   .toLowerCase()
    //   .includes(searchQuery.toLowerCase());

    const matchesDifficulty =
      activeDifficulty === "all" || question.difficulty === activeDifficulty;

    const matchesTopics =
      selectedTopics.length === 0 ||
      (question.topics &&
        question.topics.some((topic) => selectedTopics.includes(topic))) ||
      (question.topic && selectedTopics.includes(question.topic)) ||
      (question.subtopic && selectedTopics.includes(question.subtopic));

    const matchesBookmarked =
      !showBookmarked || bookmarkedQuestions.has(question.id);
    const matchesWrongAnswered =
      !showWrongAnswered || question.performance === "incorrect";

    return (
      matchesFilter &&
      matchesDifficulty &&
      matchesTopics &&
      matchesBookmarked &&
      matchesWrongAnswered
    );
  });

  const toggleBookmark = (questionId) => {
    setBookmarkedQuestions((prev) => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(questionId)) {
        newBookmarks.delete(questionId);
      } else {
        newBookmarks.add(questionId);
      }
      return newBookmarks;
    });
  };

  return (
    <div className="practice-page">
      {selectedQuestion ? (
        <PracticeQuestionInterface
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          questionNumber={
            filteredQuestions.findIndex((q) => q.id === selectedQuestion.id) + 1
          }
          isBookmarked={bookmarkedQuestions.has(selectedQuestion.id)}
          onBookmark={(id) => {
            const newBookmarked = new Set(bookmarkedQuestions);
            if (newBookmarked.has(id)) {
              newBookmarked.delete(id);
            } else {
              newBookmarked.add(id);
            }
            setBookmarkedQuestions(newBookmarked);
          }}
          onNext={() => {
            const currentIndex = filteredQuestions.findIndex(
              (q) => q.id === selectedQuestion.id
            );
            if (currentIndex < filteredQuestions.length - 1) {
              setSelectedQuestion(filteredQuestions[currentIndex + 1]);
            }
          }}
          onPrevious={() => {
            const currentIndex = filteredQuestions.findIndex(
              (q) => q.id === selectedQuestion.id
            );
            if (currentIndex > 0) {
              setSelectedQuestion(filteredQuestions[currentIndex - 1]);
            }
          }}
        />
      ) : (
        <div className="practice-header">
          <h1>
            Practice Arena <span>🦉</span>
          </h1>
          <div className="practice-filters">
            <div className="filter-row">
              <PracticeSwitch
                isVerbal={activeFilter === "verbal"}
                onChange={(isVerbal) =>
                  setActiveFilter(isVerbal ? "verbal" : "math")
                }
              />

              <div className="filter-dropdown">
                <button
                  className="filter-dropdown-button"
                  onClick={() => setShowTopicFilter(!showTopicFilter)}
                >
                  Topics{" "}
                  {selectedTopics.length > 0 && `(${selectedTopics.length})`}
                  <i
                    className={`fas fa-chevron-${
                      showTopicFilter ? "up" : "down"
                    }`}
                  ></i>
                </button>
                {showTopicFilter && (
                  <div className="topic-filter-dropdown">
                    <div className="topic-section">
                      <h3>Math Topics</h3>
                      <div className="topic-tags">
                        {mathTopics.map((topic) => (
                          <div
                            key={topic}
                            className={`topic-tag ${
                              selectedTopics.includes(topic) ? "selected" : ""
                            }`}
                            onClick={() => toggleTopic(topic)}
                          >
                            {topic}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="topic-section">
                      <h3>Verbal Topics</h3>
                      <div className="topic-tags">
                        {verbalTopics.map((topic) => (
                          <div
                            key={topic}
                            className={`topic-tag ${
                              selectedTopics.includes(topic) ? "selected" : ""
                            }`}
                            onClick={() => toggleTopic(topic)}
                          >
                            {topic}
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedTopics.length > 0 && (
                      <button
                        className="clear-topics-button"
                        onClick={() => setSelectedTopics([])}
                      >
                        Clear All Topics
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="filter-dropdown">
                <button
                  className="filter-dropdown-button"
                  onClick={() => setShowDifficultyFilter(!showDifficultyFilter)}
                >
                  Difficulty{" "}
                  {activeDifficulty !== "all" && `(${activeDifficulty})`}
                  <i
                    className={`fas fa-chevron-${
                      showDifficultyFilter ? "up" : "down"
                    }`}
                  ></i>
                </button>
                {showDifficultyFilter && (
                  <div className="difficulty-filter-dropdown">
                    <div
                      className={`difficulty-option ${
                        activeDifficulty === "all" ? "selected" : ""
                      }`}
                      onClick={() => {
                        setActiveDifficulty("all");
                        setShowDifficultyFilter(false);
                      }}
                    >
                      All Levels
                    </div>
                    <div
                      className={`difficulty-option easy ${
                        activeDifficulty === "easy" ? "selected" : ""
                      }`}
                      onClick={() => {
                        setActiveDifficulty("easy");
                        setShowDifficultyFilter(false);
                      }}
                    >
                      Easy
                    </div>
                    <div
                      className={`difficulty-option medium ${
                        activeDifficulty === "medium" ? "selected" : ""
                      }`}
                      onClick={() => {
                        setActiveDifficulty("medium");
                        setShowDifficultyFilter(false);
                      }}
                    >
                      Medium
                    </div>
                    <div
                      className={`difficulty-option hard ${
                        activeDifficulty === "hard" ? "selected" : ""
                      }`}
                      onClick={() => {
                        setActiveDifficulty("hard");
                        setShowDifficultyFilter(false);
                      }}
                    >
                      Hard
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="filter-row down">
              <div className="filter-toggles">
                <button
                  className={`filter-toggle ${showBookmarked ? "active" : ""}`}
                  onClick={() => setShowBookmarked(!showBookmarked)}
                >
                  <i className="fas fa-bookmark"></i>
                  Bookmarked
                </button>
                <button
                  className={`filter-toggle ${
                    showWrongAnswered ? "active" : ""
                  }`}
                  onClick={() => setShowWrongAnswered(!showWrongAnswered)}
                >
                  <i className="fas fa-times-circle"></i>
                  Wrong Answers
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="practice-questions">
        <div className="practice-questions-header">
          <div className="header-left">
            <span className="header-number">#</span>
            <span className="header-type">Type</span>
            <span className="header-difficulty">Difficulty</span>
            <span className="header-question">Question</span>
          </div>
          <div className="header-right">
            <span className="header-tags">Tags</span>
            <span className="header-solve-rate">Solve Rate</span>
            <span className="header-actions">Actions</span>
          </div>
        </div>
        {filteredQuestions.map((question, index) => (
          <div
            className="question-card"
            key={question.id}
            onClick={() => setSelectedQuestion(question)}
            style={{ cursor: "pointer" }}
          >
            <div className="question-left">
              <span className="question-number">#{index + 1}</span>
              <div className="question-info">
                <div className="question-header">
                  <div className="question-type">
                    <span
                      className={`subject-badge ${
                        question.type || question.subject
                      }`}
                    >
                      {question.type === "math" || question.subject === "math"
                        ? "M"
                        : "V"}
                    </span>
                  </div>
                  <div className="question-type">
                    <span
                      className={`difficulty-indicator ${question.difficulty}`}
                    >
                      <span className="bar"></span>
                      <span className="bar"></span>
                      <span className="bar"></span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="question-content-row">
              <h3 className="question-title">{question.title}</h3>
              <div className="question-meta">
                <div className="question-topics">
                  {question.topics &&
                    question.topics.map((topic) => (
                      <span
                        className="topic-tag"
                        key={topic}
                        onClick={() => toggleTopic(topic)}
                      >
                        {topic}
                      </span>
                    ))}
                  {question.topic && !question.topics && (
                    <span
                      className="topic-tag"
                      key={question.topic}
                      onClick={() => toggleTopic(question.topic)}
                    >
                      {question.topic}
                    </span>
                  )}
                  {question.subtopic && (
                    <span
                      className="topic-tag"
                      key={question.subtopic}
                      onClick={() => toggleTopic(question.subtopic)}
                    >
                      {question.subtopic}
                    </span>
                  )}
                </div>
                <div className="completion-rate">
                  <span>{question.completionRate || 0}% </span>
                </div>
                <div className="question-actions">
                  <button
                    className="bookmark-button"
                    onClick={() => toggleBookmark(question.id)}
                  >
                    <i
                      className={`${
                        bookmarkedQuestions.has(question.id) ? "fas" : "far"
                      } fa-bookmark`}
                    ></i>
                  </button>
                </div>
              </div>
            </div>
            {/* <button className="practice-button">Add</button> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Practice;
