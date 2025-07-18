import React, { useState } from "react";
import "./QuestionTimingTracker.css";

// Define the subtopic structure with proper question mapping
const SUBTOPIC_DATA = [
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

// Generate the question-to-subtopic mapping
const generateQuestionSubtopicMap = () => {
  const map = [];
  SUBTOPIC_DATA.forEach((mainTopic) => {
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

const QUESTION_SUBTOPIC_MAP = generateQuestionSubtopicMap();

const QuestionTimingTracker = ({
  questionTimes = [],
  title = "Timing Across Verbal Questions",
}) => {
  const [hoveredQuestionIndex, setHoveredQuestionIndex] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Ensure we have the right number of questions (27 for verbal)
  const normalizedTimes = questionTimes.slice(0, 27);
  while (normalizedTimes.length < 27) {
    normalizedTimes.push(0);
  }

  // Find the subtopic of the currently hovered question
  const hoveredSubtopic =
    hoveredQuestionIndex !== null
      ? QUESTION_SUBTOPIC_MAP[hoveredQuestionIndex]?.subtopic
      : null;

  // Determine if a question's subtopic matches the hovered subtopic
  const isQuestionInHoveredSubtopic = (questionIndex) => {
    return QUESTION_SUBTOPIC_MAP[questionIndex]?.subtopic === hoveredSubtopic;
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

  const formatTime = (seconds) => {
    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
    return `${seconds}s`;
  };

  return (
    <div className="question-timing-tracker">
      <div className="tracker-header">
        <h2 className="tracker-title">{title}</h2>
      </div>

      <div className="chart-container">
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
          <div className="bars-container">
            {normalizedTimes.map((timeInSeconds, index) => {
              const height = Math.min((timeInSeconds / maxTime) * 100, 100);
              const isHighlighted = isQuestionInHoveredSubtopic(index);
              const questionData = QUESTION_SUBTOPIC_MAP[index];

              // Calculate number of dots based on time (each dot represents ~5 seconds)
              const numDots = Math.max(1, Math.ceil(timeInSeconds / 5));
              const maxDots = Math.ceil(maxTime / 5); // Max dots for 2 minutes

              return (
                <div
                  key={index}
                  className={`question-column ${
                    isHighlighted ? "highlighted" : ""
                  }`}
                  style={{ height: "100%" }}
                  onMouseEnter={(e) => handleMouseEnter(index, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Create dots from bottom to top */}
                  {Array.from({ length: Math.min(numDots, maxDots) }).map(
                    (_, dotIndex) => (
                      <div
                        key={dotIndex}
                        className="question-dot"
                        style={{
                          backgroundColor: isHighlighted
                            ? "#143d80" // Sky blue for all highlighted dots
                            : undefined, // Let CSS handle default color based on theme
                        }}
                      />
                    )
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

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
              {QUESTION_SUBTOPIC_MAP[hoveredQuestionIndex]?.subtopic}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="legend">
        {SUBTOPIC_DATA.map((mainTopic, idx) => {
          // Check if any subtopic in this main topic is currently hovered
          const isMainTopicHighlighted = mainTopic.subtopics.some(
            (subtopic) => subtopic.name === hoveredSubtopic
          );

          return (
            <div
              key={idx}
              className={`legend-group ${
                isMainTopicHighlighted ? "highlighted" : ""
              }`}
            >
              <h4 className="legend-group-title">{mainTopic.name}</h4>
              <div className="legend-items">
                {mainTopic.subtopics.map((subtopic, sIdx) => (
                  <div
                    key={sIdx}
                    className={`legend-item ${
                      hoveredSubtopic === subtopic.name ? "highlighted" : ""
                    }`}
                  >
                    <div
                      className="legend-color-box"
                      style={{ backgroundColor: subtopic.color }}
                    />
                    <span className="legend-text">
                      {subtopic.name} ({subtopic.questions})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionTimingTracker;
