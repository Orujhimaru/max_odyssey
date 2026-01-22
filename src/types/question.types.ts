// Question related types
export interface Question {
  id: number
  question_text: string
  subject_id: 1 | 2 // 1 = Math, 2 = Verbal
  difficulty_level: 0 | 1 | 2 // 0 = Easy, 1 = Medium, 2 = Hard
  topic: string
  subtopic: string
  solve_rate: number
  correct_answer_index: number
  is_solved?: boolean
  incorrect?: boolean
  is_bookmarked?: boolean
  is_bluebook?: boolean
  choices?: string[]
  explanation?: string
  userState?: QuestionUserState
  created_at?: string
  updated_at?: string
}

export interface QuestionUserState {
  questionId: number
  isBookmarked: boolean
  isSolved: boolean
  isIncorrect: boolean
  selectedOption?: number
  timestamp: string
}

export interface QuestionFilters {
  subject: 1 | 2
  difficulty?: number | string
  topic?: string
  subtopic?: string
  hide_solved?: boolean
  incorrect?: boolean
  is_bookmarked?: number
  is_bluebook?: number
  sort_dir?: 'asc' | 'desc'
  page?: number
  page_size?: number
  refreshTimestamp?: number
}

export interface PaginatedResponse<T> {
  questions?: T[]
  data?: T[]
  total_pages: number
  total_questions?: number
  total_items?: number
  current_page: number
  pagination?: {
    total_pages: number
    total_items: number
    current_page: number
  }
}

export type QuestionDifficulty = 'easy' | 'medium' | 'hard'
export type SubjectType = 'math' | 'verbal'







