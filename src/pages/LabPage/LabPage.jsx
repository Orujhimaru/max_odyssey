import React, { useState, useEffect } from "react";
import "./LabPage.css";
import aristotleIcon from "../../assets/aristotle.svg";
import labPageIcon from "../../assets/lab_page.svg";

// Import score SVGs
import scoreAce from "../../assets/ace.svg";
import scoreGood from "../../assets/good.svg";
import scoreMid from "../../assets/mid.svg";
import scoreBad from "../../assets/bad.svg";
import scoreNone from "../../assets/none.svg";

// Import SpeedometerIcon
import SpeedometerIcon from "../../components/SpeedometerIcon/SpeedometerIcon";

// Import the QuestionTimingTracker component
import QuestionTimingTracker from "../../components/QuestionTimingTracker/QuestionTimingTracker";

// Import MasteryRingCard
import MasteryRingCard from "../../components/MasteryRingCard/MasteryRingCard";

// Sample timing data
const sampleQuestionTimingData = [
  42, 55, 38, 70, 25, 60, 80, 35, 50, 45, 90, 100, 110, 30, 20, 40, 60, 70, 80,
  90, 25, 35, 45, 55, 65, 75, 85,
];

const sampleMathQuestionTimingData = [
  25, 30, 35, 28, 32, 40, 50, 65, 75, 60, 80, 70, 85, 55, 90,
  110, 125, 100, 130, 115, 105, 120,
];

// PaceCard component
const PaceCard = () => {
  const userAvgTime = "01:04";
  const targetTime = "01:31";
  const paceRatio = 1.2;

  const getPaceStatus = (ratio) => {
    if (ratio <= 0.7) return "excellent";
    if (ratio <= 1.0) return "okay";
    return "slow";
  };

  const paceStatusClass = getPaceStatus(paceRatio);
  const paceText = {
    excellent: "Excellent",
    okay: "Okay",
    slow: "Slow",
  }[paceStatusClass];

  return (
    <div className="pace-card">
      <div className="pace-card-left">
        <div className="pace-info">
          <h3 className="pace-title">Pace</h3>
          <div className={`pace-status ${paceStatusClass}`}>{paceText}</div>
          <p className="pace-message">
            You've struggled with some questions, but practice makes you perfect!
          </p>
        </div>
      </div>

      <div className="pace-card-right">
        <div className="time-info-container">
          <div className="time-info-card">
            <div className="time-info-row">
              <span className="time-label">Test Time</span>
              <span className="time-value">{targetTime}</span>
            </div>
            <div className="time-info-row">
              <span className="time-label">Your Time</span>
              <span className="time-value">{userAvgTime}</span>
            </div>
          </div>
        </div>

        <div className="speedometer-container">
          <SpeedometerIcon ratio={paceRatio} />
          <div className="remaining-time">03:06 remaining</div>
        </div>
      </div>
    </div>
  );
};

