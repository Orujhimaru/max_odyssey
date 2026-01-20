import axiosInstance from '../axios'
import type { Course, Lesson } from '@/types'

export const coursesApi = {
  // Get all courses
  getCourses: async (): Promise<Course[]> => {
    const { data } = await axiosInstance.get<Course[]>('/courses')
    return data
  },

  // Get course by ID
  getCourseById: async (courseId: number): Promise<Course> => {
    const { data } = await axiosInstance.get<Course>(`/courses/${courseId}`)
    return data
  },

  // Get lessons for a course
  getCourseLessons: async (courseId: number): Promise<Lesson[]> => {
    const { data } = await axiosInstance.get<Lesson[]>(`/courses/${courseId}/lessons`)
    return data
  },

  // Get a specific lesson
  getLesson: async (courseId: number, lessonId: number): Promise<Lesson> => {
    const { data } = await axiosInstance.get<Lesson>(
      `/courses/${courseId}/lessons/${lessonId}`
    )
    return data
  },

  // Mark lesson as completed
  markLessonComplete: async (
    courseId: number,
    lessonId: number
  ): Promise<{ success: boolean }> => {
    const { data } = await axiosInstance.post<{ success: boolean }>(
      `/courses/${courseId}/lessons/${lessonId}/complete`
    )
    return data
  },
}





