import { User, CreateUserInput, ApiResponse } from '@enterprise/shared'
import { apiClient } from './apiClient'

export const authService = {
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiClient.post('/auth/login', { email, password })
    return response.data as ApiResponse<{ user: User; token: string }>
  },

  async register(userData: CreateUserInput): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiClient.post('/auth/register', userData)
    return response.data as ApiResponse<{ user: User; token: string }>
  },

  async verifyToken(token: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiClient.get('/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data as ApiResponse<{ user: User; token: string }>
  },
}