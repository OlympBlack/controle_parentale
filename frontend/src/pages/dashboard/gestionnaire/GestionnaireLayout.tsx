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
} from 'lucide-react'

const NAV_ITEMS = [
  { label: "Vue d'ensemble",  icon: LayoutDashboard, path: '/dashboard/gestionnaire', end: true },
  { label: 'Enfants',         icon: Users,           path: '/dashboard/gestionnaire/children' },
  { label: 'Appareils',       icon: Smartphone,      path: '/dashboard/gestionnaire/devices' },
  { label: 'Filtrage',        icon: Shield,          path: '/dashboard/gestionnaire/filter-rules' },
  { label: "Temps d'écran",   icon: Clock,           path: '/dashboard/gestionnaire/screen-time' },
  { label: 'Géolocalisation', icon: MapPin,          path: '/dashboard/gestionnaire/locations' },
  { label: 'Alertes',         icon: Bell,            path: '/dashboard/gestionnaire/alerts' },
  { label: 'Rapports',        icon: BarChart3,       path: '/dashboard/gestionnaire/reports' },
]

export function GestionnaireLayout() {
  return (
    <BaseDashboardLayout
      navItems={NAV_ITEMS}
      roleLabel="Gestionnaire"
      roleBadgeClass="bg-emerald-100 text-emerald-700"
    />
  )
}
