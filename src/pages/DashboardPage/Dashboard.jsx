import React from "react";
import ScoreColumnGraph from "../../components/ScoreColumnComponent/ScoreColumnGraph/ScoreColumn";
import RadarChart from "../../components/RadarComponent/RadarChart/RadarChart";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-left">
        <ScoreColumnGraph />
      </div>
      <div className="dashboard-right">
        <RadarChart />
      </div>
    </div>
  );
};

export default Dashboard;
