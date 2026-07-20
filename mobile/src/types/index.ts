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
  brand: string | null
  model: string | null
  os: string | null
  os_version: string | null
  app_version: string | null
  device_token: string | null
  status: DeviceStatus
  permissions_accordees: Record<string, boolean> | null
  derniere_synchronisation: string | null
  is_online: boolean
  battery_level: number | null
  last_seen_at: string | null
  paired_at: string | null
  child?: {
    id: number
    first_name: string
    last_name: string | null
    full_name: string
  } | null
}

export interface UsageSession {
  id: number
  device_id: number
  package_name: string
  nom_application: string | null
  duree_secondes: number
  date_utilisation: string
  categorie: string | null
  created_at: string | null
}

export interface AppUsageSummary {
  id?: number
  device_id?: number
  date: string
  temps_ecran_total_secondes: number
  nombre_apps_utilisees: number
}

export interface ChildUsageToday {
  sessions: UsageSession[]
  resume: AppUsageSummary
}

export interface LocationData {
  id: number
  child_id: number
  device_id: number
  latitude: number
  longitude: number
  accuracy_meters: number | null
  recorded_at: string
  created_at: string
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
