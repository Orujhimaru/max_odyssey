import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { questionsApi } from '@/services/api'
import { queryKeys } from '@/lib/react-query'
import type { QuestionFilters } from '@/types'

// Get filtered questions with pagination
export const useQuestions = (filters: QuestionFilters) => {
  return useQuery({
    queryKey: queryKeys.questions.list(filters),
    queryFn: () => questionsApi.getFilteredQuestions(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new data for pagination
  })
}

// Get a single question
export const useQuestion = (id: number) => {
  return useQuery({
    queryKey: queryKeys.questions.detail(id),
    queryFn: () => questionsApi.getQuestion(id),
    enabled: !!id, // Only fetch if ID is provided
  })
}

// Toggle bookmark mutation
export const useBookmarkQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (questionId: number) => questionsApi.toggleBookmark(questionId),
    onSuccess: (_, questionId) => {
      // Invalidate questions list to refetch with updated bookmark status
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.lists() })
      
      // Optimistically update the question detail if it's cached
      queryClient.setQueryData(
        queryKeys.questions.detail(questionId),
        (oldData: any) => {
          if (oldData) {
            return {
              ...oldData,
              is_bookmarked: !oldData.is_bookmarked,
            }
          }
          return oldData
        }
      )
    },
  })
}

// Batch update questions mutation
export const useBatchUpdateQuestions = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: questionsApi.batchUpdateQuestions,
    onSuccess: () => {
      // Invalidate questions list after batch update
      queryClient.invalidateQueries({ queryKey: queryKeys.questions.lists() })
    },
  })
}

// Prefetch questions (useful for pagination)
export const usePrefetchQuestions = () => {
  const queryClient = useQueryClient()

  return (filters: QuestionFilters) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.questions.list(filters),
      queryFn: () => questionsApi.getFilteredQuestions(filters),
    })
  }
}

