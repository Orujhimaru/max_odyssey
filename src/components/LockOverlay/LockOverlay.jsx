import React from "react";
import "./LockOverlay.css";

const LockOverlay = () => {
  return (
    <div className="lock-overlay">
      <div className="lock-content">
        <svg
          className="lock-icon"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <span className="lock-text">Coming Soon</span>
      </div>
    </div>
  );
};

export default LockOverlay;
