import { apiClient } from './api-client'
import type { ApiResponse, DeviceType, DeviceStatus } from '@/types'

export interface DeviceData {
  id: number
  child_id: number | null
  name: string
  type: DeviceType
  os: string | null
  os_version: string | null
  device_token: string | null
  status: DeviceStatus
  permissions_accordees: Record<string, boolean> | null
  derniere_synchronisation: string | null
  is_online: boolean
  battery_level: number | null
  last_seen_at: string | null
  paired_at: string | null
  created_at: string | null
  updated_at: string | null
}

export interface CreateDevicePayload {
  child_id: number
  name: string
  type: string
  os?: string
  os_version?: string
  device_token?: string
}

export const deviceService = {
  async create(payload: CreateDevicePayload): Promise<DeviceData> {
    const { data } = await apiClient.post<ApiResponse<DeviceData>>('/devices', payload)
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
    await apiClient.post(`/devices/${deviceId}/usage`, { sessions })
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
