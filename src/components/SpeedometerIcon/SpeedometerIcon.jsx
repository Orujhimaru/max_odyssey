import React from "react";
import "./SpeedometerIcon.css";
import speedometerBg from "../../assets/spedometer_bg.svg";
import speedometerColors from "../../assets/spedometer_colors.svg";

// ========== POSITIONING CONSTANTS - ADJUST THESE VALUES ==========
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

// Tick mark (white indicator lines) positioning
const TICK_MARKS = {
  centerX: 100,           // X position of tick mark center
  centerY: 97,           // Y position of tick mark center
  rotation: -90,            // Rotation offset in degrees (positive = clockwise)
  outerRadius: 68,        // Outer edge of tick marks
  innerRadiusLarge: 60,   // Inner edge for major ticks (every 30 degrees)
  innerRadiusSmall: 64,   // Inner edge for minor ticks
  strokeWidthLarge: 1.5,  // Line thickness for major ticks
  strokeWidthSmall: 0.8,  // Line thickness for minor ticks
  color: "#a2a3a5ff",       // Tick mark color
};

// Needle positioning and design
const NEEDLE = {
  centerX: 125,           // X position of needle pivot point
  centerY: 30,            // Y position of needle pivot point (matches white circle center)
  length: 60,             // Length of the needle
  baseWidth: 6,           // Width at the base (bottom)
  tipWidth: 2,            // Width at the tip (top)
  color: "#ffffff",       // Needle color

};
// ==================================================================

const SpeedometerIcon = React.memo(({ ratio, avgTime, targetTime }) => {
  const [currentAngle, setCurrentAngle] = React.useState(-90);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const firstRender = React.useRef(true);
  const prevRatio = React.useRef(ratio);

  React.useEffect(() => {
    // Calculate target angle based on ratio
    let targetAngle;
    if (ratio <= 0.8) {
      // Blue section: -90 to -30 degrees
      targetAngle = -90 + (ratio / 0.8) * 60;
    } else if (ratio <= 1.0) {
      // Orange section: -30 to 0 degrees
      targetAngle = -30 + ((ratio - 0.8) / 0.2) * 30;
    } else {
      // Red section: 0 to 90 degrees
      targetAngle = Math.min((ratio - 1.0) * 90, 90);
    }

    // On first render, start animation from -90
    if (firstRender.current) {
      firstRender.current = false;
      // Small delay to ensure the initial state is rendered before animating
      setTimeout(() => {
        setIsAnimating(true);
        setCurrentAngle(targetAngle);
        setTimeout(() => setIsAnimating(false), 1500);
      }, 100);
      return;
    }

    // Skip if ratio hasn't changed
    if (prevRatio.current === ratio) return;
    prevRatio.current = ratio;

    // Start animation
    setIsAnimating(true);
    setCurrentAngle(targetAngle);

    // End animation after duration
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1500);

    return () => clearTimeout(timer);
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

      {/* Needle */}
      <g
        transform={`rotate(${currentAngle}, ${NEEDLE.centerX}, ${NEEDLE.centerY})`}
        className={`speedometer-needle-group ${isAnimating ? "animating" : ""}`}
      >
        {/* Main needle - tapered shape */}
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
