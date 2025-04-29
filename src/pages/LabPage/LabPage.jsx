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
  // Mock data for monthly calendar view
  const monthsData = [
    {
      name: "May 2024",
      weekdays: ["M", "T", "W", "T", "F"],
      days: [
        { day: 1, activity: 2 },
        { day: 2, activity: 1 },
        { day: 3, activity: 3 },
        { day: 4, activity: 0 },
        { day: 5, activity: 2 },
        { day: 6, activity: 1 },
        { day: 7, activity: 0 },
        { day: 8, activity: 2 },
        { day: 9, activity: 3 },
        { day: 10, activity: 1 },
        { day: 11, activity: 0 },
        { day: 12, activity: 1 },
        { day: 13, activity: 2 },
        { day: 14, activity: 0 },
        { day: 15, activity: 3 },
        { day: 16, activity: 1 },
        { day: 17, activity: 0 },
        { day: 18, activity: 2 },
        { day: 19, activity: 1 },
        { day: 20, activity: 3 },
        { day: 21, activity: 0 },
        { day: 22, activity: 1 },
        { day: 23, activity: 2 },
        { day: 24, activity: 0 },
        { day: 25, activity: 1 },
      ],
    },
    {
      name: "June 2024",
      weekdays: ["M", "T", "W", "T", "F"],
      days: [
        { day: 1, activity: 1 },
        { day: 2, activity: 2 },
        { day: 3, activity: 0 },
        { day: 4, activity: 3 },
        { day: 5, activity: 1 },
        { day: 6, activity: 0 },
        { day: 7, activity: 2 },
        { day: 8, activity: 1 },
        { day: 9, activity: 3 },
        { day: 10, activity: 0 },
        { day: 11, activity: 1 },
        { day: 12, activity: 2 },
        { day: 13, activity: 0 },
        { day: 14, activity: 1 },
        { day: 15, activity: 0 },
        { day: 16, activity: 3 },
        { day: 17, activity: 2 },
        { day: 18, activity: 1 },
        { day: 19, activity: 0 },
        { day: 20, activity: 1 },
        { day: 21, activity: 3 },
        { day: 22, activity: 2 },
        { day: 23, activity: 0 },
        { day: 24, activity: 1 },
        { day: 25, activity: 2 },
      ],
    },
  ];

  // Mock data for year view
  const yearData = [
    {
      month: "Jan",
      activity: Array(15)
        .fill(0)
        .map(() => Math.floor(Math.random() * 4)),
    },
    {
      month: "Feb",
      activity: Array(15)
        .fill(0)
        .map(() => Math.floor(Math.random() * 4)),
    },
    {
      month: "Mar",
      activity: Array(15)
        .fill(0)
        .map(() => Math.floor(Math.random() * 4)),
    },
    {
      month: "Apr",
      activity: Array(15)
        .fill(0)
        .map(() => Math.floor(Math.random() * 4)),
    },
    {
      month: "May",
      activity: Array(15)
        .fill(0)
        .map(() => Math.floor(Math.random() * 4)),
    },
    {
      month: "Jun",
      activity: Array(15)
        .fill(0)
        .map(() => Math.floor(Math.random() * 4)),
    },
    {
      month: "Jul",
      activity: Array(15)
        .fill(0)
        .map(() => Math.floor(Math.random() * 4)),
    },
    {
      month: "Aug",
      activity: Array(15)
        .fill(0)
        .map(() => Math.floor(Math.random() * 4)),
    },
    {
      month: "Sep",
      activity: Array(15)
        .fill(0)
        .map(() => Math.floor(Math.random() * 4)),
    },
    {
      month: "Oct",
      activity: Array(15)
        .fill(0)
        .map(() => Math.floor(Math.random() * 4)),
    },
    {
      month: "Nov",
      activity: Array(15)
        .fill(0)
        .map(() => Math.floor(Math.random() * 4)),
    },
    {
      month: "Dec",
      activity: Array(15)
        .fill(0)
        .map(() => Math.floor(Math.random() * 4)),
    },
  ];

  // Mock data for performance metrics
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
        <div className="lab-row">
          <div className="lab-card activity-card">
            <div className="lab-card-header">
              <div className="lab-card-icon">
                <CalendarIcon />
              </div>
              <h2>Activity Level</h2>
            </div>
            <div className="lab-calendar-grids">
              {monthsData.map((month, index) => (
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

        <div className="lab-card year-view-card">
          <div className="lab-card-header">
            <div className="lab-card-icon">
              <ClockIcon />
            </div>
            <h2>Year Activity</h2>
          </div>
          <div className="year-view-container">
            {yearData.map((month, monthIndex) => (
              <div className="year-month" key={monthIndex}>
                <div className="year-month-name">{month.month}</div>
                <div className="year-month-grid">
                  {[0, 1, 2].map((row) => (
                    <div className="year-grid-row" key={row}>
                      {[0, 1, 2, 3, 4].map((col) => {
                        const index = row * 5 + col;
                        return index < month.activity.length ? (
                          <div
                            className="year-grid-cell"
                            key={col}
                            style={getActivityStyle(month.activity[index])}
                          ></div>
                        ) : null;
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabPage;
