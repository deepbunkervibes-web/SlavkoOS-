import { DashboardStats, ProjectChart, ApiResponse } from '@enterprise/shared'
import { apiClient } from './apiClient'

export const dashboardService = {
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    const response = await apiClient.get('/dashboard/stats')
    return response.data as ApiResponse<DashboardStats>
  },

  async getProjectChartData(): Promise<ApiResponse<ProjectChart[]>> {
    const response = await apiClient.get('/dashboard/charts/projects')
    return response.data as ApiResponse<ProjectChart[]>
  },

  async getTaskChartData(): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/dashboard/charts/tasks')
    return response.data as ApiResponse<any>
  },

  async getActivityChartData(): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/dashboard/charts/activity')
    return response.data as ApiResponse<any>
  },
}