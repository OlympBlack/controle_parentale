import { apiClient } from './api-client'
import type { ApiResponse, Alert } from '@/types'

export const alertService = {
  async list(): Promise<Alert[]> {
    const { data } = await apiClient.get<ApiResponse<Alert[]>>('/alerts', {
      params: { per_page: 50 },
    })
    return Array.isArray(data.data) ? data.data : []
  },

  async updateStatus(alertId: number, status: string): Promise<Alert> {
    const { data } = await apiClient.patch<ApiResponse<Alert>>(`/alerts/${alertId}/status`, { status })
    return data.data
  },
}
