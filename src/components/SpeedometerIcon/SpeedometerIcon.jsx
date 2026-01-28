import React from "react";
import "./SpeedometerIcon.css";
import speedometerBg from "../../assets/spedometer_bg.svg";
import speedometerColors from "../../assets/spedometer_colors.svg";

// ========== POSITIONING CONSTANTS - UPDATED ==========
const COLORS_POSITION = {
  x: 13,
  y: 14,
  width: 173,
  height: 85,
};

const BG_POSITION = {
  x: 30,
  y: 29,
  width: 140,
  height: 71,
};

const TICK_MARKS = {
  centerX: 100,
  centerY: 97,
  rotation: -90,            // Reset to 0 for simpler math
  outerRadius: 68,
  innerRadiusLarge: 60,
  innerRadiusSmall: 64,
  strokeWidthLarge: 1.5,
  strokeWidthSmall: 0.8,
  color: "#a2a3a5ff",
};

const NEEDLE = {
  centerX: 102,           // Aligned with TICK_MARKS.centerX
  centerY: 91.5,            // Aligned with TICK_MARKS.centerY
  length: 65,             // Length reaching towards the ticks
  baseWidth: 8,
  tipWidth: 2,
  color: "#ffffff",
};
// =====================================================

const SpeedometerIcon = React.memo(({ ratio, avgTime, targetTime }) => {
  // Start at -90 degrees (far left / blue start)
  const [currentAngle, setCurrentAngle] = React.useState(-90);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const firstRender = React.useRef(true);

  React.useEffect(() => {
    // Logic: -90deg is far left, 0deg is top center, 90deg is far right
    let targetAngle;
    if (ratio <= 0.8) {
      // Blue section: maps 0.0-0.8 to -90 to -30 degrees
      targetAngle = -90 + (ratio / 0.8) * 60;
    } else if (ratio <= 1.0) {
      // Orange section: maps 0.8-1.0 to -30 to 0 degrees
      targetAngle = -30 + ((ratio - 0.8) / 0.2) * 30;
    } else {
      // Red section: maps 1.0-2.0+ to 0 to 90 degrees
      targetAngle = Math.min((ratio - 1.0) * 90, 90);
    }

    if (firstRender.current) {
      firstRender.current = false;
      // Trigger animation after initial mount
      setTimeout(() => {
        setIsAnimating(true);
        setCurrentAngle(targetAngle);
      }, 50);
    } else {
      setIsAnimating(true);
      setCurrentAngle(targetAngle);
    }
  }, [ratio]);

  // Generate tick marks
  const createTickMarks = () => {
    const ticks = [];
    for (let i = 0; i <= 36; i++) {
      const angle = -90 + (i * 5) + TICK_MARKS.rotation;
      const radian = (angle * Math.PI) / 180;
      const isLargeTick = i % 6 === 0;
      const outerRadius = TICK_MARKS.outerRadius;
      const innerRadius = isLargeTick ? TICK_MARKS.innerRadiusLarge : TICK_MARKS.innerRadiusSmall;

      const x1 = TICK_MARKS.centerX + innerRadius * Math.cos(radian);
      const y1 = TICK_MARKS.centerY + innerRadius * Math.sin(radian);
      const x2 = TICK_MARKS.centerX + outerRadius * Math.cos(radian);
      const y2 = TICK_MARKS.centerY + outerRadius * Math.sin(radian);

      ticks.push(
        <line
          key={`tick-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={TICK_MARKS.color}
          strokeWidth={isLargeTick ? TICK_MARKS.strokeWidthLarge : TICK_MARKS.strokeWidthSmall}
        />
      );
    }
    return ticks;
  };

  // Format time helper
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <svg viewBox="0 0 200 120" className="speedometer-icon">
      {/* Custom color segments from SVG file */}
      <image
        href={speedometerColors}
        x={COLORS_POSITION.x}
        y={COLORS_POSITION.y}
        width={COLORS_POSITION.width}
        height={COLORS_POSITION.height}
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Custom background from SVG file */}
      <image
        href={speedometerBg}
        x={BG_POSITION.x}
        y={BG_POSITION.y}
        width={BG_POSITION.width}
        height={BG_POSITION.height}
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Tick marks */}
      {createTickMarks()}

      {/* Needle Group */}
      <g
        className={`speedometer-needle-group ${isAnimating ? "animating" : ""}`}
        style={{
          transform: `rotate(${currentAngle}deg)`,
          transformOrigin: `${NEEDLE.centerX}px ${NEEDLE.centerY}px`
        }}
      >
        {/* Needle shape: Drawn pointing straight up so rotation math is simple */}
        <polygon
          points={`
            ${NEEDLE.centerX - NEEDLE.baseWidth / 2},${NEEDLE.centerY}
            ${NEEDLE.centerX + NEEDLE.baseWidth / 2},${NEEDLE.centerY}
            ${NEEDLE.centerX + NEEDLE.tipWidth / 2},${NEEDLE.centerY - NEEDLE.length}
            ${NEEDLE.centerX - NEEDLE.tipWidth / 2},${NEEDLE.centerY - NEEDLE.length}
          `}
          fill={NEEDLE.color}
        />

      </g>
    </svg>
  );
});

SpeedometerIcon.displayName = "SpeedometerIcon";

export default SpeedometerIcon;
