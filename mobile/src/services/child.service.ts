import { apiClient } from './api-client'
import type { ApiResponse, Child } from '@/types'

export const childService = {
  async list(familyId?: number): Promise<Child[]> {
    const params: Record<string, unknown> = { per_page: 100 }
    if (familyId) params.family_id = familyId
    const { data } = await apiClient.get<ApiResponse<Child[]>>('/children', { params })
    return Array.isArray(data.data) ? data.data : []
  },

  async get(childId: number): Promise<Child> {
    const { data } = await apiClient.get<ApiResponse<Child>>(`/children/${childId}`)
    return data.data
  },
}
