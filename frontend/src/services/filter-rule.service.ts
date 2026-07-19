import { apiClient } from '@/lib/api-client'
import type { ApiResponse, ContentCategory, FilterRule, FilterRuleStatus, FilterRuleType } from '@/types'

export interface CreateFilterRuleData {
  child_id: number
  type: FilterRuleType
  value: string
  status?: FilterRuleStatus
  categories?: number[]
}

export interface UpdateFilterRuleData {
  type?: FilterRuleType
  value?: string
  status?: FilterRuleStatus
  categories?: number[]
}

export const filterRuleService = {
  async list(childId?: number): Promise<FilterRule[]> {
    const params: Record<string, unknown> = { per_page: 100 }
    if (childId) params.child_id = childId
    const { data } = await apiClient.get<ApiResponse<FilterRule[]>>('/filter-rules', { params })
    return Array.isArray(data.data) ? data.data : []
  },

  async create(payload: CreateFilterRuleData): Promise<FilterRule> {
    const { data } = await apiClient.post<ApiResponse<FilterRule>>('/filter-rules', payload)
    return data.data
  },

  async update(ruleId: number, payload: UpdateFilterRuleData): Promise<FilterRule> {
    const { data } = await apiClient.put<ApiResponse<FilterRule>>(`/filter-rules/${ruleId}`, payload)
    return data.data
  },

  async remove(ruleId: number): Promise<void> {
    await apiClient.delete(`/filter-rules/${ruleId}`)
  },
}

export const contentCategoryService = {
  async list(): Promise<ContentCategory[]> {
    const { data } = await apiClient.get<ApiResponse<ContentCategory[]>>('/content-categories')
    return Array.isArray(data.data) ? data.data : []
  },
}
