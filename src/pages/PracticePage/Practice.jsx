import React, { useState, useEffect, useRef } from "react";
import PracticeSwitch from "./PracticeSwitch/PracticeSwitch";
import "./Practice.css";
import PracticeQuestionInterface from "./PracticeQuestionInterface/PracticeQuestionInterface";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

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
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Fetch questions when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await api.request("/questions");
        if (!response.ok) throw new Error("Failed to fetch questions");
        const data = await response.json();

        console.log("Raw data from API:", data);

        // Check if data.questions exists and is an array
        const questionsArray = data.questions || data;
        if (!Array.isArray(questionsArray)) {
          console.error("API did not return an array of questions");
          setError("Invalid data format from API");
          setLoading(false);
          return;
        }

        const transformedQuestions = questionsArray.map((q) => ({
          id: q.id,
          question_text: q.question_text,
          subject_id: q.subject_id,
          difficulty_level: q.difficulty_level || 1,
          correct_answer: q.correct_answer || "",
          explanation: q.explanation || "",
          created_at: q.created_at || new Date().toISOString(),
          choices: Array.isArray(q.choices) ? q.choices : [],
          topic: q.topic || "",
          subtopic: q.subtopic || "",
        }));

        console.log("Transformed questions:", transformedQuestions);
        setQuestions(transformedQuestions);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [navigate]);

  // Add this function to fetch bookmarked questions
  const fetchBookmarkedQuestions = async () => {
    try {
      // Check if token exists before making request
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, skipping bookmark fetch");
        return;
      }

      const response = await api.request("/bookmarks");
      if (!response.ok) {
        console.error("Failed to fetch bookmarks:", response.status);
        return;
      }

      const bookmarkedData = await response.json();
      console.log("Bookmarked data:", bookmarkedData);

      // Handle different response formats
      const bookmarkIds = Array.isArray(bookmarkedData)
        ? bookmarkedData.map((q) => q.id)
        : (bookmarkedData.questions || []).map((q) => q.id);

      setBookmarkedQuestions(new Set(bookmarkIds));
    } catch (err) {
      console.error("Error fetching bookmarked questions:", err);
      // Don't fail the whole component if bookmarks fail
    }
  };

  // Update the toggleBookmark function with better logging
  const toggleBookmark = async (questionId, e) => {
    // We don't need to call stopPropagation here since we're doing it in the onClick
    // But we'll keep the parameter for consistency

    console.log(`Toggling bookmark for question ID: ${questionId}`);

    try {
      await api.toggleBookmark(questionId);
      console.log(
        `Successfully toggled bookmark for question ID: ${questionId}`
      );

      // Update local state
      const newBookmarked = new Set(bookmarkedQuestions);
      if (newBookmarked.has(questionId)) {
        console.log(`Removing question ID ${questionId} from bookmarks`);
        newBookmarked.delete(questionId);
      } else {
        console.log(`Adding question ID ${questionId} to bookmarks`);
        newBookmarked.add(questionId);
      }
      setBookmarkedQuestions(newBookmarked);
    } catch (err) {
      console.error(
        `Error toggling bookmark for question ID ${questionId}:`,
        err
      );
    }
  };

  // Call both functions in useEffect
  useEffect(() => {
    fetchBookmarkedQuestions();
  }, []);

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

  // Add loading and error states to your JSX
  if (loading) {
    return <div className="loading">Loading questions...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="practice-page">
      {selectedQuestion ? (
        <PracticeQuestionInterface
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          questionNumber={
            questions.findIndex((q) => q.id === selectedQuestion.id) + 1
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
            const currentIndex = questions.findIndex(
              (q) => q.id === selectedQuestion.id
            );
            if (currentIndex < questions.length - 1) {
              setSelectedQuestion(questions[currentIndex + 1]);
            }
          }}
          onPrevious={() => {
            const currentIndex = questions.findIndex(
              (q) => q.id === selectedQuestion.id
            );
            if (currentIndex > 0) {
              setSelectedQuestion(questions[currentIndex - 1]);
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
            <span className="header-solve-rate" style={{ cursor: "pointer" }}>
              Solve Rate
              <i className="fas fa-sort" style={{ marginLeft: "4px" }}></i>
            </span>
            <span className="header-actions">Actions</span>
          </div>
        </div>

        {questions.map((question, index) => (
          <div
            className="question-card"
            key={question.id}
            onClick={() => setSelectedQuestion(question)}
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
                    <span
                      className="topic-tag"
                      key={question.topic}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTopic(question.topic);
                      }}
                    >
                      {question.topic}
                    </span>
                  )}
                  {question.subtopic && (
                    <span
                      className="topic-tag"
                      key={question.subtopic}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTopic(question.subtopic);
                      }}
                    >
                      {question.subtopic}
                    </span>
                  )}
                </div>
                <div className="completion-rate">
                  <span> {question.solverate}%</span>
                </div>
                <div
                  className="question-actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <BookmarkButton
                    questionId={question.id}
                    isBookmarked={bookmarkedQuestions.has(question.id)}
                    onToggle={toggleBookmark}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BookmarkButton = ({ questionId, isBookmarked, onToggle }) => {
  return (
    <button
      className="bookmark-button"
      data-question-id={questionId}
      onClick={(e) => {
        // Stop event propagation
        e.stopPropagation();
        e.preventDefault();

        // Show an alert
        alert(`Bookmark clicked for question ${questionId}`);

        // Call the toggle function using the prop
        onToggle(questionId);

        return false;
      }}
      style={{
        position: "absolute",
        right: "10px",
        top: "10px",
        zIndex: 9999,
        background: "red",
        color: "white",
        padding: "10px",
        border: "2px solid black",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "14px",
        pointerEvents: "auto",
      }}
    >
      BOOKMARK
    </button>
  );
};

export default Practice;
