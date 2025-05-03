import React, { useState } from "react";
import "./LabPage.css";
import { CalendarIcon, ChartIcon, ClockIcon } from "../../icons/Icons";

// Import score SVGs
import scoreA from "../../assets/scoreA.svg";
import scoreB from "../../assets/scoreB.svg";
import scoreC from "../../assets/scoreC.svg";
import scoreD from "../../assets/scoreD.svg";
import scoreF from "../../assets/scoreF.svg";

// Mock data for 2 months (25 days each)
const months = [
  { name: "May 2024", days: 25 },
  { name: "June 2024", days: 25 },
];
const activityData = months.map(() =>
  Array.from({ length: 25 }, () => Math.floor(Math.random() * 6))
);
const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

// Full year activity data (for the year view)
const yearMonths = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

// Generate year data (mostly empty with some activity in recent months)
const generateYearData = () => {
  // Create empty grid (each month has 7 rows of 5-7 days)
  const yearData = {};

  yearMonths.forEach((month) => {
    // Each month has 5-7 rows
    const numRows = Math.floor(Math.random() * 2) + 5; // 5-6 rows
    const numDays = Math.floor(Math.random() * 3) + 4; // 4-6 days per row

    yearData[month] = Array(numRows)
      .fill(0)
      .map(() =>
        Array(numDays)
          .fill(0)
          .map(() => {
            // Mostly empty (0), with some activity (1-3) in recent months
            if (["MAY", "JUN", "JUL"].includes(month)) {
              return Math.random() < 0.2 ? Math.ceil(Math.random() * 3) : 0;
            }
            if (["APR", "MAR"].includes(month)) {
              return Math.random() < 0.1 ? Math.ceil(Math.random() * 2) : 0;
            }
            if (["JAN", "FEB"].includes(month)) {
              return Math.random() < 0.07 ? Math.ceil(Math.random() * 2) : 0;
            }
            return Math.random() < 0.02 ? 1 : 0;
          })
      );
  });

  return yearData;
};

const yearData = generateYearData();

// Mock subtopic data with more realistic values
const subtopicData = [
  {
    name: "Linear Equations",
    avgTime: 38,
    correct: 43,
    total: 48,
    improvement: 12,
  },
  {
    name: "Grammar & Usage",
    avgTime: 42,
    correct: 67,
    total: 70,
    improvement: 8,
  },
  { name: "Functions", avgTime: 55, correct: 32, total: 40, improvement: -3 },
  {
    name: "Reading Comprehension",
    avgTime: 33,
    correct: 92,
    total: 102,
    improvement: 15,
  },
  { name: "Geometry", avgTime: 48, correct: 27, total: 45, improvement: 5 },
];

const getBoxShade = (val) => {
  // 0 = empty/transparent, 1-5 = increasing intensity
  const shades = [
    "transparent",
    "#a9d6ff",
    "#7bbcff",
    "#3996e6",
    "#1565c0",
    "#003c8f",
  ];
  return shades[Math.min(val, shades.length - 1)];
};

