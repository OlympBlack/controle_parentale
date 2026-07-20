import { apiClient } from '@/lib/api-client'
import type { ApiResponse, UsageSession, ChildUsageToday } from '@/types'

export const usageService = {
  async getChildUsage(
    childId: number,
    filters?: { from?: string; to?: string }
  ): Promise<UsageSession[]> {
    const params: Record<string, string> = {}
    if (filters?.from) params.from = filters.from
    if (filters?.to) params.to = filters.to
    const { data } = await apiClient.get<ApiResponse<UsageSession[]>>(
      `/children/${childId}/usage`,
      { params }
    )
    return Array.isArray(data.data) ? data.data : []
  },

  async getChildUsageToday(childId: number): Promise<ChildUsageToday> {
    const { data } = await apiClient.get<ApiResponse<ChildUsageToday>>(
      `/children/${childId}/usage/today`
    )
    return data.data
  },
}
