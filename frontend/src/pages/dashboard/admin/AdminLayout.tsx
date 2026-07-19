import { BaseDashboardLayout } from '@/components/layout/BaseDashboardLayout'
import {
  LayoutDashboard,
  Users,
  Smartphone,
  Shield,
  Clock,
  MapPin,
  Bell,
  BarChart3,
  Users2,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: "Vue d'ensemble",  icon: LayoutDashboard, path: '/dashboard/admin' },
  { label: 'Enfants',         icon: Users,           path: '/dashboard/admin/children' },
  { label: 'Appareils',       icon: Smartphone,      path: '/dashboard/admin/devices' },
  { label: 'Filtrage',        icon: Shield,          path: '/dashboard/admin/filter-rules' },
  { label: "Temps d'écran",   icon: Clock,           path: '/dashboard/admin/screen-time' },
  { label: 'Géolocalisation', icon: MapPin,          path: '/dashboard/admin/locations' },
  { label: 'Alertes',         icon: Bell,            path: '/dashboard/admin/alerts' },
  { label: 'Rapports',        icon: BarChart3,       path: '/dashboard/admin/reports' },
  { label: 'Famille',         icon: Users2,          path: '/dashboard/admin/family' },
]

export function AdminLayout() {
  return (
    <BaseDashboardLayout
      navItems={NAV_ITEMS}
      settingsPath="/dashboard/admin/settings"
      roleLabel="Administrateur"
      roleBadgeClass="bg-brand-100 text-brand-700"
    />
  )
}
