import { apiClient } from '@/lib/api-client'
import type { ApiResponse, LocationData } from '@/types'

export const locationService = {
  async getLast(childId: number): Promise<LocationData | null> {
    try {
      const { data } = await apiClient.get<ApiResponse<LocationData>>(
        `/children/${childId}/location/last`
      )
      return data.data
    } catch {
      return null
    }
  },

  async getHistory(
    childId: number,
    filters?: { from?: string; to?: string; per_page?: number }
  ): Promise<LocationData[]> {
    const params: Record<string, string | number> = {}
    if (filters?.from) params.from = filters.from
    if (filters?.to) params.to = filters.to
    if (filters?.per_page) params.per_page = filters.per_page
    const { data } = await apiClient.get<ApiResponse<LocationData[]>>(
      `/children/${childId}/location/history`,
      { params }
    )
    return Array.isArray(data.data) ? data.data : []
  },
}
