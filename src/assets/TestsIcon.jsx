import React from "react";

const TestsIcon = ({ isActive }) => {
  return (
    <div className="tests-icon-container" style={{ position: "relative" }}>
      {/* Top part (pen) - always white */}
      <svg
        width="19"
        height="16"
        viewBox="0 0 19 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.262 1.59468L17.5447 3.49427C17.7651 3.71386 17.8887 4.01569 17.8868 4.33031C17.885 4.64495 17.7582 4.9453 17.5353 5.16228L15.8007 7.32228L9.89734 14.6867C9.79511 14.8098 9.65757 14.8967 9.50417 14.9351L6.44338 15.6551C6.03724 15.6722 5.68701 15.366 5.64062 14.9531L5.78381 11.8655C5.79442 11.7078 5.85544 11.5581 5.9575 11.4395L11.6061 4.40147L13.5954 1.91988C13.9819 1.38196 14.709 1.24011 15.262 1.59468Z"
          stroke="white"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Bottom part (line) - white or blue depending on active state */}
      <svg
        width="19"
        height="5"
        viewBox="0 0 19 5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", top: "16px", left: "0" }}
      >
        <path
          d="M1.59116 1.5C1.10503 1.5 0.868051 1.5 0.710938 1.95429C0.710938 2.45151 1.10503 2.85429 1.59116 2.85429V1.5ZM17.6698 2.85429C18.1559 2.85429 18.4724 2.5 18.4724 2C18.4724 1.5 18.1559 1.5 17.6698 1.5V2.85429ZM1.59116 2.85429H9.63048H17.6698V1.5H1.59116V2.85429Z"
          fill={isActive ? "#456bc4" : "white"}
        />
      </svg>
    </div>
  );
};

export default TestsIcon;
