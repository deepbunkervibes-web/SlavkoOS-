import { Task, TaskFilters, ApiResponse, PaginatedResponse } from '@enterprise/shared'
import { apiClient } from './apiClient'

export const taskService = {
  async getTasks(filters: TaskFilters): Promise<PaginatedResponse<Task>> {
    const response = await apiClient.get('/tasks', { params: filters })
    return response.data
  },

  async getTaskById(id: string): Promise<ApiResponse<Task>> {
    const response = await apiClient.get(`/tasks/${id}`)
    return response.data
  },

  async createTask(taskData: any): Promise<ApiResponse<Task>> {
    const response = await apiClient.post('/tasks', taskData)
    return response.data
  },

  async updateTask(id: string, updates: any): Promise<ApiResponse<Task>> {
    const response = await apiClient.put(`/tasks/${id}`, updates)
    return response.data
  },

  async deleteTask(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete(`/tasks/${id}`)
    return response.data
  },
}