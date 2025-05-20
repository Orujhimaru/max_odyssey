import React, { useState, useEffect } from "react";
import "./LabPage.css";
import { CalendarIcon } from "../../icons/Icons";
import labPageIcon from "../../assets/lab_page.svg";
import aristotleIcon from "../../assets/aristotle.svg";
import {
  LineChart,
  Line,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

// Import score SVGs
import scoreA from "../../assets/scoreA.svg";
import scoreB from "../../assets/scoreB.svg";
import scoreC from "../../assets/scoreC.svg";
import scoreD from "../../assets/scoreD.svg";
import scoreF from "../../assets/scoreF.svg";

// Import SpeedometerIcon
import SpeedometerIcon from "../../components/SpeedometerIcon/SpeedometerIcon";

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

// Verbal subtopics in order
const verbalSubtopics = [
  "Words in Context (Easy)",
  "Words in Context (Medium)",
  "Words in Context (Medium)",
  "Words in Context (Hard)",
  "Text Structure and Purpose (Easy)",
  "Text Structure and Purpose (Medium)",
  "Cross-Text Connections (Medium)",
  "Central Ideas and Details (Easy)",
  "Central Ideas and Details (Medium)",
  "Command of Evidence (Textual) (Easy)",
  "Command of Evidence (Textual) (Medium)",
  "Command of Evidence (Quantitative) (Medium)",
  "Command of Evidence (Quantitative) (Hard)",
  "Inferences (Medium)",
  "Boundaries (Easy)",
  "Boundaries (Medium)",
  "Boundaries (Hard)",
  "Form, Structure, and Sense (Easy)",
  "Form, Structure, and Sense (Medium)",
  "Form, Structure, and Sense (Hard)",
  "Transitions (Easy)",
  "Transitions (Medium)",
  "Transitions (Hard)",
  "Rhetorical Synthesis (Easy)",
  "Rhetorical Synthesis (Medium)",
  "Rhetorical Synthesis (Medium)",
  "Rhetorical Synthesis (Hard)",
];

// Placeholder timing data (in seconds)
const timingData = [
  42, 55, 38, 70, 25, 60, 80, 35, 50, 45, 90, 100, 110, 30, 20, 40, 60, 70, 80,
  90, 25, 35, 45, 55, 65, 75, 85,
];

const chartData = timingData.map((seconds, idx) => ({
  question: idx + 1,
  subtopic: verbalSubtopics[idx],
  seconds,
}));

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { question, subtopic, seconds } = payload[0].payload;
    return (
      <div
        className="custom-tooltip"
        style={{
          background: "#fff",
          border: "1px solid #ccc",
          padding: 10,
          borderRadius: 8,
        }}
      >
        <div>
          <strong>Q{question}</strong>
        </div>
        <div>{subtopic}</div>
        <div>
          <b>{seconds} seconds</b>
        </div>
      </div>
    );
  }
  return null;
};

// Custom dot: invisible by default
const InvisibleDot = (props) => null;

const TimingLineGraph = () => (
  <div
    style={{
      width: "100%",
      maxWidth: 1000,
      margin: "32px 0",
      background: "#23272f",
      borderRadius: 18,
      padding: 32,
      boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
      position: "relative",
    }}
  >
    <h2 style={{ textAlign: "left", marginBottom: 12, color: "#fff" }}>
      Timing Across Verbal Questions
    </h2>
    <div
      style={{
        background: "#f7f7fa",
        borderRadius: 12,
        padding: 16,
        position: "relative",
        width: "100%",
        height: 300,
      }}
    >
      {/* Area background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ left: 40, right: 20, top: 20, bottom: 20 }}
          >
            <CartesianGrid
              stroke="#e0e0e0"
              horizontal={true}
              vertical={false}
            />
            <YAxis
              domain={[0, 120]}
              ticks={[10, 30, 60, 120]}
              tickFormatter={(s) => {
                if (s === 60) return "01:00";
                if (s === 120) return "02:00";
                return `${s}`;
              }}
              width={60}
            />
            <Area
              type="monotone"
              dataKey="seconds"
              stroke={false}
              fill="#23272f"
              fillOpacity={0.18}
              baseValue={0}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Foreground line and tooltip */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ left: 100, right: 20, top: 20, bottom: 20 }}
          >
            <Line
              type="monotone"
              dataKey="seconds"
              stroke="#787A7C"
              strokeWidth={2}
              dot={<InvisibleDot />}
              activeDot={{
                r: 4,
                fill: "#fff",
                stroke: "#787A7C",
                strokeWidth: 1,
              }}
              isAnimationActive={false}
            />
            <Tooltip content={<CustomTooltip />} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

