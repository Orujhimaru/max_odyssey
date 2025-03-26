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
        {questions.map((question, index) => (
          <div
            className="question-card"
            key={question.id}
            onClick={() => onQuestionClick(question)}
          >
            <div className="question-left">
              <span className="question-number">#{index + 1}</span>
              <div className="question-info-main">
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
                      className={`difficulty-indicator-bars ${
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

// Add the debounce hook right after imports
const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);

  const debouncedFn = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      return new Promise((resolve) => {
        timeoutRef.current = setTimeout(() => {
          resolve(callback(...args));
        }, delay);
      });
    },
    [callback, delay]
  );

  return debouncedFn;
};

const Practice = () => {
  const [activeFilter, setActiveFilter] = useState(null); // null, 'solved', or 'incorrect'
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
  const [solved, setHideSolved] = useState(false);

  const [filters, setFilters] = useState({
    subject: 2, // Default to Math
    difficulty: "",
    topic: "",
    subtopic: "",
    sort_dir: "asc",
    page: 1,
    page_size: 20,
    solved: false,
    incorrect: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const pageSize = 20; // Number of questions per page

  const navigate = useNavigate();

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
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Smooth scroll to top
      window.scrollTo({
        top: 0,
      });
    }
  };

  // Create a proper callback function for the API call
  const fetchQuestionsCallback = useCallback((filterParams) => {
    return api.getFilteredQuestions(filterParams);
  }, []);

  // Create debounced version
  const debouncedFetchQuestions = useDebounce(fetchQuestionsCallback, 500);

  // Update the useEffect
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
          data = await api.getBookmarkedQuestions(
            filters.sort_dir,
            currentPage,
            pageSize
          );
        } else {
          data = await debouncedFetchQuestions({
            ...filters,
            page: currentPage,
            page_size: pageSize,
          });
        }

        setQuestions(data.questions || []);

        if (data.pagination) {
          setCurrentPage(data.pagination.current_page);
          setTotalQuestions(data.pagination.total_items);
          setTotalPages(data.pagination.total_pages);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError(`Failed to load questions: ${error.message}`);
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, showBookmarked, currentPage, pageSize, debouncedFetchQuestions]);

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

  // Then update the handleHideSolvedChange function to update filters
  const handleSolvedChange = () => {
    setHideSolved(!hideSolved);
    setFilters((prev) => ({
      ...prev,
      solved: !hideSolved,
      page: 1,
    }));
  };

  const handleQuestionSubmit = (
    questionId,
    selectedAnswer,
    correctAnswerIndex
  ) => {
    // Determine if the answer was correct
    const isCorrect = selectedAnswer === correctAnswerIndex;

    // Get existing question states from localStorage
    const storedQuestions = JSON.parse(
      localStorage.getItem("userQuestionStates") || "[]"
    );

    // Find if this question already exists in localStorage
    const existingIndex = storedQuestions.findIndex(
      (q) => q.questionId === questionId
    );

    // Create the updated question state
    const updatedQuestionState = {
      questionId,
      isBookmarked:
        existingIndex >= 0
          ? storedQuestions[existingIndex].isBookmarked
          : false,
      isSolved: true,
      isCorrect,
      selectedOption: selectedAnswer,
      timestamp: new Date().toISOString(),
    };

    // Update the array
    if (existingIndex >= 0) {
      storedQuestions[existingIndex] = {
        ...storedQuestions[existingIndex],
        ...updatedQuestionState,
      };
    } else {
      storedQuestions.push(updatedQuestionState);
    }

    // Save back to localStorage
    localStorage.setItem("userQuestionStates", JSON.stringify(storedQuestions));

    // You can also update state if needed
    // For example, to show a "Solved" indicator
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId ? { ...q, userState: updatedQuestionState } : q
      )
    );

    // Return the result for immediate UI feedback
    return isCorrect;
  };

  // Add this effect to reset page when filters change
  useEffect(() => {
    // Reset to page 1 whenever filters change
    setCurrentPage(1);
  }, [filters]);

  return (
    <div>
      {selectedQuestion ? (
        <PracticeQuestionInterface
          question={selectedQuestion}
          onClose={handleCloseQuestion}
          onNextQuestion={handleNextQuestion}
          onPreviousQuestion={handlePreviousQuestion}
          hasNext={currentQuestionIndex < questions.length - 1}
          hasPrevious={currentQuestionIndex > 0}
          questionNumber={currentQuestionIndex + 1}
          onBookmark={toggleBookmark}
          isBookmarked={selectedQuestion.is_bookmarked}
          onSubmit={(selectedAnswer) =>
            handleQuestionSubmit(
              selectedQuestion.id,
              selectedAnswer,
              selectedQuestion.correct_answer_index
            )
          }
        />
      ) : (
        <div className="practice-page">
          <Header />
          <FilterControls
            filters={filters}
            setFilters={setFilters}
            setActiveFilter={setActiveFilter}
            activeFilter={activeFilter}
            activeDifficulty={activeDifficulty}
            onSubjectToggle={handleSubjectSwitch}
            onDifficultyChange={handleDifficultyClick}
            onSolveRateSort={handleSolveRateSort}
            onBookmarkToggle={handleBookmarkToggle}
            showBookmarked={showBookmarked}
            handleHideSolvedChange={handleSolvedChange}
            hideSolved={solved}
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
        </div>
      )}
    </div>
  );
};
// Create a memoized filter controls component
const FilterControls = React.memo(
  ({
    filters,
    activeFilter,
    setFilters,
    setActiveFilter,
    isVerbal,
    activeDifficulty,
    onSubjectToggle,
    onDifficultyChange,
    onSolveRateSort,
    onBookmarkToggle,
    showBookmarked,
    solved,
    handleSolvedChange,
    incorrect,
    handleIncorrectChange,
  }) => {
    // Add state for dropdown visibility
    const [showTopicFilter, setShowTopicFilter] = useState(false);
    const [showDifficultyFilter, setShowDifficultyFilter] = useState(false);
    const [selectedTopics, setSelectedTopics] = useState([]);

    // Define math topics with their subtopics (shortened subtopics with improved readability)
    const mathTopics = {
      Algebra: [
        "Linear Equations (1)",
        "Linear Functions",
        "Linear Equations (2)",
        "Systems of 2 in 2",
        "Linear Inequalities",
      ],
      "Advanced Math": [
        "Equivalent Expressions",
        "Nonlinear Equations",
        "Nonlinear Functions",
      ],
      "Problem-Solving and Data Analysis": [
        "Ratios & Rates",
        "Percentages",
        "Measures of Spread",
        "Models and Scatterplots",
        "Probability",
        "Sample Statistics",
        "Studeis and Experiments",
      ],
      "Geometry and Trigonometry": [
        "Area & Volume",
        "Angles & Triangles",
        "Trigonometry",
        "Circles",
      ],
    };

    // Define verbal topics with their subtopics
    const verbalTopics = {
      "Craft and Structure": [
        "Cross-Text Connections",
        "Text Structure and Purpose",
        "Words in Context",
      ],
      "Expression of Ideas": ["Rhetorical Synthesis", "Transitions"],
      "Information and Ideas": [
        "Central Ideas and Details",
        "Command of Evidence",
        "Inferences",
      ],
      "Standard English Conventions": [
        "Boundaries",
        "Form, Structure, and Sense",
      ],
    };

    const toggleTopic = (topic, subtopic = null) => {
      let newSelectedTopics = [];
      let selectedMainTopic = null;

      if (subtopic) {
        // If clicking a subtopic
        // Find which main topic this subtopic belongs to
        const topicsToSearch =
          filters.subject === 1 ? mathTopics : verbalTopics;
        for (const [mainTopic, subtopics] of Object.entries(topicsToSearch)) {
          if (subtopics.includes(subtopic)) {
            selectedMainTopic = mainTopic;
            break;
          }
        }

        if (!selectedMainTopic) {
          console.error(`Subtopic "${subtopic}" not found in any topic`);
          return;
        }

        const topicKey = `${selectedMainTopic}:${subtopic}`;

        // If this subtopic is already selected, deselect it
        if (selectedTopics.includes(topicKey)) {
          newSelectedTopics = [];
        } else {
          // Otherwise, select only this subtopic
          newSelectedTopics = [topicKey];
        }
      } else {
        // If clicking a main topic
        // Check if this topic exists
        const topicsToUse = filters.subject === 1 ? mathTopics : verbalTopics;
        if (!topicsToUse[topic]) {
          console.error(
            `Topic "${topic}" not found in ${
              filters.subject === 1 ? "mathTopics" : "verbalTopics"
            }`
          );
          return;
        }

        // Get all subtopics for this topic
        const allSubtopicKeys = topicsToUse[topic].map(
          (sub) => `${topic}:${sub}`
        );

        // Check if all subtopics of this topic are already selected
        const allSubtopicsSelected = allSubtopicKeys.every((key) =>
          selectedTopics.includes(key)
        );

        if (allSubtopicsSelected) {
          // If all are selected, deselect all
          newSelectedTopics = [];
        } else {
          // Otherwise, select all subtopics of this topic
          newSelectedTopics = [...allSubtopicKeys];
          selectedMainTopic = topic;
        }
      }

      // Update selectedTopics state
      setSelectedTopics(newSelectedTopics);

      // Prepare filter updates
      const filterUpdates = {
        page: 1,
      };

      // Only add topic and subtopic if we have selections
      if (newSelectedTopics.length > 0) {
        filterUpdates.topic = selectedMainTopic;

        // If we selected a specific subtopic (not the whole topic)
        if (newSelectedTopics.length === 1) {
          filterUpdates.subtopic = newSelectedTopics[0].split(":")[1];
        } else {
          filterUpdates.subtopic = "";
        }
      } else {
        // Clear topic and subtopic filters if nothing is selected
        filterUpdates.topic = "";
        filterUpdates.subtopic = "";
      }

      // Update filters
      setFilters((prev) => ({
        ...prev,
        ...filterUpdates,
      }));
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

    const handleFilterToggle = (filter) => {
      // If clicking the active filter, deactivate it
      if (activeFilter === filter) {
        setActiveFilter(null);
        setFilters((prev) => ({
          ...prev,
          solved: false,
          incorrect: false,
          page: 1,
        }));
      } else {
        // Activate the clicked filter, deactivate the other
        setActiveFilter(filter);
        setFilters((prev) => ({
          ...prev,
          solved: filter === "solved",
          incorrect: filter === "incorrect",
          page: 1,
        }));
      }
    };

    return (
      <div className="practice-filters">
        <div
          className={`filter-row ${showBookmarked ? "disabled-filters" : ""}`}
        >
          <div className="subject-toggle-container">
            <button
              className={`subject-toggle ${
                filters.subject === 1 ? "active verbal" : ""
              }`}
              onClick={() => onSubjectToggle(1)}
            >
              V
            </button>
            <button
              className={`math subject-toggle ${
                filters.subject === 2 ? "active math" : ""
              }`}
              onClick={() => onSubjectToggle(2)}
            >
              M
            </button>
          </div>

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
                {Object.entries(
                  filters.subject === 1 ? mathTopics : verbalTopics
                ).map(([topic, subtopics]) => {
                  // Check if this topic is selected (all its subtopics are selected)
                  const isTopicSelected = subtopics.every((sub) =>
                    selectedTopics.includes(`${topic}:${sub}`)
                  );

                  return (
                    <div key={topic} className="topic-section">
                      <h3
                        className={`topic-header ${
                          isTopicSelected ? "selected" : ""
                        }`}
                        onClick={() => toggleTopic(topic)}
                      >
                        {topic}
                      </h3>
                      <div className="topic-tags">
                        {subtopics.map((subtopic) => (
                          <div
                            key={`${topic}-${subtopic}`}
                            className={`topic-tag 
                              ${
                                selectedTopics.includes(`${topic}:${subtopic}`)
                                  ? "selected"
                                  : ""
                              } 
                              ${isTopicSelected ? "disabled" : ""}
                            `}
                            onClick={() =>
                              !isTopicSelected && toggleTopic(null, subtopic)
                            }
                            style={{
                              cursor: isTopicSelected ? "default" : "pointer",
                            }}
                          >
                            {subtopic}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
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
              Difficulty
              {activeDifficulty !== null && (
                <span
                  className={`difficulty-indicator ${
                    activeDifficulty === 0
                      ? "easy"
                      : activeDifficulty === 1
                      ? "medium"
                      : "hard"
                  }`}
                />
              )}
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
          </div>{" "}
          <div className="filter-toggles">
            <button
              className={`filter-toggle ${
                activeFilter === "solved" ? "active" : ""
              }`}
              onClick={() => handleFilterToggle("solved")}
              data-filter="solved"
            >
              <i className="fas fa-check-circle"></i>
              Solved
            </button>
            <button
              className={`filter-toggle ${
                activeFilter === "incorrect" ? "active" : ""
              }`}
              onClick={() => handleFilterToggle("incorrect")}
              data-filter="incorrect"
            >
              <i className="fas fa-times-circle"></i>
              Incorrect
            </button>
          </div>
        </div>
      </div>
    );
  }
);
export default Practice;
