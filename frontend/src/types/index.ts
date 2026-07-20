export type UserStatus = 'active' | 'suspended' | 'pending'

export type UserRole = 'admin' | 'gestionnaire' | 'observateur'

export type FamilyPlan = 'free' | 'premium'

export type MaturityLevel = 'enfant' | 'preado' | 'ado'

export type ChildStatus = 'active' | 'paused' | 'archived'

export type DeviceType = 'mobile' | 'tablette' | 'pc' | 'autre'

export type DeviceStatus = 'pending' | 'active' | 'inactive' | 'blocked'

export type FilterRuleType = 'domain' | 'keyword' | 'category' | 'app'

export type FilterRuleStatus = 'active' | 'paused' | 'disabled'

export type ScreenTimeRuleType = 'daily_quota' | 'schedule' | 'bedtime' | 'homework' | 'break'

export type ScreenTimeRuleStatus = 'active' | 'inactive'

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

export interface ScreenTimeRule {
  id: number
  child_id: number
  type: ScreenTimeRuleType
  duration_minutes: number | null
  day_of_week: number | null
  start_time: string | null
  end_time: string | null
  status: ScreenTimeRuleStatus
  created_at: string
  updated_at: string
}

export interface ContentCategory {
  id: number
  name: string
  slug: string
  description: string | null
  is_sensitive: boolean
  children?: ContentCategory[]
  created_at: string
}

export interface FilterRule {
  id: number
  child_id: number
  type: FilterRuleType
  value: string
  status: FilterRuleStatus
  version: number | null
  categories?: ContentCategory[]
  created_at: string
  updated_at: string
}

export interface Device {
  id: number
  child_id: number | null
  name: string
  type: DeviceType
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
  created_at: string
  updated_at: string
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

export interface Child {
  id: number
  family_id: number
  first_name: string
  last_name: string | null
  full_name: string
  birth_date: string
  avatar: string | null
  maturity_level: MaturityLevel
  status: ChildStatus
  digital_health_score: number | null
  devices_count?: number
  created_at: string
  updated_at: string
}

export interface PendingInvitation {
  id: number
  email: string
  role: UserRole
  role_label: string
  invited_by: string
  expires_at: string
}

export interface FamilyMember {
  id: number
  name: string
  email: string
  avatar: string | null
  role: UserRole
  role_label: string
  joined_at: string | null
  is_owner: boolean
}

export interface Family {
  id: number
  name: string
  plan: FamilyPlan
  owner?: User
  children_count?: number
  my_role?: UserRole
  created_at: string
  updated_at: string
}

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
