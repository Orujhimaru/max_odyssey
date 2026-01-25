import { QueryClient, DefaultOptions } from '@tanstack/react-query'

const queryConfig: DefaultOptions = {
  queries: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  },
  mutations: {
    retry: 0,
  },
}

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
})

// Query key factory pattern for consistent key management
export const queryKeys = {
  // Questions
  questions: {
    all: ['questions'] as const,
    lists: () => [...queryKeys.questions.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.questions.lists(), filters] as const,
    details: () => [...queryKeys.questions.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.questions.details(), id] as const,
  },
  
  // Exams
  exams: {
    all: ['exams'] as const,
    lists: () => [...queryKeys.exams.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.exams.lists(), filters] as const,
    details: () => [...queryKeys.exams.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.exams.details(), id] as const,
  },
  
  // User
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    progress: () => [...queryKeys.user.all, 'progress'] as const,
    examResults: () => [...queryKeys.user.all, 'exam-results'] as const,
  },
  
  // Courses
  courses: {
    all: ['courses'] as const,
    lists: () => [...queryKeys.courses.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.courses.lists(), filters] as const,
    details: () => [...queryKeys.courses.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.courses.details(), id] as const,
    lessons: (courseId: number) => [...queryKeys.courses.detail(courseId), 'lessons'] as const,
    lesson: (courseId: number, lessonId: number) => 
      [...queryKeys.courses.lessons(courseId), lessonId] as const,
  },
}












