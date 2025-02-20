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
          <i className="fa-solid fa-brightness"></i>
        ) : (
          <i className="fa-solid fa-moon"></i>
        )}
      </button>
      <RadarChart scores={[99, 75, 65, 79, 83, 63, 9]} />
      <ScoreColumnGraph />
    </div>
  );
};

export default Dashboard;
