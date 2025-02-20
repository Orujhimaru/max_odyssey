import React, { useState, useEffect } from "react";
import Navbar from "../../components/NavBar/Navbar";
import RadarChart from "../../components/RadarComponent/RadarChart/RadarChart";
import ScoreColumnGraph from "../../components/ScoreColumnComponent/ScoreColumnGraph/ScoreColumn";
import "./Dashboard.css";

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  return (
    <div className="dashboard">
      <button
        className="theme-toggle"
        onClick={() => setIsDarkMode(!isDarkMode)}
      >
        {isDarkMode ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="5" fill="currentColor" />
            <path
              d="M12 4V2M12 22v-2M4 12H2m20 0h-2m-2.828-5.172L18.586 5.414M5.414 18.586l1.414-1.414M5.414 5.414L6.828 6.828M18.586 18.586l-1.414-1.414"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
      <RadarChart scores={[99, 75, 65, 79, 83, 63, 9]} />
      <ScoreColumnGraph />
    </div>
  );
};

export default Dashboard;
