import React, { useMemo } from "react";
import "./ActivityHeatmap.css";

const ActivityHeatmap = ({ activityData = {} }) => {
  // Generate months for 2026 with 7x5/7x6 grid layout
  const calendarData = useMemo(() => {
    const months = [];
    const year = 2026;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let month = 0; month < 12; month++) {
      // Get number of days in this month
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      
      // Calculate number of columns needed (each column has 5 rows)
      const numColumns = Math.ceil(daysInMonth / 5);
      const rowsPerColumn = 5;
      const totalCells = numColumns * rowsPerColumn;
      
      // Create grid in row-major order for CSS Grid (which fills row-major)
      // But arranged so it displays as column-major visually
      const grid = [];
      
      // Fill grid row by row (for CSS Grid), but calculate day numbers column-major
      for (let row = 0; row < rowsPerColumn; row++) {
        for (let col = 0; col < numColumns; col++) {
          // Calculate day number in column-major order
          const dayNumber = col * rowsPerColumn + row + 1;
          
          if (dayNumber <= daysInMonth) {
            const date = new Date(year, month, dayNumber);
            const dateStr = date.toISOString().split('T')[0];
            const activity = activityData[dateStr] || 0;
            
            grid.push({
              date: dateStr,
              activity,
              dayOfMonth: dayNumber,
              fullDate: date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })
            });
          } else {
            // Empty cell after last day of month
            grid.push(null);
          }
        }
      }
      
      months.push({
        name: monthNames[month],
        grid,
        daysInMonth,
        numColumns
      });
    }
    
    return { months };
  }, [activityData]);

  // Get activity level for coloring (0-4)
  const getActivityLevel = (activity) => {
    if (activity === 0) return 0;
    if (activity <= 2) return 1;
    if (activity <= 5) return 2;
    if (activity <= 10) return 3;
    return 4;
  };

  return (
    <div className="activity-heatmap">
      <div className="heatmap-header">
        <h3 className="heatmap-title">
          <i className="fas fa-fire"></i>
          Study Activity
        </h3>
        <span className="heatmap-subtitle">Questions practiced this year</span>
      </div>
      
      <div className="heatmap-container">
        <div className="heatmap-wrapper">
          {/* Month labels */}
          <div className="heatmap-month-labels-row">
            {calendarData.months.map((month, idx) => (
              <div 
                key={idx} 
                className="heatmap-month-label"
              >
                {month.name}
              </div>
            ))}
          </div>
          
          {/* Activity grid - each month as a column-major grid (5 rows x dynamic columns) */}
          <div className="heatmap-months-grid">
            {calendarData.months.map((month, monthIdx) => (
              <div 
                key={monthIdx} 
                className="heatmap-month-grid"
                style={{
                  gridTemplateColumns: `repeat(${month.numColumns}, 1fr)`,
                  gridTemplateRows: 'repeat(5, 1fr)'
                }}
              >
                {month.grid.map((day, dayIdx) => {
                  if (day) {
                    return (
                      <div 
                        key={dayIdx}
                        className={`heatmap-day level-${getActivityLevel(day.activity)}`}
                        data-date={day.fullDate}
                        data-activity={day.activity}
                        title={`${day.fullDate}: ${day.activity} questions`}
                      />
                    );
                  } else {
                    return (
                      <div key={dayIdx} className="heatmap-day empty" />
                    );
                  }
                })}
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
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
  );
};

export default ActivityHeatmap;
