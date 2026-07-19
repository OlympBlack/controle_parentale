import { useState, useEffect, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { AxiosError } from 'axios'
import { Users, Check, AlertCircle, Sparkles } from 'lucide-react'
import safekidLogo from '@/assets/safekid.png'
import { familyService } from '@/services/family.service'
import { useFamilyContext } from '@/contexts/FamilyContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { ApiErrorResponse, FamilyPlan } from '@/types'

interface PlanOption {
  id: FamilyPlan
  label: string
  price: string
  description: string
  features: string[]
  highlight: boolean
}

const PLANS: PlanOption[] = [
  {
    id: 'free',
    label: 'Gratuit',
    price: '0 €',
    description: 'Pour commencer',
    features: ['1 enfant', '2 appareils', 'Filtrage basique', 'Alertes e-mail'],
    highlight: false,
  },
  {
    id: 'premium',
    label: 'Premium',
    price: '4,99 €/mois',
    description: 'Pour les familles',
    features: ['Enfants illimités', 'Appareils illimités', 'Toutes les fonctionnalités', 'Support prioritaire'],
    highlight: true,
  },
]

export function OnboardingPage() {
  const navigate = useNavigate()
  const { families, isLoadingFamily, refreshFamilies } = useFamilyContext()

  const [name, setName] = useState('')
  const [plan, setPlan] = useState<FamilyPlan>('free')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [generalError, setGeneralError] = useState('')

  useEffect(() => {
    if (!isLoadingFamily && families.length > 0) {
      navigate('/dashboard', { replace: true })
    }
  }, [isLoadingFamily, families, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    setGeneralError('')
    setLoading(true)

    try {
      await familyService.create(name.trim(), plan)
      await refreshFamilies()
      navigate('/dashboard/admin', { replace: true })
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>
      const status = error.response?.status
      if (status === 422) {
        setFieldErrors(error.response?.data?.errors ?? {})
      } else {
        setGeneralError('Une erreur est survenue. Veuillez réessayer.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left — Form */}
      <div className="flex w-full flex-col overflow-y-auto px-4 py-8 sm:px-6 lg:w-1/2 lg:px-8">
        <div className="mx-auto my-auto w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center">
            <img src={safekidLogo} alt="Safekid" className="h-9 w-auto" />
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100">
              <Users className="h-6 w-6 text-brand-600" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Créez votre famille</h1>
            <p className="mt-1 text-sm text-gray-500">
              Vous n'appartenez encore à aucune famille. Créez-en une pour commencer à protéger vos enfants.
            </p>
          </motion.div>

          {generalError && (
            <div className="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
              <p className="text-sm text-red-700">{generalError}</p>
            </div>
          )}

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
          >
            <Input
              label="Nom de la famille"
              type="text"
              name="name"
              placeholder="Ex : Famille Dupont"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={fieldErrors.name?.[0]}
              autoComplete="off"
              required
            />

            <fieldset>
              <legend className="mb-3 text-sm font-medium text-gray-700">Choisir un plan</legend>
              <div className="grid grid-cols-2 gap-3">
                {PLANS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlan(p.id)}
                    className={`relative rounded-xl border-2 p-4 text-left transition-all focus:outline-none ${
                      plan === p.id
                        ? 'border-brand-600 bg-brand-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {p.highlight && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        Recommandé
                      </span>
                    )}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{p.label}</p>
                        <p className="mt-0.5 text-xs text-gray-500">{p.description}</p>
                      </div>
                      <div className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        plan === p.id ? 'border-brand-600 bg-brand-600' : 'border-gray-300'
                      }`}>
                        {plan === p.id && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                      </div>
                    </div>
                    <p className="mt-2 text-base font-bold text-gray-900">{p.price}</p>
                    <ul className="mt-2 space-y-1">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Check className="h-3 w-3 flex-shrink-0 text-brand-500" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </fieldset>

            <Button type="submit" size="lg" loading={loading} className="w-full">
              Créer ma famille
            </Button>
          </motion.form>
        </div>
      </div>

      {/* Right — Visual */}
      <div className="hidden lg:block lg:w-1/2">
        <div className="flex h-full flex-col justify-center bg-brand-600 px-12">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-md text-white"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold leading-tight">
              Votre famille, votre espace de protection.
            </h2>
            <p className="mt-6 text-lg text-white/80">
              Invitez votre partenaire, configurez les règles et protégez chaque enfant avec des paramètres personnalisés.
            </p>
            <div className="mt-10 space-y-4">
              {[
                'Rôles par membre (admin, gestionnaire, observateur)',
                'Paramètres individuels par enfant',
                'Tableau de bord partagé en temps réel',
                'Notifications pour toute la famille',
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
