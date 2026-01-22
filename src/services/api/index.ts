// Central export point for all API services
export { questionsApi } from './questions.api'
export { examsApi } from './exams.api'
export { usersApi } from './users.api'
export { coursesApi } from './courses.api'

// Export a combined API object for convenience
import { questionsApi } from './questions.api'
import { examsApi } from './exams.api'
import { usersApi } from './users.api'
import { coursesApi } from './courses.api'

export const api = {
  questions: questionsApi,
  exams: examsApi,
  users: usersApi,
  courses: coursesApi,
}







