import React, { useState, useEffect } from "react";
import "./WeeklyTasks.css";
import flamesIcon from "../../assets/flames.png";

const WeeklyTasks = () => {
  // Sample data
  const streakDays = 26;
  const [displayStreak, setDisplayStreak] = useState(0);

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
      <div className="wk_daily-goal-card">
        <div className="wk_daily-goal-header">
          {/* Target Icon */}
          <svg className="wk_target-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#5b8dee" strokeWidth="2" />
            <circle cx="12" cy="12" r="6" stroke="#5b8dee" strokeWidth="2" />
            <circle cx="12" cy="12" r="2" fill="#5b8dee" />
          </svg>
          <h3 className="wk_daily-goal-title">Daily Goals</h3>

          {/* Info Icon with Tooltip */}
          <div className="wk_info-wrapper">
            <svg className="wk_info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>

            {/* Tooltip */}
            <div className="wk_tooltip">
              <div className="wk_tooltip-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="wk_tooltip-text">
                  <span className="wk_tooltip-label">TESTS</span>
                  <span className="wk_tooltip-desc">Complete one short/full test</span>
                </div>
              </div>
              <div className="wk_tooltip-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#3b82f6" strokeWidth="2" fill="none" />
                  <circle cx="12" cy="12" r="6" stroke="#3b82f6" strokeWidth="2" fill="none" />
                  <circle cx="12" cy="12" r="2" fill="#3b82f6" />
                </svg>
                <div className="wk_tooltip-text">
                  <span className="wk_tooltip-label">PRACTICES</span>
                  <span className="wk_tooltip-desc">Work on one of your weaknesses</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="wk_daily-goal-content">
          {/* Nested Concentric Progress Rings */}
          <div className="wk_nested-rings">
            <svg className="wk_rings-svg" viewBox="0 0 120 120">
              {/* Dark background circle for depth */}
              <circle
                className="wk_ring-center-bg"
                cx="60"
                cy="60"
                r="48"
              />

              {/* Outer Ring Background */}
              <circle
                className="wk_ring-bg-outer"
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
                className="wk_ring-bg-inner"
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="wk_challenge-progress">{testsCompleted}/{testsTarget}</span>
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="#3b82f6" strokeWidth="2" fill="none" />
                    <circle cx="12" cy="12" r="5" stroke="#3b82f6" strokeWidth="2" fill="none" />
                    <circle cx="12" cy="12" r="1.5" fill="#3b82f6" />
                  </svg>
                )}
              </div>
              <span className="wk_challenge-progress">{practicesCompleted}/{practicesTarget}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyTasks;
