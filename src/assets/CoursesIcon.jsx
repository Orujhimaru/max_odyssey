import React from "react";

const CoursesIcon = ({ isActive }) => {
  return (
    <div className="courses-icon-container" style={{ position: "relative" }}>
      {/* Book icon - scaled up */}
      <svg
        width="14"
        height="16"
        viewBox="0 0 14 16"
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
          d="M3 0.700195H13.2998V15.2998H4C2.17746 15.2998 0.700195 13.8225 0.700195 12V3C0.700195 1.72975 1.72975 0.700195 3 0.700195Z"
          stroke="white"
          strokeWidth="1.4"
        />
        <path
          d="M0.789062 11.7002H13.2998V15.2998H4.21094C2.27213 15.2998 0.700195 13.7279 0.700195 11.7891C0.700417 11.74 0.739974 11.7004 0.789062 11.7002Z"
          stroke="white"
          strokeWidth="1.4"
        />
      </svg>

      {/* Bottom indicator line - for active state */}
      {isActive && (
        <svg
          width="20"
          height="3"
          viewBox="0 0 20 3"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            top: "24px",
            left: "-3px",
            borderRadius: "2px",
          }}
        >
          <rect width="20" height="3" rx="1.5" fill="#456bc4" />
        </svg>
      )}
    </div>
  );
};

export default CoursesIcon;
