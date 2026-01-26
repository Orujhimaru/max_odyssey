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

  // Two separate challenges
  const testsCompleted = 1;
  const testsTarget = 2;
  const testsProgress = (testsCompleted / testsTarget) * 100;
  const testsComplete = testsCompleted >= testsTarget;

  const practicesCompleted = 1;
  const practicesTarget = 5;
  const practicesProgress = (practicesCompleted / practicesTarget) * 100;
  const practicesComplete = practicesCompleted >= practicesTarget;

  // Overall progress
  const totalCompleted = testsCompleted + practicesCompleted;
  const totalTarget = testsTarget + practicesTarget;

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
            {/* Nested Concentric Progress Rings */}
            <div className="wk_nested-rings">
              <svg className="wk_rings-svg" viewBox="0 0 120 120">
                {/* Dark background circle for depth */}
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="#1a202c"
                />

                {/* Outer Ring Background */}
                <circle
                  className="wk_ring-bg"
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  strokeWidth="8"
                />
                {/* Outer Ring - Tests (Light Blue) */}
                <circle
                  className="wk_ring-tests"
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - testsProgress / 100)}`}
                  transform="rotate(-90 60 60)"
                  strokeLinecap="round"
                />

                {/* Inner Ring Background */}
                <circle
                  className="wk_ring-bg"
                  cx="60"
                  cy="60"
                  r="40"
                  fill="none"
                  strokeWidth="7"
                />
                {/* Inner Ring - Practices (Dark Blue) */}
                <circle
                  className="wk_ring-practices"
                  cx="60"
                  cy="60"
                  r="40"
                  fill="none"
                  strokeWidth="7"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - practicesProgress / 100)}`}
                  transform="rotate(-90 60 60)"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Task Status List with Icons */}
            <div className="wk_task-status-list">
              {/* Tests Challenge */}
              <div className="wk_challenge-item">
                <div className="wk_challenge-checkbox">
                  {testsComplete ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect width="20" height="20" rx="5" fill="#60a5fa" />
                      <path d="M15 6L8 13L5 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect width="20" height="20" rx="5" stroke="#4b5563" strokeWidth="1.5" fill="none" />
                      <path d="M10 7V13M7 10H13" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <span className="wk_challenge-progress">{testsCompleted}/{testsTarget}</span>
                <svg className="wk_challenge-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 11l3 3L22 4" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#60a5fa" strokeWidth="2" />
                </svg>
              </div>

              {/* Practices Challenge */}
              <div className="wk_challenge-item">
                <div className="wk_challenge-checkbox">
                  {practicesComplete ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect width="20" height="20" rx="5" fill="#3b82f6" />
                      <path d="M15 6L8 13L5 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect width="20" height="20" rx="5" stroke="#4b5563" strokeWidth="1.5" fill="none" />
                      <path d="M10 7V13M7 10H13" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <span className="wk_challenge-progress">{practicesCompleted}/{practicesTarget}</span>
                <svg className="wk_challenge-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="#3b82f6" strokeWidth="2" />
                </svg>
              </div>
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
