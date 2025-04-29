import React from "react";
import "./LabPage.css";
import { CalendarIcon, ChartIcon, ClockIcon } from "../../icons/Icons";

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
  // Mock months data for the yearly view
  const yearlyMonths = [
    { name: "JAN", days: 31 },
    { name: "FEB", days: 28 },
    { name: "MAR", days: 31 },
    { name: "APR", days: 30 },
    { name: "MAY", days: 31 },
    { name: "JUN", days: 30 },
    { name: "JUL", days: 31 },
    { name: "AUG", days: 31 },
    { name: "SEP", days: 30 },
    { name: "OCT", days: 31 },
    { name: "NOV", days: 30 },
    { name: "DEC", days: 31 },
  ];

  // Mock monthly activity data (5x5 grid for each month)
  const monthlyData = [
    {
      name: "May 2024",
      weekdays: ["M", "T", "W", "T", "F"],
      days: Array(25)
        .fill(0)
        .map((_, i) => ({
          day: i + 1,
          activity: Math.floor(Math.random() * 4),
        })),
    },
    {
      name: "June 2024",
      weekdays: ["M", "T", "W", "T", "F"],
      days: Array(25)
        .fill(0)
        .map((_, i) => ({
          day: i + 1,
          activity: Math.floor(Math.random() * 4),
        })),
    },
  ];

  // Mock subtopic performance data
  const subtopicData = [
    {
      name: "Critical Reasoning",
      timingPercentage: 75,
      timingText: "2:33 avg",
      masteryPercentage: 82,
      masteryText: "82% (41/50)",
      improvement: "+8%",
    },
    {
      name: "Reading Comprehension",
      timingPercentage: 65,
      timingText: "3:12 avg",
      masteryPercentage: 78,
      masteryText: "78% (39/50)",
      improvement: "+5%",
    },
    {
      name: "Sentence Correction",
      timingPercentage: 88,
      timingText: "1:56 avg",
      masteryPercentage: 92,
      masteryText: "92% (46/50)",
      improvement: "+12%",
    },
    {
      name: "Problem Solving",
      timingPercentage: 45,
      timingText: "3:45 avg",
      masteryPercentage: 60,
      masteryText: "60% (30/50)",
      improvement: "-3%",
    },
  ];

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

  // Render a single month for the yearly calendar
  const renderMonthColumn = (month, monthIndex) => {
    return (
      <div className="month-column" key={month.name}>
        <div className="month-label">{month.name}</div>
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
                    return (
                      <div
                        className={`activity-square ${
                          isActive ? "active-day" : ""
                        }`}
                        key={`square-${rowIndex}-${colIndex}`}
                      />
                    );
                  })}
              </div>
            ))}
        </div>
      </div>
    );
  };

  // Function to determine activity styles for the monthly calendar
  const getActivityStyle = (activity) => {
    if (activity === 0) return {};
    if (activity === 1) return { backgroundColor: "var(--activity-1)" };
    if (activity === 2) return { backgroundColor: "var(--activity-2)" };
    if (activity === 3) return { backgroundColor: "var(--activity-3)" };
  };

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
            <div className="year-dropdown">
              <span>2025</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="yearly-calendar-container">
            {yearlyMonths.map((month, index) =>
              renderMonthColumn(month, index)
            )}
          </div>
        </div>

        <div className="lab-row">
          <div className="lab-card activity-card">
            <div className="lab-card-header">
              <div className="lab-card-icon">
                <CalendarIcon />
              </div>
              <h2>Monthly Activity</h2>
            </div>
            <div className="lab-calendar-grids">
              {monthlyData.map((month, index) => (
                <div className="lab-calendar-month" key={index}>
                  <div className="lab-calendar-month-title">{month.name}</div>
                  <div className="lab-calendar-weekdays">
                    {month.weekdays.map((day, dayIndex) => (
                      <div className="lab-calendar-weekday" key={dayIndex}>
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="lab-calendar-grid">
                    {month.days.map((day, dayIndex) => (
                      <div
                        className="lab-calendar-box"
                        key={dayIndex}
                        style={getActivityStyle(day.activity)}
                      >
                        {day.day}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lab-card performance-card">
            <div className="lab-card-header">
              <div className="lab-card-icon">
                <ChartIcon />
              </div>
              <h2>Subtopic Performance</h2>
            </div>
            <div className="lab-subtopic-table">
              <div className="lab-subtopic-table-header">
                <div>Subtopic</div>
                <div>Time</div>
                <div>Mastery</div>
              </div>
              {subtopicData.map((subtopic, index) => (
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
                    <div className="lab-timing-bar-bg">
                      <div
                        className="lab-timing-bar-fill"
                        style={{ width: `${subtopic.timingPercentage}%` }}
                      ></div>
                    </div>
                    <div className="lab-timing-text">{subtopic.timingText}</div>
                  </div>
                  <div className="lab-mastery-cell">
                    <div className="lab-mastery-bar-bg">
                      <div
                        className="lab-mastery-bar-fill"
                        style={{ width: `${subtopic.masteryPercentage}%` }}
                      ></div>
                    </div>
                    <div className="lab-mastery-text">
                      {subtopic.masteryText}
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
