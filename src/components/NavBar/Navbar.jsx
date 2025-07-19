import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import Logo from "./Logo";

// Import your logos
import Dashboard from "../../assets/dashboard1.svg";
import Practice from "../../assets/practice1.svg";
import Courses from "../../assets/courses1.svg";
import LabIcon from "../../assets/lab_icon.svg";

// Import icons from a more modern icon set (using SVG components)
const TestsIcon = ({ isActive = false }) => (
  <svg
    width="23"
    height="23"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
  </svg>
);

const SunIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="m12 2 0 2" />
    <path d="m12 20 0 2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="m2 12 2 0" />
    <path d="m20 12 2 0" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const Navbar = ({ isDarkMode, onThemeToggle, className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    console.log(`Navigating to ${path}`);
    navigate(path);
  };

  const navItems = [
    {
      id: "dashboard",
      path: "/dashboard",
      label: "Dashboard",
      icon: Dashboard,
    },
    {
      id: "courses",
      path: "/courses",
      label: "Courses",
      icon: Courses,
    },
    {
      id: "tests",
      path: "/tests",
      label: "Tests",
      icon: TestsIcon,
      isComponent: true,
    },
    {
      id: "practice",
      path: "/practice",
      label: "Practice",
      icon: Practice,
    },
    {
      id: "lab",
      path: "/lab",
      label: "Performance",
      icon: LabIcon,
    },
  ];

  return (
    <div className="navbar-hover-area">
      <nav className={`shadcn-navbar ${className}`}>
        {/* Header with Logo */}
        <div className="navbar-header">
          <div className="logo-section">
            <Logo />
          </div>
        </div>

        {/* Navigation Items */}
        <div className="nav-content">
          <div className="nav-section">
            <div className="nav-group">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.path)}
                    className={`nav-item ${active ? "nav-item-active" : ""}`}
                    aria-label={item.label}
                    title={item.label}
                  >
                    <div className="nav-item-icon">
                      {item.isComponent ? (
                        <item.icon isActive={active} />
                      ) : (
                        <img
                          src={item.icon}
                          alt={item.label}
                          className="nav-icon-img"
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer with Theme Toggle */}
        <div className="navbar-footer">
          <button
            className="theme-toggle-btn"
            onClick={onThemeToggle}
            aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
            title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
          >
            <div className="theme-toggle-icon">
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </div>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
