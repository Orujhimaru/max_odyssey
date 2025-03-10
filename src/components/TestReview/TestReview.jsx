import React, { useState } from "react";
import QuestionNavigator from "./QuestionNavigator";
import "./TestReview.css";

const mockQuestions = [
  {
    id: 1,
    type: "Verbal",
    topic: "Reading Comprehension",
    subtopic: "Main Idea",
    difficulty: "Medium",
    isBookmarked: false,
    isIncorrect: true,
    question: "In the given passage, the author's primary purpose is to...",
    passage:
      "Recent studies in paleontology have revealed surprising insights about dinosaur behavior. Contrary to earlier beliefs that dinosaurs were solitary creatures, evidence now suggests they lived in complex social groups. Fossil discoveries in Montana show multiple generations of the same species living together, indicating family structures similar to modern elephants...",
    choices: [
      "A) compare dinosaur behavior to modern animals",
      "B) challenge traditional views about dinosaur social structures",
      "C) explain new paleontological research methods",
      "D) discuss the importance of fossil discoveries in Montana",
    ],
    correctAnswer: "B",
    userAnswer: "A",
    explanation:
      "The passage primarily focuses on challenging previous assumptions about dinosaur behavior, particularly their social nature. While comparisons to modern animals are made, they serve to support the main argument about dinosaur social structures.",
  },
  {
    id: 2,
    type: "Math",
    topic: "Algebra",
    subtopic: "Quadratic Equations",
    difficulty: "Hard",
    isBookmarked: true,
    isIncorrect: false,
    question:
      "If x² + bx + c = 0 has exactly one solution and c = 4, what is the value of b?",
    choices: ["A) -4", "B) 4", "C) -8", "D) 8"],
    correctAnswer: "A",
    userAnswer: "A",
    explanation:
      "For a quadratic equation to have exactly one solution, its discriminant must be zero. Using the discriminant formula b² - 4ac = 0, where a = 1 and c = 4: b² - 4(1)(4) = 0, b² - 16 = 0, b² = 16, b = ±4. Since we need the negative value for this context, b = -4.",
  },
  {
    id: 3,
    type: "Verbal",
    topic: "Critical Reasoning",
    subtopic: "Strengthen Argument",
    difficulty: "Hard",
    isBookmarked: true,
    isIncorrect: true,
    question:
      "A company's sales increased by 25% after implementing a new marketing strategy. The marketing director claims this proves the effectiveness of the strategy. Which of the following, if true, most strengthens the director's argument?",
    choices: [
      "A) Other companies in the industry saw an average sales decrease during the same period",
      "B) The company had experienced similar sales increases in previous years",
      "C) The cost of implementing the new strategy was higher than expected",
      "D) Customer satisfaction surveys showed mixed results after the strategy implementation",
    ],
    correctAnswer: "A",
    userAnswer: "B",
    explanation:
      "Option A strengthens the argument by eliminating an alternative explanation (industry-wide growth) and suggesting the increase was unique to this company's strategy.",
  },
  {
    id: 4,
    type: "Math",
    topic: "Number Properties",
    subtopic: "Prime Numbers",
    difficulty: "Medium",
    isBookmarked: false,
    isIncorrect: true,
    question:
      "If p is prime and p² + 2 = n, which of the following CANNOT be true?",
    choices: [
      "A) n is odd",
      "B) n is divisible by 3",
      "C) n is a perfect square",
      "D) n is greater than 100",
    ],
    correctAnswer: "C",
    userAnswer: "A",
    explanation:
      "Since p is prime, p² + 2 cannot be a perfect square. For any prime p > 2, p² + 2 falls between two consecutive perfect squares.",
  },
  {
    id: 5,
    type: "Verbal",
    topic: "Sentence Correction",
    subtopic: "Parallelism",
    difficulty: "Medium",
    isBookmarked: false,
    isIncorrect: false,
    question:
      "Unlike his previous films, which were known for their extravagant special effects but weak plots, the director's latest movie emphasizes character development and focusing on storytelling.",
    choices: [
      "A) emphasizes character development and focusing on storytelling",
      "B) emphasizes character development and focuses on storytelling",
      "C) emphasizes character development and storytelling",
      "D) has an emphasis on character development and storytelling focus",
    ],
    correctAnswer: "C",
    userAnswer: "C",
    explanation:
      "The sentence requires parallel construction. 'Emphasizes X and Y' is the correct parallel structure, where both X and Y are nouns.",
  },
  {
    id: 6,
    type: "Math",
    topic: "Geometry",
    subtopic: "Circles",
    difficulty: "Hard",
    isBookmarked: true,
    isIncorrect: true,
    question:
      "A circle with center O has radius r. Points A and B lie on the circle, and angle AOB = 60°. If the area of the sector AOB is 8π square units, what is the length of arc AB?",
    choices: ["A) 4π", "B) 6", "C) 8", "D) 4π/3"],
    correctAnswer: "A",
    userAnswer: "C",
    explanation:
      "Since angle AOB = 60° = π/3 radians, and the sector area is 8π, we can use the formula: Area = (1/2)r²θ. Thus, 8π = (1/2)r²(π/3), solving gives r = 8. The arc length is rθ = 8(π/3) = 4π.",
  },
  {
    id: 7,
    type: "Verbal",
    topic: "Reading Comprehension",
    subtopic: "Inference",
    difficulty: "Hard",
    isBookmarked: false,
    isIncorrect: true,
    question:
      "Based on the passage about quantum computing, which of the following best describes the author's view of current quantum technology?",
    passage:
      "While quantum computers promise revolutionary advances in computational power, current implementations remain highly susceptible to environmental interference. Even minor temperature fluctuations can disrupt the delicate quantum states necessary for computation. Despite recent advances in error correction, we are still years away from practical quantum supremacy...",
    choices: [
      "A) Enthusiastically optimistic about immediate applications",
      "B) Cautiously optimistic while acknowledging significant challenges",
      "C) Deeply skeptical of the technology's fundamental premises",
      "D) Primarily concerned with technical implementation details",
    ],
    correctAnswer: "B",
    userAnswer: "D",
    explanation:
      "The author acknowledges quantum computing's potential ('promise revolutionary advances') while realistically addressing current limitations, showing cautious optimism.",
  },
  {
    id: 8,
    type: "Math",
    topic: "Probability",
    subtopic: "Conditional Probability",
    difficulty: "Medium",
    isBookmarked: false,
    isIncorrect: false,
    question:
      "In a bag of marbles, 60% are blue and 40% are red. 30% of the blue marbles and 20% of the red marbles have stripes. If a marble is selected at random and has stripes, what is the probability it is blue?",
    choices: ["A) 0.69", "B) 0.75", "C) 0.82", "D) 0.78"],
    correctAnswer: "C",
    userAnswer: "C",
    explanation:
      "Using Bayes' Theorem: P(Blue|Stripes) = P(Stripes|Blue)P(Blue)/P(Stripes) = (0.3)(0.6)/[(0.3)(0.6)+(0.2)(0.4)] = 0.18/0.22 ≈ 0.82",
  },
  // ... Add 16 more questions with similar structure
];

