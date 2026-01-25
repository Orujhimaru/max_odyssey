import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { TestState, Exam, TestType } from '@/types'

const initialState: TestState = {
  activeTest: null,
  testInProgress: false,
  reviewingTest: null,
  selectedTestType: 'official',
}

const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    setActiveTest: (state, action: PayloadAction<Exam | null>) => {
      state.activeTest = action.payload
      state.testInProgress = !!action.payload
    },
    startTest: (state, action: PayloadAction<{ type: TestType; exam?: Exam }>) => {
      state.selectedTestType = action.payload.type
      state.activeTest = action.payload.exam || null
      state.testInProgress = true
    },
    endTest: (state) => {
      state.activeTest = null
      state.testInProgress = false
    },
    setReviewingTest: (state, action: PayloadAction<Exam | null>) => {
      state.reviewingTest = action.payload
    },
    setSelectedTestType: (state, action: PayloadAction<TestType>) => {
      state.selectedTestType = action.payload
    },
  },
})

export const {
  setActiveTest,
  startTest,
  endTest,
  setReviewingTest,
  setSelectedTestType,
} = testSlice.actions

export default testSlice.reducer











