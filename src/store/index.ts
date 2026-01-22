import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import practiceReducer from './slices/practiceSlice'
import testReducer from './slices/testSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    practice: practiceReducer,
    test: testReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths in the state for serializable check
        ignoredActions: ['auth/setSession', 'test/setActiveTest'],
        ignoredPaths: ['auth.session', 'test.activeTest'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch








