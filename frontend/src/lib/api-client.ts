import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const AUTH_ENDPOINTS = ['/login', '/register', '/auth/password']

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const requestUrl = error.config?.url ?? ''
    const isAuthEndpoint = AUTH_ENDPOINTS.some((ep) => requestUrl.includes(ep))

    if ((status === 401 || status === 403) && !isAuthEndpoint) {
      window.dispatchEvent(new CustomEvent('auth:expired'))
    }

    return Promise.reject(error)
  }
)
