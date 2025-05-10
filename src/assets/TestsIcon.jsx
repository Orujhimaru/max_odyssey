import React from "react";

const TestsIcon = ({ isActive }) => {
  return (
    <div className="tests-icon-container" style={{ position: "relative" }}>
      {/* Top part (pen) - always white, scaled up */}
      <svg
        width="16"
        height="19"
        viewBox="0 0 16 19"
        fill="none"
        style={{
          position: "relative",
          scale: "1.35",
          top: "4px",
          left: "2px",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.01025 2.45068C9.5928 1.67186 10.6412 1.42856 11.4966 1.86572L11.6675 1.96338L11.7427 2.01807L14.0249 3.91748L14.0747 3.96338L14.2036 4.10498C14.4458 4.40068 14.5928 4.76296 14.6284 5.14307L14.6372 5.33447C14.6345 5.82087 14.4465 6.28778 14.1128 6.64111L12.3862 8.7915L6.48291 16.1558L6.4751 16.1655C6.2723 16.4098 5.99691 16.585 5.68701 16.6626L5.67627 16.6655L2.61572 17.3853C2.56974 17.3961 2.52229 17.4028 2.4751 17.4048C1.71269 17.4368 1.0701 16.9012 0.919434 16.1831L0.895996 16.0366C0.891596 15.9974 0.890268 15.9579 0.89209 15.9185L1.03467 12.8306L1.03564 12.8149C1.05705 12.4972 1.18047 12.1935 1.38916 11.9507L7.021 4.93213L9.01025 2.45068Z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13 7.5C11 6.7 9.16667 4.83333 8.5 4L7.5 5C8.3 7 10.8333 8.16667 12 8.5L13 7.5Z"
          fill="white"
        />
      </svg>

      {/* Bottom part (line) - white or blue depending on active state */}
      {/* <svg
        width="24"
        height="4"
        viewBox="0 0 24 4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          top: "24px",
          left: "-3px",
          borderRadius: "2px",
        }}
      >
        <rect
          width="24"
          height="4"
          rx="1.5"
          fill={isActive ? "#456bc4" : "white"}
        />
      </svg> */}
    </div>
  );
};

export default TestsIcon;
