// Exam and test related types
export interface Exam {
  id: number
  created_at: string
  is_finished: boolean
  user_progress?: ExamUserProgress
  current_module?: number
  modules?: ExamModule[]
  score?: ExamScore
}

export interface ExamModule {
  id: number
  module_type: 'math' | 'verbal'
  time_limit: number
  questions: ExamQuestion[]
}

export interface ExamQuestion {
  id: number
  question_id: number
  question_text: string
  choices: string[]
  correct_answer_index: number
  difficulty_level: 0 | 1 | 2
  topic: string
  subtopic: string
  subject_id: 1 | 2
  user_answer?: number
  is_correct?: boolean
  time_spent?: number
}

export interface ExamUserProgress {
  current_module: number
  modules: {
    [key: string]: {
      questions: Array<{
        question_id: number
        user_answer?: number
      }>
    }
  }
  question_times?: {
    [key: string]: number
  }
  module_time_remaining?: number
  is_finished?: boolean
}

export interface ExamResult {
  id: number
  exam_id: number
  total_score: number
  math_score: number
  verbal_score: number
  correct_answers: number
  total_questions: number
  time_taken: number
  created_at: string
  breakdown?: {
    math: {
      correct: number
      total: number
      score: number
    }
    verbal: {
      correct: number
      total: number
      score: number
    }
  }
}

export interface ExamScore {
  total: number
  math: number
  verbal: number
  percentage: number
}

export type ExamStatus = 'not_started' | 'in_progress' | 'completed'
export type TestType = 'official' | 'custom' | 'adaptive'













