import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/services/api'
import { queryKeys } from '@/lib/react-query'
import type { User } from '@/types'

// Get user profile
export const useUserProfile = () => {
  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: usersApi.getUserProfile,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Get user statistics
export const useUserStats = () => {
  return useQuery({
    queryKey: queryKeys.user.progress(),
    queryFn: usersApi.getUserStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Update user profile mutation
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updates: Partial<User>) => usersApi.updateUserProfile(updates),
    onSuccess: (updatedUser) => {
      // Update the cached user profile
      queryClient.setQueryData(queryKeys.user.profile(), updatedUser)
    },
  })
}











