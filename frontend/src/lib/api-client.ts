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

// ─── Auth token injection ──────────────────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Auth expiry handling ──────────────────────────────────────────────────
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

// ─── Dev debug logger (stripped from production build) ────────────────────
if (import.meta.env.DEV) {
  apiClient.interceptors.request.use((config) => {
    const method = config.method?.toUpperCase() ?? '?'
    const url = `${config.baseURL ?? ''}${config.url ?? ''}`
    console.groupCollapsed(
      `%c⬆ ${method} %c${url}`,
      'color:#6366f1;font-weight:700',
      'color:#94a3b8;font-weight:400',
    )
    if (config.params) console.log('Params :', config.params)
    if (config.data) {
      try { console.log('Body   :', JSON.parse(config.data as string)) }
      catch { console.log('Body   :', config.data) }
    }
    console.groupEnd()
    return config
  })

  apiClient.interceptors.response.use(
    (response) => {
      const method = response.config.method?.toUpperCase() ?? '?'
      const url = `${response.config.baseURL ?? ''}${response.config.url ?? ''}`
      console.groupCollapsed(
        `%c✓ ${response.status} %c${method} %c${url}`,
        'color:#22c55e;font-weight:700',
        'color:#6366f1;font-weight:700',
        'color:#94a3b8;font-weight:400',
      )
      console.log('Response:', response.data)
      console.groupEnd()
      return response
    },
    (error) => {
      const method = error.config?.method?.toUpperCase() ?? '?'
      const url = `${error.config?.baseURL ?? ''}${error.config?.url ?? ''}`
      const status = error.response?.status ?? 'ERR'
      console.groupCollapsed(
        `%c✗ ${status} %c${method} %c${url}`,
        'color:#ef4444;font-weight:700',
        'color:#6366f1;font-weight:700',
        'color:#94a3b8;font-weight:400',
      )
      console.log('Error  :', error.response?.data ?? error.message)
      console.groupEnd()
      return Promise.reject(error)
    },
  )
}
