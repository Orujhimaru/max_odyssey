import React, { useState, useEffect } from "react";
import RadarChart from "../../components/RadarComponent/RadarChart/RadarChart";
import ScoreColumnGraph from "../../components/ScoreColumnComponent/ScoreColumnGraph/ScoreColumn";
import { coursesProgress } from "../../data/courseProgress";
import ContinueLearning from "../../components/ContinueLearning/ContinueLearning";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-left">
        <ContinueLearning courses={coursesProgress} />
        <ScoreColumnGraph />
      </div>
      <div className="dashboard-right">
        <RadarChart scores={[99, 75, 65, 79, 83, 63, 9]} />
      </div>
    </div>
  );
};

export default Dashboard;