const LabPage = () => {
  const [activeTab, setActiveTab] = useState("math");
  const [expandedTopics, setExpandedTopics] = useState({
    timing: {},
    mastery: {},
  });
  const [expandedMasteryCards, setExpandedMasteryCards] = useState({});

  // Reset expanded topics when tab changes
  useEffect(() => {
    setExpandedTopics({
      timing: {},
      mastery: {},
    });
    setExpandedMasteryCards({});
  }, [activeTab]);

  const toggleTopic = (topic, section) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [topic]: !prev[section][topic],
      },
    }));
  };

  const toggleMasteryCard = (topic) => {
    setExpandedMasteryCards((prev) => ({
      ...prev,
      [topic]: !prev[topic],
    }));
  };

  const getScoreImage = (percentage) => {
    if (percentage >= 90) return scoreAce;
    if (percentage >= 75) return scoreGood;
    if (percentage >= 60) return scoreMid;
    if (percentage >= 40) return scoreBad;
    return scoreNone;
  };

  const getScoreLabel = (percentage) => {
    if (percentage >= 90) return "Ace";
    if (percentage >= 75) return "Good";
    if (percentage >= 60) return "Mid";
    if (percentage >= 40) return "Bad";
    return "None";
  };

  const calculateAverageTime = (subtopics) => {
    let totalSeconds = 0;
    subtopics.forEach((subtopic) => {
      const timeParts = subtopic.timingText.split(":");
      const minutes = parseInt(timeParts[0]);
      const seconds = parseInt(timeParts[1]);
      totalSeconds += minutes * 60 + seconds;
    });
    const avgSeconds = Math.round(totalSeconds / subtopics.length);
    const avgMinutes = Math.floor(avgSeconds / 60);
    const avgRemainingSeconds = avgSeconds % 60;
    return `${avgMinutes.toString().padStart(2, "0")}:${avgRemainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const calculateAverageImprovement = (subtopics) => {
    let totalImprovement = 0;
    subtopics.forEach((subtopic) => {
      const improvementValue = parseInt(subtopic.improvement);
      totalImprovement += improvementValue;
    });
    const avgImprovement = Math.round(totalImprovement / subtopics.length);
    return avgImprovement >= 0 ? `+${avgImprovement}%` : `${avgImprovement}%`;
  };

  const calculateAverageMastery = (subtopics) => {
    let totalMastery = 0;
    let totalQuestions = 0;
    let totalCorrect = 0;

    subtopics.forEach((subtopic) => {
      totalMastery += subtopic.masteryPercentage;
      const match = subtopic.masteryText.match(/(\d+)\/(\d+)/);
      if (match) {
        totalCorrect += parseInt(match[1]);
        totalQuestions += parseInt(match[2]);
      }
    });

    const avgMastery = Math.round(totalMastery / subtopics.length);
    return {
      percentage: avgMastery,
      text: `${avgMastery}% (${totalCorrect}/${totalQuestions})`,
    };
  };

  const calculateAverageTimingPercentage = (subtopics) => {
    let totalPercentage = 0;
    subtopics.forEach((subtopic) => {
      totalPercentage += subtopic.timingPercentage;
    });
    return Math.round(totalPercentage / subtopics.length);
  };

  const renderPerformanceBar = (percentage) => {
    const fillPercentage = Math.min(100, percentage);
    const targetPercentage = 70;

    let greenWidth = 0;
    let redWidth = 0;

    if (fillPercentage <= targetPercentage) {
      greenWidth = fillPercentage;
      redWidth = 0;
    } else {
      greenWidth = targetPercentage;
      redWidth = fillPercentage - targetPercentage;
    }

    return (
      <div className="performance-bar-container">
        <div className="performance-bar">
          <div className="bar-segment"></div>
          <div className="bar-segment"></div>
          <div className="bar-segment"></div>
          <div className="bar-segment"></div>

          {greenWidth > 0 && (
            <div
              className="bar-fill green"
              style={{
                width: `${greenWidth}%`,
                left: "0%",
              }}
            ></div>
          )}

          {redWidth > 0 && (
            <div
              className="bar-fill red"
              style={{
                width: `${redWidth}%`,
                left: `${targetPercentage}%`,
              }}
            ></div>
          )}
        </div>
      </div>
    );
  };

  // Complete topic data
  const mathTopicsData = {
    Algebra: [
      {
        name: "Linear Equations (1)",
        timingPercentage: 82,
        timingText: "02:15",
        masteryPercentage: 88,
        masteryText: "88% (44/50)",
        improvement: "+6%",
      },
      {
        name: "Linear Functions",
        timingPercentage: 75,
        timingText: "02:30",
        masteryPercentage: 84,
        masteryText: "84% (42/50)",
        improvement: "+5%",
      },
      {
        name: "Linear Equations (2)",
        timingPercentage: 80,
        timingText: "02:20",
        masteryPercentage: 86,
        masteryText: "86% (43/50)",
        improvement: "+7%",
      },
      {
        name: "Systems of 2 in 2",
        timingPercentage: 65,
        timingText: "02:45",
        masteryPercentage: 76,
        masteryText: "76% (38/50)",
        improvement: "+3%",
      },
      {
        name: "Linear Inequalities",
        timingPercentage: 70,
        timingText: "02:35",
        masteryPercentage: 80,
        masteryText: "80% (40/50)",
        improvement: "+4%",
      },
    ],
    "Advanced Math": [
      {
        name: "Equivalent Expressions",
        timingPercentage: 60,
        timingText: "03:00",
        masteryPercentage: 74,
        masteryText: "74% (37/50)",
        improvement: "+2%",
      },
      {
        name: "Nonlinear Equations",
        timingPercentage: 62,
        timingText: "02:55",
        masteryPercentage: 72,
        masteryText: "72% (36/50)",
        improvement: "+3%",
      },
      {
        name: "Nonlinear Functions",
        timingPercentage: 68,
        timingText: "03:05",
        masteryPercentage: 76,
        masteryText: "76% (38/50)",
        improvement: "+4%",
      },
    ],
    "Problem-Solving and Data Analysis": [
      {
        name: "Ratios & Rates",
        timingPercentage: 85,
        timingText: "02:00",
        masteryPercentage: 90,
        masteryText: "90% (45/50)",
        improvement: "+10%",
      },
      {
        name: "Percentages",
        timingPercentage: 88,
        timingText: "01:58",
        masteryPercentage: 92,
        masteryText: "92% (46/50)",
        improvement: "+11%",
      },
      {
        name: "Measures of Spread",
        timingPercentage: 80,
        timingText: "02:10",
        masteryPercentage: 86,
        masteryText: "86% (43/50)",
        improvement: "+8%",
      },
      {
        name: "Models and Scatterplots",
        timingPercentage: 75,
        timingText: "02:25",
        masteryPercentage: 82,
        masteryText: "82% (41/50)",
        improvement: "+7%",
      },
      {
        name: "Probability",
        timingPercentage: 92,
        timingText: "01:48",
        masteryPercentage: 94,
        masteryText: "94% (47/50)",
        improvement: "+12%",
      },
      {
        name: "Sample Statistics",
        timingPercentage: 78,
        timingText: "02:20",
        masteryPercentage: 84,
        masteryText: "84% (42/50)",
        improvement: "+6%",
      },
      {
        name: "Studies and Experiments",
        timingPercentage: 70,
        timingText: "02:40",
        masteryPercentage: 78,
        masteryText: "78% (39/50)",
        improvement: "+5%",
      },
    ],
    "Geometry and Trigonometry": [
      {
        name: "Area & Volume",
        timingPercentage: 82,
        timingText: "02:15",
        masteryPercentage: 88,
        masteryText: "88% (44/50)",
        improvement: "+9%",
      },
      {
        name: "Angles & Triangles",
        timingPercentage: 75,
        timingText: "02:30",
        masteryPercentage: 80,
        masteryText: "80% (40/50)",
        improvement: "+6%",
      },
      {
        name: "Trigonometry",
        timingPercentage: 58,
        timingText: "03:35",
        masteryPercentage: 62,
        masteryText: "62% (31/50)",
        improvement: "-3%",
      },
      {
        name: "Circles",
        timingPercentage: 65,
        timingText: "03:10",
        masteryPercentage: 70,
        masteryText: "70% (35/50)",
        improvement: "+2%",
      },
    ],
  };

  const verbalTopicsData = {
    "Craft and Structure": [
      {
        name: "Cross-Text Connections",
        timingPercentage: 72,
        timingText: "02:40",
        masteryPercentage: 78,
        masteryText: "78% (39/50)",
        improvement: "+6%",
      },
      {
        name: "Text Structure and Purpose",
        timingPercentage: 78,
        timingText: "02:20",
        masteryPercentage: 84,
        masteryText: "84% (42/50)",
        improvement: "+7%",
      },
      {
        name: "Words in Context",
        timingPercentage: 75,
        timingText: "02:33",
        masteryPercentage: 82,
        masteryText: "82% (41/50)",
        improvement: "+8%",
      },
    ],
    "Expression of Ideas": [
      {
        name: "Rhetorical Synthesis",
        timingPercentage: 88,
        timingText: "01:56",
        masteryPercentage: 92,
        masteryText: "92% (46/50)",
        improvement: "+12%",
      },
      {
        name: "Transitions",
        timingPercentage: 80,
        timingText: "02:10",
        masteryPercentage: 86,
        masteryText: "86% (43/50)",
        improvement: "+9%",
      },
    ],
    "Information and Ideas": [
      {
        name: "Central Ideas and Details",
        timingPercentage: 76,
        timingText: "02:25",
        masteryPercentage: 82,
        masteryText: "82% (41/50)",
        improvement: "+7%",
      },
      {
        name: "Command of Evidence",
        timingPercentage: 65,
        timingText: "03:12",
        masteryPercentage: 78,
        masteryText: "78% (39/50)",
        improvement: "+5%",
      },
      {
        name: "Inferences",
        timingPercentage: 70,
        timingText: "02:45",
        masteryPercentage: 76,
        masteryText: "76% (38/50)",
        improvement: "+4%",
      },
    ],
    "Standard English Conventions": [
      {
        name: "Boundaries",
        timingPercentage: 82,
        timingText: "02:10",
        masteryPercentage: 88,
        masteryText: "88% (44/50)",
        improvement: "+10%",
      },
      {
        name: "Form, Structure, and Sense",
        timingPercentage: 45,
        timingText: "03:45",
        masteryPercentage: 60,
        masteryText: "60% (30/50)",
        improvement: "-3%",
      },
    ],
  };

  const activeTopicsData =
    activeTab === "math" ? mathTopicsData : verbalTopicsData;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Topic icons mapping
  const topicIcons = {
    // Math
    "Algebra": "📐",
    "Advanced Math": "🔬",
    "Problem-Solving and Data Analysis": "📊",
    "Geometry and Trigonometry": "📐",
    // Verbal
    "Craft and Structure": "📚",
    "Expression of Ideas": "💡",
    "Information and Ideas": "📖",
    "Standard English Conventions": "✏️"
  };

  // Prepare mastery data for ring cards
  const prepareMasteryData = () => {
    return Object.entries(activeTopicsData).map(([topic, subtopics]) => ({
      topic,
      icon: topicIcons[topic] || "📝",
      data: {
        subtopics,
        avgMastery: calculateAverageMastery(subtopics),
        avgImprovement: calculateAverageImprovement(subtopics),
      }
    }));
  };

  const masteryCardsData = prepareMasteryData();

  const renderTopicsSection = (topicsData, sectionType) => {
    return (
      <div className="topics-container">
        {Object.entries(topicsData).map(([topic, subtopics]) => {
          const avgTimingPercentage =
            calculateAverageTimingPercentage(subtopics);
          const avgTimingText = calculateAverageTime(subtopics);
          const avgImprovement = calculateAverageImprovement(subtopics);
          const avgMastery = calculateAverageMastery(subtopics);

          const isExpanded = expandedTopics[sectionType]?.[topic] || false;

          return (
            <div key={topic} className="lab-topic-section">
              <div
                className={`lab-topic-header ${isExpanded ? "expanded" : ""}`}
                onClick={() => toggleTopic(topic, sectionType)}
              >
                <div className="topic-header-content">
                  <div className="topic-name-container">
                    <h3 className="topic-name">{topic}</h3>
                    <span
                      className={`improvement ${
                        avgImprovement.includes("+") ? "positive" : "negative"
                      }`}
                    >
                      {avgImprovement}
                    </span>
                  </div>

                  {sectionType === "timing" ? (
                    <div className="lab-timing-cell">
                      <span
                        className={`dropdown-indicator ${
                          isExpanded ? "expanded" : ""
                        }`}
                      >
                        ▼
                      </span>
                      {renderPerformanceBar(avgTimingPercentage)}
                      <div className="lab-timing-text-group">
                        <div className="lab-timing-text">{avgTimingText}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="lab-mastery-cell">
                      <span
                        className={`dropdown-indicator ${
                          isExpanded ? "expanded" : ""
                        }`}
                      >
                        ▼
                      </span>
                      <div className="lab-score-container">
                        <img
                          src={getScoreImage(avgMastery.percentage)}
                          alt={`Score ${getScoreLabel(avgMastery.percentage)}`}
                          className="lab-score-icon"
                        />
                        <div className="lab-mastery-text">
                          {avgMastery.text}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="lab-subtopics">
                  <div className="lab-subtopic-table">
                    {subtopics.map((subtopic, index) => (
                      <div className="lab-subtopic-row" key={index}>
                        <div className="lab-subtopic-name">
                          {subtopic.name}
                          {sectionType === "timing" && (
                            <span
                              className={`improvement ${
                                subtopic.improvement.includes("+")
                                  ? "positive"
                                  : "negative"
                              }`}
                            >
                              {subtopic.improvement}
                            </span>
                          )}
                        </div>

                        {sectionType === "timing" ? (
                          <div className="lab-timing-cell">
                            {renderPerformanceBar(subtopic.timingPercentage)}
                            <div className="lab-timing-text-group">
                              <div className="lab-timing-text">
                                {subtopic.timingText}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="lab-mastery-cell">
                            <div className="lab-score-container">
                              <img
                                src={getScoreImage(subtopic.masteryPercentage)}
                                alt={`Score ${getScoreLabel(
                                  subtopic.masteryPercentage
                                )}`}
                                className="lab-score-icon"
                              />
                              <div className="lab-mastery-text">
                                {subtopic.masteryText}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="lab-page-container">
      {/* Modern Header */}
      <header className="lab-header-modern">
        <div className="lab-header-content">
          <div className="lab-icon-wrapper">
            <img src={labPageIcon} alt="Lab Icon" className="lab-icon" />
          </div>
          <div className="lab-header-text">
            <h1 className="lab-title-modern">Performance Lab</h1>
            <p className="lab-subtitle">Track your progress and master your skills</p>
          </div>
        </div>
      </header>

      <div className="lab-content">
        {/* Aristotle Quote Section */}
        <div className="quote-container-modern">
          <div className="quote-accent-line"></div>
          <img
            src={aristotleIcon}
            alt="Aristotle"
            className="quote-author-icon"
          />
          <div className="quote-text-container">
            <p className="quote-text">
              "Of all considerations, two bear the greatest weight: the
              precision of one's timing and the righteousness of one's
              judgment."
            </p>
            <span className="quote-author">— Aristotle</span>
          </div>
        </div>

        {/* Charts Container */}
        <div className="charts-container">
          <div className="timing-chart-container">
            <QuestionTimingTracker
              questionTimes={sampleQuestionTimingData}
              mathQuestionTimes={sampleMathQuestionTimingData}
            />
          </div>
          <div className="pace-container">
            <PaceCard />
          </div>
        </div>

        {/* Tab Selector */}
        <div className="performance-tab-selector-modern">
          <div className="tab-pill">
            <button
              className={`tab-button ${activeTab === "math" ? "active" : ""}`}
              onClick={() => handleTabChange("math")}
            >
              <i className="fas fa-calculator"></i>
              Math
            </button>
            <button
              className={`tab-button ${activeTab === "verbal" ? "active" : ""}`}
              onClick={() => handleTabChange("verbal")}
            >
              <i className="fas fa-book"></i>
              Verbal
            </button>
          </div>
        </div>

        {/* Performance Sections */}
        <div className="lab-row performance-row">
          {/* Timing Performance */}
          <div className="lab-card timing-card">
            <div className="lab-card-header-modern">
              <div className="lab-card-icon-modern">
                <i className="fas fa-clock"></i>
              </div>
              <h2>Timing Performance</h2>
            </div>
            {renderTopicsSection(activeTopicsData, "timing")}
          </div>

          {/* Mastery Performance */}
          <div className="lab-card mastery-card">
            <div className="lab-card-header-modern">
              <div className="lab-card-icon-modern">
                <i className="fas fa-chart-line"></i>
              </div>
              <h2>Mastery Performance</h2>
            </div>
            {renderTopicsSection(activeTopicsData, "mastery")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabPage;
