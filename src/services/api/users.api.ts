import axiosInstance from '../axios'
import type { User } from '@/types'

export const usersApi = {
  // Get user profile
  getUserProfile: async (): Promise<User> => {
    const { data } = await axiosInstance.get<User>('/user/profile')
    return data
  },

  // Update user profile
  updateUserProfile: async (updates: Partial<User>): Promise<User> => {
    const { data } = await axiosInstance.put<User>('/user/profile', updates)
    return data
  },

  // Get user statistics
  getUserStats: async (): Promise<any> => {
    const { data } = await axiosInstance.get('/user/stats')
    return data
  },
}










