import React from "react";
import "./ContinueLearning.css";

const ContinueLearning = ({ courses }) => {
  return (
    <div className="continue-learning">
      <h2>Pick up where you left off</h2>
      <div className="course-cards">
        {courses.map((course) => (
          <div
            key={course.id}
            className="course-card"
            style={{ backgroundImage: `url(${course.background})` }}
          >
            <div className="course-type">
              <i className="fas fa-book"></i>
              <span>{course.type}</span>
            </div>

            <h3 className="course-name">{course.name}</h3>

            <div className="progress-indicator">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      (course.progress.current / course.progress.total) * 100
                    }%`,
                  }}
                />
              </div>
              <span className="progress-text">
                {course.progress.current}/{course.progress.total}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContinueLearning;
