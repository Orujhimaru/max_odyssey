import React from "react";

const SpeedometerIcon = React.memo(({ ratio }) => {
  const [currentAngle, setCurrentAngle] = React.useState(-180);
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

    // Start from leftmost position (-180 degrees)
    setCurrentAngle(-180);

    // Animate to final position after a brief delay
    const timer = setTimeout(() => {
      setCurrentAngle(targetAngle);
    }, 200);

    return () => clearTimeout(timer);
  }, [ratio]);

  // Generate tick marks
  const createTickMarks = () => {
    const ticks = [];
    for (let i = 0; i <= 180; i += 5) {
      const isLargeTick = i % 15 === 0;
      const angle = i - 180;
      const radian = (angle * Math.PI) / 180;
      // Make ticks more delicate by adjusting their length
      const outerRadius = 36;
      const innerRadius = isLargeTick ? 34 : 35; // Shorter difference between inner and outer radius

      const x1 = 50 + innerRadius * Math.cos(radian);
      const y1 = 50 + innerRadius * Math.sin(radian);
      const x2 = 50 + outerRadius * Math.cos(radian);
      const y2 = 50 + outerRadius * Math.sin(radian);

      ticks.push(
        <line
          key={`tick-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="white"
          strokeWidth={isLargeTick ? 0.5 : 0.3} // Much thinner lines
        />
      );
    }
    return ticks;
  };

  // Generate the segmented blocks around the perimeter
  const createSegments = () => {
    const segments = [];
    const segmentCount = 12; // Reduced count for wider segments
    const segmentAngle = 180 / segmentCount;
    const outerRadius = 52; // Increased outer radius for wider rectangles
    const innerRadius = 46; // Increased inner radius but keeping the height difference smaller

    for (let i = 0; i < segmentCount; i++) {
      // Calculate color based on position
      let color;
      if (i < segmentCount * 0.6) {
        color = "#2563EB"; // Blue for first 60%
      } else if (i < segmentCount * 0.8) {
        color = "#7C3AED"; // Purple for next 20%
      } else {
        color = "#EF4444"; // Red for last 20%
      }

      const startAngle = -180 + i * segmentAngle;
      const endAngle = startAngle + segmentAngle * 0.85; // Wider segments

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = 50 + innerRadius * Math.cos(startRad);
      const y1 = 50 + innerRadius * Math.sin(startRad);
      const x2 = 50 + outerRadius * Math.cos(startRad);
      const y2 = 50 + outerRadius * Math.sin(startRad);
      const x3 = 50 + outerRadius * Math.cos(endRad);
      const y3 = 50 + outerRadius * Math.sin(endRad);
      const x4 = 50 + innerRadius * Math.cos(endRad);
      const y4 = 50 + innerRadius * Math.sin(endRad);

      const path = `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4} Z`;

      segments.push(<path key={`segment-${i}`} d={path} fill={color} />);
    }
    return segments;
  };

  return (
    <svg viewBox="0 0 100 56" className="speedometer-icon">
      {/* Complete semicircle background with the bottom part filled - shorter at bottom */}
      <path
        d="M 10 50 A 40 40 0 0 1 90 50 L 90 47 A 3 3 0 0 1 87 50 L 13 50 A 3 3 0 0 1 10 47 Z"
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
        transform={`rotate(${currentAngle + 90}, 50, 50)`}
        className="speedometer-needle-group"
      >
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="20"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle
          cx="50"
          cy="50"
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
