import React, { useState, useEffect } from "react";
import PracticeSwitch from "./PracticeSwitch/PracticeSwitch";
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
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:8080/maxsat/practice");
        if (!response.ok) throw new Error("Failed to fetch questions");
        const data = await response.json();

        console.log("Raw data from API:", data);

        // Check if data is an array
        if (!Array.isArray(data)) {
          console.error("API did not return an array");
          setError("Invalid data format from API");
          setLoading(false);
          return;
        }

        // Map each question with proper fallbacks
        const transformedQuestions = data.map((q, index) => {
          // Log each question to see its structure
          console.log(`Question ${index}:`, q);

          return {
            id: q.id || index + 1,
            question_text: q.QuestionText || `Question ${index + 1}`,
            subject_id: q.subject_id || 1,
            difficulty_level: q.difficulty_level || 2,
            correct_answer: q.correct_answer || "",
            explanation: q.explanation || "",
            created_at: q.created_at || new Date().toISOString(),
            choices: Array.isArray(q.choices) ? q.choices : [],
          };
        });

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
            <span className="header-question">Question</span>
          </div>
        </div>

        {questions.map((question, index) => (
          <div key={question.id || index} className="question-card">
            <div className="question-left">
              <span className="question-number">#{question.id}</span>
            </div>
            <div className="question-content-row">
              <h3 className="question-title">{question.question_text}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Practice;
