import React, { useState, useEffect } from "react";
import "./MasteryRingCard.css";

const MasteryRingCard = ({ topic, data, icon, isExpanded, onToggle }) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const percentage = data.avgMastery.percentage;

  useEffect(() => {
    setIsAnimating(true);
    const duration = 1000;
    const steps = 60;
    const stepValue = percentage / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setAnimatedPercentage(percentage);
        clearInterval(timer);
        setIsAnimating(false);
      } else {
        setAnimatedPercentage(Math.round(currentStep * stepValue));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [percentage]);

  const getColorClass = (percent) => {
    if (percent >= 90) return "excellent";
    if (percent >= 75) return "good";
    if (percent >= 60) return "okay";
    return "needs-work";
  };

  const getScoreIcon = (percent) => {
    if (percent >= 90) return "✓"; // Checkmark
    if (percent >= 75) return "✓"; 
    if (percent >= 60) return "?";
    return "!";
  };

  const colorClass = getColorClass(percentage);
  const scoreIcon = getScoreIcon(percentage);

  // Calculate SVG circle properties
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  return (
    <div className={`mastery-ring-card ${colorClass} ${isExpanded ? "expanded" : ""}`}>
      <div className="ring-card-main" onClick={onToggle}>
        {/* Icon Header */}
        <div className="ring-card-header">
          <span className="ring-card-icon">{icon}</span>
          <h3 className="ring-card-title">{topic}</h3>
        </div>

        {/* Circular Progress Ring */}
        <div className="ring-container">
          <svg className="progress-ring" width="180" height="180" viewBox="0 0 180 180">
            {/* Background Circle */}
            <circle
              className="ring-background"
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              strokeWidth="12"
            />
            
            {/* Progress Circle */}
            <circle
              className={`ring-progress ${isAnimating ? "animating" : ""}`}
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 90 90)"
            />

            {/* Center Icon Background */}
            <circle
              className="ring-icon-bg"
              cx="90"
              cy="90"
              r="40"
              fill="currentColor"
              opacity="0.1"
            />
          </svg>

          {/* Center Content */}
          <div className="ring-center-content">
            <div className="ring-score-icon">{scoreIcon}</div>
            <div className="ring-percentage">{animatedPercentage}%</div>
          </div>
        </div>

        {/* Stats */}
        <div className="ring-stats">
          <div className={`improvement-badge ${data.avgImprovement.includes("+") ? "positive" : "negative"}`}>
            {data.avgImprovement.includes("+") ? "↗" : "↘"} {data.avgImprovement}
          </div>
          <div className="question-count">{data.avgMastery.text.match(/\((.+)\)/)?.[1] || ""}</div>
        </div>

        {/* Expand Indicator */}
        <div className="expand-indicator">
          <i className={`fas fa-chevron-${isExpanded ? "up" : "down"}`}></i>
        </div>
      </div>

      {/* Expanded Subtopics */}
      <div className="ring-subtopics">
        <div className="subtopics-list">
          {data.subtopics.map((subtopic, index) => (
            <div 
              key={index} 
              className="subtopic-item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="subtopic-info">
                <span className="subtopic-name">{subtopic.name}</span>
                <span className="subtopic-percentage">{subtopic.masteryPercentage}%</span>
              </div>
              <div className="subtopic-bar-container">
                <div 
                  className="subtopic-bar"
                  style={{ 
                    width: isExpanded ? `${subtopic.masteryPercentage}%` : "0%",
                    transitionDelay: `${index * 0.1}s`
                  }}
                />
              </div>
              <div className="subtopic-count">
                {subtopic.masteryText.match(/\((.+)\)/)?.[1] || ""}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MasteryRingCard;












