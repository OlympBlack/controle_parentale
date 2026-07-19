import { apiClient } from './api-client'
import type { ApiResponse, Report } from '@/types'

export const reportService = {
  async list(): Promise<Report[]> {
    const { data } = await apiClient.get<ApiResponse<Report[]>>('/reports', {
      params: { per_page: 50 },
    })
    return Array.isArray(data.data) ? data.data : []
  },

  async get(reportId: number): Promise<Report> {
    const { data } = await apiClient.get<ApiResponse<Report>>(`/reports/${reportId}`)
    return data.data
  },
}
