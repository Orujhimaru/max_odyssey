import React, { useState, useEffect, useRef } from "react";
import "./QuestionTimer.css";

const QuestionTimer = ({ questionIndex, onTimeUpdate }) => {
  // Initialize from localStorage if available
  const getInitialTime = () => {
    const savedTimers = JSON.parse(
      localStorage.getItem("testQuestionTimers") || "{}"
    );
    return savedTimers[questionIndex]
      ? Math.floor(savedTimers[questionIndex] / 1000)
      : 0;
  };

  const [timeSpent, setTimeSpent] = useState(getInitialTime());
  const intervalRef = useRef(null);

  // Start timer on mount and when questionIndex changes
  useEffect(() => {
    // On question change, persist previous time
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Reset timer to saved value or 0
    setTimeSpent(getInitialTime());
    // Start new timer
    intervalRef.current = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);
    return () => {
      // On unmount or question change, persist time
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (onTimeUpdate) {
        onTimeUpdate(questionIndex, timeSpent);
      }
    };
    // eslint-disable-next-line
  }, [questionIndex]);

  // Persist time on unmount
  useEffect(() => {
    return () => {
      if (onTimeUpdate) {
        onTimeUpdate(questionIndex, timeSpent);
      }
    };
    // eslint-disable-next-line
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="question-timer" title="Time spent on this question">
      <i className="far fa-clock"></i>
      <span>{formatTime(timeSpent)}</span>
    </div>
  );
};

export default QuestionTimer;
