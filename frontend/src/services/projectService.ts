import { Project, ProjectFilters, ApiResponse, PaginatedResponse } from '@enterprise/shared'
import { apiClient } from './apiClient'

export const projectService = {
  async getProjects(filters: ProjectFilters): Promise<PaginatedResponse<Project>> {
    const response = await apiClient.get('/projects', { params: filters })
    return response.data
  },

  async getProjectById(id: string): Promise<ApiResponse<Project>> {
    const response = await apiClient.get(`/projects/${id}`)
    return response.data
  },

  async createProject(projectData: any): Promise<ApiResponse<Project>> {
    const response = await apiClient.post('/projects', projectData)
    return response.data
  },

  async updateProject(id: string, updates: any): Promise<ApiResponse<Project>> {
    const response = await apiClient.put(`/projects/${id}`, updates)
    return response.data
  },

  async deleteProject(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete(`/projects/${id}`)
    return response.data
  },

  async getProjectStats(id: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get(`/projects/${id}/stats`)
    return response.data
  },
}