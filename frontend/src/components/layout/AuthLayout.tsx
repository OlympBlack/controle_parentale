import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Check } from 'lucide-react'

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left side - Form */}
      <div className="flex w-full flex-col overflow-y-auto px-4 py-8 sm:px-6 lg:w-1/2 lg:px-8">
        <div className="mx-auto my-auto w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">Contrôle Parental</span>
          </Link>
          {children}
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:block lg:w-1/2">
        <div className="flex h-full flex-col justify-center bg-brand-600 px-12">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-md text-white"
          >
            <h2 className="text-3xl font-bold leading-tight">
              La sécurité numérique de vos enfants, simplifiée.
            </h2>
            <p className="mt-6 text-lg text-white/80">
              Surveillez le temps d'écran, filtrez les contenus, suivez la localisation et
              recevez des alertes en temps réel.
            </p>
            <div className="mt-10 space-y-4">
              {[
                'Filtrage intelligent adapté à l\'âge',
                'Rapports d\'activité détaillés',
                'Alertes en temps réel',
                'Géolocalisation sécurisée',
              ].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-white/90">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
