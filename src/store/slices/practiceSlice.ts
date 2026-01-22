import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { PracticeState } from '@/types'

const initialState: PracticeState = {
  filters: {
    subject: 2, // Default to Verbal
    difficulty: '',
    topic: '',
    subtopic: '',
    hide_solved: false,
    incorrect: false,
    is_bookmarked: 0,
    is_bluebook: 0,
    sort_dir: 'desc',
  },
  selectedTopics: [],
  currentPage: 1,
  activeFilter: null,
}

const practiceSlice = createSlice({
  name: 'practice',
  initialState,
  reducers: {
    setSubject: (state, action: PayloadAction<1 | 2>) => {
      state.filters.subject = action.payload
      state.currentPage = 1
      // Reset topic filters when changing subject
      state.filters.topic = ''
      state.filters.subtopic = ''
      state.selectedTopics = []
    },
    setDifficulty: (state, action: PayloadAction<number | string>) => {
      state.filters.difficulty = action.payload
      state.currentPage = 1
    },
    setTopic: (state, action: PayloadAction<{ topic: string; subtopic?: string }>) => {
      state.filters.topic = action.payload.topic
      state.filters.subtopic = action.payload.subtopic || ''
      state.currentPage = 1
    },
    toggleHideSolved: (state) => {
      state.filters.hide_solved = !state.filters.hide_solved
      state.currentPage = 1
    },
    toggleIncorrect: (state) => {
      state.filters.incorrect = !state.filters.incorrect
      state.currentPage = 1
      // Turn off hide_solved when activating incorrect
      if (state.filters.incorrect) {
        state.filters.hide_solved = false
      }
    },
    toggleBookmarked: (state) => {
      state.filters.is_bookmarked = state.filters.is_bookmarked === 1 ? 0 : 1
      state.currentPage = 1
    },
    toggleBluebook: (state) => {
      state.filters.is_bluebook = state.filters.is_bluebook === 1 ? 0 : 1
      state.currentPage = 1
    },
    setSortDir: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.filters.sort_dir = action.payload
      state.currentPage = 1
    },
    setSelectedTopics: (state, action: PayloadAction<string[]>) => {
      state.selectedTopics = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setActiveFilter: (state, action: PayloadAction<'incorrect' | 'solved' | null>) => {
      state.activeFilter = action.payload
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
      state.selectedTopics = []
      state.currentPage = 1
      state.activeFilter = null
    },
  },
})

export const {
  setSubject,
  setDifficulty,
  setTopic,
  toggleHideSolved,
  toggleIncorrect,
  toggleBookmarked,
  toggleBluebook,
  setSortDir,
  setSelectedTopics,
  setCurrentPage,
  setActiveFilter,
  resetFilters,
} = practiceSlice.actions

export default practiceSlice.reducer







