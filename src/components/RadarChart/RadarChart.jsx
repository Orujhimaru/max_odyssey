import React from "react";
import "./RadarChart.css";

const RadarChart = ({ sides = 7, levels = 7, radius = 100, scores = [] }) => {
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
      const scale = (score - 1) % levels; // User's approach
      const angle = -Math.PI / 2 + i * angleStep;
      const x = centerX + (Math.cos(angle) * radius * scale) / levels;
      const y = centerY + (Math.sin(angle) * radius * scale) / levels;
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

  return (
    <svg
      className="radar-chart-component"
      width={300}
      height={300}
      viewBox="0 0 300 300"
    >
      {/* Background grid (lighter color) */}
      <g>{gridLevels}</g>
      <g>{radialLines}</g>

      {/* Polygon area */}
      <polygon
        points={scorePolygonPoints}
        className="score-area"
        fill="#D5FFE5"
        fillOpacity="0.5"
        stroke="#0FB86B"
        strokeWidth="1"
      />

      {/* Overlay grid (darker inside polygon) */}
      <clipPath id="polygonClip">
        <polygon points={scorePolygonPoints} />
      </clipPath>
      <g clipPath="url(#polygonClip)">
        {Array.from({ length: levels }, (_, i) => (
          <polygon
            key={i}
            points={getPolygonPoints((i + 1) / levels)}
            className="grid-level-inner"
          />
        ))}
        {Array.from({ length: sides }, (_, i) => {
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
              className="radial-line-inner"
            />
          );
        })}
      </g>

      <g>{labels}</g>
      {scorePoints.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={2.5}
          className="score-point"
          fill="#0FB86B"
        />
      ))}
    </svg>
  );
};

export default RadarChart;
