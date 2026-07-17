import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Eye,
  Clock,
  MapPin,
  Bell,
  Smartphone,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'

const stats = [
  {
    label: 'Appareils protégés',
    value: '3',
    icon: Smartphone,
    sub: '2 actifs maintenant',
  },
  {
    label: 'Sites bloqués (7j)',
    value: '47',
    icon: ShieldCheck,
    sub: '12 cette semaine',
  },
  {
    label: 'Temps d\'écran moyen',
    value: '2h 15min',
    icon: Clock,
    sub: '-18% vs semaine dernière',
  },
  {
    label: 'Alertes actives',
    value: '2',
    icon: Bell,
    sub: '1 critique, 1 modérée',
  },
]

const children = [
  {
    name: 'Lucas',
    age: 12,
    status: 'En ligne',
    device: 'iPhone 13',
    timeToday: '1h 45min',
    score: 85,
  },
  {
    name: 'Emma',
    age: 9,
    status: 'Hors ligne',
    device: 'iPad Air',
    timeToday: '0h 30min',
    score: 92,
  },
]

const recentAlerts = [
  {
    type: 'critical',
    icon: AlertTriangle,
    title: 'Tentative d\'accès à un site bloqué',
    detail: 'site-adulte.com · Lucas · iPhone 13',
    time: 'Il y a 12 min',
  },
  {
    type: 'warning',
    icon: Clock,
    title: 'Limite de temps d\'écran atteinte',
    detail: 'TikTok · Emma · iPad Air',
    time: 'Il y a 1h',
  },
  {
    type: 'info',
    icon: CheckCircle2,
    title: 'Nouvel appareil connecté',
    detail: 'Chromebook · Lucas',
    time: 'Il y a 3h',
  },
]

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <DashboardLayout title="Vue d'ensemble">
      <div className="space-y-6">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Bonjour, {user?.name?.split(' ')[0]}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Voici un résumé de la protection de vos enfants aujourd'hui.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600">
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-extrabold text-gray-900">{stat.value}</span>
              </div>
              <p className="mt-3 text-sm font-medium text-gray-900">{stat.label}</p>
              <p className="mt-0.5 text-xs text-gray-500">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Children overview */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Mes enfants</h3>
                <button className="text-sm font-medium text-brand-600 hover:text-brand-700">
                  Gérer
                </button>
              </div>

              <div className="mt-5 space-y-4">
                {children.map((child, i) => (
                  <motion.div
                    key={child.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                        {child.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{child.name}</span>
                          <span className="text-xs text-gray-400">{child.age} ans</span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              child.status === 'En ligne' ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          />
                          {child.status} · {child.device}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Aujourd'hui</div>
                        <div className="text-sm font-semibold text-gray-900">{child.timeToday}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Score</div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-brand-600">{child.score}</span>
                          <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent alerts */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Alertes récentes</h3>
              <button className="text-sm font-medium text-brand-600 hover:text-brand-700">
                Tout voir
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {recentAlerts.map((alert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-3 rounded-lg border border-gray-100 p-3"
                >
                  <div
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
                      alert.type === 'critical'
                        ? 'bg-red-100'
                        : alert.type === 'warning'
                        ? 'bg-amber-100'
                        : 'bg-brand-100'
                    }`}
                  >
                    <alert.icon
                      className={`h-4 w-4 ${
                        alert.type === 'critical'
                          ? 'text-red-600'
                          : alert.type === 'warning'
                          ? 'text-amber-600'
                          : 'text-brand-600'
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    <p className="mt-0.5 truncate text-xs text-gray-500">{alert.detail}</p>
                    <p className="mt-0.5 text-xs text-gray-400">{alert.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: 'Filtrage', icon: Eye, desc: 'Gérer les sites bloqués et autorisés' },
            { label: 'Temps d\'écran', icon: Clock, desc: 'Définir les quotas et plages horaires' },
            { label: 'Géolocalisation', icon: MapPin, desc: 'Voir la position de vos enfants' },
          ].map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all hover:border-brand-200 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-600">
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{action.label}</p>
                <p className="mt-0.5 text-xs text-gray-500">{action.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
