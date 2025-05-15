import React from "react";
import "./CheckYourWork.css";

const CheckYourWork = ({
  currentModule,
  selectedAnswers,
  markedQuestions,
  onGoBack,
  onNextModule,
  isLastModule,
  moduleTitle,
}) => {
  return (
    <div className="check-your-work">
      <h1>Check Your Work</h1>

      <div className="explanation">
        <p>
          On test day, you won't be able to move on to the next module until
          time expires.
        </p>
        <p>
          For these practice questions, you can click <strong>Next</strong> when
          you're ready to move on.
        </p>
      </div>

      <div className="module-section">
        <h2>{moduleTitle}</h2>

        <div className="question-navigation">
          <div className="question-legend">
            <div className="legend-item">
              <div className="square answered"></div>
              <span>Answered</span>
            </div>
            <div className="legend-item">
              <div className="square unanswered"></div>
              <span>Unanswered</span>
            </div>
            <div className="legend-item">
              <div className="square for-review"></div>
              <span>For Review</span>
            </div>
          </div>

          <div className="question-grid">
            {currentModule.questions.map((question, index) => {
              const questionId = question.question_id;
              const isAnswered = !!selectedAnswers[questionId];
              const isMarked = markedQuestions.includes(index);

              return (
                <div
                  key={questionId || index}
                  className={`question-number ${
                    isAnswered ? "answered" : "unanswered"
                  } ${isMarked ? "for-review" : ""}`}
                  onClick={() => onGoBack(index)}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="actions">
        <button className="btn-back" onClick={() => onGoBack()}>
          Back
        </button>
        {!isLastModule && (
          <button className="btn-next" onClick={onNextModule}>
            Next Module
          </button>
        )}
      </div>
    </div>
  );
};

export default CheckYourWork;
