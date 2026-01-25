import React from "react";
import "./WeeklyTasks.css";
import targetIcon from "../../assets/target.svg";
import flamesIcon from "../../assets/flames.png";

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
        <img src={flamesIcon} alt="flames" className="wk_streak-flame" />
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
