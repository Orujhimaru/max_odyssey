import React from 'react'
import practiceHandIcon from '@/assets/practice_hand.svg'

export const PracticeHeader: React.FC = React.memo(() => {
  return (
    <div className="practice-header">
      <h1>
        Practice Arena
        <img
          src={practiceHandIcon}
          alt="Practice Icon"
          className="practice-icon"
        />
      </h1>
    </div>
  )
})

PracticeHeader.displayName = 'PracticeHeader'













