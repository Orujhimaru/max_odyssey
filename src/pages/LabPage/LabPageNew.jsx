import React, { useState, useEffect } from "react";
import "./LabPageNew.css";
import aristotleIcon from "../../assets/aristotle.svg";
import labPageIcon from "../../assets/lab_page.svg";

// Import score SVGs
import scoreAce from "../../assets/ace.svg";
import scoreGood from "../../assets/good.svg";
import scoreMid from "../../assets/mid.svg";
import scoreBad from "../../assets/bad.svg";
import scoreNone from "../../assets/none.svg";

// Import QuestionTimingTracker
import QuestionTimingTracker from "../../components/QuestionTimingTracker/QuestionTimingTracker";

// Sample timing data
const sampleQuestionTimingData = [
  42, 55, 38, 70, 25, 60, 80, 35, 50, 45, 90, 100, 110, 30, 20, 40, 60, 70, 80,
  90, 25, 35, 45, 55, 65, 75, 85,
];

const sampleMathQuestionTimingData = [
  25, 30, 35, 28, 32, 40, 50, 65, 75, 60, 80, 70, 85, 55, 90,
  110, 125, 100, 130, 115, 105, 120,
];

const LabPage = () => {
  const [activeTab, setActiveTab] = useState("math");
  const [expandedTopics, setExpandedTopics] = useState({});

  // Reset expanded topics when tab changes
  useEffect(() => {
    setExpandedTopics({});
  }, [activeTab]);

  const toggleTopic = (topic) => {
    setExpandedTopics((prev) => ({
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

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 85) return "excellent";
    if (percentage >= 70) return "good";
    if (percentage >= 55) return "average";
    return "needs-work";
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
      text: `${avgMastery}%`,
      questions: `${totalCorrect}/${totalQuestions}`,
    };
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
      <div className="perf-bar-wrapper">
        <div className="perf-bar">
          <div className="perf-segment"></div>
          <div className="perf-segment"></div>
          <div className="perf-segment"></div>
          <div className="perf-segment"></div>

          {greenWidth > 0 && (
            <div
              className="perf-fill good"
              style={{
                width: `${greenWidth}%`,
              }}
            ></div>
          )}

          {redWidth > 0 && (
            <div
              className="perf-fill slow"
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
        timingText: "02:29",
        masteryPercentage: 88,
        masteryText: "88% (44/50)",
        improvement: "+5%",
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
        improvement: "+3%",
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
        timingText: "02:12",
        masteryPercentage: 90,
        masteryText: "90% (45/50)",
        improvement: "+8%",
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
        timingText: "02:53",
        masteryPercentage: 88,
        masteryText: "88% (44/50)",
        improvement: "+4%",
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
    "Geometry and Trigonometry": "🔺",
    // Verbal
    "Craft and Structure": "📚",
    "Expression of Ideas": "💡",
    "Information and Ideas": "📖",
    "Standard English Conventions": "✏️"
  };

  // Calculate overall stats
  const calculateOverallStats = () => {
    const allSubtopics = Object.values(activeTopicsData).flat();
    const avgMastery = calculateAverageMastery(allSubtopics);
    const avgTime = calculateAverageTime(allSubtopics);
    const avgImprovement = calculateAverageImprovement(allSubtopics);
    
    return { avgMastery, avgTime, avgImprovement };
  };

  const overallStats = calculateOverallStats();

  return (
    <div className="lab-page-new">
      {/* Hero Header */}
      <div className="lab-hero">
        <div className="lab-hero-content">
          <div className="lab-hero-icon">
            <img src={labPageIcon} alt="Lab" />
          </div>
          <div className="lab-hero-text">
            <h1>Performance Lab</h1>
            <p>Track your progress and master your skills</p>
          </div>
        </div>
      </div>

      <div className="lab-page-content">
        {/* Aristotle Quote */}
        <div className="lab-quote-card">
          <img src={aristotleIcon} alt="Aristotle" className="lab-quote-avatar" />
          <div className="lab-quote-content">
            <p className="lab-quote-text">
              "Of all considerations, two bear the greatest weight: the precision of one's timing and the righteousness of one's judgment."
            </p>
            <span className="lab-quote-author">— Aristotle</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="lab-tab-selector">
          <button
            className={`lab-tab ${activeTab === "math" ? "active" : ""}`}
            onClick={() => handleTabChange("math")}
          >
            <i className="fas fa-calculator"></i>
            <span>Math</span>
          </button>
          <button
            className={`lab-tab ${activeTab === "verbal" ? "active" : ""}`}
            onClick={() => handleTabChange("verbal")}
          >
            <i className="fas fa-book"></i>
            <span>Verbal</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="lab-stats-grid">
          <div className="lab-stat-card">
            <div className="lab-stat-icon mastery">
              <i className="fas fa-trophy"></i>
            </div>
            <div className="lab-stat-content">
              <span className="lab-stat-label">Overall Mastery</span>
              <div className="lab-stat-value">{overallStats.avgMastery.percentage}%</div>
              <span className="lab-stat-sub">{overallStats.avgMastery.questions} questions</span>
            </div>
          </div>

          <div className="lab-stat-card">
            <div className="lab-stat-icon timing">
              <i className="fas fa-clock"></i>
            </div>
            <div className="lab-stat-content">
              <span className="lab-stat-label">Avg Time/Question</span>
              <div className="lab-stat-value">{overallStats.avgTime}</div>
              <span className="lab-stat-sub">per question</span>
            </div>
          </div>

          <div className="lab-stat-card">
            <div className={`lab-stat-icon improvement ${overallStats.avgImprovement.includes('+') ? 'positive' : 'negative'}`}>
              <i className={`fas fa-arrow-${overallStats.avgImprovement.includes('+') ? 'up' : 'down'}`}></i>
            </div>
            <div className="lab-stat-content">
              <span className="lab-stat-label">Improvement</span>
              <div className={`lab-stat-value ${overallStats.avgImprovement.includes('+') ? 'positive' : 'negative'}`}>
                {overallStats.avgImprovement}
              </div>
              <span className="lab-stat-sub">vs last month</span>
            </div>
          </div>
        </div>

        {/* Timing Chart */}
        <div className="lab-chart-card">
          <div className="lab-card-header">
            <i className="fas fa-chart-area"></i>
            <h2>Question Timing Distribution</h2>
          </div>
          <QuestionTimingTracker
            questionTimes={sampleQuestionTimingData}
            mathQuestionTimes={sampleMathQuestionTimingData}
          />
        </div>

        {/* Performance by Topic */}
        <div className="lab-topics-section">
          <div className="lab-section-header">
            <i className="fas fa-list-check"></i>
            <h2>Performance by Topic</h2>
          </div>

          <div className="lab-topics-list">
            {Object.entries(activeTopicsData).map(([topic, subtopics]) => {
              const avgMastery = calculateAverageMastery(subtopics);
              const avgTime = calculateAverageTime(subtopics);
              const avgImprovement = calculateAverageImprovement(subtopics);
              const avgTimingPercentage = subtopics.reduce((acc, s) => acc + s.timingPercentage, 0) / subtopics.length;
              const performanceLevel = getPerformanceLevel(avgMastery.percentage);
              const isExpanded = expandedTopics[topic] || false;

              return (
                <div key={topic} className={`lab-topic-card ${performanceLevel}`}>
                  <div 
                    className="lab-topic-main"
                    onClick={() => toggleTopic(topic)}
                  >
                    <div className="lab-topic-left">
                      <span className="lab-topic-icon">{topicIcons[topic]}</span>
                      <div className="lab-topic-info">
                        <h3 className="lab-topic-name">{topic}</h3>
                        <span className="lab-topic-count">{subtopics.length} subtopics</span>
                      </div>
                    </div>

                    <div className="lab-topic-metrics">
                      <div className="lab-metric">
                        <span className="lab-metric-label">Mastery</span>
                        <div className="lab-metric-value-row">
                          <img 
                            src={getScoreImage(avgMastery.percentage)} 
                            alt="Score" 
                            className="lab-metric-icon"
                          />
                          <span className="lab-metric-value">{avgMastery.text}</span>
                        </div>
                        <span className="lab-metric-sub">{avgMastery.questions}</span>
                      </div>

                      <div className="lab-metric">
                        <span className="lab-metric-label">Avg Time</span>
                        <div className="lab-metric-value-row">
                          <span className="lab-metric-value">{avgTime}</span>
                        </div>
                        {renderPerformanceBar(avgTimingPercentage)}
                      </div>

                      <div className="lab-metric">
                        <span className="lab-metric-label">Trend</span>
                        <span className={`lab-metric-badge ${avgImprovement.includes('+') ? 'positive' : 'negative'}`}>
                          <i className={`fas fa-arrow-${avgImprovement.includes('+') ? 'up' : 'down'}`}></i>
                          {avgImprovement}
                        </span>
                      </div>

                      <button className={`lab-expand-btn ${isExpanded ? 'expanded' : ''}`}>
                        <i className="fas fa-chevron-down"></i>
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="lab-subtopics">
                      {subtopics.map((subtopic, idx) => (
                        <div key={idx} className="lab-subtopic-row">
                          <div className="lab-subtopic-name">
                            <span className="lab-subtopic-bullet">•</span>
                            {subtopic.name}
                          </div>

                          <div className="lab-subtopic-metrics">
                            <div className="lab-subtopic-metric">
                              <img 
                                src={getScoreImage(subtopic.masteryPercentage)} 
                                alt="Score" 
                                className="lab-subtopic-icon"
                              />
                              <span>{subtopic.masteryText}</span>
                            </div>

                            <div className="lab-subtopic-metric">
                              <i className="fas fa-clock"></i>
                              <span>{subtopic.timingText}</span>
                            </div>

                            <span className={`lab-subtopic-badge ${subtopic.improvement.includes('+') ? 'positive' : 'negative'}`}>
                              {subtopic.improvement}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabPage;

