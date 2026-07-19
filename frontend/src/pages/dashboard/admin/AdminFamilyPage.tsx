import { useState, useEffect, useCallback, type FormEvent } from 'react'
import type { AxiosError } from 'axios'
import {
  Users,
  UserPlus,
  Crown,
  ChevronDown,
  Trash2,
  X,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { familyService } from '@/services/family.service'
import { useFamilyContext } from '@/contexts/FamilyContext'
import { useAuth } from '@/contexts/AuthContext'
import type { ApiErrorResponse, FamilyMember, PendingInvitation, UserRole } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLES: { value: UserRole; label: string; badge: string }[] = [
  { value: 'admin',        label: 'Administrateur', badge: 'bg-brand-100 text-brand-700' },
  { value: 'gestionnaire', label: 'Gestionnaire',   badge: 'bg-emerald-100 text-emerald-700' },
  { value: 'observateur',  label: 'Observateur',    badge: 'bg-gray-100 text-gray-600' },
]

function roleBadge(role: UserRole): string {
  return ROLES.find((r) => r.value === role)?.badge ?? 'bg-gray-100 text-gray-600'
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MemberAvatar({ name }: { name: string }) {
  return (
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

interface RoleSelectorProps {
  memberId: number
  currentRole: UserRole
  isOwner: boolean
  isSelf: boolean
  onUpdate: (userId: number, role: UserRole) => Promise<void>
}

function RoleSelector({ memberId, currentRole, isOwner, isSelf, onUpdate }: RoleSelectorProps) {
  const [loading, setLoading] = useState(false)

  if (isOwner || isSelf) {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleBadge(currentRole)}`}>
        {isOwner && <Crown className="h-3 w-3" />}
        {ROLES.find((r) => r.value === currentRole)?.label ?? currentRole}
      </span>
    )
  }

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as UserRole
    setLoading(true)
    try {
      await onUpdate(memberId, role)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex items-center gap-1.5">
      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />}
      <div className="relative">
        <select
          value={currentRole}
          onChange={handleChange}
          disabled={loading}
          className={`appearance-none rounded-full py-0.5 pl-2.5 pr-7 text-xs font-semibold outline-none transition-opacity ${roleBadge(currentRole)} ${loading ? 'opacity-50' : ''}`}
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 opacity-60" />
      </div>
    </div>
  )
}

interface InviteModalProps {
  onClose: () => void
  onInvite: (email: string, role: UserRole) => Promise<void>
}

function InviteModal({ onClose, onInvite }: InviteModalProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>('observateur')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [generalError, setGeneralError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors({})
    setGeneralError('')
    setLoading(true)
    try {
      await onInvite(email, role)
      onClose()
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>
      if (error.response?.status === 422) {
        setErrors(error.response.data?.errors ?? {})
        if (!error.response.data?.errors) {
          setGeneralError(error.response.data?.message ?? 'Erreur de validation.')
        }
      } else {
        setGeneralError(error.response?.data?.message ?? 'Une erreur est survenue.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Inviter un membre</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              L'utilisateur doit déjà avoir un compte Safekid.
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {generalError && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
            <p className="text-sm text-red-700">{generalError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Adresse e-mail"
            type="email"
            placeholder="membre@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email?.[0]}
            required
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Rôle</label>
            <div className="space-y-2">
              {ROLES.map((r) => (
                <label
                  key={r.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-all ${
                    role === r.value
                      ? 'border-brand-600 bg-brand-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={role === r.value}
                    onChange={() => setRole(r.value)}
                    className="sr-only"
                  />
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.badge}`}>
                    {r.label}
                  </span>
                  <span className="text-sm text-gray-600">
                    {r.value === 'admin' && 'Accès complet, peut gérer la famille'}
                    {r.value === 'gestionnaire' && 'Peut gérer les enfants et les règles'}
                    {r.value === 'observateur' && 'Consultation uniquement, sans modification'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1" loading={loading}>
              Inviter
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface RemoveConfirmProps {
  member: FamilyMember
  onConfirm: () => Promise<void>
  onCancel: () => void
}

function RemoveConfirm({ member, onConfirm, onCancel }: RemoveConfirmProps) {
  const [loading, setLoading] = useState(false)

  const handle = async () => {
    setLoading(true)
    try { await onConfirm() } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-base font-bold text-gray-900">Retirer ce membre ?</h2>
        <p className="mt-2 text-sm text-gray-500">
          <span className="font-medium text-gray-700">{member.name}</span> perdra immédiatement
          l'accès à la famille.
        </p>
        <div className="mt-5 flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={onCancel}>Annuler</Button>
          <button
            onClick={handle}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Retirer
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function AdminFamilyPage() {
  const { user } = useAuth()
  const { activeFamily } = useFamilyContext()

  const [members, setMembers]             = useState<FamilyMember[]>([])
  const [invitations, setInvitations]     = useState<PendingInvitation[]>([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState('')
  const [showInvite, setShowInvite]       = useState(false)
  const [confirmRemove, setConfirmRemove]   = useState<FamilyMember | null>(null)
  const [confirmCancel, setConfirmCancel]   = useState<PendingInvitation | null>(null)

  const load = useCallback(async () => {
    if (!activeFamily) return
    setLoading(true)
    setError('')
    try {
      const [m, inv] = await Promise.all([
        familyService.listMembers(activeFamily.id),
        familyService.listInvitations(activeFamily.id),
      ])
      setMembers(m)
      setInvitations(inv)
    } catch {
      setError('Impossible de charger les membres.')
    } finally {
      setLoading(false)
    }
  }, [activeFamily])

  useEffect(() => { void load() }, [load])

  const handleInvite = async (email: string, role: UserRole) => {
    if (!activeFamily) return
    const result = await familyService.addMember(activeFamily.id, email, role) as FamilyMember & { pending?: boolean; expires_at?: string }
    if (result.pending) {
      setInvitations((prev) => [...prev, {
        id: Date.now(),
        email: result.email ?? email,
        role: result.role as UserRole,
        role_label: ROLES.find((r) => r.value === result.role)?.label ?? String(result.role),
        invited_by: user?.name ?? '',
        expires_at: result.expires_at ?? '',
      }])
    } else {
      setMembers((prev) => [...prev, result])
    }
  }

  const handleCancelInvitation = async (inv: PendingInvitation) => {
    if (!activeFamily) return
    await familyService.cancelInvitation(activeFamily.id, inv.id)
    setInvitations((prev) => prev.filter((i) => i.id !== inv.id))
  }

  const handleRoleUpdate = async (userId: number, role: UserRole) => {
    if (!activeFamily) return
    const updated = await familyService.updateMemberRole(activeFamily.id, userId, role)
    setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
  }

  const handleRemove = async (member: FamilyMember) => {
    if (!activeFamily) return
    await familyService.removeMember(activeFamily.id, member.id)
    setMembers((prev) => prev.filter((m) => m.id !== member.id))
    setConfirmRemove(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Famille</h1>
          <p className="mt-1 text-sm text-gray-500">
            {activeFamily?.name} · {members.length} membre{members.length > 1 ? 's' : ''}
            {invitations.length > 0 && ` · ${invitations.length} invitation${invitations.length > 1 ? 's' : ''} en attente`}
          </p>
        </div>
        <Button onClick={() => setShowInvite(true)} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Inviter un membre
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Confirmed members */}
      <div className="rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-10 w-10 text-gray-200" />
            <p className="mt-3 text-sm font-medium text-gray-500">Aucun membre pour l'instant</p>
            <p className="mt-1 text-xs text-gray-400">Invitez un partenaire ou proche pour partager la gestion.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {members.map((member) => {
              const isSelf  = member.id === user?.id
              const isOwner = member.is_owner
              return (
                <li key={member.id} className="flex items-center gap-4 px-5 py-4">
                  <MemberAvatar name={member.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-gray-900">{member.name}</p>
                      {isSelf && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">Vous</span>
                      )}
                    </div>
                    <p className="truncate text-xs text-gray-500">{member.email}</p>
                  </div>
                  <RoleSelector
                    memberId={member.id}
                    currentRole={member.role}
                    isOwner={isOwner}
                    isSelf={isSelf}
                    onUpdate={handleRoleUpdate}
                  />
                  {!isOwner && !isSelf && (
                    <button
                      onClick={() => setConfirmRemove(member)}
                      title="Retirer ce membre"
                      className="ml-1 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Pending invitations */}
      {!loading && invitations.length > 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white">
          <div className="border-b border-gray-100 px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Invitations en attente
            </p>
          </div>
          <ul className="divide-y divide-gray-100">
            {invitations.map((inv) => (
              <li key={inv.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                  <span className="text-sm font-bold text-gray-400">?</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-700">{inv.email}</p>
                  <p className="text-xs text-gray-400">Invitation envoyée · expire dans 7 jours</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleBadge(inv.role)}`}>
                  {inv.role_label}
                </span>
                <button
                  onClick={() => setConfirmCancel(inv)}
                  className="ml-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
                >
                  Annuler
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showInvite && (
        <InviteModal
          onClose={() => setShowInvite(false)}
          onInvite={handleInvite}
        />
      )}

      {confirmRemove && (
        <RemoveConfirm
          member={confirmRemove}
          onConfirm={() => handleRemove(confirmRemove)}
          onCancel={() => setConfirmRemove(null)}
        />
      )}

      {confirmCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmCancel(null)} />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-base font-bold text-gray-900">Annuler cette invitation ?</h2>
            <p className="mt-2 text-sm text-gray-500">
              L'invitation envoyée à{' '}
              <span className="font-medium text-gray-700">{confirmCancel.email}</span>{' '}
              sera définitivement supprimée.
            </p>
            <div className="mt-5 flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setConfirmCancel(null)}>Conserver</Button>
              <button
                onClick={async () => {
                  await handleCancelInvitation(confirmCancel)
                  setConfirmCancel(null)
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
