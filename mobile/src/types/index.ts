export type UserRole = 'admin' | 'gestionnaire' | 'observateur'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  phone?: string | null
  avatar?: string | null
  family_id?: number | null
  created_at?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface ApiErrorResponse {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

export interface Family {
  id: number
  name: string
  plan: string
  created_at?: string
}

export type ChildStatus = 'active' | 'paused' | 'archived'
export type MaturityLevel = 'enfant' | 'preado' | 'ado'

export interface Child {
  id: number
  family_id: number
  first_name: string
  last_name: string | null
  full_name: string
  birth_date: string | null
  avatar: string | null
  maturity_level: MaturityLevel | null
  pin_code: string | null
  status: ChildStatus
  digital_health_score: number | null
  devices_count?: number
  created_at?: string
}

export type DeviceType = 'mobile' | 'tablette' | 'pc' | 'autre'
export type DeviceStatus = 'pending' | 'active' | 'inactive' | 'blocked'

export interface Device {
  id: number
  child_id: number | null
  name: string
  type: DeviceType
  os: string | null
  os_version: string | null
  status: DeviceStatus
  is_online: boolean
  battery_level: number | null
  child?: Child | null
}

export type FilterRuleType = 'domain' | 'keyword' | 'category' | 'app'
export type FilterRuleStatus = 'active' | 'paused' | 'disabled'

export interface FilterRule {
  id: number
  child_id: number
  type: FilterRuleType
  value: string
  status: FilterRuleStatus
  created_at: string
}

export type ScreenTimeRuleType = 'daily_quota' | 'schedule' | 'bedtime' | 'homework' | 'break'
export type ScreenTimeRuleStatus = 'active' | 'inactive'

export interface ScreenTimeRule {
  id: number
  child_id: number
  type: ScreenTimeRuleType
  duration_minutes: number | null
  day_of_week: number | null
  start_time: string | null
  end_time: string | null
  status: ScreenTimeRuleStatus
}

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical'
export type AlertStatus = 'pending' | 'acknowledged' | 'resolved'

export interface Alert {
  id: number
  child_id: number
  type: string
  severity: AlertSeverity
  status: AlertStatus
  title: string
  message: string
  created_at: string
  child?: Child | null
}

export type ReportPeriodType = 'weekly' | 'monthly'

export interface Report {
  id: number
  child_id: number
  period_type: ReportPeriodType
  period_start: string
  period_end: string
  digital_health_score: number | null
  statistics: Record<string, unknown> | null
  file_path: string | null
  generated_at: string | null
  child?: {
    id: number
    first_name: string
    last_name: string | null
    full_name: string
  } | null
  created_at: string
}
