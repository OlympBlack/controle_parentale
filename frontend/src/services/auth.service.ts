import { apiClient } from '@/lib/api-client'
import type { ApiResponse, AuthResponse, User } from '@/types'

export const authService = {
  async login(email: string, password: string, deviceName?: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/login', {
      email,
      password,
      device_name: deviceName,
    })
    return data.data
  },

  async register(payload: {
    name: string
    email: string
    password: string
    password_confirmation: string
    phone?: string
    device_name?: string
  }): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/register', payload)
    return data.data
  },

  async logout(): Promise<void> {
    await apiClient.post('/logout')
  },

  async me(): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<User>>('/me')
    return data.data
  },
}
