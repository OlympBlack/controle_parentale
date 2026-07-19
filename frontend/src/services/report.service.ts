import { apiClient } from '@/lib/api-client'
import type { ApiResponse, Report, ReportPeriodType } from '@/types'

export const reportService = {
  async list(params?: { child_id?: number; period_type?: ReportPeriodType }): Promise<Report[]> {
    const { data } = await apiClient.get<ApiResponse<Report[]>>('/reports', {
      params: { per_page: 100, ...params },
    })
    return Array.isArray(data.data) ? data.data : []
  },

  async get(reportId: number): Promise<Report> {
    const { data } = await apiClient.get<ApiResponse<Report>>(`/reports/${reportId}`)
    return data.data
  },
}
