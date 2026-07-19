import { apiClient } from '@/lib/api-client'
import type { ApiResponse, Child, MaturityLevel } from '@/types'

export interface CreateChildData {
  family_id: number
  first_name: string
  last_name?: string
  birth_date: string
  maturity_level: MaturityLevel
  pin_code?: string
}

export interface UpdateChildData {
  first_name?: string
  last_name?: string
  birth_date?: string
  maturity_level?: MaturityLevel
  status?: 'active' | 'paused' | 'archived'
  digital_health_score?: number
}

export const childService = {
  async list(familyId: number): Promise<Child[]> {
    const { data } = await apiClient.get<ApiResponse<Child[]>>('/children', {
      params: { family_id: familyId, per_page: 100 },
    })
    return Array.isArray(data.data) ? data.data : []
  },

  async create(payload: CreateChildData): Promise<Child> {
    const { data } = await apiClient.post<ApiResponse<Child>>('/children', payload)
    return data.data
  },

  async update(childId: number, payload: UpdateChildData): Promise<Child> {
    const { data } = await apiClient.put<ApiResponse<Child>>(`/children/${childId}`, payload)
    return data.data
  },

  async remove(childId: number): Promise<void> {
    await apiClient.delete(`/children/${childId}`)
  },
}
