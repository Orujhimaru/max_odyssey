import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalQuestions: number
  onPageChange: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = React.memo(
  ({ currentPage, totalPages, totalQuestions, onPageChange }) => {
    return (
      <div className="pagination">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages} ({totalQuestions} questions)
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    )
  }
)

Pagination.displayName = 'Pagination'





