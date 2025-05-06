import React, { useState, useEffect } from "react";
import "./LabPage.css";
import { CalendarIcon } from "../../icons/Icons";
import labPageIcon from "../../assets/lab_page.svg";
import aristotleIcon from "../../assets/aristotle.svg";

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

// Predefined test dates
const testDates = [
  {
    label: "August 23, 2025",
    month: 7,
    day: 23,
    year: "2025",
    semester: "fall",
  },
  {
    label: "September 13, 2025",
    month: 8,
    day: 13,
    year: "2025",
    semester: "fall",
  },
  {
    label: "October 4, 2025",
    month: 9,
    day: 4,
    year: "2025",
    semester: "fall",
  },
  {
    label: "November 8, 2025",
    month: 10,
    day: 8,
    year: "2025",
    semester: "fall",
  },
  {
    label: "December 6, 2025",
    month: 11,
    day: 6,
    year: "2025",
    semester: "fall",
  },
  {
    label: "March 14, 2026",
    month: 2,
    day: 14,
    year: "2026",
    semester: "spring",
  },
  { label: "May 2, 2026", month: 4, day: 2, year: "2026", semester: "spring" },
  { label: "June 6, 2026", month: 5, day: 6, year: "2026", semester: "spring" },
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
  const [selectedExamDate, setSelectedExamDate] = useState("");
  const [activeTab, setActiveTab] = useState("math"); // 'math' or 'verbal'
  // Track expanded topics separately for timing and mastery sections
  const [expandedTopics, setExpandedTopics] = useState({
    timing: {},
    mastery: {},
  });

  // Filter test dates based on selected year
  const filteredTestDates = testDates.filter(
    (date) => date.year === selectedYear
  );

  // Reset expanded topics when tab changes (keep all closed)
  useEffect(() => {
    // Reset all expanded topics to closed when tab changes
    setExpandedTopics({
      timing: {},
      mastery: {},
    });
  }, [activeTab]);

  // Reset selected exam date when year changes
  useEffect(() => {
    setSelectedExamDate("");
  }, [selectedYear]);

  // Function to toggle topic expansion for a specific section
  const toggleTopic = (topic, section) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [topic]: !prev[section][topic],
      },
    }));
  };

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

  // Function to check if a day is the selected exam date
  const isExamDate = (monthIndex, row, col) => {
    if (!selectedExamDate) return false;

    const examDate = testDates.find((date) => date.label === selectedExamDate);
    if (!examDate) return false;

    // For simplicity, we'll just check the month and use a simple mapping for row and col
    // In a real implementation, you would need proper date calculations
    if (examDate.month !== monthIndex) return false;

    // Map day to row/column (simplified approach)
    const day = examDate.day;
    const mappedRow = Math.floor((day - 1) / 5);
    const mappedCol = (day - 1) % 5;

    return mappedRow === row && mappedCol === col;
  };

  // Render a single month for the yearly calendar
  const renderMonthColumn = (month, monthIndex) => {
    return (
      <div className="month-column" key={month}>
        <div className="month-label">{month}</div>
        <div className="month-grid">
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
                      ></div>
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

  // Function to calculate average time formatting
  const calculateAverageTime = (subtopics) => {
    // Calculate avg time in seconds for simplicity
    let totalSeconds = 0;

    subtopics.forEach((subtopic) => {
      const timeParts = subtopic.timingText.split(":");
      const minutes = parseInt(timeParts[0]);
      const seconds = parseInt(timeParts[1]);
      totalSeconds += minutes * 60 + seconds;
    });

    const avgSeconds = Math.round(totalSeconds / subtopics.length);
    const avgMinutes = Math.floor(avgSeconds / 60);
    const avgRemainingSeconds = avgSeconds % 60;

    return `${avgMinutes}:${avgRemainingSeconds
      .toString()
      .padStart(2, "0")} avg`;
  };

  // Function to calculate average improvement (can be positive or negative)
  const calculateAverageImprovement = (subtopics) => {
    let totalImprovement = 0;

    subtopics.forEach((subtopic) => {
      // Extract the number from the improvement string (e.g., "+6%" -> 6, "-3%" -> -3)
      const improvementValue = parseInt(subtopic.improvement);
      totalImprovement += improvementValue;
    });

    const avgImprovement = Math.round(totalImprovement / subtopics.length);
    return avgImprovement >= 0 ? `+${avgImprovement}%` : `${avgImprovement}%`;
  };

  // Function to calculate average mastery percentage
  const calculateAverageMastery = (subtopics) => {
    let totalMastery = 0;
    let totalQuestions = 0;
    let totalCorrect = 0;

    subtopics.forEach((subtopic) => {
      totalMastery += subtopic.masteryPercentage;

      // Extract questions from text like "88% (44/50)"
      const match = subtopic.masteryText.match(/(\d+)\/(\d+)/);
      if (match) {
        totalCorrect += parseInt(match[1]);
        totalQuestions += parseInt(match[2]);
      }
    });

    const avgMastery = Math.round(totalMastery / subtopics.length);
    return {
      percentage: avgMastery,
      text: `${avgMastery}% (${totalCorrect}/${totalQuestions})`,
    };
  };

  // Function to calculate average timing percentage
  const calculateAverageTimingPercentage = (subtopics) => {
    let totalPercentage = 0;

    subtopics.forEach((subtopic) => {
      totalPercentage += subtopic.timingPercentage;
    });

    return Math.round(totalPercentage / subtopics.length);
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

  // Complete lists of topics and subtopics with performance data
  const mathTopicsData = {
    Algebra: [
      {
        name: "Linear Equations (1)",
        timingPercentage: 82,
        timingText: "2:15 avg",
        masteryPercentage: 88,
        masteryText: "88% (44/50)",
        improvement: "+6%",
      },
      {
        name: "Linear Functions",
        timingPercentage: 75,
        timingText: "2:30 avg",
        masteryPercentage: 84,
        masteryText: "84% (42/50)",
        improvement: "+5%",
      },
      {
        name: "Linear Equations (2)",
        timingPercentage: 80,
        timingText: "2:20 avg",
        masteryPercentage: 86,
        masteryText: "86% (43/50)",
        improvement: "+7%",
      },
      {
        name: "Systems of 2 in 2",
        timingPercentage: 65,
        timingText: "2:45 avg",
        masteryPercentage: 76,
        masteryText: "76% (38/50)",
        improvement: "+3%",
      },
      {
        name: "Linear Inequalities",
        timingPercentage: 70,
        timingText: "2:35 avg",
        masteryPercentage: 80,
        masteryText: "80% (40/50)",
        improvement: "+4%",
      },
    ],
    "Advanced Math": [
      {
        name: "Equivalent Expressions",
        timingPercentage: 60,
        timingText: "3:00 avg",
        masteryPercentage: 74,
        masteryText: "74% (37/50)",
        improvement: "+2%",
      },
      {
        name: "Nonlinear Equations",
        timingPercentage: 62,
        timingText: "2:55 avg",
        masteryPercentage: 72,
        masteryText: "72% (36/50)",
        improvement: "+3%",
      },
      {
        name: "Nonlinear Functions",
        timingPercentage: 68,
        timingText: "3:05 avg",
        masteryPercentage: 76,
        masteryText: "76% (38/50)",
        improvement: "+4%",
      },
    ],
    "Problem-Solving and Data Analysis": [
      {
        name: "Ratios & Rates",
        timingPercentage: 85,
        timingText: "2:00 avg",
        masteryPercentage: 90,
        masteryText: "90% (45/50)",
        improvement: "+10%",
      },
      {
        name: "Percentages",
        timingPercentage: 88,
        timingText: "1:58 avg",
        masteryPercentage: 92,
        masteryText: "92% (46/50)",
        improvement: "+11%",
      },
      {
        name: "Measures of Spread",
        timingPercentage: 80,
        timingText: "2:10 avg",
        masteryPercentage: 86,
        masteryText: "86% (43/50)",
        improvement: "+8%",
      },
      {
        name: "Models and Scatterplots",
        timingPercentage: 75,
        timingText: "2:25 avg",
        masteryPercentage: 82,
        masteryText: "82% (41/50)",
        improvement: "+7%",
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
        name: "Sample Statistics",
        timingPercentage: 78,
        timingText: "2:20 avg",
        masteryPercentage: 84,
        masteryText: "84% (42/50)",
        improvement: "+6%",
      },
      {
        name: "Studies and Experiments",
        timingPercentage: 70,
        timingText: "2:40 avg",
        masteryPercentage: 78,
        masteryText: "78% (39/50)",
        improvement: "+5%",
      },
    ],
    "Geometry and Trigonometry": [
      {
        name: "Area & Volume",
        timingPercentage: 82,
        timingText: "2:15 avg",
        masteryPercentage: 88,
        masteryText: "88% (44/50)",
        improvement: "+9%",
      },
      {
        name: "Angles & Triangles",
        timingPercentage: 75,
        timingText: "2:30 avg",
        masteryPercentage: 80,
        masteryText: "80% (40/50)",
        improvement: "+6%",
      },
      {
        name: "Trigonometry",
        timingPercentage: 58,
        timingText: "3:35 avg",
        masteryPercentage: 62,
        masteryText: "62% (31/50)",
        improvement: "-3%",
      },
      {
        name: "Circles",
        timingPercentage: 65,
        timingText: "3:10 avg",
        masteryPercentage: 70,
        masteryText: "70% (35/50)",
        improvement: "+2%",
      },
    ],
  };

  const verbalTopicsData = {
    "Craft and Structure": [
      {
        name: "Cross-Text Connections",
        timingPercentage: 72,
        timingText: "2:40 avg",
        masteryPercentage: 78,
        masteryText: "78% (39/50)",
        improvement: "+6%",
      },
      {
        name: "Text Structure and Purpose",
        timingPercentage: 78,
        timingText: "2:20 avg",
        masteryPercentage: 84,
        masteryText: "84% (42/50)",
        improvement: "+7%",
      },
      {
        name: "Words in Context",
        timingPercentage: 75,
        timingText: "2:33 avg",
        masteryPercentage: 82,
        masteryText: "82% (41/50)",
        improvement: "+8%",
      },
    ],
    "Expression of Ideas": [
      {
        name: "Rhetorical Synthesis",
        timingPercentage: 88,
        timingText: "1:56 avg",
        masteryPercentage: 92,
        masteryText: "92% (46/50)",
        improvement: "+12%",
      },
      {
        name: "Transitions",
        timingPercentage: 80,
        timingText: "2:10 avg",
        masteryPercentage: 86,
        masteryText: "86% (43/50)",
        improvement: "+9%",
      },
    ],
    "Information and Ideas": [
      {
        name: "Central Ideas and Details",
        timingPercentage: 76,
        timingText: "2:25 avg",
        masteryPercentage: 82,
        masteryText: "82% (41/50)",
        improvement: "+7%",
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
        name: "Inferences",
        timingPercentage: 70,
        timingText: "2:45 avg",
        masteryPercentage: 76,
        masteryText: "76% (38/50)",
        improvement: "+4%",
      },
    ],
    "Standard English Conventions": [
      {
        name: "Boundaries",
        timingPercentage: 82,
        timingText: "2:10 avg",
        masteryPercentage: 88,
        masteryText: "88% (44/50)",
        improvement: "+10%",
      },
      {
        name: "Form, Structure, and Sense",
        timingPercentage: 45,
        timingText: "3:45 avg",
        masteryPercentage: 60,
        masteryText: "60% (30/50)",
        improvement: "-3%",
      },
    ],
  };

  // Get active topics data based on the selected tab
  const activeTopicsData =
    activeTab === "math" ? mathTopicsData : verbalTopicsData;

  // Function to handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Function to render topics for the active tab
  const renderTopicsSection = (topicsData, sectionType) => {
    return (
      <div className="topics-container">
        {Object.entries(topicsData).map(([topic, subtopics]) => {
          // Calculate topic averages
          const avgTimingPercentage =
            calculateAverageTimingPercentage(subtopics);
          const avgTimingText = calculateAverageTime(subtopics);
          const avgImprovement = calculateAverageImprovement(subtopics);
          const avgMastery = calculateAverageMastery(subtopics);

          // Get expansion state for this section and topic
          const isExpanded = expandedTopics[sectionType]?.[topic] || false;

          return (
            <div key={topic} className="lab-topic-section">
              <div
                className={`lab-topic-header ${isExpanded ? "expanded" : ""}`}
                onClick={() => toggleTopic(topic, sectionType)}
              >
                <div className="topic-header-content">
                  <div className="topic-name-container">
                    <h3 className="topic-name">{topic}</h3>
                    <span
                      className={`improvement ${
                        avgImprovement.includes("+") ? "positive" : "negative"
                      }`}
                    >
                      {avgImprovement}
                    </span>
                    <span
                      className={`dropdown-indicator ${
                        isExpanded ? "expanded" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </div>

                  {sectionType === "timing" ? (
                    <div className="lab-timing-cell">
                      {renderPerformanceBar(avgTimingPercentage)}
                      <div className="lab-timing-text-group">
                        <div className="lab-timing-text">{avgTimingText}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="lab-mastery-cell">
                      <div className="lab-score-container">
                        <img
                          src={getScoreImage(avgMastery.percentage)}
                          alt={`Score ${getScoreLabel(avgMastery.percentage)}`}
                          className="score-icon"
                        />
                        <div className="lab-mastery-text">
                          {avgMastery.text}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Subtopics now inside the topic header for each toggling */}
                <div className="lab-subtopics">
                  <div className="lab-subtopic-table">
                    {subtopics.map((subtopic, index) => (
                      <div className="lab-subtopic-row" key={index}>
                        <div className="lab-subtopic-name">
                          {subtopic.name}
                          {sectionType === "timing" && (
                            <span
                              className={`improvement ${
                                subtopic.improvement.includes("+")
                                  ? "positive"
                                  : "negative"
                              }`}
                            >
                              {subtopic.improvement}
                            </span>
                          )}
                        </div>

                        {sectionType === "timing" ? (
                          <div className="lab-timing-cell">
                            {renderPerformanceBar(subtopic.timingPercentage)}
                            <div className="lab-timing-text-group">
                              <div className="lab-timing-text">
                                {subtopic.timingText}
                              </div>
                            </div>
                          </div>
                        ) : (
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
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="lab-page-container">
      <header className="lab-header">
        <div className="lab-title-area">
          <div className="lab-logo-container">
            <img src={labPageIcon} alt="Lab Icon" className="lab-icon" />
          </div>
          <h1 className="lab-title continue-learning-header-h2">
            Learning Lab
          </h1>
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
                <option value="2026">2026</option>
                <option value="2024">2024</option>
              </select>
            </div>
          </div>

          {/* Exam date selection UI */}
          <div className="exam-date-selector">
            <div className="exam-date-dropdown-container">
              <label htmlFor="exam-date-select">Select your exam date:</label>
              <select
                id="exam-date-select"
                value={selectedExamDate}
                onChange={(e) => setSelectedExamDate(e.target.value)}
                className="exam-date-dropdown"
              >
                <option value="">Select a test date</option>
                {selectedYear === "2025" && (
                  <optgroup label="Fall 2025">
                    {filteredTestDates
                      .filter((date) => date.semester === "fall")
                      .map((date) => (
                        <option key={date.label} value={date.label}>
                          {date.label}
                        </option>
                      ))}
                  </optgroup>
                )}
                {selectedYear === "2026" && (
                  <optgroup label="Spring 2026">
                    {filteredTestDates
                      .filter((date) => date.semester === "spring")
                      .map((date) => (
                        <option key={date.label} value={date.label}>
                          {date.label}
                        </option>
                      ))}
                  </optgroup>
                )}
              </select>
            </div>
            {selectedExamDate && (
              <p className="selected-exam-date">
                Selected exam date: {selectedExamDate}
              </p>
            )}
          </div>

          <div className="yearly-calendar-container">
            {yearMonths.map((month, index) => renderMonthColumn(month, index))}
          </div>
        </div>

        {/* Confirmed Test Dates Section */}

        {/* Aristotle Quote Section */}
        <div className="quote-container">
          <div className="quote-accent-line"></div>
          <div className="quote-content">
            <img
              src={aristotleIcon}
              alt="Aristotle"
              className="quote-author-icon"
            />
            <div className="quote-text-container">
              <p className="quote-text">
                "Of all considerations, two bear the greatest weight: the
                precision of one's timing and the righteousness of one's
                judgment."
              </p>
              <span className="quote-author">-- Aristotle</span>
            </div>
          </div>
        </div>

        {/* Tab selection for Math/Verbal */}
        <div className="performance-tab-selector">
          <div className="tab-pill">
            <button
              className={`tab-button ${activeTab === "math" ? "active" : ""}`}
              onClick={() => handleTabChange("math")}
            >
              Math
            </button>
            <button
              className={`tab-button ${activeTab === "verbal" ? "active" : ""}`}
              onClick={() => handleTabChange("verbal")}
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
                <div className="insight-icon">
                  <i className="fas fa-clock"></i>
                </div>
              </div>
              <h2>Timing Performance</h2>
            </div>

            {renderTopicsSection(activeTopicsData, "timing")}
          </div>

          {/* Mastery Performance Section with Score Icons */}
          <div className="lab-card mastery-card">
            <div className="lab-card-header">
              <div className="lab-card-icon">
                <div className="insight-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
              </div>
              <h2>Mastery Performance</h2>
            </div>

            {renderTopicsSection(activeTopicsData, "mastery")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabPage;
