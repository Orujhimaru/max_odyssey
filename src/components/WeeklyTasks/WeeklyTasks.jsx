import React from "react";
import "./WeeklyTasks.css";
import targetIcon from "../../assets/target.svg";

// Flame icon SVG component
const FlameIcon = () => (
  <svg
    width="48"
    height="56"
    viewBox="0 0 48 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer flame */}
    <path
      d="M24 0C24 0 16 8 16 20C16 24 18 28 20 30C20 26 22 22 24 20C26 22 28 26 28 30C30 28 32 24 32 20C32 8 24 0 24 0Z"
      fill="#FFA500"
      opacity="0.9"
    />
    {/* Middle flame */}
    <path
      d="M24 8C24 8 20 12 20 18C20 20 21 22 22 23C22 20 23 18 24 17C25 18 26 20 26 23C27 22 28 20 28 18C28 12 24 8 24 8Z"
      fill="#FF6B00"
    />
    {/* Inner flame */}
    <path
      d="M24 14C24 14 22 16 22 20C22 21 22.5 22 23 22.5C23 21 23.5 20 24 19.5C24.5 20 25 21 25 22.5C25.5 22 26 21 26 20C26 16 24 14 24 14Z"
      fill="#FFD700"
    />
    {/* Base */}
    <ellipse cx="24" cy="48" rx="8" ry="8" fill="#FF8C00" />
  </svg>
);

const WeeklyTasks = () => {
  // Sample data
  const streakDays = 26;
  const completedGoals = 2;
  const totalGoals = 3;
  const progressPercentage = (completedGoals / totalGoals) * 100;

  // Sample goal items
  const goalItems = [
    { id: 1, text: "Complete 10 questions", completed: true },
    { id: 2, text: "Review weak topics", completed: true },
    { id: 3, text: "Take practice test", completed: false },
  ];

  return (
    <div className="wk_daily-goals-grid">
      {/* Streak Days Card */}
      <div className="wk_streak-card">
        <div className="wk_streak-number">{streakDays}</div>
        <div className="wk_streak-label">Streak Days</div>
        <div className="wk_streak-flame">
          <FlameIcon />
        </div>
      </div>

      {/* Daily Goal Card */}
      <div className="wk_daily-goal-card">
        <div className="wk_daily-goal-header">
          <img src={targetIcon} alt="target" className="wk_daily-goal-icon" />
          <h3 className="wk_daily-goal-title">Daily Goal</h3>
        </div>
        
        <div className="wk_daily-goal-content">
          <div className="wk_daily-goal-progress-circle">
            <svg className="wk_progress-svg" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                className="wk_progress-bg"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                className="wk_progress-fill"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="wk_progress-text">{completedGoals}/{totalGoals}</div>
          </div>

          <div className="wk_daily-goal-items">
            {goalItems.map((item, index) => (
              <div key={item.id} className="wk_goal-item">
                <div className={`wk_goal-checkbox ${item.completed ? "wk_completed" : ""}`}>
                  {item.completed ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : index === 1 ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <rect x="4" y="2" width="4" height="8" fill="currentColor" />
                    </svg>
                  ) : (
                    <div className="wk_goal-checkbox-inner"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyTasks;
