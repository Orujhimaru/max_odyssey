import React, { useState, useRef } from "react";
import peasantAvatar from "../../assets/peasent.svg";
import leftCrown from "../../assets/vector.svg";
import rightCrown from "../../assets/vector-1.svg";
import Practice from "../../assets/Group 43.svg";
import "./ProfileSection.css";

const ProfileSection = () => {
  const predictedScore = 1520; // We'll use this to determine avatar
  const [targetScore, setTargetScore] = useState(1520);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("1520");
  const inputRef = useRef(null);

  const getAvatarByScore = (score) => {
    // This will be expanded as more avatars are added
    if (score < 1600) {
      return {
        image: peasantAvatar,
        rank: "Peasant",
        color: "var(--text-primary)", // Bronze-ish color for peasant rank
      };
    }
    // Future ranks will be added here
    // e.g., 1600-1700: Gladiator
    // 1700+: Senator, etc.
  };

  const userRank = getAvatarByScore(predictedScore);

  const handleScoreClick = () => {
    setIsEditing(true);
    setInputValue(targetScore.toString());
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 0);
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setInputValue(value);
  };

  const handleInputBlur = () => {
    let newScore = parseInt(inputValue, 10);

    if (isNaN(newScore) || newScore < 1000) {
      newScore = 1000;
    } else if (newScore > 1600) {
      newScore = 1600;
    } else {
      // Round to nearest 10
      newScore = Math.round(newScore / 10) * 10;
    }

    setTargetScore(newScore);
    setInputValue(newScore.toString());
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur(); // Trigger the blur event to validate
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setInputValue(targetScore.toString());
    }
  };

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
              <i className="fas fa-medal"></i> {userRank.rank}
            </span>
          </div>
        </div>

        <div className="goal-section">
          <div className="goal-header">
            <span>Target Score</span>
            <img src={Practice} alt="target" className="target-icon" />
          </div>
          <div className="goal-score-container">
            <img src={leftCrown} alt="" className="crown-left" />
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                className="goal-score-input"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                maxLength={4}
              />
            ) : (
              <div className="goal-score" onClick={handleScoreClick}>
                {targetScore}
              </div>
            )}
            <img src={rightCrown} alt="" className="crown-right" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
