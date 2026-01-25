import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { User, AuthState } from '@/types'

const initialState: AuthState = {
  user: null,
  session: null,
  loading: false,
  initializing: true,
  isAuthenticated: false,
  token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    },
    setSession: (state, action: PayloadAction<any>) => {
      state.session = action.payload
      state.token = action.payload?.access_token || null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setInitializing: (state, action: PayloadAction<boolean>) => {
      state.initializing = action.payload
    },
    logout: (state) => {
      state.user = null
      state.session = null
      state.token = null
      state.isAuthenticated = false
    },
  },
})

export const { setUser, setSession, setLoading, setInitializing, logout } =
  authSlice.actions
export default authSlice.reducer











