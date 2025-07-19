import React, { useState } from "react";
import "./RadarChart.css";

export default function RadarChart({
  sides = 7,
  levels = 4,
  radius = 100,
  scores = [],
  gradientColors = {
    start: "#0FB86B",
    middle: "#7DDBA3",
    end: "#60E291",
  },
}) {
  const [isSecondChartVisible, setIsSecondChartVisible] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const centerX = 150,
    centerY = 150;
  const angleStep = (2 * Math.PI) / sides;

  const getPolygonPoints = (scale = 1) => {
    return Array.from({ length: sides }, (_, i) => {
      const angle = -Math.PI / 2 + i * angleStep;
      const x = centerX + Math.cos(angle) * radius * scale;
      const y = centerY + Math.sin(angle) * radius * scale;
      return `${x},${y}`;
    }).join(" ");
  };

  const getScorePoints = (inputScores = scores) => {
    return inputScores.map((score, i) => {
      // Always subtract 10, but ensure minimum of 5%
      const adjustedScore = Math.max(5, score - 10);
      const scale = adjustedScore / 100; // Convert to scale (0-0.8)
      const angle = -Math.PI / 2 + i * angleStep;
      const x = centerX + Math.cos(angle) * radius * scale;
      const y = centerY + Math.sin(angle) * radius * scale;
      return { x, y };
    });
  };

  const gridLevels = Array.from({ length: levels }, (_, i) => (
    <polygon
      key={i}
      points={getPolygonPoints((i + 1) / levels)}
      className={`grid-level ${i === levels - 1 ? "outer-level" : ""}`}
    />
  ));

  const radialLines = Array.from({ length: sides }, (_, i) => {
    const angle = -Math.PI / 2 + i * angleStep;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    return (
      <line
        key={i}
        x1={centerX}
        y1={centerY}
        x2={x}
        y2={y}
        className="radial-line"
      />
    );
  });

  const labels = Array.from({ length: sides }, (_, i) => {
    const angle = -Math.PI / 2 + i * angleStep;
    const circleX = centerX + Math.cos(angle) * radius;
    const circleY = centerY + Math.sin(angle) * radius;
    return (
      <g key={i} className="radar-number-circle">
        <circle cx={circleX} cy={circleY} r={8} className="vertex-circle" />
        <text x={circleX} y={circleY} className="vertex-label" dy="0.35em">
          {i + 1}
        </text>
      </g>
    );
  });

  const scorePoints = getScorePoints();
  const scorePolygonPoints = scorePoints.map((p) => `${p.x},${p.y}`).join(" ");

  // Calculate duration based on score
  const getDuration = (score) => {
    // Normalize score to 0-100 after -10 adjustment
    const adjustedScore = Math.max(5, score - 10);

    if (adjustedScore >= 70) return 0.3;
    if (adjustedScore >= 60) return 0.4;
    if (adjustedScore >= 50) return 0.5;
    if (adjustedScore >= 40) return 0.7;
    if (adjustedScore >= 30) return 0.8;
    if (adjustedScore >= 20) return 0.9;
    return 1.0;
  };

  // Calculate max duration for polygon animation
  const getMaxDuration = () => {
    return Math.max(...scores.map(getDuration));
  };
  // Add the skills data and color function at the top
  const verbalSkills = [
    { id: 1, name: "Similarity", score: 48 },
    { id: 2, name: "Consistency", score: 87 },
    { id: 3, name: "Clarity", score: 76 },
    { id: 4, name: "Cognitive demand", score: 66 },
    { id: 5, name: "Focus", score: 56 },
    { id: 6, name: "Engagement", score: 47 },
    { id: 7, name: "Time consumption", score: 36 },
  ];

  // Add mathSkills data
  const mathSkills = [
    { id: 1, name: "Algebra", score: 42 },
    { id: 2, name: "Geometry", score: 85 },
    { id: 3, name: "Calculus", score: 68 },
    { id: 4, name: "Statistics", score: 38 },
    { id: 5, name: "Linear Algebra", score: 72 },
    { id: 6, name: "Trigonometry", score: 82 },
    { id: 7, name: "Number Theory", score: 76 },
  ];

  // // Update color ranges
  // const getSkillColor = (score) => {
  //   const ranges = {
  //     exceptional: "#0FB86B", // 90-100 - Vibrant green
  //     excellent: "#1DC977", // 80-90  - Strong green
  //     great: "#2EDA85", // 70-80  - Medium green
  //     good: "#75B175", // 60-70  - Light green
  //     average: "#8E8E8E", // 50-60  - Light gray with hint of green
  //     fair: "#7A7A7A", // 40-50  - Lighter gray
  //     poor: "#666666", // Below 40 - Base gray
  //   };

  //   if (score >= 90) return ranges.exceptional;
  //   if (score >= 80) return ranges.excellent;
  //   if (score >= 70) return ranges.great;
  //   if (score >= 60) return ranges.good;
  //   if (score >= 50) return ranges.average;
  //   if (score >= 40) return ranges.fair;
  //   return ranges.poor;
  // };

  // // Update color ranges for math skills
  // const getMathSkillColor = (score) => {
  //   const ranges = {
  //     exceptional: "#c41e3a", // 90-100 - Rich crimson red
  //     excellent: "#d32f2f", // 80-90  - Bright red
  //     great: "#e53935", // 70-80  - Standard red
  //     good: "#ef5350", // 60-70  - Light red
  //     average: "#9e9e9e", // 50-60  - Medium gray with slight red tint
  //     fair: "#7d7d7d", // 40-50  - Darker gray
  //     poor: "#666666", // Below 40 - Base gray
  //   };

  //   if (score >= 90) return ranges.exceptional;
  //   if (score >= 80) return ranges.excellent;
  //   if (score >= 70) return ranges.great;
  //   if (score >= 60) return ranges.good;
  //   if (score >= 50) return ranges.average;
  //   if (score >= 40) return ranges.fair;
  //   return ranges.poor;
  // };

  const toggleChart = () => {
    setIsSecondChartVisible(!isSecondChartVisible);
    setAnimationKey((prev) => prev + 1);
  };

  return (
    <div className="radar-chart-container">
      <div className="radar-header">
        <h3>Skill Overview</h3>
        <i
          className={`fas fa-chevron-${
            isSecondChartVisible ? "left" : "right"
          }`}
          onClick={toggleChart}
        ></i>
      </div>
      <div className="charts-wrapper">
        <div className={`charts-slider ${isSecondChartVisible ? "slide" : ""}`}>
          <div className="chart-section">
            <div className="skill-section-header verbal">
              <i className="fas fa-quote-left"></i>
              Verbal Skills
            </div>
            <svg
              className="radar-chart-component"
              width={250}
              height={250}
              viewBox="25 25 250 250"
            >
              <defs>
                <radialGradient
                  id="scoreGradientVerbal"
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fx="50%"
                  fy="50%"
                  spreadMethod="pad"
                >
                  <stop offset="0%" stopColor="#456bc4" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#7a96d4" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#5c7fd0" stopOpacity="0.6" />
                </radialGradient>
              </defs>
              <g>{gridLevels}</g>
              <g>{radialLines}</g>
              <polygon
                key={`area-1-${animationKey}`}
                points={getScorePoints(verbalSkills.map((s) => s.score))
                  .map((p) => `${p.x},${p.y}`)
                  .join(" ")}
                className="score-area"
                fill="url(#scoreGradientVerbal)"
                style={{
                  "--duration": `${getMaxDuration()}s`,
                  "--delay": `${getMaxDuration()}s`,
                }}
              />
              <polygon
                key={`blend-1-${animationKey}`}
                points={getScorePoints(verbalSkills.map((s) => s.score))
                  .map((p) => `${p.x},${p.y}`)
                  .join(" ")}
                className="score-area math-blend"
                fill="#456bc4"
                fillOpacity="0.4"
                style={{
                  "--duration": `${getMaxDuration()}s`,
                  "--delay": `${getMaxDuration()}s`,
                }}
              />
              <polygon
                key={`stroke-1-${animationKey}`}
                points={getScorePoints(verbalSkills.map((s) => s.score))
                  .map((p) => `${p.x},${p.y}`)
                  .join(" ")}
                fill="none"
                stroke="#456bc4"
                strokeWidth="1"
                className="score-area"
                style={{
                  "--duration": "0.3s",
                  "--delay": `${getMaxDuration()}s`,
                }}
              />
              <g>{labels}</g>
              {getScorePoints(verbalSkills.map((s) => s.score)).map((p, i) => (
                <circle
                  key={`point-1-${i}-${animationKey}`}
                  cx={centerX}
                  cy={centerY}
                  r={2.5}
                  className="score-point"
                  fill="#456bc4"
                  style={{
                    "--target-x": p.x,
                    "--target-y": p.y,
                    "--start-x": centerX,
                    "--start-y": centerY,
                    "--duration": `${getDuration(verbalSkills[i].score)}s`,
                  }}
                />
              ))}
            </svg>
            <div className="skill-stack">
              {verbalSkills.map((skill) => (
                <div key={skill.id} className="skill-item">
                  <div className="skill-header">
                    <div className="skill-label">
                      <div className="skill-number">{skill.id}</div>
                      <div className="skill-name">{skill.name}</div>
                    </div>
                    <div
                      className="skill-score"
                      style={{
                        color: "#fff",
                      }}
                    >
                      {skill.score}%
                    </div>
                  </div>
                  <div className="skill-progress-container">
                    <div
                      className="skill-progress"
                      style={{
                        width: `${skill.score}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="chart-section">
            <div className="skill-section-header math">
              <i className="fas fa-square-root-variable"></i>
              Math Skills
            </div>
            <svg
              className="radar-chart-component"
              width={250}
              height={250}
              viewBox="25 25 250 250"
            >
              <defs>
                <radialGradient
                  id="scoreGradientMath"
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fx="50%"
                  fy="50%"
                  spreadMethod="pad"
                >
                  <stop offset="0%" stopColor="#F8F6F0" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#F5F3ED" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#F2F0EA" stopOpacity="0.7" />
                </radialGradient>
                <radialGradient
                  id="scoreGradientMathLight"
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fx="50%"
                  fy="50%"
                  spreadMethod="pad"
                >
                  <stop offset="0%" stopColor="#525050" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#3E3D3D" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#313130" stopOpacity="0.18" />
                </radialGradient>
              </defs>
              <g>{gridLevels}</g>
              <g>{radialLines}</g>
              <polygon
                key={`area-2-${animationKey}`}
                points={getScorePoints(mathSkills.map((s) => s.score))
                  .map((p) => `${p.x},${p.y}`)
                  .join(" ")}
                className="score-area math-area"
                fill="url(#scoreGradientMath)"
                style={{
                  "--duration": `${getMaxDuration()}s`,
                  "--delay": `${getMaxDuration()}s`,
                }}
              />
              <polygon
                key={`blend-2-${animationKey}`}
                points={getScorePoints(mathSkills.map((s) => s.score))
                  .map((p) => `${p.x},${p.y}`)
                  .join(" ")}
                className="score-area math-blend math-blend-fill"
                fill="#F8F6F0"
                fillOpacity="0.4"
                style={{
                  "--duration": `${getMaxDuration()}s`,
                  "--delay": `${getMaxDuration()}s`,
                }}
              />
              <polygon
                key={`stroke-2-${animationKey}`}
                points={getScorePoints(mathSkills.map((s) => s.score))
                  .map((p) => `${p.x},${p.y}`)
                  .join(" ")}
                fill="none"
                stroke="#a8a8a8"
                strokeWidth="1"
                className="score-area math-stroke"
                style={{
                  "--duration": "0.3s",
                  "--delay": `${getMaxDuration()}s`,
                }}
              />
              <g>{labels}</g>
              {getScorePoints(mathSkills.map((s) => s.score)).map((p, i) => (
                <circle
                  key={`point-2-${i}-${animationKey}`}
                  cx={centerX}
                  cy={centerY}
                  r={2.5}
                  className="score-point math-point"
                  fill="#E8E6E0"
                  style={{
                    "--target-x": p.x,
                    "--target-y": p.y,
                    "--start-x": centerX,
                    "--start-y": centerY,
                    "--duration": `${getDuration(mathSkills[i].score)}s`,
                  }}
                />
              ))}
            </svg>
            <div className="skill-stack">
              {mathSkills.map((skill) => (
                <div key={skill.id} className="skill-item">
                  <div className="skill-header">
                    <div className="skill-label">
                      <div className="skill-number">{skill.id}</div>
                      <div className="skill-name">{skill.name}</div>
                    </div>
                    <div
                      className="skill-score"
                      style={{
                        color: "#fff",
                      }}
                    >
                      {skill.score}%
                    </div>
                  </div>
                  <div className="skill-progress-container">
                    <div
                      className="skill-progress"
                      style={{
                        width: `${skill.score}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
