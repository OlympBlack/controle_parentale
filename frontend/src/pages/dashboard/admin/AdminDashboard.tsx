import { useState, useEffect, useCallback } from 'react'
import {
  Shield,
  Users,
  Smartphone,
  Bell,
  Clock,
  BarChart3,
  Loader2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useFamilyContext } from '@/contexts/FamilyContext'
import { childService } from '@/services/child.service'
import { deviceService } from '@/services/device.service'
import { filterRuleService } from '@/services/filter-rule.service'
import { reportService } from '@/services/report.service'
import type { Child, Device, Report } from '@/types'

interface DashboardStats {
  childrenCount: number
  activeDevices: number
  totalDevices: number
  filterRulesCount: number
  recentReports: Report[]
  children: Child[]
  devices: Device[]
}

export function AdminDashboard() {
  const { user } = useAuth()
  const { activeFamily } = useFamilyContext()

  const [stats, setStats]     = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  const load = useCallback(async () => {
    if (!activeFamily) return
    setLoading(true)
    setError('')
    try {
      const [children, devices, reports] = await Promise.all([
        childService.list(activeFamily.id),
        deviceService.list(),
        reportService.list(),
      ])

      const allRules = await Promise.all(
        children.map((c) => filterRuleService.list(c.id))
      )

      setStats({
        childrenCount: children.length,
        activeDevices: devices.filter((d) => d.status === 'active').length,
        totalDevices: devices.length,
        filterRulesCount: allRules.flat().filter((r) => r.status === 'active').length,
        recentReports: reports.slice(0, 5),
        children,
        devices,
      })
    } catch {
      setError('Impossible de charger les statistiques.')
    } finally {
      setLoading(false)
    }
  }, [activeFamily])

  useEffect(() => { void load() }, [load])

  const avgScore = stats && stats.recentReports.length > 0
    ? Math.round(stats.recentReports.reduce((sum, r) => sum + (r.digital_health_score ?? 0), 0) / stats.recentReports.length)
    : null

  const statCards = [
    { label: 'Enfants supervisés',   value: stats?.childrenCount ?? '—',     icon: Users,      color: 'bg-blue-50 text-blue-600',         link: '/dashboard/admin/children' },
    { label: 'Appareils actifs',      value: stats ? `${stats.activeDevices}/${stats.totalDevices}` : '—', icon: Smartphone, color: 'bg-green-50 text-green-600', link: '/dashboard/admin/devices' },
    { label: 'Règles actives',        value: stats?.filterRulesCount ?? '—',  icon: Shield,     color: 'bg-brand-50 text-brand-600',       link: '/dashboard/admin/filter-rules' },
    { label: 'Score santé moyenne',   value: avgScore ?? '—',                 icon: BarChart3,  color: avgScore !== null ? (avgScore >= 70 ? 'bg-emerald-50 text-emerald-600' : avgScore >= 40 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600') : 'bg-purple-50 text-purple-600', link: '/dashboard/admin/reports' },
    { label: 'Rapports récents',      value: stats?.recentReports.length ?? '—', icon: Clock,   color: 'bg-purple-50 text-purple-600',     link: '/dashboard/admin/reports' },
    { label: 'Alertes actives',       value: '—',                             icon: Bell,       color: 'bg-red-50 text-red-600',           link: '/dashboard/admin' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Tableau de bord de la famille <span className="font-medium text-gray-700">{activeFamily?.name}</span>
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
        {loading ? (
          statCards.map((card) => (
            <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-300" />
                <p className="text-sm text-gray-300">Chargement...</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">{card.label}</p>
            </div>
          ))
        ) : (
          statCards.map((card) => (
            <Link
              key={card.label}
              to={card.link}
              className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-md"
            >
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-2xl font-bold text-gray-900">{card.value}</p>
              <div className="mt-0.5 flex items-center justify-between">
                <p className="text-sm text-gray-500">{card.label}</p>
                <ArrowRight className="h-3.5 w-3.5 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-400" />
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Recent reports */}
      {!loading && stats && stats.recentReports.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Derniers rapports</h2>
            <Link to="/dashboard/admin/reports" className="text-xs font-medium text-brand-600 hover:text-brand-700">
              Voir tout →
            </Link>
          </div>
          <div className="space-y-2">
            {stats.recentReports.map((report) => {
              const score = report.digital_health_score
              const childName = report.child?.full_name ?? 'Enfant'
              return (
                <div key={report.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      score !== null
                        ? score >= 70 ? 'bg-emerald-100 text-emerald-600' : score >= 40 ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      <BarChart3 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {childName} · {report.period_type === 'weekly' ? 'Hebdo' : 'Mensuel'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(report.period_start).toLocaleDateString('fr-FR')} → {new Date(report.period_end).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  {score !== null && (
                    <span className={`text-sm font-bold ${
                      score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {score}/100
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Children overview */}
      {!loading && stats && stats.children.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Aperçu des enfants</h2>
            <Link to="/dashboard/admin/children" className="text-xs font-medium text-brand-600 hover:text-brand-700">
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stats.children.slice(0, 6).map((child) => {
              const childDevices = stats.devices.filter((d) => d.child_id === child.id)
              const initials = (child.full_name || child.first_name || '?')
                .split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
              return (
                <Link
                  key={child.id}
                  to="/dashboard/admin/children"
                  className="group flex items-center gap-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-700">
                      {child.full_name || child.first_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {childDevices.length} appareil{childDevices.length > 1 ? 's' : ''}
                      {child.digital_health_score !== null && ` · Score ${child.digital_health_score}`}
                    </p>
                  </div>
                  {child.digital_health_score !== null && (
                    <div className="h-2 w-12 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className={`h-full rounded-full ${
                          child.digital_health_score >= 70 ? 'bg-emerald-500' : child.digital_health_score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${child.digital_health_score}%` }}
                      />
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && stats && stats.children.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <Shield className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-500">
            Bienvenue ! Commencez par ajouter votre premier enfant.
          </p>
          <Link
            to="/dashboard/admin/children"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            <Users className="h-4 w-4" />
            Ajouter un enfant
          </Link>
        </div>
      )}
    </div>
  )
}
