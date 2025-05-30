import React from "react";
import "./ContinueLearning.css";
import learningIcon from "../../assets/learning.svg";

const ContinueLearning = ({ courses }) => {
  return (
    <div className="continue-learning">
      <div className="continue-learning-header">
        <h2 className="continue-learning-header-h2">
          Continue Learning
          <img
            src={learningIcon}
            alt="Learning Icon"
            className="learning-icon"
          />
        </h2>
        {/* <button className="view-all-button">View All</button> */}
      </div>
      <div className="learning-content">
        <div className="course-cards">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`course-card ${course.cat}`}
              style={{ backgroundImage: `url(${course.background})` }}
            >
              <div className="course-type">
                <i className="fas fa-book-open"></i>
                {/* <span>{course.type}</span> */}{" "}
                <h3 className="course-name">{course.name}</h3>
              </div>

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
        {/* <div className="quick-actions">
          <button className="action-button quiz">
            <div className="action-icon">
              <i className="fas fa-clipboard-question"></i>
            </div>
            <span>Take Quiz</span>
          </button>
          <button className="action-button mock">
            <div className="action-icon">
              <i className="fas fa-file-pen"></i>
            </div>
            <span>Mock Exam</span>
          </button>
          <button className="action-button flashcards">
            <div className="action-icon">
              <i className="fas fa-layer-group"></i>
            </div>
            <span>Flashcards</span>
          </button>
          <button className="action-button mini-tests">
            <div className="action-icon">
              <i className="fas fa-vial-circle-check"></i>
            </div>
            <span>Mini Tests</span>
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ContinueLearning;
