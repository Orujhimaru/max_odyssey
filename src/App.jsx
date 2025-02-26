import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./index.css";
import Dashboard from "./pages/DashboardPage/Dashboard";
import Navbar from "./components/NavBar/Navbar";
import ScoreColumnGraph from "./components/ScoreColumnComponent/ScoreColumnGraph/ScoreColumn";
import Courses from "./pages/CoursesPage/Courses";
import Tests from "./pages/TestsPage/Tests";
import Practice from "./pages/PracticePage/Practice";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  return (
    <Router>
      <div className="app">
        <Navbar
          isDarkMode={isDarkMode}
          onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        />
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/practice" element={<Practice />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
