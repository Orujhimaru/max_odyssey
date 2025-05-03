import React, { useState } from "react";
import "./WeeklyTasks.css";
import StarSign from "../../assets/star-sign.svg";

const WeeklyTasks = () => {
  // State to track which task box is active
  const [activeTaskIndex, setActiveTaskIndex] = useState(null);

  // Sample tasks data - updated to 7 tasks with progress indicators
  const tasks = [
    { id: 1, text: "practice verbal", completed: false, progress: "1/5" },
    { id: 2, text: "Complete mini test", completed: false, progress: "2/10" },
    { id: 3, text: "practice weak points", completed: false, progress: "0/1" },
    { id: 4, text: "complete 10 lessons", completed: false, progress: "3/10" },
    { id: 5, text: "practice math", completed: false, progress: "2/5" },
    { id: 6, text: "review a test", completed: false, progress: "0/3" },
    {
      id: 7,
      text: "finish 1 exam",
      completed: false,
      isSpecial: true,
      progress: "0/1",
    },
  ];

  // Calculate progress for display
  const completedTasks = 2;
  const totalTasks = 4;

  // Toggle active task
  const handleTaskClick = (index) => {
    if (activeTaskIndex === index) {
      setActiveTaskIndex(null);
    } else {
      setActiveTaskIndex(index);
    }
  };

  return (
    <div className="daily-tasks">
      <div>
        <div className="daily-tasks-header">
          <h2>
            Daily Goals
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.5837 10.9993C15.5837 11.9058 15.3149 12.792 14.8112 13.5457C14.3076 14.2994 13.5918 14.8869 12.7543 15.2338C11.9168 15.5807 10.9952 15.6715 10.1062 15.4946C9.21708 15.3178 8.40041 14.8812 7.75942 14.2403C7.11843 13.5993 6.68191 12.7826 6.50506 11.8935C6.32821 11.0044 6.41898 10.0829 6.76588 9.24538C7.11278 8.40789 7.70024 7.69207 8.45396 7.18845C9.20769 6.68482 10.0938 6.41602 11.0003 6.41602"
                stroke="var(--text-primary)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.8335 2.01634C12.2407 1.89534 11.6296 1.83423 11.0002 1.83301C5.93741 1.83301 1.8335 5.93692 1.8335 10.9997C1.8335 16.0624 5.93741 20.1663 11.0002 20.1663C16.0629 20.1663 20.1668 16.0624 20.1668 10.9997C20.1656 10.3702 20.1045 9.75912 19.9835 9.16634"
                stroke="var(--text-primary)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.0278 10.965L15.2014 6.79145M18.0953 3.98278L17.5884 2.16045C17.5681 2.09102 17.5311 2.02766 17.4805 1.97598C17.4299 1.92429 17.3674 1.88588 17.2984 1.86412C17.2294 1.84237 17.1561 1.83796 17.0851 1.85127C17.014 1.86458 16.9473 1.89521 16.8908 1.94045C15.5745 3.0157 14.1408 4.46495 15.3114 6.7502C17.6709 7.8502 19.0184 6.36703 20.0506 5.11945C20.0973 5.06198 20.1289 4.99379 20.1426 4.92103C20.1563 4.84827 20.1517 4.77324 20.1291 4.70273C20.1066 4.63221 20.0668 4.56843 20.0134 4.51715C19.96 4.46587 19.8946 4.42871 19.8232 4.40903L18.0953 3.98278Z"
                stroke="var(--text-primary)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </h2>
        </div>

        <div className="progress-bar-container">
          <div
            className="progress-bar-tasks"
            style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="task-section">
        {/* Single text area that shows either UP NEXT or task text */}
        <div className="text-display-area">
          {activeTaskIndex === null ? (
            <div className="up-next-header">
              <img src={StarSign} alt="star sign" className="star-sign-icon" />
              <span className="up-next-text">UP NEXT FOR YOU!</span>
            </div>
          ) : (
            <div className="task-description">
              <img src={StarSign} alt="star sign" className="star-sign-icon" />
              <div className="task-info">
                <span className="task-text">
                  {tasks[activeTaskIndex].text.toUpperCase()}
                  <span className="task-progress">
                    <em>{tasks[activeTaskIndex].progress}</em>
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Fixed row of 7 boxes */}
        <div className="task-boxes">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className={`task-box ${task.completed ? "completed" : ""} ${
                activeTaskIndex === index ? "active" : ""
              } ${task.isSpecial ? "star" : ""}`}
              onClick={() => handleTaskClick(index)}
            >
              {task.completed && <div className="checkmark">✓</div>}
              {task.isSpecial && <div className="star-icon">★</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyTasks;
