import { apiClient } from './api-client'
import type { ApiResponse, DeviceType, DeviceStatus } from '@/types'

export interface DeviceData {
  id: number
  child_id: number | null
  name: string
  type: DeviceType
  brand: string | null
  model: string | null
  os: string | null
  os_version: string | null
  app_version: string | null
  device_token: string | null
  status: DeviceStatus
  permissions_accordees: Record<string, boolean> | null
  derniere_synchronisation: string | null
  is_online: boolean
  battery_level: number | null
  last_seen_at: string | null
  paired_at: string | null
  child?: {
    id: number
    first_name: string
    last_name: string | null
    full_name: string
  } | null
  created_at: string | null
  updated_at: string | null
}

export interface CreateDevicePayload {
  child_id: number
  name: string
  type: string
  brand?: string | null
  model?: string | null
  os?: string
  os_version?: string
  app_version?: string
  device_token?: string
  battery_level?: number | null
}

export interface PairPayload {
  pairing_code: string
  name?: string
  brand?: string | null
  model?: string | null
  os?: string
  os_version?: string
  app_version?: string
  battery_level?: number | null
}

export const deviceService = {
  async create(payload: CreateDevicePayload): Promise<DeviceData> {
    const { data } = await apiClient.post<ApiResponse<DeviceData>>('/devices', payload)
    return data.data
  },

  async pair(payload: PairPayload): Promise<DeviceData> {
    const { data } = await apiClient.post<ApiResponse<DeviceData>>('/devices/pair', payload)
    return data.data
  },

  async get(deviceId: number): Promise<DeviceData> {
    const { data } = await apiClient.get<ApiResponse<DeviceData>>(`/devices/${deviceId}`)
    return data.data
  },

  async updatePermissions(
    deviceId: number,
    permissions: Record<string, boolean>
  ): Promise<DeviceData> {
    const { data } = await apiClient.patch<ApiResponse<DeviceData>>(
      `/devices/${deviceId}/permissions`,
      { permissions }
    )
    return data.data
  },

  async sendUsage(
    deviceId: number,
    sessions: Array<{
      package_name: string
      nom_application?: string
      duree_secondes: number
      date_utilisation: string
    }>
  ): Promise<void> {
    console.log('[SafeKid] sendUsage → device:', deviceId, 'sessions:', sessions.length)
    try {
      const res = await apiClient.post(`/devices/${deviceId}/usage`, { sessions })
      console.log('[SafeKid] sendUsage ✓ status:', res.status)
    } catch (e: any) {
      console.error('[SafeKid] sendUsage ✗', e?.response?.status, e?.response?.data ?? e?.message)
      throw e
    }
  },

  async sendLocation(
    deviceId: number,
    location: {
      latitude: number
      longitude: number
      precision_metres?: number
      captured_at: string
    }
  ): Promise<void> {
    await apiClient.post(`/devices/${deviceId}/location`, location)
  },
}
