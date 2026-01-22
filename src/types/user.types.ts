// User and authentication related types
import { User as SupabaseUser } from '@supabase/supabase-js'

export interface User extends SupabaseUser {
  full_name?: string
  avatar_url?: string
  preferences?: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  notifications_enabled: boolean
  study_goal_minutes?: number
}

export interface AuthState {
  user: User | null
  session: any | null
  loading: boolean
  initializing: boolean
  isAuthenticated: boolean
  token: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpCredentials {
  email: string
  password: string
  fullName: string
}

export interface AuthResponse {
  success: boolean
  data?: any
  error?: string
}







