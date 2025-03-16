import React from "react";
import { useAuth } from "../../context/AuthContext";
import "./UserProfile.css";

const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>Loading user information...</div>;
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="avatar">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.username} />
          ) : (
            <div className="avatar-placeholder">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="user-info">
          <h2>{user.username}</h2>
          <span className={`user-role ${user.role}`}>{user.role}</span>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-item">
          <span className="stat-label">Target Score</span>
          <span className="stat-value">{user.target_score || "Not set"}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Predicted Score</span>
          <span className="stat-value">
            {user.predicted_total_score || "N/A"}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Questions Solved</span>
          <span className="stat-value">{user.total_questions_solved || 0}</span>
        </div>
      </div>

      <button className="logout-button" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default UserProfile;
