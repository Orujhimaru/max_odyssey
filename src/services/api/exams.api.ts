import axiosInstance from '../axios'
import type { Exam, ExamUserProgress } from '@/types'

export const examsApi = {
  // Get all user exam results
  getUserExamResults: async (): Promise<Exam[]> => {
    const { data } = await axiosInstance.get<Exam[] | { data: Exam[] }>('/exams')
    // Handle both array and object with data property
    return Array.isArray(data) ? data : data.data || []
  },

  // Generate a new exam
  generateExam: async (): Promise<Exam> => {
    const { data } = await axiosInstance.post<Exam>('/exams/generate')
    return data
  },

  // Get exam by ID
  getExamById: async (examId: number): Promise<Exam> => {
    const { data } = await axiosInstance.get<Exam>(`/exams/${examId}`)
    return data
  },

  // Remove an exam by ID
  removeExamById: async (examId: number): Promise<{ success: boolean }> => {
    const { data } = await axiosInstance.post<{ success: boolean }>('/exams/remove', {
      exam_id: examId,
    })
    return data
  },

  // Update an exam with user progress
  updateExam: async (
    examId: number,
    userProgressData: {
      is_finished: boolean
      current_module: number
      modules: ExamUserProgress['modules']
      question_times?: { [key: string]: number }
      module_time_remaining?: number
    }
  ): Promise<{ success: boolean }> => {
    const payload = {
      exam_id: parseInt(examId.toString(), 10),
      is_finished: userProgressData.is_finished,
      user_progress: {
        current_module: userProgressData.current_module,
        modules: userProgressData.modules,
        question_times: userProgressData.question_times,
        module_time_remaining: userProgressData.module_time_remaining,
      },
    }

    console.log('Updating exam with payload:', payload)

    const { data } = await axiosInstance.post<{ success: boolean }>(
      '/exams/update',
      payload
    )
    return data
  },
}

