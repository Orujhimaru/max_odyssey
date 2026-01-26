// Course and learning related types
export interface Course {
  id: number
  type: 'Course' | 'Practice' | 'Test'
  cat: 'math' | 'verbal'
  name: string
  progress: CourseProgress
  background: string
  description?: string
  total_lessons?: number
  completed_lessons?: number
}

export interface CourseProgress {
  current: number
  total: number
  percentage?: number
}

export interface Lesson {
  id: number
  course_id: number
  title: string
  content: string
  order: number
  duration_minutes: number
  is_completed: boolean
  quiz_questions?: number[]
  resources?: LessonResource[]
}

export interface LessonResource {
  id: number
  type: 'video' | 'pdf' | 'link' | 'text'
  title: string
  url: string
}

export interface Topic {
  name: string
  subtopics: string[]
}

export interface TopicProgress {
  topic: string
  subtopic: string
  total_questions: number
  correct_answers: number
  mastery_level: number // 0-100
}













