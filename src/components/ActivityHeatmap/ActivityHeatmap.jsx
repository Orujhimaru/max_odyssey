import React, { useState, useMemo } from "react";
import "./ActivityHeatmap.css";

const ActivityHeatmap = ({ activityData = {} }) => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());

  // Generate calendar data for a single month
  const monthData = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = currentMonthIndex;
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

    // Create calendar grid (7 columns for days of week, up to 6 rows for weeks)
    const grid = [];
    const totalCells = 42; // 6 weeks * 7 days

    // Fill the grid
    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - startingDayOfWeek + 1;

      if (i < startingDayOfWeek || dayNumber > daysInMonth) {
        // Empty cell before/after month
        grid.push(null);
      } else {
        const date = new Date(year, month, dayNumber);
        const dateStr = date.toISOString().split('T')[0];
        const activity = activityData[dateStr] || 0;

        grid.push({
          date: dateStr,
          activity,
          dayOfMonth: dayNumber,
          isToday: dateStr === today.toISOString().split('T')[0],
          fullDate: date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
        });
      }
    }

    // Calculate total questions for the month
    const totalQuestions = Object.entries(activityData || {})
      .filter(([dateStr]) => {
        const date = new Date(dateStr);
        return date.getFullYear() === year && date.getMonth() === month;
      })
      .reduce((sum, [, count]) => sum + count, 0);

    // Calculate current streak
    let streak = 0;
    const todayStr = today.toISOString().split('T')[0];
    let checkDate = new Date(today);

    while (true) {
      const checkStr = checkDate.toISOString().split('T')[0];
      if (activityData[checkStr] && activityData[checkStr] > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return {
      monthName: monthNames[month],
      year,
      grid,
      daysInMonth,
      totalQuestions,
      streak
    };
  }, [currentMonthIndex, activityData]);

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentMonthIndex((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonthIndex((prev) => (prev === 11 ? 0 : prev + 1));
  };

  // Get activity level for coloring (0-4)
  const getActivityLevel = (activity) => {
    if (activity === 0) return 0;
    if (activity <= 2) return 1;
    if (activity <= 5) return 2;
    if (activity <= 10) return 3;
    return 4;
  };

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="activity-heatmap">
      <div className="heatmap-header">
        <div className="heatmap-title-section">
          <h3 className="heatmap-title">
            <i className="fas fa-fire"></i>
            Study Consistency
          </h3>
          {monthData.streak > 0 && (
            <div className="heatmap-streak">
              <i className="fas fa-flame"></i>
              <span className="streak-number">{monthData.streak}</span>
              <span className="streak-label">Day Streak</span>
            </div>
          )}
        </div>

        <div className="heatmap-controls">
          <button
            className="month-nav-btn"
            onClick={goToPreviousMonth}
            aria-label="Previous month"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="current-month">{monthData.monthName}</span>
          <button
            className="month-nav-btn"
            onClick={goToNextMonth}
            aria-label="Next month"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <div className="heatmap-container">
        {/* Day of week labels */}
        <div className="heatmap-day-labels">
          {dayLabels.map((label, idx) => (
            <div key={idx} className="day-label">{label}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="heatmap-calendar-grid">
          {monthData.grid.map((day, idx) => {
            if (day) {
              return (
                <div
                  key={idx}
                  className={`heatmap-day level-${getActivityLevel(day.activity)} ${day.isToday ? 'today' : ''}`}
                  data-date={day.fullDate}
                  data-activity={day.activity}
                  title={`${day.fullDate}: ${day.activity} questions`}
                >
                  <span className="day-number">{day.dayOfMonth}</span>
                </div>
              );
            } else {
              return (
                <div key={idx} className="heatmap-day empty" />
              );
            }
          })}
        </div>

        {/* Summary stats */}
        <div className="heatmap-summary">
          <div className="summary-item">
            <span className="summary-label">Last 30 days</span>
            <span className="summary-value">{monthData.totalQuestions} Qs</span>
          </div>
          <div className="heatmap-legend">
            <span className="heatmap-legend-label">Less</span>
            <div className="heatmap-legend-squares">
              <div className="heatmap-day level-0" />
              <div className="heatmap-day level-1" />
              <div className="heatmap-day level-2" />
              <div className="heatmap-day level-3" />
              <div className="heatmap-day level-4" />
            </div>
            <span className="heatmap-legend-label">More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
