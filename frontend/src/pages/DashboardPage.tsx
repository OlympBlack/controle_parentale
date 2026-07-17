import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

export function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600"
      >
        <ShieldCheck className="h-6 w-6 text-white" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-6 text-2xl font-bold text-gray-900"
      >
        Bienvenue, {user?.name} !
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="mt-2 text-gray-600"
      >
        Le tableau de bord sera bientôt disponible.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <Button variant="outline" className="mt-6" onClick={logout}>
          Se déconnecter
        </Button>
      </motion.div>
    </div>
  )
}
