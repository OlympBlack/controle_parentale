import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { AlertCircle } from 'lucide-react'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register, loading } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [generalError, setGeneralError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors({})
    setGeneralError('')

    try {
      await register(name, email, password, passwordConfirmation)
      navigate('/dashboard')
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
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
        <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
        <p className="mt-2 text-sm text-gray-600">
          Commencez votre essai gratuit. Aucune carte requise.
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
          label="Nom complet"
          type="text"
          name="name"
          placeholder="Jean Dupont"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name?.[0]}
          autoComplete="name"
          required
        />

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
          autoComplete="new-password"
          required
        />

        <Input
          label="Confirmer le mot de passe"
          type="password"
          name="password_confirmation"
          placeholder="••••••••"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          error={errors.password_confirmation?.[0]}
          autoComplete="new-password"
          required
        />

        <label className="flex items-start gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            className="mt-0.5 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            required
          />
          <span>
            J'accepte les{' '}
            <a href="#" className="font-medium text-brand-600 hover:text-brand-700">CGU</a> et la{' '}
            <a href="#" className="font-medium text-brand-600 hover:text-brand-700">politique de confidentialité</a>
          </span>
        </label>

        <Button type="submit" size="lg" loading={loading} className="w-full">
          Créer mon compte
        </Button>
      </motion.form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 text-center text-sm text-gray-600"
      >
        Déjà un compte ?{' '}
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
          Se connecter
        </Link>
      </motion.p>
    </AuthLayout>
  )
}
