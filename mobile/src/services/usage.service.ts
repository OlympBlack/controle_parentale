import { apiClient } from './api-client'
import type { ApiResponse } from '@/types'

export interface UsageSessionData {
  id: number
  device_id: number
  package_name: string
  nom_application: string | null
  duree_secondes: number
  date_utilisation: string
  categorie: string | null
  created_at: string | null
}

export interface UsageSummaryData {
  date: string
  temps_ecran_total_secondes: number
  nombre_apps_utilisees: number
}

export interface ChildUsageTodayResponse {
  sessions: UsageSessionData[]
  resume: UsageSummaryData
}

export const usageService = {
  async getChildUsage(
    childId: number,
    filters?: { from?: string; to?: string }
  ): Promise<UsageSessionData[]> {
    const params = new URLSearchParams()
    if (filters?.from) params.append('from', filters.from)
    if (filters?.to) params.append('to', filters.to)
    const query = params.toString() ? `?${params}` : ''
    const { data } = await apiClient.get<ApiResponse<UsageSessionData[]>>(
      `/children/${childId}/usage${query}`
    )
    return data.data
  },

  async getChildUsageToday(childId: number): Promise<ChildUsageTodayResponse> {
    const { data } = await apiClient.get<ApiResponse<ChildUsageTodayResponse>>(
      `/children/${childId}/usage/today`
    )
    return data.data
  },
}
