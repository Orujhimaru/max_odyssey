import React, { useState, useEffect, useMemo } from "react";
import "./LabPage.css";
import { CalendarIcon } from "../../icons/Icons";
import labPageIcon from "../../assets/lab_page.svg";
import aristotleIcon from "../../assets/aristotle.svg";

// Import SVG chain assets as React components
import InitialChain from "../../assets/initial_chain.svg?react";
import ConnectingChain from "../../assets/connecting_chain.svg?react";
import TheLine from "../../assets/the_line.svg?react";
import BrokenChain from "../../assets/broken_chain.svg?react";

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

// --- START UTILITY FUNCTIONS (Should be outside the component) ---
const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

// Define grid constants
const ACTUAL_COLUMNS_IN_GRID = 5;
const CELLS_PER_COLUMN_IN_GRID = 7;
const CELLS_PER_MONTH_GRID = ACTUAL_COLUMNS_IN_GRID * CELLS_PER_COLUMN_IN_GRID;

// Moved generateFullYearActivity outside the component
const generateFullYearActivity = (year) => {
  const activity = {};
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    activity[dateStr] = Math.floor(Math.random() * 4) + 1;
  }
  return activity;
};

// --- END UTILITY FUNCTIONS ---

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
const generateFullYearCalendar = (year, activityData = {}, examDates = []) => {
  const months = [
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

  const CELLS_PER_VISUAL_COLUMN = 7; // 7 cells per visual column
  const CELLS_PER_MONTH_GRID = 35; // 5 columns × 7 rows

  const yearData = {};

  // Process each month
  months.forEach((monthName, monthIndex) => {
    const daysInCurrentMonth = daysInMonth(year, monthIndex);
    const monthCells = Array(CELLS_PER_MONTH_GRID)
      .fill()
      .map(() => ({
        type: "placeholder",
        chainType: "empty",
      }));

    // Map days to cells in zigzag order
    const zigzagOrder = [];
    for (let col = 0; col < 5; col++) {
      const isDownColumn = col % 2 === 0;
      for (let row = 0; row < 7; row++) {
        const displayRow = isDownColumn ? row : 6 - row;
        const cellIndex = col * CELLS_PER_VISUAL_COLUMN + displayRow;
        zigzagOrder.push(cellIndex);
      }
    }

    // Fill cells with days in zigzag order
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const cellIndex = zigzagOrder[day - 1];
      const dateString = `${year}-${String(monthIndex + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      const isActive = activityData[dateString] > 0;
      const activityLevel = activityData[dateString] || 0;

      const isExamDay = examDates.some(
        (examDate) =>
          examDate.year === year &&
          examDate.month === monthIndex &&
          examDate.day === day
      );

      monthCells[cellIndex] = {
        type: "day",
        dayOfMonth: day,
        dateString: dateString,
        isActive: isActive,
        activityLevel: activityLevel,
        chainType: "empty", // Initial placeholder
        tooltipText: `${months[monthIndex]} ${day}, ${year}: ${
          isActive ? `Activity level: ${activityLevel}` : "No activity"
        }`,
        isExamDay: isExamDay,
      };
    }

    let prevActiveIndex = -1;
    for (let i = 0; i < daysInCurrentMonth; i++) {
      const cellIndex = zigzagOrder[i];
      if (cellIndex === undefined || cellIndex >= monthCells.length) continue; // Safety check
      const cell = monthCells[cellIndex];
      if (cell.type !== "day") continue; // Skip placeholders potentially mixed in calculation

      if (cell.isActive) {
        const visualColumn = Math.floor(cellIndex / CELLS_PER_VISUAL_COLUMN);
        const horizontalRow = cellIndex % CELLS_PER_VISUAL_COLUMN;
        const isDownColumn = visualColumn % 2 === 0;

        // Rule Exceptions: First and Last day of the month are InitialChain
        if (cell.dayOfMonth === 1 || cell.dayOfMonth === daysInCurrentMonth) {
          cell.chainType = isDownColumn
            ? "initial_snake_down"
            : "initial_snake_up";
        }
        // General Rule: Top (0) or Bottom (6) HORIZONTAL rows are ConnectingChain
        else if (horizontalRow === 0 || horizontalRow === 6) {
          cell.chainType = "connecting_turn_intra_month";
        } else {
          // Middle HORIZONTAL rows (1-5) are InitialChain
          cell.chainType = isDownColumn
            ? "initial_snake_down"
            : "initial_snake_up";
        }
        prevActiveIndex = cellIndex; // Track last active cell index
      } else {
        // Broken chain logic (remains the same, based on zigzag path)
        if (prevActiveIndex !== -1) {
          const expectedPrevCellIndex = i > 0 ? zigzagOrder[i - 1] : -1;
          if (prevActiveIndex === expectedPrevCellIndex) {
            cell.chainType = "broken";
          }
        }
        // prevActiveIndex is only updated by active cells
      }
    }

    yearData[monthName] = monthCells;
  });

  return yearData;
};
// --- END CALENDAR GENERATION LOGIC ---

// --- START NEW CONTINUOUS CALENDAR GENERATION LOGIC (SNAKE PATTERN) ---
const generateContinuousYearData = (
  year,
  activityData = {},
  examDates = []
) => {
  const allCells = [];
  // ... (leading placeholder and day cell generation remains similar to previous continuous attempt)
  // ... (ensure dateStr, monthIndex, dayOfMonth, activityLevel, isActive, isExam, tooltipText are set)

  // Iterate through all days of the year
  // (This part is from a previous correct version of continuous data generation)
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
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const firstDateOfYear = new Date(year, 0, 1);
  let dayOfWeekJan1 = firstDateOfYear.getDay();
  const leadingPlaceholdersCount = dayOfWeekJan1 === 0 ? 6 : dayOfWeekJan1 - 1;
  for (let i = 0; i < leadingPlaceholdersCount; i++) {
    allCells.push({
      type: "placeholder_leading_year",
      chainType: "placeholder_empty",
    });
  }
  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const numDaysInCurrentMonth = daysInMonth(year, monthIndex);
    for (let day = 1; day <= numDaysInCurrentMonth; day++) {
      const dateObj = new Date(year, monthIndex, day);
      const formattedDate = dateFormatter.format(dateObj);
      const dateStr = `${year}-${String(monthIndex + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      const currentActivity = activityData[dateStr] || 0;
      const isExam = examDates.some(
        (ed) =>
          ed.year === String(year) && ed.month === monthIndex && ed.day === day
      );
      let tooltipText = `No activity on ${formattedDate}`;
      if (isExam) tooltipText = `Exam day on ${formattedDate}`;
      else if (currentActivity > 0)
        tooltipText = `Activity Level ${currentActivity} on ${formattedDate}`;
      allCells.push({
        type: "day",
        dateString: dateStr,
        formattedDate: formattedDate,
        tooltipText: tooltipText,
        monthIndex: monthIndex,
        monthName: yearMonths[monthIndex],
        dayOfMonth: day,
        activityLevel: currentActivity,
        isExam: isExam,
        isActive: currentActivity > 0,
      });
    }
  }
  while (allCells.length % CELLS_PER_VISUAL_COLUMN !== 0) {
    allCells.push({
      type: "placeholder_trailing_year",
      chainType: "placeholder_empty",
    });
  }

  // Apply SNAKE chain logic
  for (let i = 0; i < allCells.length; i++) {
    const currentCell = allCells[i];
    if (currentCell.type !== "day") continue;

    const visualColumnIndex = Math.floor(i / CELLS_PER_VISUAL_COLUMN);
    const isDownColumn = visualColumnIndex % 2 === 0;
    const rowInVisualColumn = i % CELLS_PER_VISUAL_COLUMN;

    if (currentCell.isActive) {
      // Default to InitialChain based on column direction
      currentCell.chainType = isDownColumn
        ? "initial_snake_down"
        : "initial_snake_up";

      // Check for Turns (ConnectingChains)
      // Bottom turn: end of a "down" column, or start of an "up" column at the bottom
      if (rowInVisualColumn === CELLS_PER_VISUAL_COLUMN - 1) {
        // Bottom row of any visual column
        currentCell.chainType = "connecting_turn";
      }
      // Top turn: end of an "up" column, or start of a "down" column at the top (excluding col 0 top)
      else if (rowInVisualColumn === 0 && visualColumnIndex > 0) {
        // Top row of any visual column (except the very first cell of all)
        currentCell.chainType = "connecting_turn";
      }
      // The very first active cell of the entire year, if it is active, should be initial_snake_down.
      // This is handled by the default if visualColumnIndex is 0 and rowInVisualColumn is 0.
    } else {
      // Inactive cell
      currentCell.chainType = "empty";
      let prevSnakePathCellIndex = -1;
      if (isDownColumn) {
        if (rowInVisualColumn > 0) prevSnakePathCellIndex = i - 1;
        // Cell directly above in the same column
        else if (visualColumnIndex > 0) {
          // Top of a down column, check top of previous up column
          prevSnakePathCellIndex = i - 1; // This is the connecting_turn from previous up column.
        }
      } else {
        // Up Column
        if (rowInVisualColumn < CELLS_PER_VISUAL_COLUMN - 1)
          prevSnakePathCellIndex = i + 1; // Cell directly below
        else if (visualColumnIndex > 0) {
          // Bottom of an up column, check bottom of previous down column
          prevSnakePathCellIndex = i - 1; // This is the connecting_turn from previous down column
        }
      }

      if (
        prevSnakePathCellIndex !== -1 &&
        prevSnakePathCellIndex < allCells.length &&
        allCells[prevSnakePathCellIndex].type === "day" &&
        allCells[prevSnakePathCellIndex].isActive
      ) {
        currentCell.chainType = "broken";
      }
    }
  }
  return allCells;
};
// --- END NEW CONTINUOUS CALENDAR GENERATION LOGIC (SNAKE PATTERN) ---

// Define CELLS_PER_VISUAL_COLUMN at a scope accessible by renderMonthColumn
const CELLS_PER_VISUAL_COLUMN = 7;

const LabPage = () => {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedExamDate, setSelectedExamDate] = useState("");
  const [activeTab, setActiveTab] = useState("math"); // 'math' or 'verbal'
  // Track expanded topics separately for timing and mastery sections
  const [expandedTopics, setExpandedTopics] = useState({
    timing: {},
    mastery: {},
  });
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });

  const [yearCalendarData, setYearCalendarData] = useState({});

  // Memoize mockActivity to prevent re-creation on every render unless selectedYear changes
  const mockActivity = useMemo(() => {
    return generateFullYearActivity(parseInt(selectedYear));
  }, [selectedYear]);

  useEffect(() => {
    const correctlyFormattedExamDates = testDates.map((td) => ({
      ...td,
      month: td.month - 1,
    }));
    setYearCalendarData(
      generateFullYearCalendar(
        parseInt(selectedYear),
        mockActivity,
        correctlyFormattedExamDates
      )
    );
  }, [selectedYear, mockActivity]); // Now mockActivity is a stable dependency

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

  // --- START MODIFIED RENDERING LOGIC ---

  const handleMouseEnterSquare = (e, cellData) => {
    if (cellData.type === "placeholder" || !cellData.tooltipText) return;
    setTooltip({
      visible: true,
      content: cellData.tooltipText,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseLeaveSquare = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  const handleMouseMoveSquare = (e) => {
    if (tooltip.visible) {
      setTooltip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
    }
  };

  // --- Rendering logic for each month - MODIFIED FOR 7 ROWS ---
  const renderMonthColumn = (monthName, monthCells) => {
    if (!monthCells || monthCells.length !== CELLS_PER_MONTH_GRID) {
      return (
        <div className="month-column error">
          Error: Invalid data for {monthName}
        </div>
      );
    }

    const checkIsSelectedExamDate = (cell) => {
      if (!selectedExamDate || cell.type !== "day") return false;
      const examDateDetails = testDates.find(
        (d) => d.label === selectedExamDate
      );
      if (!examDateDetails) return false;
      return (
        cell.dateString ===
        `${examDateDetails.year}-${String(examDateDetails.month + 1).padStart(
          2,
          "0"
        )}-${String(examDateDetails.day).padStart(2, "0")}`
      );
    };

    return (
      <div className="month-column" key={monthName}>
        <div className="month-label">{monthName}</div>
        {/* Render 7 distinct horizontal rows */}
        {Array.from({ length: 7 }).map((_, rowIndex) => (
          <div className="month-row" key={`row-${rowIndex}`}>
            {/* Render 5 cells for the current row */}
            {Array.from({ length: 5 }).map((_, colIndex) => {
              // Calculate the index in the flat monthCells array
              const cellIndex = colIndex * 7 + rowIndex;
              const cell = monthCells[cellIndex];

              // Determine SVG and classes based on cell data (same logic as before)
              let ChainComponentToRender;
              let svgClassName = "chain-svg";
              let squareClassName = "activity-square chain-cell";

              if (!cell) {
                // Handle potential undefined cell if array isn't perfect
                squareClassName += " placeholder-cell";
                ChainComponentToRender = null;
              } else if (cell.type === "placeholder") {
                squareClassName += " placeholder-cell";
                ChainComponentToRender = null; // Explicitly no SVG for placeholders
              } else if (cell.type === "day") {
                if (checkIsSelectedExamDate(cell)) {
                  squareClassName += " exam-day";
                }
                // Chain type logic based on the pre-calculated cell.chainType
                switch (cell.chainType) {
                  case "initial_snake_down":
                    ChainComponentToRender = InitialChain;
                    break;
                  case "initial_snake_up":
                    ChainComponentToRender = InitialChain;
                    svgClassName += " rotated-180";
                    break;
                  case "connecting_turn_intra_month":
                    ChainComponentToRender = ConnectingChain;
                    break;
                  case "broken":
                    ChainComponentToRender = BrokenChain;
                    break;
                  case "empty":
                  default:
                    ChainComponentToRender = null;
                }
              } else {
                // Should not happen, but handle unexpected cell types
                squareClassName += " placeholder-cell";
                ChainComponentToRender = null;
              }

              return (
                <div
                  className={squareClassName}
                  key={`${monthName}-cell-${cellIndex}`}
                  title={cell?.tooltipText || ""} // Use optional chaining for safety
                  onMouseEnter={(e) => cell && handleMouseEnterSquare(e, cell)} // Pass cell if defined
                  onMouseLeave={handleMouseLeaveSquare}
                  onMouseMove={handleMouseMoveSquare}
                >
                  {ChainComponentToRender && (
                    <ChainComponentToRender className={svgClassName} />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };
  // --- END MODIFIED RENDERING LOGIC ---

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
        <div className="yearly-activity-section">
          <div className="yearly-activity-header">
            <h2 className="yearly-activity-title">Training Activity</h2>
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
                {/* Populate options based on selectedYear and testDates */}
                {testDates
                  .filter((date) => date.year === selectedYear)
                  .reduce((acc, date) => {
                    const groupLabel =
                      date.semester === "fall"
                        ? `Fall ${selectedYear}`
                        : `Spring ${selectedYear}`;
                    if (!acc.find((opt) => opt.label === groupLabel)) {
                      acc.push({ label: groupLabel, isGroup: true });
                    }
                    acc.push(date);
                    return acc;
                  }, [])
                  .map((item, index) =>
                    item.isGroup ? (
                      <optgroup key={item.label} label={item.label} />
                    ) : (
                      <option key={item.label} value={item.label}>
                        {item.label}
                      </option>
                    )
                  )}
              </select>
            </div>
            {selectedExamDate && (
              <p className="selected-exam-date">
                Selected exam date: {selectedExamDate}
              </p>
            )}
          </div>

          {/* Main calendar rendering area - iterates over yearCalendarData */}
          <div className="yearly-calendar-container month-based-layout">
            {Object.entries(yearCalendarData).map(([monthName, monthCells]) =>
              renderMonthColumn(monthName, monthCells)
            )}
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
      {tooltip.visible && (
        <div
          className="lab-custom-tooltip"
          style={{ top: tooltip.y + 10, left: tooltip.x + 10 }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default LabPage;
