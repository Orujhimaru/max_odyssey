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
import practiceHandIcon from "../../assets/practice_hand.svg";

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
    "Studies and Experiments",
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
    "Words in Context",
    "Text Structure and Purpose",
    "Cross-Text Connections",
  ],
  "Information and Ideas": [
    "Central Ideas and Details",
    "Command of Evidence",
    "Inferences",
  ],
  "Standard English Conventions": ["Boundaries", "Form, Structure, and Sense"],
  "Expression of Ideas": ["Rhetorical Synthesis", "Transitions"],
};

// Create separate components for static parts
const Header = React.memo(() => {
  return (
    <div className="practice-header">
      <h1>
        Practice Arena
        <img
          src={practiceHandIcon}
          alt="Practice Icon"
          className="practice-icon"
        />
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
        {questions.map((question, index) => {
          // Check if the question is correctly solved
          const isCorrectlySolved = (() => {
            // First check if the question has userState from our state management
            if (question.userState?.isSolved) {
              return true;
            }

            // Check if the question is marked as solved by the backend
            // Only check if is_solved is true, regardless of incorrect property
            if (question.is_solved === true) {
              return true;
            }

            // Finally check localStorage for user progress
            try {
              const userQuestionStates = JSON.parse(
                localStorage.getItem("userQuestionStates") || "[]"
              );
              const existingState = userQuestionStates.find(
                (q) => q.questionId === question.id
              );
              return existingState?.isSolved === true;
            } catch (e) {
              console.error("Error parsing userQuestionStates:", e);
              return false;
            }
          })();

          // console.log(`Question ${question.id} solved status:`, {
          //   id: question.id,
          //   is_solved: question.is_solved,
          //   incorrect: question.incorrect,
          //   isCorrectlySolved: isCorrectlySolved,
          // });

          return (
            <div
              className="question-card"
              key={question.id}
              onClick={() => onQuestionClick(question)}
            >
              <div className="question-left">
                {isCorrectlySolved ? (
                  <span
                    className={`solved-check ${
                      question.incorrect === true ? "incorrect" : "correct"
                    }`}
                  >
                    <i
                      className={`fas ${
                        question.incorrect === true
                          ? "fa-times-circle"
                          : "fa-check-circle"
                      }`}
                    ></i>
                  </span>
                ) : (
                  <span className="question-number">#{index + 1}</span>
                )}
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
          );
        })}
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

// Add a hook to protect against rapid filter changes
const useFilterProtection = () => {
  const [isFilterChanging, setIsFilterChanging] = useState(false);

  const protectFilterAction = useCallback(
    (action) => {
      if (isFilterChanging) return;

      setIsFilterChanging(true);
      action();

      setTimeout(() => {
        setIsFilterChanging(false);
      }, 500); // 0.5 second cooldown
    },
    [isFilterChanging]
  );

  return { protectFilterAction, isFilterChanging };
};

const Practice = () => {
  // Add filter protection
  const { protectFilterAction, isFilterChanging } = useFilterProtection();

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
  const [hideSolved, setHideSolved] = useState(false);
  const [bluebookActive, setBluebookActive] = useState(false);

  const [filters, setFilters] = useState({
    question_text: "",
    sort_dir: "desc",
    subject: 2, // 1 = Math, 2 = Verbal
    difficulty: "", // Empty string means all difficulties
    topic: "",
    subtopic: "",
    hide_solved: false, // Renamed to match API expectation
    incorrect: false, // Add incorrect filter
    refreshTimestamp: Date.now(), // Add this to force refresh when needed
    is_bluebook: 0, // Add is_bluebook filter with default value 0
    page: 1,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const pageSize = 20; // Number of questions per page

  const navigate = useNavigate();

  // Add a ref to track mounted state
  const isMountedRef = useRef(false);
  const shouldFetchRef = useRef(false);

  // Separate useEffect just for the initial data load
  useEffect(() => {
    // Only run this once on mount
    if (!isMountedRef.current) {
      isMountedRef.current = true;

      const fetchInitialData = async () => {
        try {
          setLoading(true);
          const initialFilters = {
            subject: filters.subject,
            page: currentPage,
            page_size: pageSize,
          };

          console.log("INITIAL: Fetching with filters:", initialFilters);

          const response = await api.getFilteredQuestions(initialFilters);
          console.log("INITIAL: Got response:", response);

          if (response && response.questions) {
            setQuestions(response.questions);
            setTotalPages(response.total_pages || 1);
            setTotalQuestions(response.total_questions || 0);

            // Log pagination data
            console.log("PAGINATION INFO:");
            console.log("- Total questions:", response.total_questions);
            console.log("- Total pages:", response.total_pages);
            console.log("- Current page:", currentPage);
            console.log("- Page size:", pageSize);
            console.log("- Questions received:", response.questions.length);
          } else {
            console.error("INITIAL: Invalid response format", response);
            setError("Failed to load questions");
            setQuestions([]);
          }
        } catch (error) {
          console.error("INITIAL: Error fetching questions", error);
          setError("Failed to load questions");
          setQuestions([]);
        } finally {
          setLoading(false);
        }
      };

      fetchInitialData();
    }
  }, []); // Empty dependency array - only runs once on mount

  // Modified page change handler to explicitly control when to fetch
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      console.log(`PAGINATION: Changing to page ${newPage} of ${totalPages}`);

      // Set loading state immediately
      setLoading(true);

      // Update the current page state
      setCurrentPage(newPage);

      // Directly fetch the new page
      api
        .getFilteredQuestions({
          ...filters,
          page: newPage,
          page_size: pageSize,
        })
        .then((response) => {
          console.log(`PAGINATION: Got data for page ${newPage}:`, response);
          if (response && response.questions) {
            setQuestions(response.questions);
            setTotalPages(response.total_pages || 1);
            setTotalQuestions(response.total_questions || 0);
          } else {
            console.error(
              `PAGINATION: Invalid response format for page ${newPage}`,
              response
            );
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(`PAGINATION: Error fetching page ${newPage}:`, err);
          setError("Failed to load questions");
          setLoading(false);
        });

      // Smooth scroll to top
      window.scrollTo({
        top: 0,
      });
    } else {
      console.warn(
        `PAGINATION: Invalid page request: ${newPage}, valid range is 1-${totalPages}`
      );
    }
  };

  // Create a proper callback function for the API call
  const fetchQuestionsCallback = useCallback((filterParams) => {
    return api.getFilteredQuestions(filterParams);
  }, []);

  // Create debounced version
  const debouncedFetchQuestions = useDebounce(fetchQuestionsCallback, 500);

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

  // Your existing difficulty button handler
  const handleDifficultyClick = (level) => {
    protectFilterAction(() => {
      // If clicking the already active difficulty, set to null (All)
      const newDifficulty = activeDifficulty === level ? null : level;
      setActiveDifficulty(newDifficulty);

      // Now directly call handleDifficultyChange with the new value
      handleDifficultyChange(
        newDifficulty !== null ? newDifficulty.toString() : ""
      );
    });
  };

  // Your existing switch handler updated to use direct API calls
  const handleSubjectSwitch = () => {
    protectFilterAction(() => {
      // Determine the new subject
      const newSubject = filters.subject === 2 ? 1 : 2; // Toggle between 1 (Verbal) and 2 (Math)
      const newActiveFilter = filters.subject === 2 ? "verbal" : "math";

      console.log(`Switching subject to ${newActiveFilter} (${newSubject})`);

      // Set loading state
      setLoading(true);

      // Update UI state
      setActiveFilter(newActiveFilter);

      // Reset selected topics when switching subjects
      setSelectedTopics([]);

      // Create new filters
      const newFilters = {
        ...filters,
        subject: newSubject,
        topic: "", // Reset topic
        subtopic: "", // Reset subtopic
        page: 1, // Reset to first page
      };

      // Update filter state
      setFilters(newFilters);
      setCurrentPage(1);

      // Direct API call
      api
        .getFilteredQuestions({
          ...newFilters,
          page_size: pageSize,
        })
        .then((response) => {
          console.log(`Got questions for subject ${newSubject}:`, response);
          setQuestions(response.questions || []);
          setTotalPages(response.total_pages || 1);
          setTotalQuestions(response.total_questions || 0);
          setLoading(false);
        })
        .catch((err) => {
          console.error(
            `Error fetching questions for subject ${newSubject}:`,
            err
          );
          setError("Failed to load questions");
          setQuestions([]);
          setLoading(false);
        });
    });
  };

  // Add a handler for the solve rate sort button
  const handleSolveRateSort = useCallback(() => {
    protectFilterAction(() => {
      setFilters((prev) => ({
        ...prev,
        sort_dir: prev.sort_dir === "asc" ? "desc" : "asc",
        page: 1,
      }));
    });
  }, [protectFilterAction]);

  // Add a handler for the bookmark toggle
  const handleBookmarkToggle = useCallback(() => {
    protectFilterAction(() => {
      const newBookmarkedState = !showBookmarked;
      setShowBookmarked(newBookmarkedState);

      // When toggling bookmark filter, we should reset other filters
      // since we're switching to a different view
      if (newBookmarkedState) {
        setFilters((prev) => ({
          ...prev,
          is_bookmarked: 1,
          page: 1,
        }));

        // Reset Incorrect and Hide Solved when enabling Bookmarks
        setActiveFilter(null);
        setHideSolved(false);
      } else {
        setFilters((prev) => ({
          ...prev,
          is_bookmarked: 0,
          page: 1,
        }));
      }
    });
  }, [protectFilterAction, showBookmarked]);

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

  // Update the close handler to reset the index and optionally refresh data
  const handleCloseQuestion = (refreshNeeded = false) => {
    setSelectedQuestion(null);
    setCurrentQuestionIndex(0);

    // If refresh is needed, force a data refresh by updating filters
    if (refreshNeeded) {
      console.log(
        "Refreshing practice page data after question interface closed"
      );
      // Use a timestamp to force refetch even if other filters haven't changed
      setFilters((prevFilters) => ({
        ...prevFilters,
        refreshTimestamp: Date.now(),
      }));
    }
  };

  // Update handleSolvedChange to use the hideSolvedToggle function instead
  const handleSolvedChange = () => {
    const newHideSolvedState = !hideSolved;
    setHideSolved(newHideSolvedState);
    setFilters((prev) => ({
      ...prev,
      hide_solved: newHideSolvedState,
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
      isIncorrect: !isCorrect,
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

  // Handle bluebook toggle
  const handleBluebookToggle = () => {
    protectFilterAction(() => {
      console.log("BLUEBOOK: Toggling bluebook filter");

      // Set loading state
      setLoading(true);

      // Toggle the UI state
      const newState = !bluebookActive;
      setBluebookActive(newState);

      // Prepare the new filters
      const newFilters = {
        ...filters,
        is_bluebook: newState ? 1 : 0,
        page: 1, // Reset to first page when changing filters
      };

      // Update state
      setFilters(newFilters);
      setCurrentPage(1);

      // Direct API call
      api
        .getFilteredQuestions({
          ...newFilters,
          page_size: pageSize,
        })
        .then((response) => {
          console.log("BLUEBOOK: Got filtered data:", response);
          setQuestions(response.questions || []);
          setTotalPages(response.total_pages || 1);
          setTotalQuestions(response.total_questions || 0);
          setLoading(false);
        })
        .catch((err) => {
          console.error("BLUEBOOK: Error fetching filtered data:", err);
          setError("Failed to load questions");
          setQuestions([]);
          setLoading(false);
        });
    });
  };

  // Add handler for hide solved toggle
  const handleHideSolvedToggle = () => {
    protectFilterAction(() => {
      console.log("HIDE SOLVED: Toggling hide solved filter");

      // Set loading state
      setLoading(true);

      // Toggle the UI state
      const newHideSolvedState = !hideSolved;
      setHideSolved(newHideSolvedState);

      // Prepare the new filters
      let newFilters = { ...filters };

      // If already active, turn it off
      if (!newHideSolvedState) {
        newFilters = {
          ...filters,
          hide_solved: false,
          page: 1,
        };
      } else {
        // Turn it on and turn off "Incorrect" filter if it's active
        if (activeFilter === "incorrect") {
          console.log("HIDE SOLVED: Turning off incorrect filter");
          setActiveFilter(null);
        }

        newFilters = {
          ...filters,
          hide_solved: true,
          incorrect: false, // Turn off "Incorrect" filter if it's active
          page: 1,
        };
      }

      // Update state
      setFilters(newFilters);
      setCurrentPage(1);

      // Direct API call
      api
        .getFilteredQuestions({
          ...newFilters,
          page_size: pageSize,
        })
        .then((response) => {
          console.log("HIDE SOLVED: Got filtered data:", response);
          setQuestions(response.questions || []);
          setTotalPages(response.total_pages || 1);
          setTotalQuestions(response.total_questions || 0);
          setLoading(false);
        })
        .catch((err) => {
          console.error("HIDE SOLVED: Error fetching filtered data:", err);
          setError("Failed to load questions");
          setQuestions([]);
          setLoading(false);
        });
    });
  };

  // Update handleFilterToggle to make direct API calls
  const handleFilterToggle = (filter) => {
    protectFilterAction(() => {
      console.log(
        "FILTER TOGGLE: Filter toggle clicked:",
        filter,
        "Current activeFilter:",
        activeFilter
      );

      // Set loading state
      setLoading(true);

      // If clicking the active filter, deactivate it
      const newActiveFilter = activeFilter === filter ? null : filter;
      let newFilters = { ...filters };

      // Update the filter
      if (newActiveFilter === null) {
        console.log("FILTER TOGGLE: Deactivating filter:", filter);
        newFilters = {
          ...filters,
          incorrect: false,
          page: 1,
        };
        setActiveFilter(null);
      } else {
        // Activate the clicked filter, deactivate the other
        console.log("FILTER TOGGLE: Activating filter:", filter);
        setActiveFilter(filter);

        // If activating "Incorrect", turn off "Hide Solved"
        if (filter === "incorrect" && hideSolved) {
          console.log(
            "FILTER TOGGLE: Turning off hide_solved because incorrect is being activated"
          );
          setHideSolved(false);
          newFilters.hide_solved = false;
        }

        newFilters = {
          ...newFilters,
          incorrect: filter === "incorrect",
          hide_solved: filter === "incorrect" ? false : newFilters.hide_solved,
          page: 1,
        };
      }

      // Update state
      setFilters(newFilters);
      setCurrentPage(1);

      // Direct API call
      api
        .getFilteredQuestions({
          ...newFilters,
          page_size: pageSize,
        })
        .then((response) => {
          console.log("FILTER TOGGLE: Got filtered data:", response);
          setQuestions(response.questions || []);
          setTotalPages(response.total_pages || 1);
          setTotalQuestions(response.total_questions || 0);
          setLoading(false);
        })
        .catch((err) => {
          console.error("FILTER TOGGLE: Error fetching filtered data:", err);
          setError("Failed to load questions");
          setQuestions([]);
          setLoading(false);
        });
    });
  };

  // Handle difficulty change
  const handleDifficultyChange = (newDifficulty) => {
    protectFilterAction(() => {
      console.log(`DIFFICULTY: Changed to ${newDifficulty}`);

      // Set loading state
      setLoading(true);

      // Update state
      setActiveDifficulty(newDifficulty);

      // Prepare the new filters
      const newFilters = {
        ...filters,
        difficulty: newDifficulty,
        page: 1, // Reset to first page when changing filters
      };

      // Update state
      setFilters(newFilters);
      setCurrentPage(1);

      // Direct API call
      api
        .getFilteredQuestions({
          ...newFilters,
          page_size: pageSize,
        })
        .then((response) => {
          console.log("DIFFICULTY: Got filtered data:", response);
          setQuestions(response.questions || []);
          setTotalPages(response.total_pages || 1);
          setTotalQuestions(response.total_questions || 0);
          setLoading(false);
        })
        .catch((err) => {
          console.error("DIFFICULTY: Error fetching filtered data:", err);
          setError("Failed to load questions");
          setQuestions([]);
          setLoading(false);
        });
    });
  };

  // Add a function to handle topic/subtopic changes with direct fetch
  const handleTopicChange = (topic, subtopic = null) => {
    console.log(`TOPIC: Changing to topic=${topic}, subtopic=${subtopic}`);

    // Set loading state
    setLoading(true);

    // Update filters
    const newFilters = {
      ...filters,
      topic: topic || "",
      subtopic: subtopic || "",
      page: 1, // Reset to first page when changing filters
    };

    // Update state
    setFilters(newFilters);
    setCurrentPage(1);

    // Directly fetch with new filters
    api
      .getFilteredQuestions({
        ...newFilters,
        page_size: pageSize,
      })
      .then((response) => {
        console.log("TOPIC: Got filtered questions by topic:", response);
        setQuestions(response.questions || []);
        setTotalPages(response.total_pages || 1);
        setTotalQuestions(response.total_questions || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("TOPIC: Error fetching filtered questions:", err);
        setError("Failed to load questions");
        setQuestions([]);
        setLoading(false);
      });
  };

  // Add this to make sure the initial filter state is correct
  // Make the initial load deterministic and not dependent on defaults
  // that might change later through other effects
  useEffect(() => {
    // Set the activeFilter based on the initial filters.subject value
    setActiveFilter(filters.subject === 1 ? "math" : "verbal");
  }, []);

  // Define a toggleTopic function to handle topic and subtopic selection
  const toggleTopic = (topic, subtopic = null) => {
    console.log(
      `Toggle topic called with topic=${topic}, subtopic=${subtopic}`
    );

    // Always start with an empty array for new selection
    let newSelectedTopics = [];
    let selectedMainTopic = "";
    let newTopic = "";
    let newSubtopic = "";

    // Handle subtopic selection
    if (subtopic) {
      const topicKey = `${topic}:${subtopic}`;

      // Check if this specific subtopic is already selected
      const isSelected = selectedTopics.includes(topicKey);

      if (isSelected) {
        // If already selected, deselect it (empty selection)
        newSelectedTopics = [];
      } else {
        // If not selected, make it the ONLY selected item
        newSelectedTopics = [topicKey];
        selectedMainTopic = topic;
        newTopic = topic;
        newSubtopic = subtopic;
      }
    } else if (topic) {
      // Handle main topic selection
      const topicsToUse = filters.subject === 1 ? mathTopics : verbalTopics;
      if (!topicsToUse[topic]) {
        console.error(`Topic "${topic}" not found`);
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
        newTopic = topic;
        // When selecting a whole topic, subtopic should be empty
        newSubtopic = "";
      }
    }

    // Update selectedTopics state
    console.log("Setting selected topics to:", newSelectedTopics);
    setSelectedTopics(newSelectedTopics);

    // Call the handler prop to update filters and fetch data
    console.log(`Calling API with topic=${newTopic}, subtopic=${newSubtopic}`);
    handleTopicChange(newTopic, newSubtopic);
  };

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
            hideSolved={hideSolved}
            handleHideSolvedChange={handleSolvedChange}
            incorrect={filters.incorrect}
            handleIncorrectChange={() => handleFilterToggle("incorrect")}
            handleBluebookToggle={handleBluebookToggle}
            bluebookActive={bluebookActive}
            isFilterChanging={isFilterChanging}
            hideSolvedActive={hideSolved}
            handleHideSolvedToggle={handleHideSolvedToggle}
            handleFilterToggle={handleFilterToggle}
            handleTopicChange={handleTopicChange}
            toggleTopic={toggleTopic}
            selectedTopics={selectedTopics}
            setLoading={setLoading}
            setQuestions={setQuestions}
            setError={setError}
            setTotalPages={setTotalPages}
            setTotalQuestions={setTotalQuestions}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
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
              disabled={currentPage <= 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages} ({totalQuestions} questions)
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
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
    hideSolved,
    handleHideSolvedChange,
    incorrect,
    handleIncorrectChange,
    handleBluebookToggle,
    bluebookActive,
    isFilterChanging,
    hideSolvedActive,
    handleHideSolvedToggle,
    handleFilterToggle,
    handleTopicChange,
    toggleTopic,
    selectedTopics,
    setLoading,
    setQuestions,
    setError,
    setTotalPages,
    setTotalQuestions,
    setCurrentPage,
    pageSize,
  }) => {
    // Add state for dropdown visibility
    const [showTopicFilter, setShowTopicFilter] = useState(false);
    const [showDifficultyFilter, setShowDifficultyFilter] = useState(false);

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
          className={`filter-row ${showBookmarked ? "disabled-filters" : ""} ${
            isFilterChanging ? "filter-changing" : ""
          }`}
        >
          <div className="bluebook-toggle-container">
            <div className="bluebook-button-wrapper">
              <button
                className={`subject-toggle bluebook-toggle ${
                  bluebookActive ? "active" : ""
                } ${isFilterChanging ? "filter-changing" : ""}`}
                onClick={handleBluebookToggle}
                title="Bluebook questions"
                disabled={isFilterChanging}
              >
                B
              </button>
              <div className="bluebook-tooltip">
                <div className="tooltip-content">
                  Bluebook questions are official CollegeBoard questions used in
                  official practice exams. It's advised not to practice them
                  before completing official exams.
                </div>
              </div>
            </div>

            <div className="subject-toggle-container">
              {/* Bluebook toggle button */}

              <button
                className={`subject-toggle ${
                  filters.subject === 1 ? "active verbal" : ""
                }`}
                onClick={() => {
                  console.log("SUBJECT: Switching to Verbal");
                  onSubjectToggle();
                }}
              >
                V
              </button>
              <button
                className={`math subject-toggle ${
                  filters.subject === 2 ? "active math" : ""
                }`}
                onClick={() => {
                  console.log("SUBJECT: Switching to Math");
                  onSubjectToggle();
                }}
              >
                M
              </button>
            </div>
          </div>

          <div className="filter-dropdown">
            <button
              className="filter-dropdown-button"
              onClick={() => {
                if (!showBookmarked) {
                  setShowTopicFilter(!showTopicFilter);
                  // Close the difficulty dropdown if it's open
                  if (showDifficultyFilter) {
                    setShowDifficultyFilter(false);
                  }
                }
              }}
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
                  const allSubtopicKeys = subtopics.map(
                    (sub) => `${topic}:${sub}`
                  );
                  const isTopicSelected =
                    allSubtopicKeys.every((key) =>
                      selectedTopics.includes(key)
                    ) &&
                    allSubtopicKeys.length > 0 &&
                    selectedTopics.length === allSubtopicKeys.length;

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
                        {subtopics.map((subtopic) => {
                          const isSubtopicSelected = selectedTopics.includes(
                            `${topic}:${subtopic}`
                          );
                          // A subtopic can be individually selected or part of a topic selection
                          const isSelectedIndividually =
                            isSubtopicSelected && selectedTopics.length === 1;

                          return (
                            <div
                              key={`${topic}-${subtopic}`}
                              className={`topic-tag ${
                                isSubtopicSelected ? "selected" : ""
                              } ${isTopicSelected ? "topic-selected" : ""} ${
                                isSelectedIndividually
                                  ? "individually-selected"
                                  : ""
                              }`}
                              onClick={() => toggleTopic(topic, subtopic)}
                            >
                              {subtopic}
                            </div>
                          );
                        })}
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
              onClick={() => {
                if (!showBookmarked) {
                  setShowDifficultyFilter(!showDifficultyFilter);
                  // Close the topic dropdown if it's open
                  if (showTopicFilter) {
                    setShowTopicFilter(false);
                  }
                }
              }}
              disabled={showBookmarked}
            >
              Difficulty
              {activeDifficulty !== null && (
                <span
                  className={`practice-difficulty-indicator ${
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
          </div>
          <div className="filter-toggles">
            <button
              className={`filter-toggle ${
                activeFilter === "incorrect" ? "active" : ""
              }`}
              onClick={() => handleFilterToggle("incorrect")}
              data-filter="incorrect"
              disabled={showBookmarked || isFilterChanging}
            >
              <i className="fas fa-times-circle"></i>
              Incorrect
            </button>
            <button
              className={`filter-toggle ${hideSolvedActive ? "active" : ""}`}
              onClick={handleHideSolvedToggle}
              data-filter="hide-solved"
              disabled={showBookmarked || isFilterChanging}
            >
              <i className="fas fa-eye-slash"></i>
              Hide Solved
            </button>
          </div>
        </div>
      </div>
    );
  }
);
export default Practice;
