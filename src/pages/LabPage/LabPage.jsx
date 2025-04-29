import React from "react";
import "./LabPage.css";
import calendarIcon from "../../assets/calendar.svg";

// Mock data for 2 months (25 days each)
const months = [
  { name: "May 2024", days: 25 },
  { name: "June 2024", days: 25 },
];
const activityData = months.map(() =>
  Array.from({ length: 25 }, () => Math.floor(Math.random() * 6))
);
const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

// Mock subtopic data
const subtopicData = [
  { name: "Linear Equations", avgTime: 38, correct: 9, incorrect: 1 },
  { name: "Grammar & Usage", avgTime: 42, correct: 7, incorrect: 3 },
  { name: "Functions", avgTime: 55, correct: 6, incorrect: 4 },
  { name: "Reading Comprehension", avgTime: 33, correct: 8, incorrect: 2 },
  { name: "Geometry", avgTime: 48, correct: 5, incorrect: 5 },
];

const getBoxShade = (val) => {
  // 0 = lightest, 5 = darkest
  const shades = [
    "#e3f0ff",
    "#b3d8ff",
    "#7bbcff",
    "#3996e6",
    "#1565c0",
    "#003c8f",
  ];
  return shades[Math.min(val, shades.length - 1)];
};

const LabPage = () => {
  return (
    <div className="lab-dashboard-bg">
      <div className="lab-dashboard-card">
        <div className="lab-header-flex">
          <span className="lab-logo" role="img" aria-label="Potion">
            🧪
          </span>
          <h1 className="lab-title">Lab</h1>
        </div>
        {/* Activity Level Section */}
        <div className="lab-section">
          <div className="lab-section-title">
            <img src={calendarIcon} alt="Calendar" className="calendar-icon" />
            <span>Activity Level</span>
          </div>
          <div className="lab-calendar-grids">
            {months.map((month, mIdx) => (
              <div className="lab-calendar-month" key={month.name}>
                <div className="lab-calendar-month-title">{month.name}</div>
                <div className="lab-calendar-weekdays">
                  {weekdays.map((w, i) => (
                    <span key={i} className="lab-calendar-weekday">
                      {w}
                    </span>
                  ))}
                </div>
                <div className="lab-calendar-grid">
                  {activityData[mIdx].map((val, idx) => (
                    <div
                      key={idx}
                      className="lab-calendar-box"
                      style={{ background: getBoxShade(val) }}
                      title={`Day ${idx + 1}: ${val} daily tasks completed`}
                    >
                      {val > 0 ? val : ""}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Subtopic Performance Section */}
        <div className="lab-section">
          <div className="lab-section-title">
            <span>Subtopic Performance</span>
          </div>
          <div className="lab-subtopic-table">
            <div className="lab-subtopic-table-header">
              <span>Subtopic</span>
              <span>Timing</span>
              <span>Mastery</span>
            </div>
            {subtopicData.map((sub, idx) => {
              const total = sub.correct + sub.incorrect;
              const percent = Math.round((sub.correct / total) * 100);
              return (
                <div className="lab-subtopic-row" key={idx}>
                  <span className="lab-subtopic-name">{sub.name}</span>
                  <div className="lab-timing-cell">
                    <div className="lab-timing-bar-bg">
                      <div
                        className="lab-timing-bar-fill"
                        style={{
                          width: `${(Math.min(sub.avgTime, 80) / 80) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="lab-timing-text">{sub.avgTime}s</span>
                  </div>
                  <div className="lab-mastery-cell">
                    <div className="lab-mastery-bar-bg">
                      <div
                        className="lab-mastery-bar-fill"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <span className="lab-mastery-text">
                      {sub.correct}/{total} ({percent}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabPage;
