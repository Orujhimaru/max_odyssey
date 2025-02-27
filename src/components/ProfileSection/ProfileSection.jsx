import React from "react";
import "./ProfileSection.css";

const ProfileSection = () => {
  return (
    <div className="profile-section">
      <div className="profile-info">
        <div className="profile-left">
          <div className="profile-image">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              alt="Profile"
            />
          </div>
          <div className="profile-details">
            <h2>Felix Chen</h2>
            <span className="study-streak">
              <i className="fas fa-fire"></i>
              12 day streak
            </span>
          </div>
        </div>

        <div className="goal-section">
          <div className="goal-header">
            <span>Target Score</span>
            <i className="fas fa-bullseye"></i>
          </div>
          <div className="goal-score">1520</div>
          <div className="score-range">(1000-1600)</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
