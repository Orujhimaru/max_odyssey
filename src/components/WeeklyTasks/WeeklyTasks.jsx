import React from "react";
import "./WeeklyTasks.css";

const WeeklyTasks = () => {
  // Sample tasks that would be tracked and completed automatically by the system
  const dailyTasks = [
    {
      id: 1,
      text: "Complete 5 verbal exercises",
      completed: true,
      progress: { current: 5, total: 5 },
    },
    {
      id: 2,
      text: "Solve 5 math problems",
      completed: false,
      progress: { current: 3, total: 5 },
    },
    {
      id: 3,
      text: "Review 3 challenging topics",
      completed: false,
      progress: { current: 1, total: 3 },
    },
    {
      id: 4,
      text: "Complete 1 practice quiz",
      completed: true,
      progress: { current: 1, total: 1 },
    },
  ];

  // Calculate progress percentage
  const completedTasks = dailyTasks.filter((task) => task.completed).length;
  const totalTasks = dailyTasks.length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

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
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <ul className="task-list">
        {dailyTasks.map((task) => (
          <li key={task.id} className="task-item-simple">
            <div
              className={`task-status-indicator ${
                task.completed ? "completed" : ""
              }`}
            >
              {task.completed ? (
                <i className="fas fa-check"></i>
              ) : (
                <span className="task-progress">
                  {task.progress.current}/{task.progress.total}
                </span>
              )}
            </div>
            <div className="task-details">
              <span
                className={`task-text ${task.completed ? "completed" : ""}`}
              >
                {task.text}
              </span>
              {!task.completed && task.progress.current > 0 && (
                <div className="task-progress-bar">
                  <div
                    className="task-progress-fill"
                    style={{
                      width: `${
                        (task.progress.current / task.progress.total) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WeeklyTasks;
