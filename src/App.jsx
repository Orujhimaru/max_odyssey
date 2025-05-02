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
import LoginPage from "./pages/LoginPage/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
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

  // Use a ref to track if this is the first render
  const isFirstRender = React.useRef(true);

  // Get authentication state from localStorage only once during initial render
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
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

  // Check for authentication changes
  useEffect(() => {
    // Skip the first render to avoid an infinite loop
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const checkAuth = () => {
      const hasToken = !!localStorage.getItem("token");
      if (hasToken !== isAuthenticated) {
        setIsAuthenticated(hasToken);
      }
    };

    // Set up event listener for storage changes (in case token is removed in another tab)
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [isAuthenticated]);

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
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tests"
            element={
              <ProtectedRoute>
                <Tests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practice"
            element={
              <ProtectedRoute>
                <Practice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lab"
            element={
              <ProtectedRoute>
                <LabPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course/:courseId/lesson/:lessonId"
            element={
              <ProtectedRoute>
                <LessonPage onNavbarToggle={toggleNavbar} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
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
