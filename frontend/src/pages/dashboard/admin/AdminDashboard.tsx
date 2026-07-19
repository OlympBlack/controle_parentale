import { Shield, Users, Smartphone, Bell, Clock, BarChart3 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useFamilyContext } from '@/contexts/FamilyContext'

const STAT_CARDS = [
  { label: 'Enfants supervisés',   value: '—', icon: Users,      color: 'bg-blue-50 text-blue-600' },
  { label: 'Appareils actifs',      value: '—', icon: Smartphone, color: 'bg-green-50 text-green-600' },
  { label: 'Sites bloqués (7j)',    value: '—', icon: Shield,     color: 'bg-brand-50 text-brand-600' },
  { label: "Temps d'écran moyen",  value: '—', icon: Clock,      color: 'bg-yellow-50 text-yellow-600' },
  { label: 'Alertes actives',       value: '—', icon: Bell,       color: 'bg-red-50 text-red-600' },
  { label: 'Rapports ce mois',      value: '—', icon: BarChart3,  color: 'bg-purple-50 text-purple-600' },
]

export function AdminDashboard() {
  const { user } = useAuth()
  const { activeFamily } = useFamilyContext()

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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
        {STAT_CARDS.map((card) => (
          <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="mt-0.5 text-sm text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
        <Shield className="mx-auto h-10 w-10 text-gray-300" />
        <p className="mt-3 text-sm font-medium text-gray-500">
          Les données s'afficheront ici une fois les appareils connectés.
        </p>
      </div>
    </div>
  )
}