// Change the gold shades to blue/purple shades
const activityColors = [
  "#a5d8ff", // Light blue (low activity)
  "#74c0fc",
  "#4dabf7",
  "#339af0", // Sky blue (medium activity)
  "#5f3dc4", // Purple/blue mix (high activity)
];

// 7 days of the week
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthsFull = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const weeksPerMonth = 5; // 5 weeks per month for layout

// Generate random activity data: 12 months, 5 weeks per month, 7 days per week
const calendarData = monthsFull.map(() =>
  Array.from({ length: weeksPerMonth }, () =>
    Array.from({ length: 7 }, () =>
      Math.floor(Math.random() * activityColors.length)
    )
  )
);

const CalendarHeatmap = () => {
  const [selectedMonth, setSelectedMonth] = useState(0);
  const squareSize = 12;
  const fontSize = 14;

  const goToPreviousMonth = () => {
    setSelectedMonth((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const goToNextMonth = () => {
    setSelectedMonth((prev) => (prev === 11 ? 0 : prev + 1));
  };

  return (
    <div
      style={{
        width: "100%",
        margin: "32px 0 24px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Month label and navigation */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            color: "#fff",
            fontSize: 32,
            fontWeight: 400,
            letterSpacing: 1,
          }}
        >
          {monthsFull[selectedMonth]}
        </div>

        {/* Navigation buttons */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            gap: 8,
          }}
        >
          <button
            onClick={goToPreviousMonth}
            style={{
              background: "transparent",
              border: "1px solid #555",
              color: "#fff",
              width: 28,
              height: 28,
              borderRadius: 4,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ←
          </button>
          <button
            onClick={goToNextMonth}
            style={{
              background: "transparent",
              border: "1px solid #555",
              color: "#fff",
              width: 28,
              height: 28,
              borderRadius: 4,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar grid for selected month */}
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {/* Day labels */}
        <div
          style={{ display: "flex", flexDirection: "column", marginRight: 6 }}
        >
          {daysOfWeek.map((day) => (
            <div
              key={day}
              style={{
                height: squareSize,
                marginBottom: 2,
                color: "#fff",
                fontSize,
                fontWeight: 400,
                width: 32,
                textAlign: "right",
              }}
            >
              {day}
            </div>
          ))}
        </div>
        {/* Activity squares for selected month */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {daysOfWeek.map((_, dayIdx) => (
            <div key={dayIdx} style={{ display: "flex" }}>
              {Array.from({ length: weeksPerMonth }).map((_, weekIdx) => (
                <div
                  key={weekIdx}
                  style={{
                    width: squareSize,
                    height: squareSize,
                    background:
                      activityColors[
                        calendarData[selectedMonth][weekIdx][dayIdx]
                      ],
                    marginRight: 2,
                    borderRadius: 2,
                    border: "1px solid #2d2157",
                    boxSizing: "border-box",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: 12,
          color: "#ccc",
          fontSize: 16,
          gap: 8,
          justifyContent: "center",
        }}
      >
        <span>Less</span>
        {activityColors.map((color, i) => (
          <span
            key={i}
            style={{
              width: squareSize,
              height: squareSize,
              background: color,
              display: "inline-block",
              margin: "0 2px",
              borderRadius: 2,
              border: "1px solid #2d2157",
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};

// Add a new PaceCard component
const PaceCard = () => {
  // Sample data - in real app this would come from props or context
  const userAvgTime = "01:04"; // User's average time per question
  const targetTime = "01:31"; // Target time per question
  const paceRatio = 1.2; // Ratio above 1.0 means slower than target

  // Determine pace status based on ratio
  const getPaceStatus = (ratio) => {
    if (ratio <= 0.7) return "excellent"; // Green
    if (ratio <= 1.0) return "okay"; // Blue
    return "slow"; // Red
  };

  const paceStatusClass = getPaceStatus(paceRatio);
  const paceText = {
    excellent: "Excellent",
    okay: "Okay",
    slow: "Slow",
  }[paceStatusClass];

  return (
    <div className="pace-card">
      {/* Left side - times */}
      <div className="pace-card-left">
        <div className="pace-info">
          <h3 className="pace-title">Pace</h3>
          <div className={`pace-status ${paceStatusClass}`}>{paceText}</div>
          <p className="pace-message">
            You've struggled with some questions, but practice makes you
            perfect!
          </p>
        </div>
      </div>

      {/* Right side - speedometer and time info */}
      <div className="pace-card-right">
        <div className="time-info-container">
          <div className="time-info-card">
            <div className="time-info-row">
              <div>
                <span className="time-label">Test Time</span>
              </div>
              <span className="time-value">{targetTime}</span>
            </div>

            <div className="time-info-row">
              <div>
                <span className="time-label">Your Time</span>
              </div>
              <span className="time-value">{userAvgTime}</span>
            </div>
          </div>
        </div>

        <div className="speedometer-container">
          <SpeedometerIcon ratio={paceRatio} />
          <div className="remaining-time">03:06 remaining</div>
        </div>
      </div>
    </div>
  );
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

    return `${avgMinutes.toString().padStart(2, "0")}:${avgRemainingSeconds
      .toString()
      .padStart(2, "0")} `;
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
        timingText: "02:15",
        masteryPercentage: 88,
        masteryText: "88% (44/50)",
        improvement: "+6%",
      },
      {
        name: "Linear Functions",
        timingPercentage: 75,
        timingText: "02:30",
        masteryPercentage: 84,
        masteryText: "84% (42/50)",
        improvement: "+5%",
      },
      {
        name: "Linear Equations (2)",
        timingPercentage: 80,
        timingText: "02:20",
        masteryPercentage: 86,
        masteryText: "86% (43/50)",
        improvement: "+7%",
      },
      {
        name: "Systems of 2 in 2",
        timingPercentage: 65,
        timingText: "02:45",
        masteryPercentage: 76,
        masteryText: "76% (38/50)",
        improvement: "+3%",
      },
      {
        name: "Linear Inequalities",
        timingPercentage: 70,
        timingText: "02:35",
        masteryPercentage: 80,
        masteryText: "80% (40/50)",
        improvement: "+4%",
      },
    ],
    "Advanced Math": [
      {
        name: "Equivalent Expressions",
        timingPercentage: 60,
        timingText: "03:00",
        masteryPercentage: 74,
        masteryText: "74% (37/50)",
        improvement: "+2%",
      },
      {
        name: "Nonlinear Equations",
        timingPercentage: 62,
        timingText: "02:55",
        masteryPercentage: 72,
        masteryText: "72% (36/50)",
        improvement: "+3%",
      },
      {
        name: "Nonlinear Functions",
        timingPercentage: 68,
        timingText: "03:05",
        masteryPercentage: 76,
        masteryText: "76% (38/50)",
        improvement: "+4%",
      },
    ],
    "Problem-Solving and Data Analysis": [
      {
        name: "Ratios & Rates",
        timingPercentage: 85,
        timingText: "02:00",
        masteryPercentage: 90,
        masteryText: "90% (45/50)",
        improvement: "+10%",
      },
      {
        name: "Percentages",
        timingPercentage: 88,
        timingText: "01:58",
        masteryPercentage: 92,
        masteryText: "92% (46/50)",
        improvement: "+11%",
      },
      {
        name: "Measures of Spread",
        timingPercentage: 80,
        timingText: "02:10",
        masteryPercentage: 86,
        masteryText: "86% (43/50)",
        improvement: "+8%",
      },
      {
        name: "Models and Scatterplots",
        timingPercentage: 75,
        timingText: "02:25",
        masteryPercentage: 82,
        masteryText: "82% (41/50)",
        improvement: "+7%",
      },
      {
        name: "Probability",
        timingPercentage: 92,
        timingText: "01:48",
        masteryPercentage: 94,
        masteryText: "94% (47/50)",
        improvement: "+12%",
      },
      {
        name: "Sample Statistics",
        timingPercentage: 78,
        timingText: "02:20",
        masteryPercentage: 84,
        masteryText: "84% (42/50)",
        improvement: "+6%",
      },
      {
        name: "Studies and Experiments",
        timingPercentage: 70,
        timingText: "02:40",
        masteryPercentage: 78,
        masteryText: "78% (39/50)",
        improvement: "+5%",
      },
    ],
    "Geometry and Trigonometry": [
      {
        name: "Area & Volume",
        timingPercentage: 82,
        timingText: "02:15",
        masteryPercentage: 88,
        masteryText: "88% (44/50)",
        improvement: "+9%",
      },
      {
        name: "Angles & Triangles",
        timingPercentage: 75,
        timingText: "02:30",
        masteryPercentage: 80,
        masteryText: "80% (40/50)",
        improvement: "+6%",
      },
      {
        name: "Trigonometry",
        timingPercentage: 58,
        timingText: "03:35",
        masteryPercentage: 62,
        masteryText: "62% (31/50)",
        improvement: "-3%",
      },
      {
        name: "Circles",
        timingPercentage: 65,
        timingText: "03:10",
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
        timingText: "02:40",
        masteryPercentage: 78,
        masteryText: "78% (39/50)",
        improvement: "+6%",
      },
      {
        name: "Text Structure and Purpose",
        timingPercentage: 78,
        timingText: "02:20",
        masteryPercentage: 84,
        masteryText: "84% (42/50)",
        improvement: "+7%",
      },
      {
        name: "Words in Context",
        timingPercentage: 75,
        timingText: "02:33",
        masteryPercentage: 82,
        masteryText: "82% (41/50)",
        improvement: "+8%",
      },
    ],
    "Expression of Ideas": [
      {
        name: "Rhetorical Synthesis",
        timingPercentage: 88,
        timingText: "01:56",
        masteryPercentage: 92,
        masteryText: "92% (46/50)",
        improvement: "+12%",
      },
      {
        name: "Transitions",
        timingPercentage: 80,
        timingText: "02:10",
        masteryPercentage: 86,
        masteryText: "86% (43/50)",
        improvement: "+9%",
      },
    ],
    "Information and Ideas": [
      {
        name: "Central Ideas and Details",
        timingPercentage: 76,
        timingText: "02:25",
        masteryPercentage: 82,
        masteryText: "82% (41/50)",
        improvement: "+7%",
      },
      {
        name: "Command of Evidence",
        timingPercentage: 65,
        timingText: "03:12",
        masteryPercentage: 78,
        masteryText: "78% (39/50)",
        improvement: "+5%",
      },
      {
        name: "Inferences",
        timingPercentage: 70,
        timingText: "02:45",
        masteryPercentage: 76,
        masteryText: "76% (38/50)",
        improvement: "+4%",
      },
    ],
    "Standard English Conventions": [
      {
        name: "Boundaries",
        timingPercentage: 82,
        timingText: "02:10",
        masteryPercentage: 88,
        masteryText: "88% (44/50)",
        improvement: "+10%",
      },
      {
        name: "Form, Structure, and Sense",
        timingPercentage: 45,
        timingText: "03:45",
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
                  </div>

                  {sectionType === "timing" ? (
                    <div className="lab-timing-cell">
                      <span
                        className={`dropdown-indicator ${
                          isExpanded ? "expanded" : ""
                        }`}
                      >
                        ▼
                      </span>
                      {renderPerformanceBar(avgTimingPercentage)}
                      <div className="lab-timing-text-group">
                        <div className="lab-timing-text">{avgTimingText}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="lab-mastery-cell">
                      <span
                        className={`dropdown-indicator ${
                          isExpanded ? "expanded" : ""
                        }`}
                      >
                        ▼
                      </span>
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
            Performance Lab
          </h1>
        </div>
      </header>

      <div className="lab-content">
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

        {/* Add the PaceCard below the quote and above the heatmap */}
        <PaceCard />

        <CalendarHeatmap />
        <TimingLineGraph />

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
