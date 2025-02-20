import React from "react";
import "./RadarChart.css";

export default function RadarChart({
  sides = 7,
  levels = 4,
  radius = 100,
  scores = [],
}) {
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
    { id: 2, name: "Consistency", score: 57 },
    { id: 3, name: "Clarity", score: 46 },
    { id: 4, name: "Cognitive demand", score: 72 },
    { id: 5, name: "Focus", score: 42 },
    { id: 6, name: "Engagement", score: 77 },
    { id: 7, name: "Time consumption", score: 1 },
  ];

  const getSkillColor = (score) => {
    // Define 10 color ranges from high to low
    const ranges = {
      perfect: "#22C55E", // 95-100 Bright green
      excellent: "#0FB86B", // 85-94  Original green
      great: "#15803D", // 75-84  Dark green
      good: "#84CC16", // 65-74  Lime green
      above: "#F59E0B", // 55-64  Amber
      average: "#F97316", // 45-54  Orange
      below: "#FB923C", // 35-44  Light orange
      poor: "#DC2626", // 25-34  Bright red
      bad: "#B91C1C", // 15-24  Dark red
      critical: "#7F1D1D", // 0-14   Deep red
    };

    // Return specific color based on score range
    if (score >= 95) return ranges.perfect;
    if (score >= 85) return ranges.excellent;
    if (score >= 75) return ranges.great;
    if (score >= 65) return ranges.good;
    if (score >= 55) return ranges.above;
    if (score >= 45) return ranges.average;
    if (score >= 35) return ranges.below;
    if (score >= 25) return ranges.poor;
    if (score >= 15) return ranges.bad;
    return ranges.critical;
  };

  return (
    <div className="radar-chart-container">
      <svg
        className="radar-chart-component"
        width={300}
        height={300}
        viewBox="0 0 300 300"
      >
        {/* Define the gradient */}
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
            <stop offset="0%" stopColor="#0FB86B" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#7DDBA3" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#60E291" stopOpacity="0.4" />
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
            <stop offset="0%" stopColor="#0FB86B" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#7DDBA3" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#60E291" stopOpacity="0.2" />
          </radialGradient>
        </defs>

        {/* Background grid (lighter color) */}
        <g>{gridLevels}</g>
        <g>{radialLines}</g>

        {/* Single polygon with gradient */}
        <polygon
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

        {/* Outer line of the polygon */}
        <polygon
          points={scorePolygonPoints}
          fill="none"
          stroke="#0FB86B"
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
              fill="#0FB86B"
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
                  color: "#fff", // White text for better contrast
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
                  backgroundColor: getSkillColor(skill.score),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
