import { BaseDashboardLayout } from '@/components/layout/BaseDashboardLayout'
import { LayoutDashboard, Eye, Bell, BarChart3 } from 'lucide-react'

const NAV_ITEMS = [
  { label: "Vue d'ensemble", icon: LayoutDashboard, path: '/dashboard/observateur' },
  { label: 'Enfants',        icon: Eye,             path: '/dashboard/observateur/children' },
  { label: 'Alertes',        icon: Bell,            path: '/dashboard/observateur/alerts' },
  { label: 'Rapports',       icon: BarChart3,       path: '/dashboard/observateur/reports' },
]

export function ObservateurLayout() {
  return (
    <BaseDashboardLayout
      navItems={NAV_ITEMS}
      roleLabel="Observateur"
      roleBadgeClass="bg-gray-100 text-gray-600"
    />
  )
}
