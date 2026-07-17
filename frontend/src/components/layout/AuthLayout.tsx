import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">Contrôle Parental</span>
          </Link>
          {children}
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:block lg:w-1/2">
        <div className="flex h-full flex-col justify-center bg-gradient-to-br from-brand-600 via-brand-700 to-accent-600 px-12">
          <div className="max-w-md text-white">
            <h2 className="text-3xl font-bold leading-tight">
              La sécurité numérique de vos enfants, simplifiée.
            </h2>
            <p className="mt-6 text-lg text-brand-100">
              Surveillez le temps d'écran, filtrez les contenus, suivez la localisation et
              recevez des alertes en temps réel.
            </p>
            <div className="mt-10 space-y-4">
              {[
                'Filtrage intelligent adapté à l\'âge',
                'Rapports d\'activité détaillés',
                'Alertes en temps réel',
                'Géolocalisation sécurisée',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-brand-50">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
