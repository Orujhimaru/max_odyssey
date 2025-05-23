import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import "./index.css";
import "katex/dist/katex.min.css";
import Dashboard from "./pages/DashboardPage/Dashboard";
import Navbar from "./components/NavBar/Navbar";
import ScoreColumnGraph from "./components/ScoreColumnComponent/ScoreColumnGraph/ScoreColumn";
import Courses from "./pages/CoursesPage/Courses";
import Tests from "./pages/TestsPage/Tests";
import Practice from "./pages/PracticePage/Practice";
import TestReview from "./components/TestReview/TestReview";
import LabPage from "./pages/LabPage/LabPage";
import LessonPage from "./pages/LessonPage/LessonPage";

// Create a wrapper component to handle the navbar visibility logic
const AppContent = () => {
  const location = useLocation();
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Get initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Check if current route is lesson page
  const isLessonPage =
    location.pathname.includes("/course/") &&
    location.pathname.includes("/lesson/");

  // Update navbar visibility based on route - hide navbar with animation when entering lesson page
  useEffect(() => {
    if (isLessonPage) {
      // Start with navbar visible briefly, then animate it away
      setIsNavbarVisible(true);
      // Add a short delay to ensure the animation is visible
      setTimeout(() => {
        setIsNavbarVisible(false);
      }, 300);
    } else {
      setIsNavbarVisible(true);
    }
  }, [location.pathname]); // React to path changes specifically

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

  // Toggle navbar visibility
  const toggleNavbar = () => {
    console.log("Navbar toggle called");
    // Always show navbar when triggered from lesson page
    if (isLessonPage) {
      setIsNavbarVisible(true);
    } else {
      setIsNavbarVisible((prev) => !prev);
    }
  };

  // Add an event handler to hide navbar when mouse leaves the navbar area
  const hideNavbar = () => {
    console.log("Hide navbar called");
    if (isLessonPage) {
      setIsNavbarVisible(false);
    }
  };

  return (
    <div className={`app ${isLessonPage ? "lesson-fullscreen" : ""}`}>
      {/* Always render the navbar but control its visibility with CSS */}
      <div className="navbar-container" onMouseLeave={hideNavbar}>
        <Navbar
          isDarkMode={isDarkMode}
          onThemeToggle={toggleTheme}
          className={isNavbarVisible ? "visible" : ""}
        />
      </div>

      <div
        className={`content ${!isNavbarVisible ? "content-fullscreen" : ""}`}
      >
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/lab" element={<LabPage />} />
          <Route
            path="/course/:courseId/lesson/:lessonId"
            element={<LessonPage onNavbarToggle={toggleNavbar} />}
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
