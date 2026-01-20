import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { supabase } from './supabase'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - attach auth token
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token && config.headers) {
        config.headers.Authorization = `Bearer ${session.access_token}`
      }
    } catch (error) {
      console.error('Error getting session:', error)
    }
    
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error: AxiosError) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      console.error('Unauthorized request - session may have expired')
      // Could trigger logout or token refresh here
      // For now, just log the error
    }

    // Handle 403 - Forbidden
    if (error.response?.status === 403) {
      console.error('Forbidden - insufficient permissions')
    }

    // Handle 500 - Server Error
    if (error.response?.status === 500) {
      console.error('Server error occurred')
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error - unable to reach server')
    }

    return Promise.reject(error)
  }
)

export default axiosInstance

