export type UserStatus = 'active' | 'suspended' | 'pending'

export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  avatar: string | null
  locale: string
  timezone: string | null
  status: UserStatus
  last_login_at: string | null
  created_at: string
  updated_at: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  passwordConfirmation: string
  phone?: string
  locale?: string
  timezone?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface ApiErrorResponse {
  success: false
  message: string
  errors?: Record<string, string[]>
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

export interface PaginationLinks {
  first: string
  last: string
  prev: string | null
  next: string | null
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
  errors?: Record<string, string[]>
  meta?: PaginationMeta
  links?: PaginationLinks
}
