import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { AlertCircle } from 'lucide-react'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [generalError, setGeneralError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors({})
    setGeneralError('')

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else if (err.response?.status === 401) {
        setGeneralError(err.response.data.message || 'Identifiants incorrects')
      } else {
        setGeneralError('Une erreur est survenue. Veuillez réessayer.')
      }
    }
  }

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
        <p className="mt-2 text-sm text-gray-600">
          Bienvenue ! Connectez-vous pour accéder à votre tableau de bord.
        </p>
      </motion.div>

      {generalError && (
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
          <p className="text-sm text-red-700">{generalError}</p>
        </div>
      )}

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
        onSubmit={handleSubmit} className="mt-8 space-y-5"
      >
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="vous@exemple.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email?.[0]}
          autoComplete="email"
          required
        />

        <Input
          label="Mot de passe"
          type="password"
          name="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password?.[0]}
          autoComplete="current-password"
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
            Se souvenir de moi
          </label>
          <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            Mot de passe oublié ?
          </a>
        </div>

        <Button type="submit" size="lg" loading={loading} className="w-full">
          Se connecter
        </Button>
      </motion.form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 text-center text-sm text-gray-600"
      >
        Pas encore de compte ?{' '}
        <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
          Créer un compte
        </Link>
      </motion.p>
    </AuthLayout>
  )
}
