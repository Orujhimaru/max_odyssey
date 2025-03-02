import React, { useState } from "react";
import "./Practice.css";

const Practice = () => {
  const [activeFilters, setActiveFilters] = useState({
    difficulty: "all",
    subject: "all",
    status: "all",
    performance: "all",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  // Mock data for practice questions
  const practiceQuestions = [
    {
      id: 1,
      question: "What is the value of x in the equation 2x + 5 = 13?",
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
      id: 2,
      question:
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
      id: 3,
      question: "If f(x) = 3x² - 2x + 1, what is the value of f(2)?",
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
      id: 4,
      question: "Which sentence contains a grammatical error?",
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
      id: 5,
      question: "What is the area of a circle with radius 5 units?",
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
      id: 6,
      question:
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

  const handleFilterChange = (filterType, value) => {
    setActiveFilters({
      ...activeFilters,
      [filterType]: value,
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Apply filters to questions
  const filteredQuestions = practiceQuestions.filter((question) => {
    // Filter by difficulty
    if (
      activeFilters.difficulty !== "all" &&
      question.difficulty !== activeFilters.difficulty
    ) {
      return false;
    }

    // Filter by subject
    if (
      activeFilters.subject !== "all" &&
      question.subject !== activeFilters.subject
    ) {
      return false;
    }

    // Filter by status
    if (
      activeFilters.status !== "all" &&
      question.status !== activeFilters.status
    ) {
      return false;
    }

    // Filter by performance
    if (activeFilters.performance !== "all") {
      if (
        activeFilters.performance === "correct" &&
        question.performance !== "correct"
      ) {
        return false;
      }
      if (
        activeFilters.performance === "incorrect" &&
        question.performance !== "incorrect"
      ) {
        return false;
      }
      if (
        activeFilters.performance === "bookmarked" &&
        !question.isBookmarked
      ) {
        return false;
      }
    }

    // Filter by search query
    if (
      searchQuery &&
      !question.question.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="practice-page">
      <div className="practice-header">
        <h1>Practice Questions</h1>
        <div className="practice-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            <i className="fas fa-search search-icon"></i>
          </div>
          <button className="filter-toggle" onClick={toggleFilters}>
            <i className="fas fa-filter"></i>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
      </div>

      <div className="practice-content">
        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <h3>Difficulty</h3>
              <div className="filter-options">
                <button
                  className={`filter-option ${
                    activeFilters.difficulty === "all" ? "active" : ""
                  }`}
                  onClick={() => handleFilterChange("difficulty", "all")}
                >
                  All
                </button>
                <button
                  className={`filter-option ${
                    activeFilters.difficulty === "easy" ? "active" : ""
                  }`}
                  onClick={() => handleFilterChange("difficulty", "easy")}
                >
                  Easy
                </button>
                <button
                  className={`filter-option ${
                    activeFilters.difficulty === "medium" ? "active" : ""
                  }`}
                  onClick={() => handleFilterChange("difficulty", "medium")}
                >
                  Medium
                </button>
                <button
                  className={`filter-option ${
                    activeFilters.difficulty === "hard" ? "active" : ""
                  }`}
                  onClick={() => handleFilterChange("difficulty", "hard")}
                >
                  Hard
                </button>
              </div>
            </div>

            <div className="filter-group">
              <h3>Subject</h3>
              <div className="filter-options">
                <button
                  className={`filter-option ${
                    activeFilters.subject === "all" ? "active" : ""
                  }`}
                  onClick={() => handleFilterChange("subject", "all")}
                >
                  All
                </button>
                <button
                  className={`filter-option ${
                    activeFilters.subject === "math" ? "active" : ""
                  }`}
                  onClick={() => handleFilterChange("subject", "math")}
                >
                  Math
                </button>
                <button
                  className={`filter-option ${
                    activeFilters.subject === "verbal" ? "active" : ""
                  }`}
                  onClick={() => handleFilterChange("subject", "verbal")}
                >
                  Verbal
                </button>
              </div>
            </div>

            <div className="filter-group">
              <h3>Status</h3>
              <div className="filter-options">
                <button
                  className={`filter-option ${
                    activeFilters.status === "all" ? "active" : ""
                  }`}
                  onClick={() => handleFilterChange("status", "all")}
                >
                  All
                </button>
                <button
                  className={`filter-option ${
                    activeFilters.status === "not-started" ? "active" : ""
                  }`}
                  onClick={() => handleFilterChange("status", "not-started")}
                >
                  Not Started
                </button>
                <button
                  className={`filter-option ${
                    activeFilters.status === "in-progress" ? "active" : ""
                  }`}
                  onClick={() => handleFilterChange("status", "in-progress")}
                >
                  In Progress
                </button>
                <button
                  className={`filter-option ${
                    activeFilters.status === "completed" ? "active" : ""
                  }`}
                  onClick={() => handleFilterChange("status", "completed")}
                >
                  Completed
                </button>
              </div>
            </div>

            <div className="filter-group">
              <h3>Performance</h3>
              <div className="filter-options">
                <button
                  className={`filter-option ${
                    activeFilters.performance === "all" ? "active" : ""
                  }`}
                  onClick={() => handleFilterChange("performance", "all")}
                >
                  All
                </button>
                <button
                  className={`filter-option ${
                    activeFilters.performance === "correct" ? "active" : ""
                  }`}
                  onClick={() => handleFilterChange("performance", "correct")}
                >
                  Correct
                </button>
                <button
                  className={`filter-option ${
                    activeFilters.performance === "incorrect" ? "active" : ""
                  }`}
                  onClick={() => handleFilterChange("performance", "incorrect")}
                >
                  Incorrect
                </button>
                <button
                  className={`filter-option ${
                    activeFilters.performance === "bookmarked" ? "active" : ""
                  }`}
                  onClick={() =>
                    handleFilterChange("performance", "bookmarked")
                  }
                >
                  Bookmarked
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="questions-container">
          <div className="questions-header">
            <h2>Questions ({filteredQuestions.length})</h2>
            <div className="sort-options">
              <span>Sort by:</span>
              <select className="sort-select">
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="difficulty-asc">
                  Difficulty (Easy to Hard)
                </option>
                <option value="difficulty-desc">
                  Difficulty (Hard to Easy)
                </option>
              </select>
            </div>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="no-questions">
              <i className="fas fa-search"></i>
              <p>
                No questions match your filters. Try adjusting your criteria.
              </p>
            </div>
          ) : (
            <div className="questions-list">
              {filteredQuestions.map((question) => (
                <div
                  key={question.id}
                  className={`question-card ${question.subject}`}
                >
                  <div className="question-header">
                    <div className="question-meta">
                      <span
                        className={`difficulty-badge ${question.difficulty}`}
                      >
                        {question.difficulty}
                      </span>
                      <span className="subject-badge">{question.subject}</span>
                      <span className="topic-badge">{question.topic}</span>
                    </div>
                    <div className="question-actions">
                      <button
                        className={`bookmark-button ${
                          question.isBookmarked ? "bookmarked" : ""
                        }`}
                      >
                        <i
                          className={`${
                            question.isBookmarked ? "fas" : "far"
                          } fa-bookmark`}
                        ></i>
                      </button>
                    </div>
                  </div>
                  <div className="question-content">
                    <p>{question.question}</p>
                  </div>
                  <div className="question-footer">
                    <div className="status-indicator">
                      {question.status === "completed" ? (
                        <span
                          className={`performance-badge ${question.performance}`}
                        >
                          <i
                            className={`fas ${
                              question.performance === "correct"
                                ? "fa-check"
                                : "fa-times"
                            }`}
                          ></i>
                          {question.performance === "correct"
                            ? "Correct"
                            : "Incorrect"}
                        </span>
                      ) : (
                        <span className={`status-badge ${question.status}`}>
                          {question.status === "not-started"
                            ? "Not Started"
                            : "In Progress"}
                        </span>
                      )}
                    </div>
                    <button className="practice-button">Practice</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Practice;
