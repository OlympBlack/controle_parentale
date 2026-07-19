import { apiClient } from '@/lib/api-client'
import type { ApiResponse, Family } from '@/types'

export const familyService = {
  async list(): Promise<Family[]> {
    const { data } = await apiClient.get<ApiResponse<Family[]>>('/families', {
      params: { per_page: 100 },
    })
    return Array.isArray(data.data) ? data.data : []
  },

  async create(name: string, plan: 'free' | 'premium' = 'free'): Promise<Family> {
    const { data } = await apiClient.post<ApiResponse<Family>>('/families', { name, plan })
    return data.data
  },
}
