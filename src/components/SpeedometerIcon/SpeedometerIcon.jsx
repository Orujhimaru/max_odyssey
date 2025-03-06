import React from "react";

const SpeedometerIcon = React.memo(({ ratio }) => {
  const [currentAngle, setCurrentAngle] = React.useState(-180);
  const firstRender = React.useRef(true);
  const prevRatio = React.useRef(ratio);

  React.useEffect(() => {
    // Calculate target angle
    const actualTime = ratio;
    const MAX_TIME = 120;
    const normalizedTime = Math.min(actualTime, MAX_TIME);
    const targetAngle = -180 + (normalizedTime / MAX_TIME) * 180;

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

  return (
    <svg viewBox="0 0 100 60" className="speedometer-icon">
      {/* Background arc */}
      <path
        d="M 10 50 A 40 40 0 0 1 90 50"
        className="speedometer-bg"
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Colored sections - perfect half circles */}
      <path
        d="M 10 49 A 40 40 0 0 1 37 19"
        className="speed-section fast"
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M 37 19 A 40 40 0 0 1 63 19"
        className="speed-section okay"
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M 63 19 A 40 40 0 0 1 90 49"
        className="speed-section slow"
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Needle */}
      <g
        transform={`rotate(${currentAngle + 90}, 50, 50)`}
        className="speedometer-needle-group"
      >
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="15"
          strokeWidth="2"
          className="speedometer-needle"
        />
        <circle cx="50" cy="50" r="3" className="speedometer-center" />
      </g>
    </svg>
  );
});

SpeedometerIcon.displayName = "SpeedometerIcon";

export default SpeedometerIcon;
