import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import * as SecureStore from 'expo-secure-store'
import { API_BASE_URL, SECURE_STORE_KEYS } from '@/constants/config'
import type { ApiErrorResponse } from '@/types'

const AUTH_ENDPOINTS = ['/login', '/register', '/auth/password']

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ─── Auth token injection ──────────────────────────────────────────────────────
apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await SecureStore.getItemAsync(SECURE_STORE_KEYS.AUTH_TOKEN)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Auth expiry handling ──────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status
    const requestUrl = error.config?.url ?? ''
    const isAuthEndpoint = AUTH_ENDPOINTS.some((ep) => requestUrl.includes(ep))

    if ((status === 401 || status === 403) && !isAuthEndpoint) {
      // Token expired — clear it and let the app handle redirect
      SecureStore.deleteItemAsync(SECURE_STORE_KEYS.AUTH_TOKEN)
    }

    return Promise.reject(error)
  }
)

export function extractApiError(error: unknown): string {
  const axiosErr = error as AxiosError<ApiErrorResponse>
  if (axiosErr.response?.data?.message) {
    return axiosErr.response.data.message
  }
  if (axiosErr.message) {
    return axiosErr.message
  }
  return 'Une erreur est survenue.'
}

export function extractFieldErrors(error: unknown): Record<string, string> {
  const axiosErr = error as AxiosError<ApiErrorResponse>
  const raw = axiosErr.response?.data?.errors
  if (!raw) return {}
  const result: Record<string, string> = {}
  for (const [key, msgs] of Object.entries(raw)) {
    if (Array.isArray(msgs) && msgs.length > 0) {
      result[key] = msgs[0]
    }
  }
  return result
}
