import React from "react";
import peasantAvatar from "../../assets/peasent.svg";
import "./ProfileSection.css";

const ProfileSection = () => {
  const predictedScore = 1520; // We'll use this to determine avatar

  const getAvatarByScore = (score) => {
    // This will be expanded as more avatars are added
    if (score < 1600) {
      return {
        image: peasantAvatar,
        rank: "Peasant",
        color: "#B87A3D", // Bronze-ish color for peasant rank
      };
    }
    // Future ranks will be added here
    // e.g., 1600-1700: Gladiator
    // 1700+: Senator, etc.
  };

  const userRank = getAvatarByScore(predictedScore);

  return (
    <div className="profile-section">
      <div className="profile-info">
        <div className="profile-left">
          <div className="profile-image">
            <img src={userRank.image} alt="Profile Avatar" />
          </div>
          <div className="profile-details">
            <h2>Felix Chen</h2>
            <span className="user-rank" style={{ color: userRank.color }}>
              <i className="fas fa-medal"></i>
              {userRank.rank} Rank
            </span>
          </div>
        </div>

        <div className="goal-section">
          <div className="goal-header">
            <span>Target Score</span>
            <i className="fas fa-bullseye"></i>
          </div>
          <div>
            <div className="goal-score">1520</div>
            <div className="score-range">(1000-1600)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
