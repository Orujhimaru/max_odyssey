import React, { useState, useEffect } from "react";
import "./LoadingScreen.css";
import Logo from "../../components/NavBar/Logo.jsx";
import warriorReady from "../../assets/warrior_ready.png";

const LoadingScreen = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [warriorState, setWarriorState] = useState("hidden"); // hidden, visible, or fading

  const loadingTexts = [
    "Generating questions...",
    "Setting difficulty levels...",
    "Preparing test layout...",
    "Organizing sections...",
    "Almost ready...",
  ];

  // Handle loading text animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) =>
        prevIndex === loadingTexts.length - 1 ? prevIndex : prevIndex + 1
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle warrior image animation stages
  useEffect(() => {
    // Fade in after 1 second
    const fadeInTimer = setTimeout(() => {
      setWarriorState("visible");
    }, 500);

    // Start fading out after 6 seconds (1s fade in + 5s visible)
    // const fadeOutTimer = setTimeout(() => {
    //   setWarriorState("fading");
    // }, 6000);

    return () => {
      clearTimeout(fadeInTimer);
      // clearTimeout(fadeOutTimer);
    };
  }, []);

  return (
    <div className="loading-screen">
      <div className={`warrior-background ${warriorState}`}>
        <img src={warriorReady} alt="Warrior Ready" />
      </div>

      <div className="logo-container-loading">
        <Logo />
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
