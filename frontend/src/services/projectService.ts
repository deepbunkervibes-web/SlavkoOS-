import { ProjectWithRelations, ProjectFilters, ApiResponse, PaginatedResponse } from '@enterprise/shared'
import { apiClient } from './apiClient'

export const projectService = {
  async getProjects(filters: ProjectFilters): Promise<PaginatedResponse<ProjectWithRelations>> {
    const response = await apiClient.get('/projects', { params: filters })
    return response.data as PaginatedResponse<ProjectWithRelations>
  },

  async getProjectById(id: string): Promise<ApiResponse<ProjectWithRelations>> {
    const response = await apiClient.get(`/projects/${id}`)
    return response.data as ApiResponse<ProjectWithRelations>
  },

  async createProject(projectData: any): Promise<ApiResponse<ProjectWithRelations>> {
    const response = await apiClient.post('/projects', projectData)
    return response.data as ApiResponse<ProjectWithRelations>
  },

  async updateProject(id: string, updates: any): Promise<ApiResponse<ProjectWithRelations>> {
    const response = await apiClient.put(`/projects/${id}`, updates)
    return response.data as ApiResponse<ProjectWithRelations>
  },

  async deleteProject(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete(`/projects/${id}`)
    return response.data as ApiResponse<null>
  },

  async getProjectStats(id: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get(`/projects/${id}/stats`)
    return response.data as ApiResponse<any>
  },
}