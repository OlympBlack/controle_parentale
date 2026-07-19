import { useState, useEffect, useCallback, useRef, type FormEvent } from 'react'
import type { AxiosError } from 'axios'
import {
  Users,
  UserPlus,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  Loader2,
  Smartphone,
} from 'lucide-react'
import { childService, type CreateChildData } from '@/services/child.service'
import { useFamilyContext } from '@/contexts/FamilyContext'
import type { ApiErrorResponse, Child, ChildStatus, MaturityLevel } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const MATURITY_LEVELS: { value: MaturityLevel; label: string; badge: string }[] = [
  { value: 'enfant',  label: 'Enfant',   badge: 'bg-blue-100 text-blue-700' },
  { value: 'preado',  label: 'Pré-ado',  badge: 'bg-amber-100 text-amber-700' },
  { value: 'ado',     label: 'Ado',      badge: 'bg-purple-100 text-purple-700' },
]

const STATUS_OPTIONS: { value: ChildStatus; label: string; badge: string }[] = [
  { value: 'active',   label: 'Actif',    badge: 'bg-emerald-100 text-emerald-700' },
  { value: 'paused',   label: 'En pause', badge: 'bg-gray-100 text-gray-600' },
  { value: 'archived', label: 'Archivé',  badge: 'bg-red-100 text-red-700' },
]

function statusBadge(status: string): string {
  return STATUS_OPTIONS.find((s) => s.value === status)?.badge ?? 'bg-gray-100 text-gray-600'
}

function statusLabel(status: string): string {
  return STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status
}

function maturityBadge(level: string): string {
  return MATURITY_LEVELS.find((m) => m.value === level)?.badge ?? 'bg-gray-100 text-gray-600'
}

function maturityLabel(level: string): string {
  return MATURITY_LEVELS.find((m) => m.value === level)?.label ?? level
}

