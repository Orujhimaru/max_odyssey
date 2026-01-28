import React, { useState } from "react";
import "./QuestionTimingTracker.css";
import SpeedometerIcon from "../SpeedometerIcon/SpeedometerIcon";

// Define the verbal subtopic structure with proper question mapping
const VERBAL_SUBTOPIC_DATA = [
  {
    name: "Craft and Structure",
    subtopics: [
      { name: "Words in Context", questions: 4, color: "#3b82f6" },
      { name: "Text Structure and Purpose", questions: 2, color: "#1d4ed8" },
      { name: "Cross-Text Connections", questions: 1, color: "#1e40af" },
    ],
  },
  {
    name: "Information and Ideas",
    subtopics: [
      { name: "Central Ideas and Details", questions: 2, color: "#059669" },
      { name: "Command of Evidence", questions: 4, color: "#047857" },
      { name: "Inferences", questions: 1, color: "#065f46" },
    ],
  },
  {
    name: "Standard English Conventions",
    subtopics: [
      { name: "Boundaries", questions: 3, color: "#dc2626" },
      { name: "Form, Structure, and Sense", questions: 3, color: "#b91c1c" },
    ],
  },
  {
    name: "Expression of Ideas",
    subtopics: [
      { name: "Transitions", questions: 3, color: "#7c3aed" },
      { name: "Rhetorical Synthesis", questions: 4, color: "#6d28d9" },
    ],
  },
];

// Define the math difficulty structure for 22 questions
const MATH_DIFFICULTY_DATA = [
  {
    name: "Easy",
    questions: 6,
    color: "#22c55e", // Green
  },
  {
    name: "Medium",
    questions: 9,
    color: "#f59e0b", // Orange
  },
  {
    name: "Hard",
    questions: 7,
    color: "#ef4444", // Red
  },
];

// Generate the question-to-subtopic mapping for verbal
const generateVerbalQuestionSubtopicMap = () => {
  const map = [];
  VERBAL_SUBTOPIC_DATA.forEach((mainTopic) => {
    mainTopic.subtopics.forEach((subtopic) => {
      for (let i = 0; i < subtopic.questions; i++) {
        map.push({
          subtopic: subtopic.name,
          mainTopic: mainTopic.name,
          color: subtopic.color,
        });
      }
    });
  });
  return map;
};

// Generate the question-to-difficulty mapping for math
const generateMathQuestionDifficultyMap = () => {
  const map = [];
  MATH_DIFFICULTY_DATA.forEach((difficulty) => {
    for (let i = 0; i < difficulty.questions; i++) {
      map.push({
        difficulty: difficulty.name,
        color: difficulty.color,
      });
    }
  });
  return map;
};

const VERBAL_QUESTION_SUBTOPIC_MAP = generateVerbalQuestionSubtopicMap();
const MATH_QUESTION_DIFFICULTY_MAP = generateMathQuestionDifficultyMap();

