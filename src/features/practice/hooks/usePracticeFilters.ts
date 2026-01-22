import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  setSubject,
  setDifficulty,
  setTopic,
  toggleHideSolved,
  toggleIncorrect,
  toggleBookmarked,
  toggleBluebook,
  setSortDir,
  setCurrentPage,
} from '@/store/slices/practiceSlice'

export const usePracticeFilters = () => {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.practice.filters)
  const currentPage = useAppSelector((state) => state.practice.currentPage)
  const activeFilter = useAppSelector((state) => state.practice.activeFilter)

  const handleSubjectChange = useCallback(
    (subject: 1 | 2) => {
      dispatch(setSubject(subject))
    },
    [dispatch]
  )

  const handleDifficultyChange = useCallback(
    (difficulty: number | string) => {
      dispatch(setDifficulty(difficulty))
    },
    [dispatch]
  )

  const handleTopicChange = useCallback(
    (topic: string, subtopic?: string) => {
      dispatch(setTopic({ topic, subtopic }))
    },
    [dispatch]
  )

  const handleHideSolvedToggle = useCallback(() => {
    dispatch(toggleHideSolved())
  }, [dispatch])

  const handleIncorrectToggle = useCallback(() => {
    dispatch(toggleIncorrect())
  }, [dispatch])

  const handleBookmarkToggle = useCallback(() => {
    dispatch(toggleBookmarked())
  }, [dispatch])

  const handleBluebookToggle = useCallback(() => {
    dispatch(toggleBluebook())
  }, [dispatch])

  const handleSortChange = useCallback(
    (direction: 'asc' | 'desc') => {
      dispatch(setSortDir(direction))
    },
    [dispatch]
  )

  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(setCurrentPage(page))
      window.scrollTo({ top: 0 })
    },
    [dispatch]
  )

  return {
    filters,
    currentPage,
    activeFilter,
    handleSubjectChange,
    handleDifficultyChange,
    handleTopicChange,
    handleHideSolvedToggle,
    handleIncorrectToggle,
    handleBookmarkToggle,
    handleBluebookToggle,
    handleSortChange,
    handlePageChange,
  }
}








