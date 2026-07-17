export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  avatar: string | null
  locale: string | null
  timezone: string | null
  status: string
  last_login_at: string | null
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
  errors?: Record<string, string[]>
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
  }
  links?: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
}
