import { useState, useCallback } from 'react'
import type { Question } from '@/types'

export const useQuestionNavigation = (questions: Question[]) => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const handleQuestionClick = useCallback(
    (question: Question) => {
      const index = questions.findIndex((q) => q.id === question.id)
      if (index !== -1) {
        setCurrentQuestionIndex(index)
        setSelectedQuestion(question)
      }
    },
    [questions]
  )

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)
      const nextQuestion = questions[nextIndex]
      if (nextQuestion) {
        setSelectedQuestion(nextQuestion)
      }
    }
  }, [currentQuestionIndex, questions])

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1
      setCurrentQuestionIndex(prevIndex)
      const prevQuestion = questions[prevIndex]
      if (prevQuestion) {
        setSelectedQuestion(prevQuestion)
      }
    }
  }, [currentQuestionIndex, questions])

  const handleCloseQuestion = useCallback(() => {
    setSelectedQuestion(null)
    setCurrentQuestionIndex(0)
  }, [])

  const hasNext = currentQuestionIndex < questions.length - 1
  const hasPrevious = currentQuestionIndex > 0

  return {
    selectedQuestion,
    currentQuestionIndex,
    hasNext,
    hasPrevious,
    handleQuestionClick,
    handleNextQuestion,
    handlePreviousQuestion,
    handleCloseQuestion,
  }
}

