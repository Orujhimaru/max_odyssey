import React, { useState } from "react";
import "./WeeklyTasks.css";

const WeeklyTasks = () => {
  // State to track which task box is active
  const [activeTaskIndex, setActiveTaskIndex] = useState(null);

  // Sample tasks data - updated to 7 tasks
  const tasks = [
    { id: 1, text: "Complete verbal exercises", completed: false },
    { id: 2, text: "Solve math problems", completed: false },
    { id: 3, text: "Review challenging topics", completed: false },
    { id: 4, text: "Complete practice quiz", completed: false },
    { id: 5, text: "Study philosophy concepts", completed: false },
    { id: 6, text: "Read passage analysis", completed: false },
    { id: 7, text: "Take timed practice test", completed: false },
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
      <div className="daily-tasks-header">
        <h2>
          Daily Goals{" "}
          <span role="img" aria-label="target">
            🎯
          </span>
        </h2>
        <div className="progress-percentage">
          {completedTasks}/{totalTasks}
        </div>
      </div>

      <div className="progress-bar-container">
        <div
          className="progress-bar-tasks"
          style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
        ></div>
      </div>

      <div className="task-section">
        {/* Task description appears above the boxes */}
        <div className="task-description-container">
          {activeTaskIndex !== null && (
            <div className="task-description">
              {tasks[activeTaskIndex].text.toUpperCase()}
            </div>
          )}
          {activeTaskIndex === null && (
            <div className="task-description empty"></div>
          )}
        </div>

        {/* Fixed row of 7 boxes */}
        <div className="task-boxes">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className={`task-box ${task.completed ? "completed" : ""} ${
                activeTaskIndex === index ? "active" : ""
              }`}
              onClick={() => handleTaskClick(index)}
            >
              {task.completed && <div className="checkmark">✓</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyTasks;
