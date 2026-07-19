import { apiClient } from '@/lib/api-client'
import type { ApiResponse, ScreenTimeRule, ScreenTimeRuleStatus, ScreenTimeRuleType } from '@/types'

export interface CreateScreenTimeRuleData {
  child_id: number
  type: ScreenTimeRuleType
  duration_minutes?: number
  day_of_week?: number | null
  start_time?: string | null
  end_time?: string | null
  status?: ScreenTimeRuleStatus
}

export interface UpdateScreenTimeRuleData {
  type?: ScreenTimeRuleType
  duration_minutes?: number | null
  day_of_week?: number | null
  start_time?: string | null
  end_time?: string | null
  status?: ScreenTimeRuleStatus
}

export const screenTimeRuleService = {
  async list(childId?: number): Promise<ScreenTimeRule[]> {
    const params: Record<string, unknown> = { per_page: 100 }
    if (childId) params.child_id = childId
    const { data } = await apiClient.get<ApiResponse<ScreenTimeRule[]>>('/screen-time-rules', { params })
    return Array.isArray(data.data) ? data.data : []
  },

  async create(payload: CreateScreenTimeRuleData): Promise<ScreenTimeRule> {
    const { data } = await apiClient.post<ApiResponse<ScreenTimeRule>>('/screen-time-rules', payload)
    return data.data
  },

  async update(ruleId: number, payload: UpdateScreenTimeRuleData): Promise<ScreenTimeRule> {
    const { data } = await apiClient.put<ApiResponse<ScreenTimeRule>>(`/screen-time-rules/${ruleId}`, payload)
    return data.data
  },

  async remove(ruleId: number): Promise<void> {
    await apiClient.delete(`/screen-time-rules/${ruleId}`)
  },
}