const LabPage = () => {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [examDate, setExamDate] = useState(null);
  const [activeTab, setActiveTab] = useState("math"); // 'math' or 'verbal'

  // Function to determine if a day in January should be active (green)
  const isJanuaryActive = (row, col) => {
    // First day in first 3 rows active
    if (row < 3 && col === 0) return true;
    // First 2 days in row 3 active
    if (row === 2 && col === 1) return true;
    // First 2 days in rows 5-6 active
    if ((row === 4 || row === 5) && col < 2) return true;
    return false;
  };

  // Function to check if a day is the exam date
  const isExamDate = (monthIndex, row, col) => {
    if (!examDate) return false;
    return (
      examDate.month === monthIndex &&
      examDate.row === row &&
      examDate.col === col
    );
  };

  // Handle exam date selection
  const handleExamDateSelect = (monthIndex, row, col) => {
    // If already selected, deselect
    if (
      examDate &&
      examDate.month === monthIndex &&
      examDate.row === row &&
      examDate.col === col
    ) {
      setExamDate(null);
    } else {
      setExamDate({ month: monthIndex, row, col });
    }
  };

  // Render a single month for the yearly calendar
  const renderMonthColumn = (month, monthIndex) => {
    return (
      <div className="month-column" key={month}>
        <div className="month-label">{month}</div>
        <div className="month-grid">
          {/* Generate 7 rows of 5 squares each */}
          {Array(7)
            .fill(0)
            .map((_, rowIndex) => (
              <div className="month-row" key={`row-${rowIndex}`}>
                {Array(5)
                  .fill(0)
                  .map((_, colIndex) => {
                    const isActive =
                      monthIndex === 0 && isJanuaryActive(rowIndex, colIndex);
                    const isExam = isExamDate(monthIndex, rowIndex, colIndex);

                    return (
                      <div
                        className={`activity-square ${
                          isActive ? "active-day" : ""
                        } ${isExam ? "exam-day" : ""}`}
                        key={`square-${rowIndex}-${colIndex}`}
                        onClick={() =>
                          handleExamDateSelect(monthIndex, rowIndex, colIndex)
                        }
                      >
                        {isExam && <span className="exam-x">X</span>}
                      </div>
                    );
                  })}
              </div>
            ))}
        </div>
      </div>
    );
  };

  // Function to get the score image based on percentage
  const getScoreImage = (percentage) => {
    if (percentage >= 90) return scoreA;
    if (percentage >= 80) return scoreB;
    if (percentage >= 70) return scoreC;
    if (percentage >= 60) return scoreD;
    return scoreF;
  };

  // Function to get the score label based on percentage
  const getScoreLabel = (percentage) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "B-";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  // Function to render performance bar like in dashboard
  const renderPerformanceBar = (percentage) => {
    // The bar represents 100% for simplicity
    const fillPercentage = Math.min(100, percentage);

    // Define target time (70% of the bar for this example)
    const targetPercentage = 70;

    // Calculate width of green and red parts
    let greenWidth = 0;
    let redWidth = 0;

    if (fillPercentage <= targetPercentage) {
      // All filled portion is within green zone
      greenWidth = fillPercentage;
      redWidth = 0;
    } else {
      // Fill extends into red zone
      greenWidth = targetPercentage;
      redWidth = fillPercentage - targetPercentage;
    }

    return (
      <div className="performance-bar-container">
        <div className="performance-bar">
          {/* Background segments for visual separation */}
          <div className="bar-segment"></div>
          <div className="bar-segment"></div>
          <div className="bar-segment"></div>
          <div className="bar-segment"></div>

          {/* Green fill (up to the target) */}
          {greenWidth > 0 && (
            <div
              className="bar-fill green"
              style={{
                width: `${greenWidth}%`,
                left: "0%",
              }}
            ></div>
          )}

          {/* Red fill (after the target) */}
          {redWidth > 0 && (
            <div
              className="bar-fill red"
              style={{
                width: `${redWidth}%`,
                left: `${targetPercentage}%`,
              }}
            ></div>
          )}
        </div>
      </div>
    );
  };

  // Updated subtopic performance data with all topics from the list
  const mathSubtopicData = [
    {
      name: "Linear Equations",
      timingPercentage: 82,
      timingText: "2:15 avg",
      masteryPercentage: 88,
      masteryText: "88% (44/50)",
      improvement: "+6%",
    },
    {
      name: "Nonlinear Functions",
      timingPercentage: 68,
      timingText: "3:05 avg",
      masteryPercentage: 76,
      masteryText: "76% (38/50)",
      improvement: "+4%",
    },
    {
      name: "Probability",
      timingPercentage: 92,
      timingText: "1:48 avg",
      masteryPercentage: 94,
      masteryText: "94% (47/50)",
      improvement: "+12%",
    },
    {
      name: "Trigonometry",
      timingPercentage: 58,
      timingText: "3:35 avg",
      masteryPercentage: 62,
      masteryText: "62% (31/50)",
      improvement: "-3%",
    },
  ];

  const verbalSubtopicData = [
    {
      name: "Words in Context",
      timingPercentage: 75,
      timingText: "2:33 avg",
      masteryPercentage: 82,
      masteryText: "82% (41/50)",
      improvement: "+8%",
    },
    {
      name: "Command of Evidence",
      timingPercentage: 65,
      timingText: "3:12 avg",
      masteryPercentage: 78,
      masteryText: "78% (39/50)",
      improvement: "+5%",
    },
    {
      name: "Rhetorical Synthesis",
      timingPercentage: 88,
      timingText: "1:56 avg",
      masteryPercentage: 92,
      masteryText: "92% (46/50)",
      improvement: "+12%",
    },
    {
      name: "Form, Structure, and Sense",
      timingPercentage: 45,
      timingText: "3:45 avg",
      masteryPercentage: 60,
      masteryText: "60% (30/50)",
      improvement: "-3%",
    },
  ];

  // Complete lists of topics and subtopics
  const allMathTopics = {
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

  const allVerbalTopics = {
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

  // Get active subtopic data based on the selected tab
  const activeSubtopicData =
    activeTab === "math" ? mathSubtopicData : verbalSubtopicData;

  return (
    <div className="lab-page-container">
      <header className="lab-header">
        <div className="lab-title-area">
          <div className="lab-logo-container">
            <span className="lab-logo">🧪</span>
          </div>
          <h1 className="lab-title">Learning Lab</h1>
        </div>
      </header>

      <div className="lab-content">
        {/* Yearly Activity Calendar Section */}
        <div className="yearly-activity-section">
          <div className="yearly-activity-header">
            <h2 className="yearly-activity-title">Training Activity</h2>

            {/* Year dropdown */}
            <div className="year-selector">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="year-dropdown"
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
          </div>

          {/* Exam date selection UI */}
          <div className="exam-date-selector">
            <p className="exam-date-text">
              Click on a day to mark your exam date with{" "}
              <span className="exam-x-sample">X</span>
            </p>
            {examDate && (
              <p className="selected-exam-date">
                Selected exam date: {yearMonths[examDate.month]}{" "}
                {examDate.row * 5 + examDate.col + 1}, {selectedYear}
              </p>
            )}
          </div>

          <div className="yearly-calendar-container">
            {yearMonths.map((month, index) => renderMonthColumn(month, index))}
          </div>
        </div>

        {/* Tab selection for Math/Verbal */}
        <div className="performance-tab-selector">
          <div className="tab-pill">
            <button
              className={`tab-button ${activeTab === "math" ? "active" : ""}`}
              onClick={() => setActiveTab("math")}
            >
              Math
            </button>
            <button
              className={`tab-button ${activeTab === "verbal" ? "active" : ""}`}
              onClick={() => setActiveTab("verbal")}
            >
              Verbal
            </button>
          </div>
        </div>

        <div className="lab-row performance-row">
          {/* Timing Performance Section */}
          <div className="lab-card timing-card">
            <div className="lab-card-header">
              <div className="lab-card-icon">
                <ClockIcon />
              </div>
              <h2>Timing Performance</h2>
            </div>
            <div className="lab-subtopic-table">
              <div className="lab-subtopic-table-header">
                <div>Subtopic</div>
                <div>Time</div>
              </div>
              {activeSubtopicData.map((subtopic, index) => (
                <div className="lab-subtopic-row" key={index}>
                  <div className="lab-subtopic-name">
                    {subtopic.name}
                    <span
                      className={`improvement ${
                        subtopic.improvement.includes("+")
                          ? "positive"
                          : "negative"
                      }`}
                    >
                      {subtopic.improvement}
                    </span>
                  </div>
                  <div className="lab-timing-cell">
                    {renderPerformanceBar(subtopic.timingPercentage)}
                    <div className="lab-timing-text-group">
                      <div className="lab-timing-text">
                        {subtopic.timingText}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mastery Performance Section with Score Icons */}
          <div className="lab-card mastery-card">
            <div className="lab-card-header">
              <div className="lab-card-icon">
                <ChartIcon />
              </div>
              <h2>Mastery Performance</h2>
            </div>
            <div className="lab-subtopic-table">
              <div className="lab-subtopic-table-header">
                <div>Subtopic</div>
                <div>Score</div>
              </div>
              {activeSubtopicData.map((subtopic, index) => (
                <div className="lab-subtopic-row" key={index}>
                  <div className="lab-subtopic-name">{subtopic.name}</div>
                  <div className="lab-mastery-cell">
                    <div className="lab-score-container">
                      <img
                        src={getScoreImage(subtopic.masteryPercentage)}
                        alt={`Score ${getScoreLabel(
                          subtopic.masteryPercentage
                        )}`}
                        className="score-icon"
                      />
                      <div className="lab-mastery-text">
                        {subtopic.masteryText}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabPage;
