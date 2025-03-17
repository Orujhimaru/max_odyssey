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
  }) => {
    // Add state for dropdown visibility
    const [showTopicFilter, setShowTopicFilter] = useState(false);
    const [showDifficultyFilter, setShowDifficultyFilter] = useState(false);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [showBookmarked, setShowBookmarked] = useState(false);

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
        <div className="filter-row">
          <PracticeSwitch isVerbal={isVerbal} onChange={onSubjectToggle} />

          <div className="filter-dropdown">
            <button
              className="filter-dropdown-button"
              onClick={() => setShowTopicFilter(!showTopicFilter)}
            >
              Topics {selectedTopics.length > 0 && `(${selectedTopics.length})`}
              <i
                className={`fas fa-chevron-${showTopicFilter ? "up" : "down"}`}
              ></i>
            </button>
            {showTopicFilter && (
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
              onClick={() => setShowDifficultyFilter(!showDifficultyFilter)}
            >
              Difficulty
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
              onClick={() => setShowBookmarked(!showBookmarked)}
            >
              <i className="fas fa-bookmark"></i>
              Bookmarked
            </button>
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
  ({ questions, loading, error, filters, onSolveRateSort }) => {
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
        {questions.map((question, index) => (
          <div
            className="question-card"
            key={question.id}
            onClick={() => {
              // Implement the logic to open the question interface
            }}
            style={{ cursor: "pointer" }}
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
    page_size: 10,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);

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
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
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

  // Add useEffect to fetch questions when filters change
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchQuestions();
  }, [filters, navigate]);

  // Simplify the toggleBookmark function
  const toggleBookmark = async (questionId) => {
    try {
      console.log(`Toggling bookmark for question ID: ${questionId}`);
      await api.toggleBookmark(questionId);
      console.log("Bookmark toggled successfully in backend");

      // No need to update any state here since the PracticeQuestionInterface
      // component handles its own state
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      throw error;
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

  return (
    <div className="practice-page">
      <Header />

      <FilterControls
        filters={filters}
        isVerbal={activeFilter === "verbal"}
        activeDifficulty={activeDifficulty}
        onSubjectToggle={handleSubjectSwitch}
        onDifficultyChange={handleDifficultyClick}
        onSolveRateSort={handleSolveRateSort}
      />
      <QuestionsHeader onSolveRateSort={handleSolveRateSort} />
      <QuestionsSection
        questions={questions}
        loading={loading}
        error={error}
        filters={filters}
        onSolveRateSort={handleSolveRateSort}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalQuestions={totalQuestions}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Practice;
