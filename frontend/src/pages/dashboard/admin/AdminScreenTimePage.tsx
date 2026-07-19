import { useState, useEffect, useCallback, useRef, type FormEvent } from 'react'
import type { AxiosError } from 'axios'
import {
  Clock,
  Plus,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  Loader2,
  Timer,
  Calendar,
  Moon,
  BookOpen,
  Coffee,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import {
  screenTimeRuleService,
  type CreateScreenTimeRuleData,
} from '@/services/screen-time-rule.service'
import { childService } from '@/services/child.service'
import { useFamilyContext } from '@/contexts/FamilyContext'
import type {
  ApiErrorResponse,
  Child,
  ScreenTimeRule,
  ScreenTimeRuleStatus,
  ScreenTimeRuleType,
} from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const RULE_TYPES: {
  value: ScreenTimeRuleType
  label: string
  icon: typeof Clock
  desc: string
  color: string
}[] = [
  { value: 'daily_quota', label: 'Quota quotidien', icon: Timer,    desc: 'Limite de temps par jour',     color: 'bg-blue-50 text-blue-600' },
  { value: 'schedule',    label: 'Plage horaire',   icon: Calendar, desc: 'Heures autorisées',            color: 'bg-emerald-50 text-emerald-600' },
  { value: 'bedtime',     label: 'Heure de coucher', icon: Moon,    desc: 'Coupure à une heure fixe',     color: 'bg-purple-50 text-purple-600' },
  { value: 'homework',    label: 'Devoirs',         icon: BookOpen, desc: 'Blocage pendant les devoirs',  color: 'bg-amber-50 text-amber-600' },
  { value: 'break',       label: 'Pause',           icon: Coffee,   desc: 'Temps de pause obligatoire',   color: 'bg-orange-50 text-orange-600' },
]

const STATUS_OPTIONS: { value: ScreenTimeRuleStatus; label: string; badge: string; activeStyle: string; icon: typeof CheckCircle2 }[] = [
  { value: 'active',   label: 'Actif',    badge: 'bg-emerald-100 text-emerald-700', activeStyle: 'border-emerald-500 bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
  { value: 'inactive', label: 'Inactif',  badge: 'bg-gray-100 text-gray-600',       activeStyle: 'border-gray-400 bg-gray-100 text-gray-700',         icon: XCircle },
]

const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

function statusBadge(status: string): string {
  return STATUS_OPTIONS.find((s) => s.value === status)?.badge ?? 'bg-gray-100 text-gray-600'
}

function statusLabel(status: string): string {
  return STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status
}

function typeMeta(type: string) {
  return RULE_TYPES.find((t) => t.value === type) ?? RULE_TYPES[0]
}

function formatDuration(minutes: number | null): string {
  if (minutes === null) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h}h`
  return `${h}h${m.toString().padStart(2, '0')}`
}

// ─── Add/Edit Modal ─────────────────────────────────────────────────────────────

interface RuleModalProps {
  rule?: ScreenTimeRule | null
  children: Child[]
  onClose: () => void
  onSaved: (rule: ScreenTimeRule, isEdit: boolean) => void
}

function RuleModal({ rule, children, onClose, onSaved }: RuleModalProps) {
  const isEdit = !!rule
  const [childId, setChildId]       = useState<number>(rule?.child_id ?? children[0]?.id ?? 0)
  const [type, setType]             = useState<ScreenTimeRuleType>(rule?.type ?? 'daily_quota')
  const [duration, setDuration]     = useState<string>(rule?.duration_minutes ? String(rule.duration_minutes) : '')
  const [dayOfWeek, setDayOfWeek]   = useState<string>(rule?.day_of_week !== null ? String(rule?.day_of_week ?? '') : '')
  const [startTime, setStartTime]   = useState<string>(rule?.start_time ?? '')
  const [endTime, setEndTime]       = useState<string>(rule?.end_time ?? '')
  const [statusVal, setStatusVal]   = useState<ScreenTimeRuleStatus>(rule?.status ?? 'active')
  const [loading, setLoading]       = useState(false)
  const [errors, setErrors]         = useState<Record<string, string>>({})

  const needsDuration = type === 'daily_quota' || type === 'break'
  const needsSchedule = type === 'schedule' || type === 'bedtime' || type === 'homework'
  const needsDay = type === 'schedule'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const payload: Record<string, unknown> = { type, status: statusVal }
      if (needsDuration && duration) payload.duration_minutes = Number(duration)
      if (needsSchedule) {
        if (startTime) payload.start_time = startTime
        if (endTime) payload.end_time = endTime
      }
      if (needsDay && dayOfWeek !== '') payload.day_of_week = Number(dayOfWeek)

      if (isEdit && rule) {
        const updated = await screenTimeRuleService.update(rule.id, payload as never)
        onSaved(updated, true)
      } else {
        const createPayload: CreateScreenTimeRuleData = {
          child_id: childId,
          ...payload,
        } as CreateScreenTimeRuleData
        const created = await screenTimeRuleService.create(createPayload)
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
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? 'Modifier la règle' : 'Ajouter une règle'}
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
          {!isEdit && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Enfant</label>
              <select
                value={childId}
                onChange={(e) => setChildId(Number(e.target.value))}
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                {children.map((c) => (
                  <option key={c.id} value={c.id}>{c.full_name || c.first_name}</option>
                ))}
              </select>
              {errors.child_id && <p className="text-sm text-red-600">{errors.child_id}</p>}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Type de règle</label>
            <div className="grid grid-cols-1 gap-2">
              {RULE_TYPES.map((t) => {
                const Icon = t.icon
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                      type === t.value
                        ? 'border-brand-600 bg-brand-50'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${t.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${type === t.value ? 'text-brand-700' : 'text-gray-700'}`}>{t.label}</p>
                      <p className="text-xs text-gray-400">{t.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {needsDuration && (
            <Input
              label="Durée (minutes)"
              name="duration_minutes"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              error={errors.duration_minutes}
              placeholder="120"
            />
          )}

          {needsSchedule && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Heure de début"
                name="start_time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                error={errors.start_time}
              />
              <Input
                label="Heure de fin"
                name="end_time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                error={errors.end_time}
              />
            </div>
          )}

          {needsDay && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Jour (optionnel)</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="">Tous les jours</option>
                {DAYS.map((day, i) => (
                  <option key={i} value={i}>{day}</option>
                ))}
              </select>
            </div>
          )}

          {isEdit && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Statut</label>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map((s) => {
                  const Icon = s.icon
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setStatusVal(s.value)}
                      className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-sm font-medium transition-colors ${
                        statusVal === s.value
                          ? s.activeStyle
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {s.label}
                    </button>
                  )
                })}
              </div>
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
  rule,
  onConfirm,
  onCancel,
}: {
  rule: ScreenTimeRule
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
        <h2 className="text-base font-bold text-gray-900">Supprimer cette règle ?</h2>
        <p className="mt-2 text-sm text-gray-500">
          La règle <span className="font-medium text-gray-700">{typeMeta(rule.type).label}</span> sera supprimée.
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

// ─── Rule Card ──────────────────────────────────────────────────────────────────

function RuleCard({
  rule,
  childName,
  onEdit,
  onDelete,
}: {
  rule: ScreenTimeRule
  childName: string | null
  onEdit: () => void
  onDelete: () => void
}) {
  const meta = typeMeta(rule.type)
  const Icon = meta.icon
  const StatusIcon = STATUS_OPTIONS.find((s) => s.value === rule.status)?.icon ?? XCircle

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:border-gray-300 hover:shadow-lg">
      <div className="h-1 w-full bg-gradient-to-r from-brand-500 to-brand-700" />

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${meta.color} ring-1 ring-gray-100`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{meta.label}</h3>
              <p className="mt-0.5 text-xs text-gray-500">
                {childName && `${childName} · `}
                {rule.day_of_week !== null ? DAYS[rule.day_of_week] : 'Tous les jours'}
              </p>
            </div>
          </div>

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

        {/* Details */}
        <div className="mt-4 space-y-2">
          {rule.duration_minutes !== null && (
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <span className="text-xs text-gray-500">Durée</span>
              <span className="text-sm font-bold text-gray-700">{formatDuration(rule.duration_minutes)}</span>
            </div>
          )}
          {rule.start_time && rule.end_time && (
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <span className="text-xs text-gray-500">Plage</span>
              <span className="text-sm font-bold text-gray-700">{rule.start_time} → {rule.end_time}</span>
            </div>
          )}
        </div>

        {/* Status badge */}
        <div className="mt-4">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(rule.status)}`}>
            <StatusIcon className="h-3 w-3" />
            {statusLabel(rule.status)}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────────

export function AdminScreenTimePage() {
  const { activeFamily } = useFamilyContext()

  const [rules, setRules]               = useState<ScreenTimeRule[]>([])
  const [children, setChildren]         = useState<Child[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [showModal, setShowModal]       = useState(false)
  const [editRule, setEditRule]         = useState<ScreenTimeRule | null>(null)
  const [deleteRule, setDeleteRule]     = useState<ScreenTimeRule | null>(null)
  const [filterChild, setFilterChild]   = useState<number | 'all'>('all')

  const load = useCallback(async () => {
    if (!activeFamily) return
    setLoading(true)
    setError('')
    try {
      const kids = await childService.list(activeFamily.id)
      setChildren(kids)
      const allRules = await Promise.all(
        kids.map((k) => screenTimeRuleService.list(k.id))
      )
      setRules(allRules.flat())
    } catch {
      setError('Impossible de charger les règles de temps d\'écran.')
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

  const childMap = new Map(children.map((c) => [c.id, c.full_name || c.first_name]))
  const filteredRules = filterChild === 'all' ? rules : rules.filter((r) => r.child_id === filterChild)

  const handleSaved = (rule: ScreenTimeRule, isEdit: boolean) => {
    if (isEdit) {
      setRules((prev) => prev.map((r) => (r.id === rule.id ? rule : r)))
    } else {
      setRules((prev) => [...prev, rule])
    }
    setShowModal(false)
    setEditRule(null)
  }

  const handleDelete = async () => {
    if (!deleteRule) return
    await screenTimeRuleService.remove(deleteRule.id)
    setRules((prev) => prev.filter((r) => r.id !== deleteRule.id))
    setDeleteRule(null)
  }

  const openEdit = (rule: ScreenTimeRule) => {
    setEditRule(rule)
    setShowModal(true)
  }

  const openAdd = () => {
    setEditRule(null)
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Temps d'écran</h1>
          <p className="mt-1 text-sm text-gray-500">
            {activeFamily?.name} · {filteredRules.length} règle{filteredRules.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={openAdd} className="flex items-center gap-2" disabled={children.length === 0}>
          <Plus className="h-4 w-4" />
          Ajouter une règle
        </Button>
      </div>

      {children.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Filtrer par enfant :</span>
          <select
            value={filterChild}
            onChange={(e) => setFilterChild(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="all">Tous les enfants</option>
            {children.map((c) => (
              <option key={c.id} value={c.id}>{c.full_name || c.first_name}</option>
            ))}
          </select>
        </div>
      )}

      {children.length === 0 && !loading && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <p className="text-sm text-amber-700">
            Vous devez d'abord ajouter au moins un enfant avant de créer des règles de temps d'écran.
          </p>
        </div>
      )}

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
      ) : filteredRules.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <Clock className="h-10 w-10 text-gray-200" />
          <p className="mt-3 text-sm font-medium text-gray-500">Aucune règle de temps d'écran</p>
          <p className="mt-1 text-xs text-gray-400">Créez une règle pour limiter le temps d'écran de vos enfants.</p>
          {children.length > 0 && (
            <Button onClick={openAdd} className="mt-4 flex items-center gap-2" size="sm">
              <Plus className="h-4 w-4" />
              Ajouter une règle
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRules.map((rule) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              childName={childMap.get(rule.child_id) ?? null}
              onEdit={() => openEdit(rule)}
              onDelete={() => setDeleteRule(rule)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <RuleModal
          rule={editRule}
          children={children}
          onClose={() => { setShowModal(false); setEditRule(null) }}
          onSaved={handleSaved}
        />
      )}

      {deleteRule && (
        <DeleteConfirm
          rule={deleteRule}
          onConfirm={handleDelete}
          onCancel={() => setDeleteRule(null)}
        />
      )}
    </div>
  )
}
