import React, { useState, useEffect } from "react";
import "./TestInterface.css";

const TestInterface = ({ testType, onExit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [markedQuestions, setMarkedQuestions] = useState([]);
  const [crossedOptions, setCrossedOptions] = useState({});
  const [timeRemaining, setTimeRemaining] = useState("2:45:00");

  // Add class to body when component mounts
  useEffect(() => {
    document.body.classList.add("taking-test");

    // Remove class when component unmounts
    return () => {
      document.body.classList.remove("taking-test");
    };
  }, []);

  // Handle exit with class removal
  const handleExit = () => {
    document.body.classList.remove("taking-test");
    onExit();
  };

  // Mock questions for the test
  const questions = [
    {
      id: 1,
      text: "K.D. Leka and colleagues found that the Sun's corona provides an advance indication of solar flares—intense eruptions of electromagnetic radiation that emanate from active regions in the Sun's photosphere and can interfere with telecommunications on Earth. Preceding a flare, the corona temporarily exhibits increased brightness above the region where the flare is _____.",
      options: [
        { id: "A", text: "antecedent" },
        { id: "B", text: "impending" },
        { id: "C", text: "innocuous" },
        { id: "D", text: "perpetual" },
      ],
      section: "Reading and Writing",
      module: 1,
      correctAnswer: "B",
    },
    {
      id: 2,
      text: "The author's primary purpose in the passage is to",
      options: [
        {
          id: "A",
          text: "explain a scientific phenomenon and its practical implications",
        },
        { id: "B", text: "challenge a widely accepted scientific theory" },
        {
          id: "C",
          text: "compare competing explanations for a natural occurrence",
        },
        {
          id: "D",
          text: "trace the historical development of a scientific discovery",
        },
      ],
      section: "Reading and Writing",
      module: 1,
      correctAnswer: "A",
    },
    {
      id: 3,
      text: "If x + y = 10 and xy = 21, what is the value of x² + y²?",
      options: [
        { id: "A", text: "58" },
        { id: "B", text: "79" },
        { id: "C", text: "100" },
        { id: "D", text: "121" },
      ],
      section: "Math",
      module: 1,
      correctAnswer: "A",
    },
    {
      id: 4,
      text: "A line passes through the points (2, 5) and (4, 9). Which of the following is the equation of this line?",
      options: [
        { id: "A", text: "y = 2x + 1" },
        { id: "B", text: "y = 2x + 2" },
        { id: "C", text: "y = 2x + 3" },
        { id: "D", text: "y = 3x - 1" },
      ],
      section: "Math",
      module: 1,
      correctAnswer: "A",
    },
  ];

  const handleAnswerSelect = (optionId) => {
    setSelectedAnswer(optionId);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };

  const toggleMarkQuestion = () => {
    if (markedQuestions.includes(currentQuestion)) {
      setMarkedQuestions(markedQuestions.filter((q) => q !== currentQuestion));
    } else {
      setMarkedQuestions([...markedQuestions, currentQuestion]);
    }
  };

  const toggleCrossMode = () => {
    const currentCrossMode =
      crossedOptions[currentQuestion]?.crossMode || false;
    setCrossedOptions({
      ...crossedOptions,
      [currentQuestion]: {
        ...crossedOptions[currentQuestion],
        crossMode: !currentCrossMode,
      },
    });
  };

  const toggleCrossOption = (optionId) => {
    if (!crossedOptions[currentQuestion]?.crossMode) return;

    const currentCrossed = crossedOptions[currentQuestion]?.crossed || [];
    const newCrossed = currentCrossed.includes(optionId)
      ? currentCrossed.filter((id) => id !== optionId)
      : [...currentCrossed, optionId];

    setCrossedOptions({
      ...crossedOptions,
      [currentQuestion]: {
        ...crossedOptions[currentQuestion],
        crossed: newCrossed,
      },
    });
    console.log("Crossed options:", crossedOptions); // Debug
  };

  const isOptionCrossed = (optionId) => {
    const isCrossed =
      crossedOptions[currentQuestion]?.crossed?.includes(optionId) || false;
    console.log(`Option ${optionId} crossed:`, isCrossed); // Debug
    return (
      crossedOptions[currentQuestion]?.crossed?.includes(optionId) || false
    );
  };

  const isCrossModeActive = () => {
    return crossedOptions[currentQuestion]?.crossMode || false;
  };

  const currentQ = questions[currentQuestion];
  const isMarked = markedQuestions.includes(currentQuestion);

  return (
    <div className="test-interface">
      <div className="test-header">
        <div className="test-info">
          <h1>Section 1, Module 1: Reading and Writing</h1>
          <div className="test-progress">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
        <div className="test-controls">
          <div className="timer">
            <i className="far fa-clock"></i> {timeRemaining}
          </div>
          <button className="exit-button" onClick={handleExit}>
            <i className="fas fa-times"></i> Exit
          </button>
        </div>
      </div>

      <div className="test-content">
        <div className="question-area">
          <div className="question-number">
            <span>{currentQuestion + 1}</span>
            <div className="question-tools">
              <button
                className={`mark-button ${isMarked ? "marked" : ""}`}
                onClick={toggleMarkQuestion}
                title="Mark for review"
              >
                <i className={`${isMarked ? "fas" : "far"} fa-bookmark`}></i>
              </button>
              <button
                className={`cross-button ${
                  isCrossModeActive() ? "active" : ""
                }`}
                onClick={toggleCrossMode}
                title="Toggle cross-out mode"
              >
                <span className="cross-text">Abc</span>
              </button>
              {isCrossModeActive() && (
                <div className="cross-mode-indicator">
                  Click on options to cross them out
                </div>
              )}
            </div>
          </div>
          <div className="question-text">
            <p>{currentQ.text}</p>
          </div>
          <div className="answer-options">
            {currentQ.options.map((option) => (
              <div
                key={option.id}
                className={`answer-option ${
                  selectedAnswer === option.id ? "selected" : ""
                } ${isOptionCrossed(option.id) ? "crossed" : ""}`}
                onClick={() =>
                  isCrossModeActive()
                    ? toggleCrossOption(option.id)
                    : handleAnswerSelect(option.id)
                }
              >
                <div className="option-letter">{option.id}</div>
                <div className="option-text">{option.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="question-navigator">
          <div className="navigator-header">
            <h3>Question Navigator</h3>
            <div className="navigator-legend">
              <div className="legend-item">
                <div className="legend-marker answered"></div>
                <span>Answered</span>
              </div>
              <div className="legend-item">
                <div className="legend-marker unanswered"></div>
                <span>Unanswered</span>
              </div>
              <div className="legend-item">
                <div className="legend-marker marked"></div>
                <span>Marked</span>
              </div>
            </div>
          </div>
          <div className="question-buttons">
            {questions.map((q, index) => (
              <button
                key={q.id}
                className={`question-button ${
                  index === currentQuestion ? "current" : ""
                } ${markedQuestions.includes(index) ? "marked" : ""}`}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="test-footer">
        <button
          className="nav-button previous"
          onClick={handlePreviousQuestion}
          disabled={currentQuestion === 0}
        >
          <i className="fas fa-chevron-left"></i> Previous
        </button>
        <button
          className="nav-button next"
          onClick={handleNextQuestion}
          disabled={currentQuestion === questions.length - 1}
        >
          Next <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default TestInterface;
