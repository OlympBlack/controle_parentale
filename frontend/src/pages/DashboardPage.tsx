import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Shield } from 'lucide-react'

export function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600">
        <Shield className="h-6 w-6 text-white" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-gray-900">
        Bienvenue, {user?.name} !
      </h1>
      <p className="mt-2 text-gray-600">Le tableau de bord sera bientôt disponible.</p>
      <Button variant="outline" className="mt-6" onClick={logout}>
        Se déconnecter
      </Button>
    </div>
  )
}
