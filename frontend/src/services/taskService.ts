import { TaskWithRelations, TaskFilters, ApiResponse, PaginatedResponse } from '@enterprise/shared'
import { apiClient } from './apiClient'

export const taskService = {
  async getTasks(filters: TaskFilters): Promise<PaginatedResponse<TaskWithRelations>> {
    const response = await apiClient.get('/tasks', { params: filters })
    return response.data as PaginatedResponse<TaskWithRelations>
  },

  async getTaskById(id: string): Promise<ApiResponse<TaskWithRelations>> {
    const response = await apiClient.get(`/tasks/${id}`)
    return response.data as ApiResponse<TaskWithRelations>
  },

  async createTask(taskData: any): Promise<ApiResponse<TaskWithRelations>> {
    const response = await apiClient.post('/tasks', taskData)
    return response.data as ApiResponse<TaskWithRelations>
  },

  async updateTask(id: string, updates: any): Promise<ApiResponse<TaskWithRelations>> {
    const response = await apiClient.put(`/tasks/${id}`, updates)
    return response.data as ApiResponse<TaskWithRelations>
  },

  async deleteTask(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete(`/tasks/${id}`)
    return response.data as ApiResponse<null>
  },
}