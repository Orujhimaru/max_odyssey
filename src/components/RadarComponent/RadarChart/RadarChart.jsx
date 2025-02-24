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

  const getScorePoints = () => {
    return scores.map((score, i) => {
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
  const skills = [
    { id: 1, name: "Similarity", score: 98 },
    { id: 2, name: "Consistency", score: 87 },
    { id: 3, name: "Clarity", score: 76 },
    { id: 4, name: "Cognitive demand", score: 66 },
    { id: 5, name: "Focus", score: 56 },
    { id: 6, name: "Engagement", score: 47 },
    { id: 7, name: "Time consumption", score: 16 },
  ];

  // Add mathSkills data
  const mathSkills = [
    { id: 1, name: "Algebra", score: 92 },
    { id: 2, name: "Geometry", score: 85 },
    { id: 3, name: "Calculus", score: 78 },
    { id: 4, name: "Statistics", score: 88 },
    { id: 5, name: "Linear Algebra", score: 72 },
    { id: 6, name: "Trigonometry", score: 82 },
    { id: 7, name: "Number Theory", score: 76 },
  ];

  // Update color ranges
  const getSkillColor = (score) => {
    const ranges = {
      exceptional: "#0DB869", // Verbal - Green
      good: "#75b175",
      average: "#A9A9A9",
      poor: "#666666", // Changed to dark gray
    };

    if (score >= 80) return ranges.exceptional;
    if (score >= 60) return ranges.good;
    if (score >= 40) return ranges.average;
    return ranges.poor;
  };

  // Update color ranges for math skills
  const getMathSkillColor = (score) => {
    const ranges = {
      exceptional: "#b71c1c", // Dark cherry red
      good: "#e53935", // Cherry red
      average: "#ef5350", // Lighter red
      poor: "#666666", // Dark gray
    };

    if (score >= 80) return ranges.exceptional;
    if (score >= 60) return ranges.good;
    if (score >= 40) return ranges.average;
    return ranges.poor;
  };

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
            <svg
              className="radar-chart-component"
              width={250}
              height={250}
              viewBox="25 25 250 250"
            >
              {/* Update gradient definitions */}
              <defs>
                <radialGradient
                  id="scoreGradient"
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fx="50%"
                  fy="50%"
                  spreadMethod="pad"
                >
                  <stop
                    offset="0%"
                    stopColor={gradientColors.start}
                    stopOpacity="0.6"
                  />
                  <stop
                    offset="50%"
                    stopColor={gradientColors.middle}
                    stopOpacity="0.5"
                  />
                  <stop
                    offset="100%"
                    stopColor={gradientColors.end}
                    stopOpacity="0.4"
                  />
                </radialGradient>
                <radialGradient
                  id="scoreGradientDark"
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fx="50%"
                  fy="50%"
                  spreadMethod="pad"
                >
                  <stop
                    offset="0%"
                    stopColor={gradientColors.start}
                    stopOpacity="0.2"
                  />
                  <stop
                    offset="50%"
                    stopColor={gradientColors.middle}
                    stopOpacity="0.3"
                  />
                  <stop
                    offset="100%"
                    stopColor={gradientColors.end}
                    stopOpacity="0.2"
                  />
                </radialGradient>
              </defs>

              {/* Background grid (lighter color) */}
              <g>{gridLevels}</g>
              <g>{radialLines}</g>

              {/* Single polygon with gradient */}
              <polygon
                key={`area-1-${animationKey}`}
                points={scorePolygonPoints}
                className="score-area"
                fill="url(#scoreGradient)"
                style={{
                  "--duration": `${getMaxDuration()}s`,
                  "--delay": `${getMaxDuration()}s`,
                }}
              />

              {/* Blend mode layer */}
              <polygon
                key={`blend-1-${animationKey}`}
                points={scorePolygonPoints}
                className="score-area"
                fill="#0FB86B"
                fillOpacity="0.4"
                style={{
                  "--duration": `${getMaxDuration()}s`,
                  "--delay": `${getMaxDuration()}s`,
                  mixBlendMode: "color-burn",
                }}
              />

              {/* Update polygon stroke color */}
              <polygon
                points={scorePolygonPoints}
                fill="none"
                stroke={gradientColors.start}
                strokeWidth="1"
                className="score-area"
                style={{
                  "--duration": "0.3s",
                  "--delay": `${getMaxDuration()}s`,
                }}
              />

              <g>{labels}</g>
              {scorePoints.map((p, i) => {
                const score = scores[i];
                const duration = getDuration(score);

                const style = {
                  "--target-x": `${p.x}px`,
                  "--target-y": `${p.y}px`,
                  "--start-x": `${centerX}px`,
                  "--start-y": `${centerY}px`,
                  "--duration": `${duration}s`,
                };
                return (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={2.5}
                    className="score-point"
                    fill={gradientColors.start}
                    style={style}
                  />
                );
              })}
            </svg>
            <div className="skill-stack">
              {skills.map((skill) => (
                <div key={skill.id} className="skill-item">
                  <div className="skill-header">
                    <div className="skill-label">
                      <div className="skill-number">{skill.id}</div>
                      <div className="skill-name">{skill.name}</div>
                    </div>
                    <div
                      className="skill-score"
                      style={{
                        backgroundColor: getSkillColor(skill.score),
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
            <svg
              className="radar-chart-component"
              width={250}
              height={250}
              viewBox="25 25 250 250"
            >
              {/* Update gradient definitions */}
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
                  <stop offset="0%" stopColor="#e53935" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#ef5350" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#ef9a9a" stopOpacity="0.4" />
                </radialGradient>
              </defs>

              {/* Background grid */}
              <g>{gridLevels}</g>
              <g>{radialLines}</g>

              {/* Math skills polygon */}
              <polygon
                key={`area-2-${animationKey}`}
                points={getScorePoints(mathSkills.map((s) => s.score))
                  .map((p) => `${p.x},${p.y}`)
                  .join(" ")}
                className="score-area"
                fill="url(#scoreGradientMath)"
                style={{
                  "--duration": `${getMaxDuration()}s`,
                  "--delay": `${getMaxDuration()}s`,
                }}
              />

              {/* Add blend mode layer */}
              <polygon
                key={`blend-2-${animationKey}`}
                points={getScorePoints(mathSkills.map((s) => s.score))
                  .map((p) => `${p.x},${p.y}`)
                  .join(" ")}
                className="score-area"
                fill="#e53935"
                fillOpacity="0.4"
                style={{
                  "--duration": `${getMaxDuration()}s`,
                  "--delay": `${getMaxDuration()}s`,
                  mixBlendMode: "color-burn",
                }}
              />

              {/* Update polygon stroke */}
              <polygon
                points={getScorePoints(mathSkills.map((s) => s.score))
                  .map((p) => `${p.x},${p.y}`)
                  .join(" ")}
                fill="none"
                stroke="#b71c1c"
                strokeWidth="1"
                className="score-area"
                style={{
                  "--duration": "0.3s",
                  "--delay": `${getMaxDuration()}s`,
                }}
              />

              {/* Labels */}
              <g>{labels}</g>

              {/* Update score points color */}
              {getScorePoints(mathSkills.map((s) => s.score)).map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={2.5}
                  className="score-point"
                  fill="#b71c1c"
                  style={{
                    "--target-x": `${p.x}px`,
                    "--target-y": `${p.y}px`,
                    "--start-x": `${centerX}px`,
                    "--start-y": `${centerY}px`,
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
                        backgroundColor: getMathSkillColor(skill.score),
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
