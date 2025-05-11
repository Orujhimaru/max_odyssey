import React from "react";

const ModuleTimerDisplay = React.memo(({ timeString }) => {
  // console.log('ModuleTimerDisplay rendering with time:', timeString); // Optional: for debugging re-renders
  return (
    <>
      <i className="far fa-clock"></i> {timeString}
    </>
  );
});

ModuleTimerDisplay.displayName = "ModuleTimerDisplay"; // Good practice for DevTools

export default ModuleTimerDisplay;
