import React, { useState, useEffect } from "react";
import Navbar from "../../components/NavBar/Navbar";
import RadarChart from "../../components/RadarComponent/RadarChart/RadarChart";
import ScoreColumnGraph from "../../components/ScoreColumnComponent/ScoreColumnGraph/ScoreColumn";
import { courseProgress } from "../../data/courseProgress";
import ContinueLearning from "../../components/ContinueLearning/ContinueLearning";
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
      <div className="dashboard-left">
        <ContinueLearning course={courseProgress} />
        <ScoreColumnGraph />
      </div>

      <div className="dashboard-right">
        <RadarChart scores={[99, 75, 65, 79, 83, 63, 9]} />
      </div>
    </div>
  );
};

export default Dashboard;
