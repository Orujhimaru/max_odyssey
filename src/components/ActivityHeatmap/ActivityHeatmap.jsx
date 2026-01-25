import React, { useMemo } from "react";
import "./ActivityHeatmap.css";

const ActivityHeatmap = ({ activityData = {} }) => {
  // Generate the last 52 weeks of dates
  const calendarData = useMemo(() => {
    const today = new Date();
    const weeks = [];
    const months = [];
    
    // Start from 52 weeks ago, align to Sunday
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364); // Go back ~52 weeks
    // Align to Sunday
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);
    
    let currentMonth = -1;
    let monthLabels = [];
    
    // Generate 53 weeks (to cover full year)
    for (let week = 0; week < 53; week++) {
      const weekDays = [];
      
      for (let day = 0; day < 7; day++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + (week * 7) + day);
        
        // Check if we're past today
        if (date > today) {
          weekDays.push(null);
          continue;
        }
        
        const dateStr = date.toISOString().split('T')[0];
        const activity = activityData[dateStr] || 0;
        
        // Track month labels
        const month = date.getMonth();
        if (month !== currentMonth && day === 0) {
          currentMonth = month;
          monthLabels.push({
            name: date.toLocaleString('default', { month: 'short' }),
            week: week
          });
        }
        
        weekDays.push({
          date: dateStr,
          activity,
          dayOfMonth: date.getDate(),
          month: date.getMonth(),
          fullDate: date.toLocaleDateString('en-US', { 
            weekday: 'short',
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })
        });
      }
      
      weeks.push(weekDays);
    }
    
    return { weeks, monthLabels };
  }, [activityData]);

  // Get activity level for coloring (0-4)
  const getActivityLevel = (activity) => {
    if (activity === 0) return 0;
    if (activity <= 2) return 1;
    if (activity <= 5) return 2;
    if (activity <= 10) return 3;
    return 4;
  };

  // Day labels (Mon, Wed, Fri)
  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

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
          <div className="heatmap-months">
            <div className="heatmap-day-labels-spacer"></div>
            <div className="heatmap-month-labels">
              {calendarData.monthLabels.map((month, idx) => (
                <span 
                  key={idx} 
                  className="heatmap-month"
                  style={{ gridColumnStart: month.week + 1 }}
                >
                  {month.name}
                </span>
              ))}
            </div>
          </div>
          
          <div className="heatmap-grid-container">
            {/* Day labels */}
            <div className="heatmap-day-labels">
              {dayLabels.map((label, idx) => (
                <span key={idx} className="heatmap-day-label">{label}</span>
              ))}
            </div>
            
            {/* Activity grid */}
            <div className="heatmap-grid">
              {calendarData.weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="heatmap-week">
                  {week.map((day, dayIdx) => (
                    day ? (
                      <div 
                        key={dayIdx}
                        className={`heatmap-day level-${getActivityLevel(day.activity)}`}
                        data-date={day.fullDate}
                        data-activity={day.activity}
                        title={`${day.fullDate}: ${day.activity} questions`}
                      />
                    ) : (
                      <div key={dayIdx} className="heatmap-day empty" />
                    )
                  ))}
                </div>
              ))}
            </div>
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

