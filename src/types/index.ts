// Central export point for all types
export * from './question.types'
export * from './exam.types'
export * from './user.types'
export * from './course.types'
export * from './ui.types'

// Common utility types
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type ID = number | string

// API related types
export interface ApiError {
  message: string
  code?: string
  status?: number
}

export interface ApiResponse<T> {
  data?: T
  error?: ApiError
  success: boolean
}












