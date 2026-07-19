import { Eye, Bell, BarChart3, Info } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useFamilyContext } from '@/contexts/FamilyContext'

const STAT_CARDS = [
  { label: 'Alertes actives',  value: '—', icon: Bell,     color: 'bg-red-50 text-red-600' },
  { label: 'Rapports ce mois', value: '—', icon: BarChart3, color: 'bg-purple-50 text-purple-600' },
  { label: 'Enfants suivis',   value: '—', icon: Eye,       color: 'bg-blue-50 text-blue-600' },
]

export function ObservateurDashboard() {
  const { user } = useAuth()
  const { activeFamily } = useFamilyContext()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Famille <span className="font-medium text-gray-700">{activeFamily?.name}</span>
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
        <p className="text-sm text-blue-700">
          Vous avez accès en <strong>lecture seule</strong> à cette famille. Vous pouvez consulter les activités, alertes et rapports, mais ne pouvez pas modifier les règles.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
        <Eye className="mx-auto h-10 w-10 text-gray-300" />
        <p className="mt-3 text-sm font-medium text-gray-500">
          Les données s'afficheront ici une fois les appareils connectés.
        </p>
      </div>
    </div>
  )
}
