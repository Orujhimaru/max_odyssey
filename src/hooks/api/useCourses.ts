import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { coursesApi } from '@/services/api'
import { queryKeys } from '@/lib/react-query'

// Get all courses
export const useCourses = () => {
  return useQuery({
    queryKey: queryKeys.courses.lists(),
    queryFn: coursesApi.getCourses,
    staleTime: 15 * 60 * 1000, // 15 minutes - courses don't change often
  })
}

// Get course by ID
export const useCourse = (courseId: number | null) => {
  return useQuery({
    queryKey: queryKeys.courses.detail(courseId!),
    queryFn: () => coursesApi.getCourseById(courseId!),
    enabled: !!courseId,
  })
}

// Get lessons for a course
export const useCourseLessons = (courseId: number | null) => {
  return useQuery({
    queryKey: queryKeys.courses.lessons(courseId!),
    queryFn: () => coursesApi.getCourseLessons(courseId!),
    enabled: !!courseId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Get a specific lesson
export const useLesson = (courseId: number | null, lessonId: number | null) => {
  return useQuery({
    queryKey: queryKeys.courses.lesson(courseId!, lessonId!),
    queryFn: () => coursesApi.getLesson(courseId!, lessonId!),
    enabled: !!courseId && !!lessonId,
  })
}

// Mark lesson as complete mutation
export const useMarkLessonComplete = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      courseId,
      lessonId,
    }: {
      courseId: number
      lessonId: number
    }) => coursesApi.markLessonComplete(courseId, lessonId),
    onSuccess: (_, { courseId, lessonId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.lessons(courseId) })
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.lesson(courseId, lessonId),
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.detail(courseId) })
    },
  })
}










