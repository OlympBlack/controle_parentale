import { apiClient } from './api-client'
import type { ApiResponse } from '@/types'

export interface LocationData {
  id: number
  child_id: number
  device_id: number
  latitude: number
  longitude: number
  accuracy_meters: number | null
  recorded_at: string
  created_at: string
}

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
    const params = new URLSearchParams()
    if (filters?.from) params.append('from', filters.from)
    if (filters?.to) params.append('to', filters.to)
    if (filters?.per_page) params.append('per_page', String(filters.per_page))
    const query = params.toString() ? `?${params}` : ''
    const { data } = await apiClient.get<ApiResponse<LocationData[]>>(
      `/children/${childId}/location/history${query}`
    )
    return data.data
  },
}
