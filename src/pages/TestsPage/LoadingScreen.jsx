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
      {/* Background texture image */}

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

      {/* Ship loader */}
      <div className="ship-spinner">
        <div className="circle-center">
          <div className="circle">
            <div className="wave"></div>
            <svg
              width="228"
              height="227"
              viewBox="0 0 228 227"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M51.5 129.5V125.5C64.579 126.617 80.7618 127.072 97.5 127.044V111L98.5 32V26H95.5V21.5L50.5 31.5L43 31L95.5 19V12L98 9.5V3.5L101 0L103 3.5V9.5L105 12V19L164 31L154 31.5L105 21.5V26H102.5V31.5L104 111V127.009C137.776 126.709 172.464 124.559 187.5 122L187 127.5C186.496 127.903 180.682 128.485 171.5 129.065V140.5H168.5V129.247C167.11 129.329 165.658 129.409 164.148 129.489L146 130.5V141.5H142.5V130.949V130.413C135.848 130.636 128.77 130.822 121.5 130.949V141H118V131.13V131.006C113.375 131.074 108.689 131.117 104 131.13V141H97.5V131.129C91.9324 131.11 86.3993 131.044 81 130.923V140.5H77V130.823C67.8678 130.567 59.2013 130.142 51.5 129.5Z"
                fill="#583F2B"
              />
              <path
                d="M21.5 159.5C16.3 141.1 0 134.5 0 116.5L52 118V138.5C89 143 134 141 178 138.5C214.8 134.9 217.333 106 214 92C209.2 75.2 191.667 81.3333 183.5 86.5C173.5 80.5 169 64.6667 168 57.5C265 62 227.5 181 166 192H2.5C-1.5 186.4 1.83333 182.333 4 181C19.6 176.6 22.1667 164.833 21.5 159.5Z"
                fill="#816044"
              />
              <path
                d="M77 166.5L68 153.5L199 154C199 158.8 189 174.5 165.5 179.5L65 179L77 166.5Z"
                fill="#5C422E"
              />
              <path
                d="M53.5 111.5C34.7 77.5 46 45.5 55 32H67C46 64.5 58.5 103 67 111.5H53.5Z"
                fill="#DFDFDF"
              />
              <path
                d="M77.5 111.5C58.7 77.5 70 45.5 79 32H91C70 64.5 82.5 103 91 111.5H77.5Z"
                fill="#DFDFDF"
              />
              <path
                d="M101.5 111.5C82.7 77.5 94 45.5 103 32H115C94 64.5 106.5 103 115 111.5H101.5Z"
                fill="#DFDFDF"
              />
              <path
                d="M125.5 111.5C106.7 77.5 118 45.5 127 32H139C118 64.5 130.5 103 139 111.5H125.5Z"
                fill="#DFDFDF"
              />
              <path
                d="M149.5 111.5C130.7 77.5 142 45.5 151 32H163C142 64.5 154.5 103 163 111.5H149.5Z"
                fill="#DFDFDF"
              />

              <g className="oar-group ">
                <circle cx="90.5" cy="167.5" r="4.5" fill="#040907" />
                <path
                  className="oar-1"
                  d="M68.5 207.5L91.5 171C90.5 171 88.3 170.7 87.5 169.5L65 205.5L63 206L53 221.5C52 226.5 57.5 227 59.5 226L69 211L68.5 207.5Z"
                  fill="#040907"
                />
              </g>

              <g className="oar-group ">
                <circle cx="106.5" cy="167.5" r="4.5" fill="#040907" />
                <path
                  className="oar-2"
                  d="M84.6204 207.5L107.62 171C106.62 171 104.42 170.7 103.62 169.5L81.1204 205.5L79.1204 206L69.1204 221.5C68.1204 226.5 73.6204 227 75.6204 226L85.1204 211L84.6204 207.5Z"
                  fill="#040907"
                />
              </g>

              <g className="oar-group ">
                <circle cx="122.5" cy="167.5" r="4.5" fill="#040907" />
                <path
                  className="oar-3"
                  d="M100.741 207.5L123.741 171C122.741 171 120.541 170.7 119.741 169.5L97.2407 205.5L95.2407 206L85.2408 221.5C84.2408 226.5 89.7407 227 91.7408 226L101.241 211L100.741 207.5Z"
                  fill="#040907"
                />
              </g>

              <g className="oar-group ">
                <circle cx="138.5" cy="167.5" r="4.5" fill="#040907" />
                <path
                  className="oar-4"
                  d="M116.861 207.5L139.861 171C138.861 171 136.661 170.7 135.861 169.5L113.361 205.5L111.361 206L101.361 221.5C100.361 226.5 105.861 227 107.861 226L117.361 211L116.861 207.5Z"
                  fill="#040907"
                />
              </g>

              <g className="oar-group ">
                <circle cx="154.5" cy="167.5" r="4.5" fill="#040907" />
                <path
                  className="oar-5"
                  d="M132.981 207.5L155.981 171C154.981 171 152.781 170.7 151.981 169.5L129.481 205.5L127.481 206L117.481 221.5C116.481 226.5 121.981 227 123.981 226L133.481 211L132.981 207.5Z"
                  fill="#040907"
                />
              </g>

              <g className="oar-group ">
                <circle cx="170.5" cy="167.5" r="4.5" fill="#040907" />
                <path
                  className="oar-6"
                  d="M149.102 207.5L172.102 171C171.102 171 168.902 170.7 168.102 169.5L145.602 205.5L143.602 206L133.602 221.5C132.602 226.5 138.102 227 140.102 226L149.602 211L149.102 207.5Z"
                  fill="#040907"
                />
              </g>
              <path
                d="M41.5 111.5C22.7 77.5 34.6667 44.3333 43 32H55C34 64.5 46.5 103 55 111.5H41.5Z"
                fill="#3A488A"
              />
              <path
                d="M65.5 111.5C46.7 77.5 58 45 67 32H79C58 64.5 70.5 103 79 111.5H65.5Z"
                fill="#3A488A"
              />
              <path
                d="M89.5 111.5C70.7 77.5 82 45.5 91 32H103C82 64.5 94.5 103 103 111.5H89.5Z"
                fill="#3A488A"
              />
              <path
                d="M137.5 111.5C118.7 77.5 130 45.5 139 32H151C130 64.5 142.5 103 151 111.5H137.5Z"
                fill="#3A488A"
              />
              <path
                d="M113.5 111.5C94.7 77.5 106 45.5 115 32H127C106 64.5 118.5 103 127 111.5H113.5Z"
                fill="#3A488A"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