function ageFromBirthDate(birthDate: string): number | null {
  if (!birthDate) return null
  const d = new Date(birthDate)
  if (isNaN(d.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - d.getFullYear()
  const m = now.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--
  return age
}

function initials(name: string | null | undefined): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?'
}

// ─── Add/Edit Modal ─────────────────────────────────────────────────────────────

interface ChildModalProps {
  child?: Child | null
  familyId: number
  onClose: () => void
  onSaved: (child: Child, isEdit: boolean) => void
}

function ChildModal({ child, familyId, onClose, onSaved }: ChildModalProps) {
  const isEdit = !!child
  const [firstName, setFirstName]     = useState(child?.first_name ?? '')
  const [lastName, setLastName]       = useState(child?.last_name ?? '')
  const [birthDate, setBirthDate]     = useState(child?.birth_date ? child.birth_date.split('T')[0] : '')
  const [maturity, setMaturity]       = useState<MaturityLevel>(child?.maturity_level ?? 'enfant')
  const [statusVal, setStatusVal]     = useState<ChildStatus>(child?.status ?? 'active')
  const [pinCode, setPinCode]         = useState('')
  const [loading, setLoading]         = useState(false)
  const [errors, setErrors]           = useState<Record<string, string>>({})

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      if (isEdit && child) {
        const updated = await childService.update(child.id, {
          first_name: firstName,
          last_name: lastName || undefined,
          birth_date: birthDate,
          maturity_level: maturity,
          status: statusVal,
        })
        onSaved(updated, true)
      } else {
        const payload: CreateChildData = {
          family_id: familyId,
          first_name: firstName,
          last_name: lastName || undefined,
          birth_date: birthDate,
          maturity_level: maturity,
        }
        if (pinCode) payload.pin_code = pinCode
        const created = await childService.create(payload)
        onSaved(created, false)
      }
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>
      if (axiosErr.response?.data?.errors) {
        const fieldErrors: Record<string, string> = {}
        for (const [key, msgs] of Object.entries(axiosErr.response.data.errors)) {
          fieldErrors[key] = msgs[0]
        }
        setErrors(fieldErrors)
      } else {
        setErrors({ general: axiosErr.response?.data?.message ?? 'Une erreur est survenue.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? 'Modifier l\'enfant' : 'Ajouter un enfant'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {errors.general && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
            <p className="text-sm text-red-700">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Prénom"
              name="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={errors.first_name}
              placeholder="Lucas"
              required
            />
            <Input
              label="Nom"
              name="last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={errors.last_name}
              placeholder="Dupont"
            />
          </div>

          <Input
            label="Date de naissance"
            name="birth_date"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            error={errors.birth_date}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Niveau de maturité</label>
            <div className="grid grid-cols-3 gap-2">
              {MATURITY_LEVELS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMaturity(m.value)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    maturity === m.value
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            {errors.maturity_level && <p className="text-sm text-red-600">{errors.maturity_level}</p>}
          </div>

          {!isEdit && (
            <Input
              label="Code PIN (optionnel)"
              name="pin_code"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              error={errors.pin_code}
              placeholder="1234"
              maxLength={10}
            />
          )}

          {isEdit && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Statut</label>
              <div className="grid grid-cols-3 gap-2">
                {STATUS_OPTIONS.map((s) => {
                  const selected = statusVal === s.value
                  const activeStyles: Record<ChildStatus, string> = {
                    active:   'border-emerald-500 bg-emerald-50 text-emerald-700',
                    paused:   'border-gray-400 bg-gray-100 text-gray-700',
                    archived: 'border-red-500 bg-red-50 text-red-700',
                  }
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setStatusVal(s.value)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        selected
                          ? activeStyles[s.value]
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {s.label}
                    </button>
                  )
                })}
              </div>
              {errors.status && <p className="text-sm text-red-600">{errors.status}</p>}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1" onClick={onClose} type="button">
              Annuler
            </Button>
            <Button className="flex-1" loading={loading} type="submit">
              {isEdit ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Delete Confirmation ────────────────────────────────────────────────────────

function DeleteConfirm({
  child,
  onConfirm,
  onCancel,
}: {
  child: Child
  onConfirm: () => void
  onCancel: () => void
}) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    await onConfirm()
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-base font-bold text-gray-900">Supprimer cet enfant ?</h2>
        <p className="mt-2 text-sm text-gray-500">
          <span className="font-medium text-gray-700">{child.full_name || child.first_name || 'Enfant'}</span> sera supprimé.
          Les appareils associés seront dissociés et l'historique sera conservé en archive.
        </p>
        <div className="mt-5 flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={onCancel}>Conserver</Button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Child Card ─────────────────────────────────────────────────────────────────

function ChildCard({
  child,
  onEdit,
  onDelete,
}: {
  child: Child
  onEdit: () => void
  onDelete: () => void
}) {
  const age = ageFromBirthDate(child.birth_date)
  const score = child.digital_health_score
  const fullName = child.full_name || `${child.first_name ?? ''} ${child.last_name ?? ''}`.trim() || 'Enfant'
  const scoreColor = score === null ? 'text-gray-300' : score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-600' : 'text-red-600'
  const scoreRing = score === null ? 'ring-gray-200' : score >= 70 ? 'ring-emerald-200' : score >= 40 ? 'ring-amber-200' : 'ring-red-200'

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:border-gray-300 hover:shadow-lg">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-brand-500 to-brand-700" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 text-base font-bold text-brand-700 ring-1 ring-brand-200">
              {initials(fullName)}
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">{fullName}</h3>
              <p className="mt-0.5 text-xs text-gray-500">
                {age !== null ? `${age} ans` : 'Âge inconnu'}{child.birth_date ? ` · né(e) le ${new Date(child.birth_date).toLocaleDateString('fr-FR')}` : ''}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={onEdit}
              title="Modifier"
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              title="Supprimer"
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${maturityBadge(child.maturity_level)}`}>
            {maturityLabel(child.maturity_level)}
          </span>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(child.status)}`}>
            {statusLabel(child.status)}
          </span>
          {child.devices_count !== undefined && child.devices_count > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
              <Smartphone className="h-3 w-3" />
              {child.devices_count} appareil{child.devices_count > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400">Santé digitale</span>
          {score !== null ? (
            <span className={`text-sm font-bold ${scoreColor}`}>
              {score}<span className="text-xs font-medium text-gray-400">/100</span>
            </span>
          ) : (
            <span className="text-sm font-medium text-gray-300">—</span>
          )}
        </div>
        {score !== null && (
          <div className={`h-2 w-16 overflow-hidden rounded-full bg-gray-200 ring-1 ${scoreRing}`}>
            <div
              className={`h-full rounded-full ${score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${score}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────────

export function AdminChildrenPage() {
  const { activeFamily } = useFamilyContext()

  const [children, setChildren]             = useState<Child[]>([])
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState('')
  const [showModal, setShowModal]           = useState(false)
  const [editChild, setEditChild]           = useState<Child | null>(null)
  const [deleteChild, setDeleteChild]       = useState<Child | null>(null)

  const load = useCallback(async () => {
    if (!activeFamily) return
    setLoading(true)
    setError('')
    try {
      setChildren(await childService.list(activeFamily.id))
    } catch {
      setError('Impossible de charger les enfants.')
    } finally {
      setLoading(false)
    }
  }, [activeFamily?.id])

  const loadRef = useRef(false)
  useEffect(() => {
    if (loadRef.current) return
    loadRef.current = true
    void load().finally(() => { loadRef.current = false })
  }, [load])

  const handleSaved = (child: Child, isEdit: boolean) => {
    if (isEdit) {
      setChildren((prev) => prev.map((c) => (c.id === child.id ? child : c)))
    } else {
      setChildren((prev) => [...prev, child])
    }
    setShowModal(false)
    setEditChild(null)
  }

  const handleDelete = async () => {
    if (!deleteChild) return
    await childService.remove(deleteChild.id)
    setChildren((prev) => prev.filter((c) => c.id !== deleteChild.id))
    setDeleteChild(null)
  }

  const openEdit = (child: Child) => {
    setEditChild(child)
    setShowModal(true)
  }

  const openAdd = () => {
    setEditChild(null)
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enfants</h1>
          <p className="mt-1 text-sm text-gray-500">
            {activeFamily?.name} · {children.length} enfant{children.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={openAdd} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Ajouter un enfant
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
        </div>
      ) : children.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <Users className="h-10 w-10 text-gray-200" />
          <p className="mt-3 text-sm font-medium text-gray-500">Aucun enfant pour l'instant</p>
          <p className="mt-1 text-xs text-gray-400">Ajoutez votre premier enfant pour commencer la supervision.</p>
          <Button onClick={openAdd} className="mt-4 flex items-center gap-2" size="sm">
            <UserPlus className="h-4 w-4" />
            Ajouter un enfant
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {children.map((child) => (
            <ChildCard
              key={child.id}
              child={child}
              onEdit={() => openEdit(child)}
              onDelete={() => setDeleteChild(child)}
            />
          ))}
        </div>
      )}

      {showModal && activeFamily && (
        <ChildModal
          child={editChild}
          familyId={activeFamily.id}
          onClose={() => { setShowModal(false); setEditChild(null) }}
          onSaved={handleSaved}
        />
      )}

      {deleteChild && (
        <DeleteConfirm
          child={deleteChild}
          onConfirm={handleDelete}
          onCancel={() => setDeleteChild(null)}
        />
      )}
    </div>
  )
}
