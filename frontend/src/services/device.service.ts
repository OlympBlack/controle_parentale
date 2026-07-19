import { apiClient } from '@/lib/api-client'
import type { ApiResponse, Device, DeviceStatus, DeviceType } from '@/types'

export interface CreateDeviceData {
  child_id: number
  name: string
  type: DeviceType
  os?: string
  os_version?: string
}

export interface UpdateDeviceData {
  name?: string
  type?: DeviceType
  os?: string
  os_version?: string
  app_version?: string
  status?: DeviceStatus
  is_online?: boolean
  battery_level?: number
}

export const deviceService = {
  async list(): Promise<Device[]> {
    const { data } = await apiClient.get<ApiResponse<Device[]>>('/devices', {
      params: { per_page: 100 },
    })
    return Array.isArray(data.data) ? data.data : []
  },

  async create(payload: CreateDeviceData): Promise<Device> {
    const { data } = await apiClient.post<ApiResponse<Device>>('/devices', payload)
    return data.data
  },

  async update(deviceId: number, payload: UpdateDeviceData): Promise<Device> {
    const { data } = await apiClient.put<ApiResponse<Device>>(`/devices/${deviceId}`, payload)
    return data.data
  },

  async remove(deviceId: number): Promise<void> {
    await apiClient.delete(`/devices/${deviceId}`)
  },
}
