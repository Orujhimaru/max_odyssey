import React, { useState, useEffect } from "react";
import RadarChart from "../../components/RadarComponent/RadarChart/RadarChart";
import ScoreColumnGraph from "../../components/ScoreColumnComponent/ScoreColumnGraph/ScoreColumn";
import { coursesProgress } from "../../data/courseProgress";
import ContinueLearning from "../../components/ContinueLearning/ContinueLearning";
import learningIcon from "../../assets/learning.svg";
import ProfileSection from "../../components/ProfileSection/ProfileSection";
import WeeklyTasks from "../../components/WeeklyTasks/WeeklyTasks";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-left">
      <div className="continue-learning-header">
        <h2 className="continue-learning-header-h2">
          Continue Learning
          <img
            src={learningIcon}
            alt="Learning Icon"
            className="learning-icon"
          />
        </h2>
        {/* <button className="view-all-button">View All</button> */}
      </div>
        <div className="top-row">
          <ContinueLearning courses={coursesProgress} />
          <WeeklyTasks />
        </div>
        <ScoreColumnGraph />
      </div>
      <div className="dashboard-right">
        <ProfileSection />
        <RadarChart scores={[99, 75, 65, 79, 83, 63, 9]} />
      </div>
    </div>
  );
};

export default Dashboard;
