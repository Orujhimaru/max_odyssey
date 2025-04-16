import React, { useState, useEffect } from "react";
import "./LoadingScreen.css";
import Logo from "../../components/NavBar/Logo.jsx";

const LoadingScreen = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const loadingTexts = [
    "Generating questions...",
    "Setting difficulty levels...",
    "Preparing test layout...",
    "Organizing sections...",
    "Almost ready...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) =>
        prevIndex === loadingTexts.length - 1 ? prevIndex : prevIndex + 1
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      <div className="logo-container-loading">
        <Logo />
        <h2 className="logo-text-loading">AX</h2>
      </div>

      <div className="loading-text-container">
        {loadingTexts.map((text, index) => (
          <div
            key={index}
            className={`loading-text ${
              index === currentTextIndex ? "active" : ""
            }`}
          >
            {text}
          </div>
        ))}
      </div>

      {/* Loading spinner */}
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingScreen;
