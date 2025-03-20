import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import PracticeSwitch from "./PracticeSwitch/PracticeSwitch";
import "./Practice.css";
import PracticeQuestionInterface from "./PracticeQuestionInterface/PracticeQuestionInterface";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

// Create separate components for static parts
const Header = React.memo(() => {
  return (
    <div className="practice-header">
      <h1>
        Practice Arena <span>🦉</span>
      </h1>
    </div>
  );
});

// Create a memoized filter controls component
const FilterControls = React.memo(
  ({
    filters,
    isVerbal,
    activeDifficulty,
    onSubjectToggle,
    onDifficultyChange,
    onSolveRateSort,
    onBookmarkToggle,
    showBookmarked,
    hideSolved,
    handleHideSolvedChange,
  }) => {
    // Add state for dropdown visibility
    const [showTopicFilter, setShowTopicFilter] = useState(false);
    const [showDifficultyFilter, setShowDifficultyFilter] = useState(false);
    const [selectedTopics, setSelectedTopics] = useState([]);

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

    const toggleTopic = (topic) => {
      if (selectedTopics.includes(topic)) {
        setSelectedTopics(selectedTopics.filter((t) => t !== topic));
      } else {
        setSelectedTopics([...selectedTopics, topic]);
      }
    };

    // Create a local handler that will be used if the prop is missing
    const handleSortClick = () => {
      console.log("Sort header clicked");
      if (typeof onSolveRateSort === "function") {
        onSolveRateSort();
      } else {
        console.error("onSolveRateSort function is not available");
      }
    };

    return (
      <div className="practice-filters">
        <div
          className={`filter-row ${showBookmarked ? "disabled-filters" : ""}`}
        >
          <PracticeSwitch
            isVerbal={isVerbal}
            onChange={onSubjectToggle}
            disabled={showBookmarked}
          />

          <div className="filter-dropdown">
            <button
              className="filter-dropdown-button"
              onClick={() =>
                !showBookmarked && setShowTopicFilter(!showTopicFilter)
              }
              disabled={showBookmarked}
            >
              Topics {selectedTopics.length > 0 && `(${selectedTopics.length})`}
              <i
                className={`fas fa-chevron-${showTopicFilter ? "up" : "down"}`}
              ></i>
            </button>
            {!showBookmarked && showTopicFilter && (
              <div className="topic-filter-dropdown">
                <div className="topic-section">
                  <h3>Math Topics</h3>
                  <div className="topic-tags">
                    {mathTopics.map((topic) => (
                      <div
                        key={`math-${topic}`}
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
                        key={`verbal-${topic}`}
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
              onClick={() =>
                !showBookmarked &&
                setShowDifficultyFilter(!showDifficultyFilter)
              }
              disabled={showBookmarked}
            >
              Difficulty {activeDifficulty !== null && `(${activeDifficulty})`}
              <i
                className={`fas fa-chevron-${
                  showDifficultyFilter ? "up" : "down"
                }`}
              ></i>
            </button>
            {!showBookmarked && showDifficultyFilter && (
              <div className="difficulty-filter-dropdown">
                <div
                  className={`difficulty-option ${
                    activeDifficulty === null ? "selected" : ""
                  }`}
                  onClick={() => {
                    onDifficultyChange(null);
                    setShowDifficultyFilter(false);
                  }}
                >
                  All Levels
                </div>
                <div
                  className={`difficulty-option easy ${
                    activeDifficulty === 0 ? "selected" : ""
                  }`}
                  onClick={() => {
                    onDifficultyChange(0);
                    setShowDifficultyFilter(false);
                  }}
                >
                  Easy
                </div>
                <div
                  className={`difficulty-option medium ${
                    activeDifficulty === 1 ? "selected" : ""
                  }`}
                  onClick={() => {
                    onDifficultyChange(1);
                    setShowDifficultyFilter(false);
                  }}
                >
                  Medium
                </div>
                <div
                  className={`difficulty-option hard ${
                    activeDifficulty === 2 ? "selected" : ""
                  }`}
                  onClick={() => {
                    onDifficultyChange(2);
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
              onClick={onBookmarkToggle}
            >
              <i className="fas fa-bookmark"></i> Bookmarked
            </button>

            <div className="solved-filter">
              <input
                type="checkbox"
                id="hideSolved"
                checked={hideSolved}
                onChange={handleHideSolvedChange}
              />
              <label htmlFor="hideSolved">Hide Solved</label>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

// Create a separate QuestionsHeader component that includes the solve rate header
const QuestionsHeader = React.memo(({ filters, onSolveRateSort }) => {
  return (
    <div className="practice-questions-header">
      <div className="header-left">
        <span className="header-number">#</span>
        <span className="header-type">S</span>
        <span className="header-difficulty">🧩</span>
        <span className="header-question">Question</span>
      </div>
      <div className="header-right">
        <span className="header-tags">Tags</span>
        <div className="solve-rate-header" onClick={onSolveRateSort}>
          Solve Rate
          <div className="sort-icons">
            <i className="fas fa-sort-up"></i>
            <i className="fas fa-sort-down"></i>
          </div>
        </div>
      </div>
    </div>
  );
});

// Create a memoized questions section
const QuestionsSection = React.memo(
  ({ questions, loading, error, onQuestionClick }) => {
    if (loading) {
      return <div className="loading-container">Loading questions...</div>;
    }

    if (error) {
      return <div className="error-container">{error}</div>;
    }

    if (questions.length === 0) {
      return (
        <div className="no-questions">
          No questions found matching your filters.
        </div>
      );
    }

    return (
      <div className="practice-questions">
        {questions.map((question) => (
          <div
            className="question-card"
            key={question.id}
            onClick={() => onQuestionClick(question)}
          >
            <div className="question-left">
              <span className="question-number">#{question.id}</span>
              <div className="question-info">
                <div className="question-header">
                  <div className="question-type">
                    <span
                      className={`subject-badge ${
                        question.subject_id === 1 ? "math" : "verbal"
                      }`}
                    >
                      {question.subject_id === 1 ? "M" : "V"}
                    </span>
                  </div>
                  <div className="question-type">
                    <span
                      className={`difficulty-indicator ${
                        question.difficulty_level === 0
                          ? "easy"
                          : question.difficulty_level === 1
                          ? "medium"
                          : question.difficulty_level === 2
                          ? "hard"
                          : "medium"
                      }`}
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
              <h3 className="question-title">{question.question_text}</h3>
              <div className="question-meta">
                <div className="question-topics">
                  {question.topic && (
                    <span className="topic-tag" key={question.topic}>
                      {question.topic}
                    </span>
                  )}
                  {question.subtopic && (
                    <span className="topic-tag" key={question.subtopic}>
                      {question.subtopic}
                    </span>
                  )}
                </div>
                <div className="completion-rate">
                  <span> {question.solve_rate}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

// Create a memoized pagination component
const Pagination = React.memo(
  ({ currentPage, totalPages, totalQuestions, onPageChange }) => {
    return (
      <div className="pagination">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages} ({totalQuestions} questions)
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    );
  }
);

const Practice = () => {
  const [activeFilter, setActiveFilter] = useState("verbal");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [showTopicFilter, setShowTopicFilter] = useState(false);
  const [showDifficultyFilter, setShowDifficultyFilter] = useState(false);
  const [activeDifficulty, setActiveDifficulty] = useState(null);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [showWrongAnswered, setShowWrongAnswered] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    subject: 2, // Default to Math
    difficulty: "",
    topic: "",
    subtopic: "",
    sort_dir: "asc",
    page: 1,
    page_size: 20,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const pageSize = 20; // Number of questions per page

  const navigate = useNavigate();

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

  // Add handlers for filter changes
  const handleSubjectChange = (subjectId) => {
    setFilters((prev) => ({
      ...prev,
      subject: subjectId,
      page: 1, // Reset to first page when changing filters
    }));
  };

  const handleDifficultyChange = (difficultyLevel) => {
    setFilters((prev) => ({
      ...prev,
      difficulty: difficultyLevel,
      page: 1, // Reset to first page when changing filters
    }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Add the fetch function
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching filtered questions with:", filters);

      // Call the new API method
      const data = await api.getFilteredQuestions(filters);

      console.log("Filtered questions response:", data);

      // Update state with the response data
      setQuestions(data.questions || []);

      // Update pagination info
      if (data.pagination) {
        setCurrentPage(data.pagination.current_page);
        setTotalQuestions(data.pagination.total_items);
        setTotalPages(data.pagination.total_pages);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError(`Failed to load questions: ${error.message}`);
      setQuestions([]);
      setLoading(false);
    }
  };

  // Update the useEffect to use the appropriate API method based on showBookmarked
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let data;

        if (showBookmarked) {
          console.log(
            `Fetching bookmarked questions - page ${currentPage}, sort direction: ${filters.sort_dir}`
          );
          data = await api.getBookmarkedQuestions(
            filters.sort_dir,
            currentPage,
            pageSize
          );
        } else {
          console.log("Fetching filtered questions with:", filters);
          data = await api.getFilteredQuestions(filters);
        }

        console.log("Questions response:", data);

        // Make sure we have the questions array
        const questionsList = data.questions || [];
        setQuestions(questionsList);

        // Check if we have questions before setting pagination info
        if (questionsList.length > 0) {
          // Use total_count from the response, or fall back to the length of questions array
          const total =
            data.total_count !== undefined
              ? data.total_count
              : questionsList.length;
          setTotalQuestions(total);

          // Calculate total pages, ensuring at least 1 page
          const calculatedTotalPages = Math.max(1, Math.ceil(total / pageSize));
          setTotalPages(calculatedTotalPages);

          // Ensure currentPage is valid
          if (currentPage > calculatedTotalPages) {
            setCurrentPage(calculatedTotalPages);
          }
        } else {
          // No questions found
          setTotalQuestions(0);
          setTotalPages(1);
          setCurrentPage(1);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError(`Failed to load questions: ${error.message}`);
        setQuestions([]);
        setTotalQuestions(0);
        setTotalPages(1);
        setCurrentPage(1);
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, showBookmarked, currentPage, pageSize, navigate]);

  // Simplify the toggleBookmark function
  const toggleBookmark = async (questionId) => {
    try {
      // Call your API to toggle the bookmark
      await api.toggleBookmark(questionId);

      // Update the questions array to reflect the change
      setQuestions(
        questions.map((q) => {
          if (q.id === questionId) {
            return { ...q, is_bookmarked: !q.is_bookmarked };
          }
          return q;
        })
      );

      // Also update selectedQuestion if it's the one being bookmarked
      if (selectedQuestion && selectedQuestion.id === questionId) {
        setSelectedQuestion({
          ...selectedQuestion,
          is_bookmarked: !selectedQuestion.is_bookmarked,
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  // Helper function to convert difficulty level to labels
  const getDifficultyLabel = (level) => {
    switch (level) {
      case 1:
        return "easy";
      case 2:
        return "medium";
      case 3:
        return "hard";
      default:
        return "medium";
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const toggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  // Add an effect to update filters when activeDifficulty changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      // Convert activeDifficulty to string or empty string if null
      difficulty: activeDifficulty !== null ? activeDifficulty.toString() : "",
      page: 1, // Reset to page 1 when difficulty changes
    }));
  }, [activeDifficulty]);

  // Your existing difficulty button handler
  const handleDifficultyClick = (level) => {
    // If clicking the already active difficulty, set to null (All)
    if (activeDifficulty === level) {
      setActiveDifficulty(null);
    } else {
      setActiveDifficulty(level);
    }
  };

  // Add an effect to update filters when the switch changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      // Convert switch state to subject ID: false (Math) = 1, true (Verbal) = 2
      subject: activeFilter === "math" ? 1 : 2,
      page: 1, // Reset to page 1 when subject changes
    }));
  }, [activeFilter]);

  // Your existing switch handler
  const handleSubjectSwitch = () => {
    setActiveFilter((prev) => (prev === "math" ? "verbal" : "math"));
  };

  // Add a handler for the solve rate sort button
  const handleSolveRateSort = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      sort_dir: prev.sort_dir === "asc" ? "desc" : "asc",
      page: 1,
    }));
  }, []);

  // Add a handler for the bookmark toggle
  const handleBookmarkToggle = useCallback(() => {
    setShowBookmarked((prev) => !prev);
  }, []);

  // Add a state to track the current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Update handleQuestionClick to also set the current index
  const handleQuestionClick = (question) => {
    const index = questions.findIndex((q) => q.id === question.id);
    if (index !== -1) {
      setCurrentQuestionIndex(index);
      setSelectedQuestion(question);
    }
  };

  // Improve the next/previous handlers
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setSelectedQuestion(questions[nextIndex]);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      setSelectedQuestion(questions[prevIndex]);
    }
  };

  // Update the close handler to reset the index
  const handleCloseQuestion = () => {
    setSelectedQuestion(null);
    setCurrentQuestionIndex(0);
  };

  return (
    <div className="practice-page">
      <Header />

      {selectedQuestion ? (
        <PracticeQuestionInterface
          question={selectedQuestion}
          onClose={handleCloseQuestion}
          onNextQuestion={handleNextQuestion}
          onPreviousQuestion={handlePreviousQuestion}
          hasNext={currentQuestionIndex < questions.length - 1}
          hasPrevious={currentQuestionIndex > 0}
          onBookmark={toggleBookmark}
        />
      ) : (
        <>
          <FilterControls
            filters={filters}
            isVerbal={activeFilter === "verbal"}
            activeDifficulty={activeDifficulty}
            onSubjectToggle={handleSubjectSwitch}
            onDifficultyChange={handleDifficultyClick}
            onSolveRateSort={handleSolveRateSort}
            onBookmarkToggle={handleBookmarkToggle}
            showBookmarked={showBookmarked}
          />

          <QuestionsHeader onSolveRateSort={handleSolveRateSort} />
          <QuestionsSection
            questions={questions}
            loading={loading}
            error={error}
            onQuestionClick={handleQuestionClick}
          />

          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || questions.length === 0}
            >
              Previous
            </button>
            <span>
              {questions.length > 0
                ? `Page ${currentPage} of ${totalPages} (${totalQuestions} questions)`
                : `No questions found`}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || questions.length === 0}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Practice;
