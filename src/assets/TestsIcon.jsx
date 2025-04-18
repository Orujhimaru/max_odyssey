import React from "react";

const TestsIcon = ({ isActive }) => {
  return (
    <div className="tests-icon-container" style={{ position: "relative" }}>
      {/* Top part (pen) - always white, scaled up */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: "scale(1.18)",
          transformOrigin: "center",
          position: "relative",
          top: "-1px",
        }}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.2629 1.59468L16.5456 3.49427C16.7661 3.71386 16.8896 4.01569 16.8878 4.33031C16.886 4.64495 16.7591 4.9453 16.5363 5.16228L14.8016 7.32228L8.89831 14.6867C8.79609 14.8098 8.65854 14.8967 8.50515 14.9351L5.44436 15.6551C5.03822 15.6722 4.68798 15.366 4.6416 14.9531L4.78478 11.8655C4.79539 11.7078 4.85642 11.5581 4.95848 11.4395L10.6071 4.40147L12.5964 1.91988C12.9829 1.38196 13.7099 1.24011 14.2629 1.59468Z"
          stroke="white"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.4982 3.885C11.4978 3.92413 11.5091 4.00055 11.56 4.12948C11.7563 4.62704 12.1785 5.36062 12.7662 5.89501C13.3385 6.41534 13.99 6.68711 14.7443 6.51288C15.1149 6.42726 15.0129 6.61052 15.0018 6.92615L15.1841 7.21879C15.6468 7.1119 15.1579 7.67535 15.0345 7.25202C13.666 7.54342 13.0512 7.31134 12.2301 6.56476C11.3951 5.80556 11.0362 5.25653 10.7631 4.56489C10.5812 4.10398 10.8013 4.25081 11.2521 4.06476C11.4169 3.99674 11.478 3.92549 11.4982 3.885C11.5177 3.84573 11.4986 3.8354 11.4982 3.885Z"
          fill="white"
        />
      </svg>

      {/* Bottom part (line) - white or blue depending on active state */}
      <svg
        width="20"
        height="3"
        viewBox="0 0 20 3"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          top: "22px",
          left: "-1px",
          borderRadius: "2px",
        }}
      >
        <rect
          width="20"
          height="3"
          rx="1.5"
          fill={isActive ? "#456bc4" : "white"}
        />
      </svg>
    </div>
  );
};

export default TestsIcon;
