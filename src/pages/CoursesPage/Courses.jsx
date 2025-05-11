import React, { useState } from "react";
import { Link } from "react-router-dom";
// del
import "./Courses.css";
import verbalIcon from "../../assets/learning.svg"; // You'll need to create these icons
import mathIcon from "../../assets/calc.svg";
import course1Bg from "../../assets/course1_bg.jpg";
import mathBg from "../../assets/math_bg_2.png";
import pencil from "../../assets/preparation_pencil.svg";

// Updated course data with first lesson IDs for each course
const courseData = [
  {
    id: 1,
    name: "SAT Verbal",
    icon: verbalIcon,
    iconColor: "#456bc4",
    background: course1Bg,
    lastUpdated: "2 days ago",
    firstLessonId: 101, // ID of the first lesson for direct navigation
    progress: {
      current: 54,
      total: 66,
    },
    chapters: [
      "Ch 1. Reading Comprehension",
      "Ch 2. Writing and Language",
      "Ch 3. Grammar and Usage",
      "Ch 4. Vocabulary in Context",
      "Ch 5. Command of Evidence",
      "Ch 6. Expression of Ideas",
    ],
  },
  {
    id: 2,
    name: "SAT Math",
    icon: mathIcon,
    iconColor: "rgb(247 247 247)",
    background: mathBg,
    lastUpdated: "5 days ago",
    firstLessonId: 101, // ID of the first lesson for direct navigation
    progress: {
      current: 48,
      total: 60,
    },
    chapters: [
      "Ch 1. Heart of Algebra",
      "Ch 2. Problem Solving",
      "Ch 3. Passport to Advanced Math",
      "Ch 4. Additional Topics",
      "Ch 5. Data Analysis",
      "Ch 6. Geometry & Trigonometry",
    ],
  },
  {
    id: 3,
    name: "Exam Preparation",
    icon: pencil,
    iconColor: "#0fb86b",
    background: "rgb(255 222 126)",
    lastUpdated: "1 week ago",
    firstLessonId: 101, // ID of the first lesson for direct navigation
    progress: {
      current: 12,
      total: 30,
    },
    chapters: [
      "Ch 1. Test Strategies",
      "Ch 2. Time Management",
      "Ch 3. Practice Tests",
      "Ch 4. Score Analysis",
      "Ch 5. Mental Preparation",
      "Ch 6. Test Day Tips",
    ],
  },
];

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")} s`;
};

const Courses = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter courses based on selected filter and search term
  const filteredCourses = courseData.filter((course) => {
    const matchesFilter =
      selectedFilter === "all" ||
      course.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = course.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="courses-page">
      <div className="courses-header ">
        <h1>Courses</h1>
        <p>Master the SAT with our specialized courses</p>
      </div>

      <div className="courses-container">
        <div className="courses-list">
          {filteredCourses.map((course) => (
            <div key={course.id} className="full-course-card">
              {/* <div
                className="course-accent-image"
                style={{ backgroundColor: course.iconColor }}
              >
                <div
                  className="accent-image"
                  style={{ backgroundImage: `url(${course.background})` }}
                />
              </div> */}
              <div className="course-content">
                <div className="course-title-section">
                  <div
                    className="course-page-icon"
                    style={{ backgroundColor: course.iconColor }}
                  >
                    <img src={course.icon} alt={course.name} />
                  </div>
                  <div className="course-page-title">
                    <div className="course-page-type">
                      <i className="fas fa-book"></i>
                      Course
                    </div>
                    <h3>{course.name}</h3>
                  </div>
                  <div className="course-page-progress">
                    {course.progress.current} / {course.progress.total}
                    <div className="course-page-progress-bar">
                      <div
                        className="course-page-progress-fill"
                        style={{
                          width: `${
                            (course.progress.current / course.progress.total) *
                            100
                          }%`,
                          backgroundColor: "#ffd700",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="chapters-grid">
                  {course.chapters.map((chapter, index) => (
                    <div key={index} className="chapter-item">
                      {chapter}
                    </div>
                  ))}
                </div>
                <div className="course-page-actions">
                  <div className="course-page-action-icons">
                    <i
                      className="fas fa-calendar-alt"
                      data-tooltip={`Last updated: ${course.lastUpdated}`}
                    ></i>
                    {/* <i className="fas fa-info-circle"></i> */}
                    {/* <i className="fas fa-sync-alt"></i> */}
                  </div>
                  <Link
                    to={`/course/${course.id}/lesson/${course.firstLessonId}`}
                    className="enter-course-link"
                  >
                    <button
                      className="enter-course-btn"
                      style={{ backgroundColor: "#456bc4" }}
                    >
                      Enter Course
                    </button>
                  </Link>
                </div>
              </div>
              {/* delete this */}
              {/* <LockOverlay /> */}
            </div>
          ))}
        </div>
        <div className="course-sidebar">
          {/* <div className="roadmap-section">
            <h3>Study Roadmap</h3>
            <div className="calendar-widget">
              <div className="calendar-header">
                <i className="fas fa-calendar"></i>
                <span>April 2024</span>
              </div>
              <div className="upcoming-events">
                <div className="event">
                  <div className="event-date">Apr 15</div>
                  <div className="event-info">
                    <span className="event-title">Practice Test #3</span>
                    <span className="event-time">09:00 AM</span>
                  </div>
                </div>
                <div className="event">
                  <div className="event-date">Apr 18</div>
                  <div className="event-info">
                    <span className="event-title">Verbal Review Session</span>
                    <span className="event-time">02:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          <div className="tips-section">
            <h3>Study Tips & Tricks</h3>
            <div className="tips-list">
              <div className="tip-card">
                <i className="fas fa-lightbulb"></i>
                <div className="tip-content">
                  <h4>Active Recall</h4>
                  <p>
                    Test yourself frequently instead of passive reading. This
                    helps build stronger memory connections.
                  </p>
                </div>
              </div>
              <div className="tip-card">
                <i className="fas fa-clock"></i>
                <div className="tip-content">
                  <h4>Timed Practice</h4>
                  <p>
                    Practice under timed conditions to build test-taking stamina
                    and improve time management.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
