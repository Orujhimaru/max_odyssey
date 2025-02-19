import React, { useState, useEffect } from "react";
import Navbar from "../../components/NavBar/Navbar";
import RadarChart from "../../components/RadarChart/RadarChart";
import ScoreColumnGraph from "../../components/ScoreColumnGraph/ScoreColumn";
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
        <i className={`fas fa-${isDarkMode ? "sun" : "moon"}`}></i>
      </button>
      <RadarChart scores={[99, 75, 65, 79, 83, 63, 89]} />
      <ScoreColumnGraph />
    </div>
  );
};

export default Dashboard;
