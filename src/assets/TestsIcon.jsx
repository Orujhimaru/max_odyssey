import React from "react";

const TestsIcon = ({ isActive }) => {
  return (
    <div className="tests-icon-container" style={{ position: "relative" }}>
      {/* Top part (pen) - always white, scaled up */}
      <svg
        width="17"
        height="19"
        viewBox="0 0 17 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "relative",
          left: "3.2px",
          bottom: "2px",
          scale: "1.2",
        }}
      >
        <path
          d="M9.81592 2.29541C10.4718 1.42487 11.6483 1.15093 12.6099 1.64209L12.8022 1.75244L12.9019 1.82568L15.1851 3.72607L15.2505 3.78564C15.6625 4.19612 15.8892 4.75571 15.8862 5.33447L15.8872 5.33545C15.8842 5.8763 15.6781 6.39676 15.311 6.79443L13.5806 8.94678L13.5815 8.94775L7.67822 16.312C7.67464 16.3165 7.67114 16.3213 7.66748 16.3257C7.46066 16.5748 7.18865 16.762 6.88135 16.8657L6.74756 16.9048C6.74301 16.9059 6.73845 16.9076 6.73389 16.9087L3.67334 17.6284C3.61203 17.6428 3.54877 17.6511 3.48584 17.6538C2.59585 17.6913 1.84893 17.0672 1.67432 16.2339L1.64697 16.0649C1.64108 16.0125 1.63965 15.9594 1.64209 15.9067L1.78564 12.8188L1.78662 12.7983C1.81086 12.4382 1.94791 12.0938 2.1792 11.814H2.17822L7.82666 4.77588L9.81592 2.29443V2.29541Z"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M14 7.5C12 6.7 10.1667 4.83333 9.5 4L8 5.5C8.8 7.5 11.3333 8.66667 12.5 9L14 7.5Z"
          fill="white"
        />
      </svg>

      {/* Bottom part (line) - white or blue depending on active state */}
      <svg
        width="24"
        height="4"
        viewBox="0 0 24 4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          top: "24px",
          left: "-4px",
          borderRadius: "2px",
        }}
      >
        <rect
          width="24"
          height="4"
          rx="1.5"
          fill={isActive ? "#456bc4" : "white"}
        />
      </svg>
    </div>
  );
};

export default TestsIcon;
