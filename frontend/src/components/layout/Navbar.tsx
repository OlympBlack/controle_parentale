import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">Contrôle Parental</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Fonctionnalités
          </a>
          <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Tarifs
          </a>
          <a href="#faq" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Connexion</Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Essai gratuit</Button>
          </Link>
        </div>
      </div>
    </motion.header>
  )
}
