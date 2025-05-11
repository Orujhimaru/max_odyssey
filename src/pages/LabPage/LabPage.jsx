import React, { useState, useEffect } from "react";
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

// Define grid constants accessible by generator and renderer
const ACTUAL_COLUMNS_PER_MONTH_DISPLAY = 5; // How many cells wide each month *visually* appears for labeling
const CELLS_PER_WEEK_COLUMN = 7; // Rows in the continuous display, typically 7 for days of week

// --- START UTILITY FUNCTIONS ---
const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

// Function to get the day of the week for the first day of the month
// 0 = Monday, 1 = Tuesday, ..., 6 = Sunday
const getFirstDayOfMonth = (year, month) => {
  const day = new Date(year, month, 1).getDay(); // Sunday is 0, Monday is 1, etc.
  return day === 0 ? 6 : day - 1; // Adjust so Monday is 0 and Sunday is 6
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

// Generate year data (mostly empty with some activity in recent months)
// THIS FUNCTION WILL BE REPLACED/HEAVILY MODIFIED
const generateYearData_OLD = () => {
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

// const yearData_OLD = generateYearData_OLD(); // Keep old one for now if needed, or remove

// --- START CALENDAR GENERATION LOGIC (Per-Month 5x7 Grids) ---
const generateFullYearCalendar = (year, activityData = {}, examDates = []) => {
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
  const calendarYear = {}; // This will store each month's 35-cell grid
  // ACTUAL_COLUMNS_PER_MONTH_DISPLAY, CELLS_PER_WEEK_COLUMN are now accessible from higher scope

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  yearMonths.forEach((monthName, monthIndex) => {
    const numDaysInCurrentMonth = daysInMonth(year, monthIndex);
    const firstDayOffset = getFirstDayOfMonth(year, monthIndex); // 0 for Monday, ..., 6 for Sunday

    const monthCells = [];

    // Add leading placeholder cells for the current month's grid
    for (
      let placeholderIndex = 0;
      placeholderIndex < firstDayOffset;
      placeholderIndex++
    ) {
      monthCells.push({ type: "placeholder", chainType: "placeholder_empty" });
    }

    // Add actual day cells for the current month
    for (let day = 1; day <= numDaysInCurrentMonth; day++) {
      if (
        monthCells.length >=
        CELLS_PER_WEEK_COLUMN * ACTUAL_COLUMNS_PER_MONTH_DISPLAY
      )
        break; // Safety break

      const dateObj = new Date(year, monthIndex, day);
      const formattedDate = dateFormatter.format(dateObj);
      const dateStr = `${year}-${String(monthIndex + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;

      const currentActivity = activityData[dateStr] || 0;
      // Ensure examDates are 0-indexed for month if they aren't already
      const isExam = examDates.some(
        (ed) =>
          ed.year === String(year) &&
          ed.month === monthIndex && // Assuming ed.month is 0-11
          ed.day === day
      );

      let tooltipText = `No activity on ${formattedDate}`;
      if (isExam) {
        tooltipText = `Exam day on ${formattedDate}`;
      } else if (currentActivity > 0) {
        tooltipText = `Activity Level ${currentActivity} on ${formattedDate}`;
      }

      const currentDayCell = {
        type: "day",
        dateString: dateStr,
        formattedDate: formattedDate,
        tooltipText: tooltipText,
        monthIndex: monthIndex,
        monthName: monthName,
        dayOfMonth: day,
        activityLevel: currentActivity,
        isExam: isExam,
        // isActive and chainType will be determined next
      };

      // Determine isActive for the current cell being processed
      currentDayCell.isActive = currentDayCell.activityLevel > 0;

      // Add to monthCells before trying to determine chainType based on its position
      monthCells.push(currentDayCell);
    }

    // Add trailing placeholders to ensure the grid is full (35 cells)
    while (
      monthCells.length <
      CELLS_PER_WEEK_COLUMN * ACTUAL_COLUMNS_PER_MONTH_DISPLAY
    ) {
      monthCells.push({ type: "placeholder", chainType: "placeholder_empty" });
    }

    // Now, iterate over the fully populated monthCells (including placeholders) to set chainType
    for (let i = 0; i < monthCells.length; i++) {
      const currentCell = monthCells[i];

      if (currentCell.type === "placeholder") {
        // chainType is already set for placeholders
        continue;
      }

      // isActive is already set on currentCell if it's a day type
      const displayRow = Math.floor(i / ACTUAL_COLUMNS_PER_MONTH_DISPLAY);

      if (currentCell.isActive) {
        if (displayRow === 0) {
          // Topmost active cell of its display column (within the 5x7 grid)
          currentCell.chainType = "connecting_top";
        } else if (displayRow === CELLS_PER_WEEK_COLUMN - 1) {
          // Bottommost active cell (row 6 for 7 rows)
          currentCell.chainType = "connecting_bottom";
        } else {
          // Active cell between top and bottom
          currentCell.chainType = "initial_vertical_segment";
        }
      } else {
        // Inactive cell
        currentCell.chainType = "empty";
        // Check if the cell directly above (in the same 5x7 grid column) was active
        const cellAboveIndex = i - ACTUAL_COLUMNS_PER_MONTH_DISPLAY;
        if (
          cellAboveIndex >= 0 &&
          monthCells[cellAboveIndex].type === "day" &&
          monthCells[cellAboveIndex].isActive
        ) {
          currentCell.chainType = "broken";
        }
      }
    }

    calendarYear[monthName] = monthCells;
  });

  return calendarYear;
};
// --- END CALENDAR GENERATION LOGIC ---

// --- START CONTINUOUS YEAR CALENDAR GENERATION LOGIC ---
const generateContinuousYearData = (
  year,
  activityData = {},
  examDates = []
) => {
  const allCells = [];
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

  const dayOfWeekJan1 = getFirstDayOfMonth(year, 0); // 0 for Monday, ..., 6 for Sunday

  // Adjust so Monday is 0, Sunday is 6 for week column calculation
  const leadingPlaceholdersCount = dayOfWeekJan1 === 0 ? 6 : dayOfWeekJan1 - 1;

  for (let i = 0; i < leadingPlaceholdersCount; i++) {
    allCells.push({
      type: "placeholder_leading_year",
      chainType: "placeholder_empty",
      // Add a unique key for React rendering later
      key: `leading-placeholder-${i}`,
    });
  }

  // Iterate through all days of the year
  for (
    let d = new Date(year, 0, 1);
    d <= new Date(year, 11, 31);
    d.setDate(d.getDate() + 1)
  ) {
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    const formattedDate = dateFormatter.format(d);

    const currentActivity = activityData[dateStr] || 0;
    // Ensure examDates are 0-indexed for month if they aren't already
    const isExam = examDates.some(
      (ed) =>
        ed.year === String(year) &&
        ed.month === d.getMonth() && // Assuming ed.month is 0-11
        ed.day === d.getDate()
    );

    let tooltipText = `No activity on ${formattedDate}`;
    if (isExam) {
      tooltipText = `Exam day on ${formattedDate}`;
    } else if (currentActivity > 0) {
      tooltipText = `Activity Level ${currentActivity} on ${formattedDate}`;
    }

    const currentDayCell = {
      type: "day",
      dateString: dateStr,
      formattedDate: formattedDate,
      tooltipText: tooltipText,
      monthIndex: d.getMonth(),
      monthName: yearMonths[d.getMonth()],
      dayOfMonth: d.getDate(),
      activityLevel: currentActivity,
      isExam: isExam,
      isActive: currentActivity > 0,
      // Add a unique key for React rendering later
      key: dateStr,
    };

    allCells.push(currentDayCell);
  }

  // Add trailing placeholders to make the total number of cells a multiple of CELLS_PER_WEEK_COLUMN
  while (allCells.length % CELLS_PER_WEEK_COLUMN !== 0) {
    allCells.push({
      type: "placeholder_trailing_year",
      chainType: "placeholder_empty",
      // Add a unique key for React rendering later
      key: `trailing-placeholder-${allCells.length}`,
    });
  }

  // Apply chain logic to the flat allCells array
  for (let i = 0; i < allCells.length; i++) {
    const currentCell = allCells[i];

    if (currentCell.type !== "day") {
      // chainType already set for placeholders during creation
      continue;
    }

    // isActive is already set
    const displayRowInYearGrid = i % CELLS_PER_WEEK_COLUMN; // 0 for top, 6 for bottom

    if (currentCell.isActive) {
      if (displayRowInYearGrid === 0) {
        // Topmost active cell of its 7-day display column
        currentCell.chainType = "connecting_top";
      } else if (displayRowInYearGrid === CELLS_PER_WEEK_COLUMN - 1) {
        // Bottommost active cell (row 6)
        currentCell.chainType = "connecting_bottom";
      } else {
        // Active cell between top and bottom (rows 1-5)
        currentCell.chainType = "initial_vertical_segment";
      }
    } else {
      // Inactive day cell
      currentCell.chainType = "empty";
      // Check if the cell directly above (in the continuous 7-day column) was active
      const cellAboveIndex = i - CELLS_PER_WEEK_COLUMN;
      if (
        cellAboveIndex >= 0 &&
        allCells[cellAboveIndex].type === "day" &&
        allCells[cellAboveIndex].isActive
      ) {
        currentCell.chainType = "broken";
      }
    }
  }
  return allCells;
};
// --- END CONTINUOUS YEAR CALENDAR GENERATION LOGIC ---

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

  // --- START USING PER-MONTH CALENDAR DATA ---
  const generateFullYearActivity = (year) => {
    const activity = {};
    const startDate = new Date(year, 0, 1); // January 1st
    const endDate = new Date(year, 11, 31); // December 31st

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      activity[dateStr] = Math.floor(Math.random() * 4) + 1; // Random activity level 1-4
    }
    return activity;
  };

  const mockActivity = generateFullYearActivity(2025);

  // State for the continuous year data
  const [allYearCellsData, setAllYearCellsData] = useState([]);

  useEffect(() => {
    const correctlyFormattedExamDates = testDates.map((td) => ({
      ...td,
      month: td.month - 1, // Adjust to 0-indexed for Date object compatibility
    }));

    setAllYearCellsData(
      generateContinuousYearData(
        // Use the continuous year data generator
        parseInt(selectedYear),
        mockActivity,
        correctlyFormattedExamDates
      )
    );
  }, [selectedYear, selectedExamDate]);

  // --- END USING PER-MONTH CALENDAR DATA ---

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
    // Only update if tooltip is already visible to avoid unnecessary updates
    if (tooltip.visible) {
      setTooltip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
    }
  };

  // --- NEW RENDERING LOGIC FOR CONTINUOUS YEAR VIEW (Placeholder) ---
  const renderContinuousYearGrid = () => {
    if (!allYearCellsData || allYearCellsData.length === 0) {
      return <p>Loading calendar data...</p>;
    }

    // Group cells into columns for month label placement (approximate)
    // This is a simplified approach for placing month labels.
    // A more robust way would be to track month changes during cell iteration.
    const cellsPerApproximateMonthColumn =
      ACTUAL_COLUMNS_PER_MONTH_DISPLAY * CELLS_PER_WEEK_COLUMN;
    let currentMonthForLabel = -1;

    return (
      <div className="continuous-year-grid-container">
        {" "}
        {/* New CSS class needed */}
        {allYearCellsData.map((cell, index) => {
          let monthLabel = null;
          if (cell.type === "day" && cell.monthIndex !== currentMonthForLabel) {
            // Check if this cell is at the start of a visual 5-cell wide block
            // This is an approximation for label placement.
            const visualColumnStartInContinuousGrid =
              index %
              (ACTUAL_COLUMNS_PER_MONTH_DISPLAY * CELLS_PER_WEEK_COLUMN);
            if (visualColumnStartInContinuousGrid < CELLS_PER_WEEK_COLUMN) {
              // If in the first "week" of a 5-wide block
              if (
                index % ACTUAL_COLUMNS_PER_MONTH_DISPLAY === 0 ||
                index === 0 ||
                (allYearCellsData[index - 1] &&
                  allYearCellsData[index - 1].type ===
                    "placeholder_leading_year")
              ) {
                currentMonthForLabel = cell.monthIndex;
                monthLabel = (
                  <div className="continuous-month-label">
                    {yearMonths[currentMonthForLabel]}
                  </div>
                );
              }
            }
          }

          let ChainComponentToRender;
          let svgClassName = "chain-svg";

          switch (cell.chainType) {
            case "connecting_top":
              ChainComponentToRender = ConnectingChain;
              break;
            case "connecting_bottom":
              ChainComponentToRender = ConnectingChain;
              break;
            case "initial_vertical_segment":
              ChainComponentToRender = InitialChain;
              break;
            case "broken":
              ChainComponentToRender = BrokenChain;
              break;
            case "empty":
            case "placeholder_empty":
              ChainComponentToRender = null;
              break;
            default:
              ChainComponentToRender = null;
          }

          return (
            <React.Fragment key={cell.key || `cell-${index}`}>
              {monthLabel}
              <div
                className={`activity-square chain-cell continuous-cell ${
                  cell.type === "placeholder_leading_year" ||
                  cell.type === "placeholder_trailing_year"
                    ? "placeholder-cell"
                    : cell.isExam
                    ? "exam-day-chain"
                    : cell.isActive
                    ? "active-chain"
                    : "inactive-day"
                }`.trim()}
                title={cell.tooltipText}
                onMouseEnter={(e) => handleMouseEnterSquare(e, cell)}
                onMouseLeave={handleMouseLeaveSquare}
                onMouseMove={handleMouseMoveSquare}
              >
                {ChainComponentToRender && (
                  <ChainComponentToRender className={svgClassName} />
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  };
  // --- END NEW RENDERING LOGIC ---

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
            {/* Render the new continuous year grid */}
            {renderContinuousYearGrid()}
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