const QuestionTimingTracker = ({
  questionTimes = [],
  mathQuestionTimes = [], // New prop for math timing data
  title = "Timing Across Questions",
}) => {
  const [hoveredQuestionIndex, setHoveredQuestionIndex] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isSecondChartVisible, setIsSecondChartVisible] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [hoveredSubtopic, setHoveredSubtopic] = useState(null); // New state for subtopic hover

  // Determine if we're in math mode and get appropriate data
  const isMathMode = isSecondChartVisible;
  const currentQuestionTimes = isMathMode ? mathQuestionTimes : questionTimes;
  const maxQuestions = isMathMode ? 22 : 27;
  const currentTitle = isMathMode
    ? "Timing Across Math Questions"
    : "Timing Across Verbal Questions";

  // Ensure we have the right number of questions
  const normalizedTimes = currentQuestionTimes.slice(0, maxQuestions);
  while (normalizedTimes.length < maxQuestions) {
    normalizedTimes.push(0);
  }

  const toggleChart = () => {
    setIsSecondChartVisible(!isSecondChartVisible);
    setAnimationKey((prev) => prev + 1);
    setHoveredQuestionIndex(null); // Reset hover state when switching
    setHoveredSubtopic(null); // Reset subtopic hover
  };

  // Calculate average timing for each subtopic/difficulty
  const calculateSubtopicAverages = () => {
    const subtopicTimes = {};

    // Group times by subtopic or difficulty
    normalizedTimes.forEach((time, index) => {
      let categoryName;
      if (isMathMode) {
        categoryName = MATH_QUESTION_DIFFICULTY_MAP[index]?.difficulty;
      } else {
        categoryName = VERBAL_QUESTION_SUBTOPIC_MAP[index]?.subtopic;
      }

      if (categoryName) {
        if (!subtopicTimes[categoryName]) {
          subtopicTimes[categoryName] = [];
        }
        subtopicTimes[categoryName].push(time);
      }
    });

    // Calculate averages
    const averages = {};
    Object.keys(subtopicTimes).forEach((category) => {
      const times = subtopicTimes[category];
      const average = times.reduce((sum, time) => sum + time, 0) / times.length;
      averages[category] = average;
    });

    return averages;
  };

  const subtopicAverages = calculateSubtopicAverages();

  // Find the subtopic/difficulty of the currently hovered question OR use hoveredSubtopic
  const hoveredCategory =
    hoveredSubtopic ||
    (hoveredQuestionIndex !== null
      ? isMathMode
        ? MATH_QUESTION_DIFFICULTY_MAP[hoveredQuestionIndex]?.difficulty
        : VERBAL_QUESTION_SUBTOPIC_MAP[hoveredQuestionIndex]?.subtopic
      : null);

  // Determine if a question's category matches the hovered category
  const isQuestionInHoveredCategory = (questionIndex) => {
    if (isMathMode) {
      return (
        MATH_QUESTION_DIFFICULTY_MAP[questionIndex]?.difficulty ===
        hoveredCategory
      );
    } else {
      return (
        VERBAL_QUESTION_SUBTOPIC_MAP[questionIndex]?.subtopic ===
        hoveredCategory
      );
    }
  };

  const maxTime = 120; // Max time in seconds (2 minutes)
  const chartHeight = 250;

  const handleMouseEnter = (index, event) => {
    setHoveredQuestionIndex(index);
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handleMouseLeave = () => {
    setHoveredQuestionIndex(null);
  };

  const handleBarsContainerMouseLeave = () => {
    setHoveredQuestionIndex(null);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Calculate average time for speedometer
  const calculateAverageTime = () => {
    if (normalizedTimes.length === 0) return 0;
    const total = normalizedTimes.reduce((sum, time) => sum + time, 0);
    return total / normalizedTimes.length;
  };

  const avgTime = calculateAverageTime();
  const targetTime = 95; // 1:35 in seconds
  const speedometerRatio = avgTime / targetTime;

  return (
    <div className="question-timing-tracker">
      <div className="tracker-header">
        <h2 className="tracker-title">{currentTitle}</h2>
        <button className="toggle-chart-button" onClick={toggleChart}>
          <i
            className={`fas fa-chevron-${isSecondChartVisible ? "left" : "right"
              }`}
          ></i>
        </button>
      </div>

      <div className="tracker-main-content">
        <div className="question-chart-container">
          {/* Y-axis labels */}
          <div className="y-axis">
            <div className="y-axis-label" style={{ top: "0%" }}>
              02:00
            </div>
            <div className="y-axis-label" style={{ top: "25%" }}>
              01:30
            </div>
            <div className="y-axis-label" style={{ top: "50%" }}>
              01:00
            </div>
            <div className="y-axis-label" style={{ top: "75%" }}>
              0:30
            </div>
            <div className="y-axis-label" style={{ top: "100%" }}>
              0:00
            </div>
          </div>

          {/* Chart area */}
          <div className="chart-area">
            {/* Grid lines */}
            <div className="grid-lines">
              {[0, 25, 50, 75, 100].map((percent) => (
                <div
                  key={percent}
                  className="grid-line"
                  style={{ top: `${percent}%` }}
                />
              ))}
            </div>

            {/* Question bars */}
            <div
              className="bars-container"
              onMouseLeave={handleBarsContainerMouseLeave}
            >
              {normalizedTimes.map((timeInSeconds, index) => {
                const height = Math.min((timeInSeconds / maxTime) * 100, 100);
                const isHighlighted = isQuestionInHoveredCategory(index);
                const isDimmed = hoveredCategory && !isHighlighted; // Dim if category is hovered but this bar isn't in it
                const questionData = isMathMode
                  ? MATH_QUESTION_DIFFICULTY_MAP[index]
                  : VERBAL_QUESTION_SUBTOPIC_MAP[index];

                // Calculate number of dots based on time (each dot represents ~5 seconds)
                const numDots = Math.max(1, Math.ceil(timeInSeconds / 5));
                const maxDots = Math.ceil(maxTime / 5); // Max dots for 2 minutes

                return (
                  <div
                    key={index}
                    className={`question-column ${isHighlighted ? "highlighted" : ""
                      } ${isDimmed ? "dimmed" : ""}`}
                    style={{ height: "100%" }}
                    onMouseEnter={(e) => handleMouseEnter(index, e)}
                  >
                    {/* Create dots from bottom to top */}
                    {Array.from({ length: Math.min(numDots, maxDots) }).map(
                      (_, dotIndex) => {
                        let highlightColor = "#143d80"; // Default blue
                        if (isMathMode && isHighlighted && questionData) {
                          // Use difficulty-specific colors for math mode
                          highlightColor = questionData.color;
                        }

                        return (
                          <div
                            key={dotIndex}
                            className="question-dot"
                            style={{
                              backgroundColor: isHighlighted
                                ? highlightColor
                                : undefined, // Let CSS handle default color based on theme
                            }}
                          />
                        );
                      }
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Speedometer Section */}
        <div className="pace-speedometer-section">
          <h3 className="pace-section-title">Overall Timing Speed</h3>
          <div className="speedometer-wrapper">
            <SpeedometerIcon
              ratio={speedometerRatio}
              avgTime={avgTime}
              targetTime={targetTime}
            />
          </div>

          <div className="pace-stats-compact">
            <div className="pace-stat-row">
              <span className="pace-label">Avg Time</span>
              <span className="pace-value">{formatTime(Math.round(avgTime))}</span>
            </div>
            <div className="pace-divider"></div>
            <div className="pace-stat-row">
              <span className="pace-label">Target</span>
              <span className="pace-value">{formatTime(targetTime)}</span>
            </div>
          </div>

          <div className={`pace-badge ${speedometerRatio <= 1 ? 'good' : 'slow'}`}>
            <i className={`fas fa-${speedometerRatio <= 1 ? 'check' : 'exclamation'}-circle`}></i>
            <span>{speedometerRatio <= 1 ? 'On Track' : 'Needs Work'}</span>
          </div>
        </div>
      </div>

      {/* Difficulty indicators for math mode */}
      {isMathMode && (
        <div className="difficulty-indicators">
          <div className="difficulty-indicator easy">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
            <span>Easy</span>
          </div>
          <div className="difficulty-indicator medium">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="8" y1="15" x2="16" y2="15" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
            <span>Medium</span>
          </div>
          <div className="difficulty-indicator hard">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
            <span>Hard</span>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {hoveredQuestionIndex !== null && (
        <div
          className="question-tooltip"
          style={{
            position: "fixed",
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y - 40}px`,
            transform: "translateX(-50%)",
            zIndex: 1000,
          }}
        >
          <div className="tooltip-content">
            <div className="question-number">#{hoveredQuestionIndex + 1}</div>
            <div className="question-time">
              {formatTime(normalizedTimes[hoveredQuestionIndex])}
            </div>
            <div className="question-subtopic">
              {isMathMode
                ? MATH_QUESTION_DIFFICULTY_MAP[hoveredQuestionIndex]?.difficulty
                : VERBAL_QUESTION_SUBTOPIC_MAP[hoveredQuestionIndex]?.subtopic}
            </div>
          </div>
        </div>
      )}

      {/* Subtopic Grid / Legend */}
      {isMathMode ? (
        // Math Mode - keep existing legend
        <div className="legend">
          {MATH_DIFFICULTY_DATA.map((difficulty, idx) => {
            const averageTime = subtopicAverages[difficulty.name] || 0;
            const formattedTime = formatTime(Math.round(averageTime));
            const isDifficultyHighlighted =
              hoveredCategory === difficulty.name;

            return (
              <div
                key={idx}
                className={`legend-group ${isDifficultyHighlighted ? "highlighted" : ""
                  }`}
                onMouseEnter={() => setHoveredSubtopic(difficulty.name)}
                onMouseLeave={() => setHoveredSubtopic(null)}
              >
                <h4 className="legend-group-title">{difficulty.name}</h4>
                <div className="legend-items">
                  <div className="legend-item">
                    <div className="legend-content">
                      <span className="legend-text">
                        {difficulty.name} ({difficulty.questions})
                      </span>
                      <span className="legend-timing">{formattedTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Verbal Mode - redesigned two-column subtopic grid with colored categories
        <div className="subtopic-grid">
          {/* Column 1: Craft and Structure + Standard English Conventions */}
          <div className="subtopic-column">
            {[
              { data: VERBAL_SUBTOPIC_DATA[0], icon: "fa-book", color: "#3b82f6" }, // Craft and Structure (blue)
              { data: VERBAL_SUBTOPIC_DATA[2], icon: "fa-check-circle", color: "#22c55e" }, // Standard English Conventions (green)
            ].map((item, idx) => (
              <div key={idx} className="subtopic-category">
                <div className="subtopic-category-header">
                  <div className="category-icon" style={{ backgroundColor: item.color }}>
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <h4 className="subtopic-category-title">{item.data.name}</h4>
                </div>
                <div className="subtopic-items-list">
                  {item.data.subtopics.map((subtopic, sIdx) => {
                    const averageTime = subtopicAverages[subtopic.name] || 0;
                    const formattedTime = formatTime(Math.round(averageTime));
                    const isSubtopicHighlighted = hoveredCategory === subtopic.name;

                    return (
                      <div
                        key={sIdx}
                        className={`subtopic-item ${isSubtopicHighlighted ? "highlighted" : ""}`}
                        onMouseEnter={() => setHoveredSubtopic(subtopic.name)}
                        onMouseLeave={() => setHoveredSubtopic(null)}
                      >
                        <span className="subtopic-name">
                          {subtopic.name} ({subtopic.questions})
                        </span>
                        <span className="subtopic-time">{formattedTime}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Column 2: Information and Ideas + Expression of Ideas */}
          <div className="subtopic-column">
            {[
              { data: VERBAL_SUBTOPIC_DATA[1], icon: "fa-lightbulb", color: "#10b981" }, // Information and Ideas (teal)
              { data: VERBAL_SUBTOPIC_DATA[3], icon: "fa-comment-dots", color: "#f59e0b" }, // Expression of Ideas (orange)
            ].map((item, idx) => (
              <div key={idx} className="subtopic-category">
                <div className="subtopic-category-header">
                  <div className="category-icon" style={{ backgroundColor: item.color }}>
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <h4 className="subtopic-category-title">{item.data.name}</h4>
                </div>
                <div className="subtopic-items-list">
                  {item.data.subtopics.map((subtopic, sIdx) => {
                    const averageTime = subtopicAverages[subtopic.name] || 0;
                    const formattedTime = formatTime(Math.round(averageTime));
                    const isSubtopicHighlighted = hoveredCategory === subtopic.name;

                    return (
                      <div
                        key={sIdx}
                        className={`subtopic-item ${isSubtopicHighlighted ? "highlighted" : ""}`}
                        onMouseEnter={() => setHoveredSubtopic(subtopic.name)}
                        onMouseLeave={() => setHoveredSubtopic(null)}
                      >
                        <span className="subtopic-name">
                          {subtopic.name} ({subtopic.questions})
                        </span>
                        <span className="subtopic-time">{formattedTime}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionTimingTracker;
