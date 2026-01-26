import React, { useState, useEffect } from "react";
import "./WeeklyTasks.css";
import flamesIcon from "../../assets/flames.png";

const WeeklyTasks = () => {
  // Sample data
  const streakDays = 26;
  const [displayStreak, setDisplayStreak] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Count-up animation for streak number
  useEffect(() => {
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const increment = streakDays / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayStreak(streakDays);
        clearInterval(timer);
      } else {
        setDisplayStreak(Math.floor(increment * currentStep));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [streakDays]);

  // Daily goals data
  const completedGoals = 2;
  const totalGoals = 3;
  const progressPercentage = (completedGoals / totalGoals) * 100;

  const dailyTasks = [
    {
      id: 1,
      completed: true,
      category: "Tests",
      title: "Complete one short/full test",
      description: "Take a practice test to track progress"
    },
    {
      id: 2,
      completed: true,
      category: "Practices",
      title: "Work on one of your weaknesses",
      description: "Recommended: Algebra"
    },
  ];

  return (
    <div className="wk_daily-goals-grid">
      {/* Streak Days Card */}
      <div className="wk_streak-card">
        <div className="wk_streak-number">{displayStreak}</div>
        <div className="wk_streak-label">Streak Days</div>
        <img src={flamesIcon} alt="flames" className="wk_streak-flame wk_flame-animate" />
      </div>

      {/* Daily Goal Card */}
      <div className={`wk_daily-goal-card ${isExpanded ? "wk_expanded" : ""}`}>
        <div className="wk_daily-goal-header">
          {/* Target Icon */}
          <svg className="wk_target-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#5b8dee" strokeWidth="2" />
            <circle cx="12" cy="12" r="6" stroke="#5b8dee" strokeWidth="2" />
            <circle cx="12" cy="12" r="2" fill="#5b8dee" />
          </svg>
          <h3 className="wk_daily-goal-title">Daily Goal</h3>

          {/* Expand/Collapse Button */}
          <button
            className="wk_expand-button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              {isExpanded ? (
                <path d="M4 10L8 6L12 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </button>
        </div>

        {!isExpanded ? (
          // Collapsed view
          <div className="wk_daily-goal-content">
            {/* Circular Progress */}
            <div className="wk_progress-circle">
              <svg className="wk_progress-svg" viewBox="0 0 80 80">
                <circle
                  className="wk_progress-bg"
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  strokeWidth="6"
                />
                <circle
                  className="wk_progress-fill"
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - progressPercentage / 100)}`}
                  transform="rotate(-90 40 40)"
                  strokeLinecap="round"
                />
              </svg>
              <div className="wk_progress-text">{completedGoals}/{totalGoals}</div>
            </div>

            {/* Task Checkboxes */}
            <div className="wk_task-list">
              {dailyTasks.map((task) => (
                <div key={task.id} className="wk_task-checkbox">
                  {task.completed ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <rect width="18" height="18" rx="4" fill="#5b8dee" />
                      <path
                        d="M14 5L7 12L4 9"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <rect width="18" height="18" rx="4" fill="#6b7280" />
                      <rect x="7" y="5" width="4" height="8" rx="1" fill="white" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Expanded view with task details
          <div className="wk_expanded-content">
            {dailyTasks.map((task) => (
              <div key={task.id} className={`wk_task-detail ${task.completed ? "wk_completed" : ""}`}>
                <div className="wk_task-detail-header">
                  <div className="wk_task-checkbox-large">
                    {task.completed ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <rect width="20" height="20" rx="4" fill="#5b8dee" />
                        <path
                          d="M15 6L8 13L5 10"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <rect width="20" height="20" rx="4" fill="#6b7280" />
                        <rect x="8" y="6" width="4" height="8" rx="1" fill="white" />
                      </svg>
                    )}
                  </div>
                  <div className="wk_task-info">
                    <div className="wk_task-category">{task.category}</div>
                    <div className="wk_task-title">{task.title}</div>
                    <div className="wk_task-description">{task.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyTasks;
