import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css"; // Create a CSS file for styling
import Logo from "../Navbar/Logo";

// Import your logos
import Dashboard from "../../assets/Group 36.svg";
import Practice from "../../assets/Group 43.svg";
import Courses from "../../assets/Group 51.svg";
import Tests from "../../assets/Group 38.svg";

const Navbar = ({ isDarkMode, onThemeToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="navbar">
      <div>
        <div className="logo-container">
          <Logo />
          <h2 className="logo-text">AX</h2>
        </div>
        <div className="nav-items">
          <div
            className={`nav-item ${isActive("/") ? "active" : ""}`}
            onClick={() => handleNavigation("/")}
          >
            <div className="nav-icon-container">
              <img src={Dashboard} alt="Dashboard" className="nav-icon" />
            </div>
            <span className="nav-text">Dashboard</span>
          </div>
          <div
            className={`nav-item ${isActive("/courses") ? "active" : ""}`}
            onClick={() => handleNavigation("/courses")}
          >
            <div className="nav-icon-container">
              <img src={Courses} alt="Courses" className="nav-icon" />
            </div>
            <span className="nav-text">Courses</span>
          </div>
          <div
            className={`nav-item ${isActive("/tests") ? "active" : ""}`}
            onClick={() => handleNavigation("/tests")}
          >
            <div className="nav-icon-container">
              <img src={Tests} alt="Tests" className="nav-icon tests" />
            </div>
            <span className="nav-text">Tests</span>
          </div>
          <div
            className={`nav-item ${isActive("/practice") ? "active" : ""}`}
            onClick={() => handleNavigation("/practice")}
          >
            <div className="nav-icon-container">
              <img
                src={Practice}
                alt="Practice"
                className="nav-icon practice"
              />
            </div>
            <span className="nav-text">Practice</span>
          </div>
        </div>
      </div>
      <button className="theme-toggle" onClick={onThemeToggle}>
        {isDarkMode ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="5" fill="white" />
            <path
              d="M12 4V2M12 22v-2M4 12H2m20 0h-2m-2.828-5.172L18.586 5.414M5.414 18.586l1.414-1.414M5.414 5.414L6.828 6.828M18.586 18.586l-1.414-1.414"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </nav>
  );
};

export default Navbar;
