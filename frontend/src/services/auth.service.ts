import { apiClient } from '@/lib/api-client'
import type { ApiResponse, AuthResponse, RegisterData, User } from '@/types'

const DEVICE_NAME = navigator.userAgent.substring(0, 100)

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/login', {
      email: email.toLowerCase().trim(),
      password,
      device_name: DEVICE_NAME,
    })
    return data.data
  },

  async register(payload: RegisterData): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/register', {
      name: payload.name.trim(),
      email: payload.email.toLowerCase().trim(),
      password: payload.password,
      password_confirmation: payload.passwordConfirmation,
      phone: payload.phone?.trim() || undefined,
      locale: payload.locale,
      timezone: payload.timezone,
      device_name: DEVICE_NAME,
    })
    return data.data
  },

  async logout(): Promise<void> {
    await apiClient.post('/logout')
  },

  async logoutAll(): Promise<void> {
    await apiClient.post('/logout-all')
  },

  async me(): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<User>>('/me')
    return data.data
  },

  async changePassword(
    currentPassword: string,
    password: string,
    passwordConfirmation: string
  ): Promise<void> {
    await apiClient.post('/auth/password', {
      current_password: currentPassword,
      password,
      password_confirmation: passwordConfirmation,
    })
  },
}
