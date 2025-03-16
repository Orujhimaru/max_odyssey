import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import "./index.css";
import Dashboard from "./pages/DashboardPage/Dashboard";
import Navbar from "./components/NavBar/Navbar";
import ScoreColumnGraph from "./components/ScoreColumnComponent/ScoreColumnGraph/ScoreColumn";
import Courses from "./pages/CoursesPage/Courses";
import Tests from "./pages/TestsPage/Tests";
import Practice from "./pages/PracticePage/Practice";
import TestReview from "./components/TestReview/TestReview";
import LoginPage from "./pages/LoginPage/LoginPage";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Get initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // Update data-theme attribute and localStorage when theme changes
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <Router>
      <div className="app">
        <Navbar isDarkMode={isDarkMode} onThemeToggle={toggleTheme} />
        <div className="content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/practice" element={<Practice />} />
            {/* <Route path="/questions/:testId" element={<TestReview />} /> */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
