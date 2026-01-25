import axiosInstance from '../axios'
import type { Question, QuestionFilters, PaginatedResponse } from '@/types'

export const questionsApi = {
  // Get all questions
  getQuestions: async (): Promise<Question[]> => {
    const { data } = await axiosInstance.get<Question[]>('/questions')
    return data
  },

  // Get a single question by ID
  getQuestion: async (id: number): Promise<Question> => {
    const { data } = await axiosInstance.get<Question>(`/questions/${id}`)
    return data
  },

  // Get filtered questions with pagination
  getFilteredQuestions: async (
    filters: QuestionFilters
  ): Promise<PaginatedResponse<Question>> => {
    const params = new URLSearchParams()

    // Add required subject parameter
    if (filters.subject) {
      params.append('subject', filters.subject.toString())
    }

    // Add optional parameters
    if (filters.difficulty !== undefined && filters.difficulty !== null && filters.difficulty !== '') {
      params.append('difficulty', filters.difficulty.toString())
    }

    if (filters.topic) {
      params.append('topic', filters.topic)
    }

    if (filters.subtopic) {
      params.append('subtopic', filters.subtopic)
    }

    if (filters.is_bluebook) {
      params.append('is_bluebook', filters.is_bluebook.toString())
    }

    if (filters.hide_solved) {
      params.append('hide_solved', filters.hide_solved.toString())
    }

    if (filters.is_bookmarked) {
      params.append('is_bookmarked', filters.is_bookmarked.toString())
    }

    if (filters.incorrect !== undefined) {
      params.append('incorrect', filters.incorrect.toString())
    }

    if (filters.sort_dir) {
      params.append('sort_dir', filters.sort_dir)
    }

    if (filters.page) {
      params.append('page', filters.page.toString())
    }

    if (filters.page_size) {
      params.append('page_size', filters.page_size.toString())
    }

    const { data } = await axiosInstance.get<PaginatedResponse<Question>>(
      `/questions/filtered?${params.toString()}`
    )

    // Normalize response structure
    const normalizedData: PaginatedResponse<Question> = {
      questions: data.questions || data.data || [],
      total_pages: data.pagination?.total_pages || data.total_pages || 1,
      total_questions: data.pagination?.total_items || data.total_questions || 0,
      current_page: data.pagination?.current_page || data.current_page || 1,
    }

    return normalizedData
  },

  // Toggle bookmark
  toggleBookmark: async (questionId: number): Promise<{ success: boolean }> => {
    const { data } = await axiosInstance.post<{ success: boolean }>('/bookmark', {
      question_id: questionId,
    })
    return data
  },

  // Batch update questions
  batchUpdateQuestions: async (
    questionStates: Array<{
      questionId: number
      isSolved: boolean
      isIncorrect: boolean
      selectedOption?: number
    }>
  ): Promise<{ success: boolean }> => {
    const { data } = await axiosInstance.post<{ success: boolean }>(
      '/questions/batch-update',
      { questions: questionStates }
    )
    return data
  },
}










