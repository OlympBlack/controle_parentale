import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2, Users } from 'lucide-react'
import { familyService } from '@/services/family.service'
import { useAuth } from '@/contexts/AuthContext'
import safekidLogo from '@/assets/safekid.png'

type InvitationData = {
  token: string
  family_name: string
  invited_by: string
  role: string
  role_label: string
  expires_at: string
  email: string
}

type PageState = 'loading' | 'ready' | 'error' | 'accepting' | 'accepted'

export function InvitationPage() {
  const { token }            = useParams<{ token: string }>()
  const navigate             = useNavigate()
  const { isAuthenticated } = useAuth()

  const [state, setState]       = useState<PageState>('loading')
  const [invitation, setInvitation] = useState<InvitationData | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!token) { setState('error'); setErrorMsg('Lien invalide.'); return }

    familyService.getInvitation(token)
      .then((data) => { setInvitation(data); setState('ready') })
      .catch((err) => {
        const msg = err?.response?.data?.message ?? 'Invitation introuvable ou expirée.'
        setErrorMsg(msg)
        setState('error')
      })
  }, [token])

  const handleAccept = async () => {
    if (!token) return
    setState('accepting')
    try {
      await familyService.acceptInvitation(token)
      setState('accepted')
      setTimeout(() => navigate('/dashboard', { replace: true }), 1800)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'Une erreur est survenue.'
      setErrorMsg(msg)
      setState('error')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <img src={safekidLogo} alt="Safekid" className="h-9 w-auto" />
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          {/* Loading */}
          {state === 'loading' && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
              <p className="text-sm text-gray-500">Chargement de l'invitation...</p>
            </div>
          )}

          {/* Error */}
          {state === 'error' && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <XCircle className="h-12 w-12 text-red-400" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Invitation invalide</h1>
                <p className="mt-1 text-sm text-gray-500">{errorMsg}</p>
              </div>
              <Link
                to="/"
                className="mt-2 text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                Retour à l'accueil
              </Link>
            </div>
          )}

          {/* Accepted */}
          {state === 'accepted' && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <CheckCircle className="h-12 w-12 text-emerald-500" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Bienvenue !</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Vous avez rejoint <strong>{invitation?.family_name}</strong>.
                  Redirection en cours...
                </p>
              </div>
            </div>
          )}

          {/* Ready */}
          {(state === 'ready' || state === 'accepting') && invitation && (
            <>
              <div className="mb-6 flex flex-col items-center gap-3 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100">
                  <Users className="h-7 w-7 text-brand-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Rejoindre {invitation.family_name}
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    <strong className="text-gray-700">{invitation.invited_by}</strong> vous invite
                    à rejoindre sa famille en tant que{' '}
                    <span className="font-semibold text-brand-600">{invitation.role_label}</span>.
                  </p>
                </div>
              </div>

              {isAuthenticated ? (
                <button
                  onClick={handleAccept}
                  disabled={state === 'accepting'}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
                >
                  {state === 'accepting'
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Acceptation...</>
                    : 'Accepter l\'invitation'
                  }
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-center text-sm text-gray-500">
                    Créez un compte ou connectez-vous pour rejoindre la famille.
                  </p>
                  <Link
                    to={`/register?invitation=${invitation.token}`}
                    className="flex w-full items-center justify-center rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                  >
                    Créer mon compte
                  </Link>
                  <Link
                    to={`/login?invitation=${invitation.token}`}
                    className="flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    J'ai déjà un compte
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