const TestReview = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);

  const question = mockQuestions[currentQuestion];

  return (
    <div className="test-review-container">
      {/* Header Section */}
      <div className="test-review-header">
        <div className="test-info">
          <h2>Practice Test #3</h2>
          <span>Date: Apr 15, 2024</span>
        </div>
        <h2>Section 1, Module 1: Reading and Writing</h2>
        {/* <div className="test-stats">
            <span>Date: Apr 15, 2024</span>
            {/* <span>Score: 720</span> */}
        {/* <span>Time: 1h 45m</span>    </div> */}

        <div className="question-info">
          <div className="question-type">
            <span
              className={`difficulty-indicator ${question.difficulty.toLowerCase()}`}
            >
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </span>
            <span className="topic">{question.topic}</span>
            <span className="subtopic">{question.subtopic}</span>
          </div>
        </div>
      </div>

      {/* Navigation Button */}
      <div className="navigation-controls">
        <button
          className="nav-button"
          onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
        >
          <i className="fas fa-chevron-left"></i>
          Previous
        </button>

        <button
          className="question-counter"
          onClick={() => setIsNavigatorOpen(!isNavigatorOpen)}
        >
          Question {currentQuestion + 1} of {mockQuestions.length}
          <i
            className={`fas fa-chevron-${isNavigatorOpen ? "up" : "down"}`}
          ></i>
        </button>

        <button
          className="nav-button"
          onClick={() =>
            setCurrentQuestion((prev) =>
              Math.min(mockQuestions.length - 1, prev + 1)
            )
          }
          disabled={currentQuestion === mockQuestions.length - 1}
        >
          Next
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      {/* Question Navigator Popup */}
      {isNavigatorOpen && (
        <QuestionNavigator
          questions={mockQuestions}
          currentQuestion={currentQuestion}
          onSelect={(index) => {
            setCurrentQuestion(index);
            setIsNavigatorOpen(false);
          }}
        />
      )}

      {/* Main Content */}
      <div className="test-review-content">
        {/* Question Section */}
        <div className="question-section">
          {question.passage && (
            <div className="passage">{question.passage}</div>
          )}
          <div className="question">
            <p>{question.question}</p>
            <div className="choices">
              {question.choices.map((choice, index) => {
                const [letter, ...text] = choice.split(") ");
                return (
                  <div
                    key={index}
                    className={`choice ${
                      choice.startsWith(question.correctAnswer)
                        ? "correct"
                        : choice.startsWith(question.userAnswer)
                        ? "incorrect"
                        : ""
                    }`}
                  >
                    <span className="choice-letter">{letter}</span>
                    <span>{text.join(") ")}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Explanation Section */}
        <div className="explanation-section">
          <h3>Explanation</h3>
          <p>{question.explanation}</p>
          <div className="question-actions">
            <button className="bookmark-btn">
              <i
                className={`fas fa-bookmark ${
                  question.isBookmarked ? "active" : ""
                }`}
              ></i>
              Bookmark
            </button>
            <button className="report-btn">
              <i className="fas fa-flag"></i>
              Report Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestReview;
