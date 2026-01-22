import React from 'react'

interface QuestionListHeaderProps {
  onSolveRateSort: () => void
}

export const QuestionListHeader: React.FC<QuestionListHeaderProps> = React.memo(
  ({ onSolveRateSort }) => {
    return (
      <div className="practice-questions-header">
        <div className="header-left">
          <span className="header-number">#</span>
          <span className="header-type">S</span>
          <span className="header-difficulty">🧩</span>
          <span className="header-question">Question</span>
        </div>
        <div className="header-right">
          <span className="header-tags">Tags</span>
          <div className="solve-rate-header" onClick={onSolveRateSort}>
            Solve Rate
            <div className="sort-icons">
              <i className="fas fa-sort-up"></i>
              <i className="fas fa-sort-down"></i>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

QuestionListHeader.displayName = 'QuestionListHeader'







