import React, { useState, useEffect } from "react";
import "./LoadingScreen.css";
import Logo from "../../components/NavBar/Logo.jsx";
import warriorReady from "../../assets/warrior_ready.png";
import philosopher from "../../assets/philosopher(1).png";

const LoadingScreen = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [warriorState, setWarriorState] = useState("hidden"); // hidden, visible, or fading
  const [philosopherState, setPhilosopherState] = useState("hidden"); // hidden, visible, or fading

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

  // Handle image animation sequence
  useEffect(() => {
    // Warrior image animation
    const fadeInWarriorTimer = setTimeout(() => {
      setWarriorState("visible");
    }, 500);

    const fadeOutWarriorTimer = setTimeout(() => {
      setWarriorState("fading");
    }, 5000); // At 5 seconds, start the 1.5s transition

    // Philosopher image animation (appears as warrior starts fading)
    const fadeInPhilosopherTimer = setTimeout(() => {
      setPhilosopherState("visible");
    }, 5000); // Start appearing exactly when warrior starts fading

    const fadeOutPhilosopherTimer = setTimeout(() => {
      setPhilosopherState("fading");
    }, 10000); // At 10 seconds, start fading philosopher

    return () => {
      clearTimeout(fadeInWarriorTimer);
      clearTimeout(fadeOutWarriorTimer);
      clearTimeout(fadeInPhilosopherTimer);
      clearTimeout(fadeOutPhilosopherTimer);
    };
  }, []);

  return (
    <div className="loading-screen">
      <div className={`warrior-background ${warriorState}`}>
        <img src={warriorReady} alt="Warrior Ready" />
      </div>

      <div className={`philosopher-background ${philosopherState}`}>
        <img src={philosopher} alt="Philosopher" />
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
