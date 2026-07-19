import * as Device from 'expo-device'
import { apiClient } from './api-client'
import type { ApiResponse, AuthResponse, User } from '@/types'

const DEVICE_NAME = Device.deviceName || 'SafeKid Mobile App'

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/login', {
      email: email.toLowerCase().trim(),
      password,
      device_name: DEVICE_NAME,
    })
    return data.data
  },

  async register(payload: {
    name: string
    email: string
    password: string
    passwordConfirmation: string
    phone?: string
    locale?: string
    timezone?: string
  }): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/register', {
      name: payload.name.trim(),
      email: payload.email.toLowerCase().trim(),
      password: payload.password,
      password_confirmation: payload.passwordConfirmation,
      phone: payload.phone?.trim() || undefined,
      locale: payload.locale || 'fr',
      timezone: payload.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      device_name: DEVICE_NAME,
    })
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
