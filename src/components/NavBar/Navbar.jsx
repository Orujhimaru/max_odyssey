import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css"; // Create a CSS file for styling
import Logo from "./Logo";
import TestsIcon from "../../assets/TestsIcon";

// Import your logos
import Dashboard from "../../assets/dashboard1.svg";
import Practice from "../../assets/practice1.svg";
import Courses from "../../assets/courses1.svg";
import LabIcon from "../../assets/lab_icon.svg";

const Navbar = ({ isDarkMode, onThemeToggle, className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    console.log(`Navigating to ${path}`);
    navigate(path);
  };

  return (
    <div className="navbar-hover-area">
      <nav className={`navbar ${className}`}>
        <div>
          <div className="logo-container">
            <Logo />
            <h2 className="logo-text-main">AX</h2>
          </div>
          <div className="nav-items">
            <div
              className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
              onClick={() => handleNavigation("/dashboard")}
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
                <TestsIcon isActive={isActive("/tests")} />
              </div>
              <span className="nav-text">Tests</span>
            </div>
            <div
              className={`nav-item ${isActive("/practice") ? "active" : ""}`}
              onClick={() => {
                console.log("Practice navigation clicked");
                handleNavigation("/practice");
              }}
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
            <div
              className={`nav-item ${isActive("/lab") ? "active" : ""}`}
              onClick={() => handleNavigation("/lab")}
            >
              <div className="nav-icon-container">
                <img
                  src={LabIcon}
                  alt="Learning Lab"
                  className="nav-icon lab"
                />
              </div>
              <span className="nav-text">Performance</span>
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
    </div>
  );
};

export default Navbar;
