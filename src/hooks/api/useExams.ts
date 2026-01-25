import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { examsApi } from '@/services/api'
import { queryKeys } from '@/lib/react-query'
import type { ExamUserProgress } from '@/types'

// Get all user exam results
export const useExams = () => {
  return useQuery({
    queryKey: queryKeys.user.examResults(),
    queryFn: examsApi.getUserExamResults,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Get exam by ID
export const useExam = (examId: number | null) => {
  return useQuery({
    queryKey: queryKeys.exams.detail(examId!),
    queryFn: () => examsApi.getExamById(examId!),
    enabled: !!examId, // Only fetch if examId is provided
  })
}

// Generate new exam mutation
export const useGenerateExam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: examsApi.generateExam,
    onSuccess: () => {
      // Invalidate exam results list to include new exam
      queryClient.invalidateQueries({ queryKey: queryKeys.user.examResults() })
    },
  })
}

// Remove exam mutation
export const useRemoveExam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (examId: number) => examsApi.removeExamById(examId),
    onSuccess: () => {
      // Invalidate exam results list after deletion
      queryClient.invalidateQueries({ queryKey: queryKeys.user.examResults() })
    },
  })
}

// Update exam mutation
export const useUpdateExam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      examId,
      userProgressData,
    }: {
      examId: number
      userProgressData: {
        is_finished: boolean
        current_module: number
        modules: ExamUserProgress['modules']
        question_times?: { [key: string]: number }
        module_time_remaining?: number
      }
    }) => examsApi.updateExam(examId, userProgressData),
    onSuccess: (_, { examId }) => {
      // Invalidate specific exam and exam list
      queryClient.invalidateQueries({ queryKey: queryKeys.exams.detail(examId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.user.examResults() })
    },
  })
}











