import React from "react";
import "./SpeedometerIcon.css";

const SpeedometerIcon = React.memo(({ ratio }) => {
  const [currentAngle, setCurrentAngle] = React.useState(-180);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const firstRender = React.useRef(true);
  const prevRatio = React.useRef(ratio);

  React.useEffect(() => {
    // Calculate target angle based on ratio to target time
    const actualTime = ratio;
    const TARGET_TIME = 80; // Reference target time
    const normalizedRatio = actualTime / TARGET_TIME; // 1.0 means on target

    // Map the ratio to an angle:
    // ratio < 0.7 (fast) -> blue section (-180 to -120)
    // ratio 0.7-1.0 (good) -> purple section (-120 to -60)
    // ratio > 1.0 (slow) -> red section (-60 to 0)
    let targetAngle;
    if (normalizedRatio <= 0.7) {
      // Fast - blue section
      targetAngle = -180 + (normalizedRatio / 0.7) * 60;
    } else if (normalizedRatio <= 1.0) {
      // On target - purple section
      targetAngle = -120 + ((normalizedRatio - 0.7) / 0.3) * 60;
    } else {
      // Slow - red section
      targetAngle = -60 + Math.min((normalizedRatio - 1.0) / 0.5, 1) * 60;
    }

    // Only animate if this is not the first render and ratio has changed
    if (firstRender.current) {
      setCurrentAngle(targetAngle);
      firstRender.current = false;
      prevRatio.current = ratio;
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
    }, 1200);

    return () => clearTimeout(timer);
  }, [ratio]);

  // Generate tick marks
  const createTickMarks = () => {
    const ticks = [];
    for (let i = 0; i <= 180; i += 5) {
      const isLargeTick = i % 15 === 0;
      const angle = i - 180;
      const radian = (angle * Math.PI) / 180;
      const outerRadius = 44; // Increased to match new background size
      const innerRadius = isLargeTick ? 42 : 43; // Keeping ticks short but moved out

      const x1 = 60 + innerRadius * Math.cos(radian);
      const y1 = 60 + innerRadius * Math.sin(radian);
      const x2 = 60 + outerRadius * Math.cos(radian);
      const y2 = 60 + outerRadius * Math.sin(radian);

      ticks.push(
        <line
          key={`tick-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="white"
          strokeWidth={isLargeTick ? 0.5 : 0.3}
        />
      );
    }
    return ticks;
  };

  // Generate the segmented blocks around the perimeter
  const createSegments = () => {
    const segments = [];
    const segmentCount = 12;
    const segmentAngle = 180 / segmentCount;
    const outerRadius = 52;
    const innerRadius = 46;
    const center = { x: 60, y: 60 };

    for (let i = 0; i < segmentCount; i++) {
      // Calculate color based on position
      let color;
      if (i < segmentCount * 0.6) {
        color = "#2563EB"; // Blue for first 60%
      } else if (i < segmentCount * 0.8) {
        color = "#EF4444"; // Purple for next 20%
      } else {
        color = "#EF4444"; // Red for last 20%
      }

      const startAngle = -180 + i * segmentAngle;
      const endAngle = startAngle + segmentAngle * 0.85;

      const startRadOuter = (startAngle * Math.PI) / 180;
      const endRadOuter = (endAngle * Math.PI) / 180;
      const startRadInner = startRadOuter;
      const endRadInner = endRadOuter;

      // Calculate points using arc paths
      const x1 = center.x + innerRadius * Math.cos(startRadInner);
      const y1 = center.y + innerRadius * Math.sin(startRadInner);
      const x2 = center.x + outerRadius * Math.cos(startRadOuter);
      const y2 = center.y + outerRadius * Math.sin(startRadOuter);
      const x3 = center.x + outerRadius * Math.cos(endRadOuter);
      const y3 = center.y + outerRadius * Math.sin(endRadOuter);
      const x4 = center.x + innerRadius * Math.cos(endRadInner);
      const y4 = center.y + innerRadius * Math.sin(endRadInner);

      // Create path with arcs for curved edges
      const path = `
        M ${x1} ${y1}
        L ${x2} ${y2}
        A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3}
        L ${x4} ${y4}
        A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}
        Z
      `;

      segments.push(<path key={`segment-${i}`} d={path} fill={color} />);
    }
    return segments;
  };

  return (
    <svg viewBox="0 0 120 70" className="speedometer-icon">
      {/* Dark semicircle background */}
      <path
        d="M 15 60 A 45 45 0 0 1 105 60"
        fill="#111827"
        stroke="#111827"
        strokeWidth="1"
      />

      {/* Segmented blocks around the perimeter */}
      {createSegments()}

      {/* Tick marks */}
      {createTickMarks()}

      {/* Needle */}
      <g
        transform={`rotate(${currentAngle + 90}, 60, 60)`}
        className={`speedometer-needle-group ${isAnimating ? "animating" : ""}`}
      >
        <line
          x1="60"
          y1="60"
          x2="60"
          y2="30"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle
          cx="60"
          cy="60"
          r="3"
          fill="#111827"
          stroke="white"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
});

SpeedometerIcon.displayName = "SpeedometerIcon";

export default SpeedometerIcon;
