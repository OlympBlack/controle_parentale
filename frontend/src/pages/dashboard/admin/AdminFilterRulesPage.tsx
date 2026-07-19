import { useState, useEffect, useCallback, useRef, type FormEvent } from 'react'
import type { AxiosError } from 'axios'
import {
  Shield,
  Plus,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  Loader2,
  Globe,
  Search,
  Tag,
  AppWindow,
  Ban,
  CheckCircle2,
  PauseCircle,
  XCircle,
} from 'lucide-react'
import {
  filterRuleService,
  contentCategoryService,
  type CreateFilterRuleData,
} from '@/services/filter-rule.service'
import { childService } from '@/services/child.service'
import { useFamilyContext } from '@/contexts/FamilyContext'
import type {
  ApiErrorResponse,
  Child,
  ContentCategory,
  FilterRule,
  FilterRuleStatus,
  FilterRuleType,
} from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const RULE_TYPES: { value: FilterRuleType; label: string; icon: typeof Globe; placeholder: string }[] = [
  { value: 'domain',   label: 'Domaine',   icon: Globe,      placeholder: 'exemple.com' },
  { value: 'keyword',  label: 'Mot-clé',   icon: Search,     placeholder: 'violence' },
  { value: 'category', label: 'Catégorie', icon: Tag,        placeholder: 'Sélectionner des catégories' },
  { value: 'app',      label: 'Application', icon: AppWindow, placeholder: 'com.exemple.app' },
]

const STATUS_OPTIONS: { value: FilterRuleStatus; label: string; badge: string; activeStyle: string; icon: typeof Ban }[] = [
  { value: 'active',    label: 'Actif',    badge: 'bg-emerald-100 text-emerald-700', activeStyle: 'border-emerald-500 bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
  { value: 'paused',    label: 'En pause', badge: 'bg-amber-100 text-amber-700',    activeStyle: 'border-amber-500 bg-amber-50 text-amber-700',       icon: PauseCircle },
  { value: 'disabled',  label: 'Désactivé', badge: 'bg-gray-100 text-gray-600',     activeStyle: 'border-gray-400 bg-gray-100 text-gray-700',         icon: XCircle },
]

function statusBadge(status: string): string {
  return STATUS_OPTIONS.find((s) => s.value === status)?.badge ?? 'bg-gray-100 text-gray-600'
}

function statusLabel(status: string): string {
  return STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status
}

function typeIcon(type: string): typeof Globe {
  return RULE_TYPES.find((t) => t.value === type)?.icon ?? Globe
}

function typeLabel(type: string): string {
  return RULE_TYPES.find((t) => t.value === type)?.label ?? type
}

// ─── Add/Edit Modal ─────────────────────────────────────────────────────────────

interface RuleModalProps {
  rule?: FilterRule | null
  children: Child[]
  categories: ContentCategory[]
  onClose: () => void
  onSaved: (rule: FilterRule, isEdit: boolean) => void
}

function RuleModal({ rule, children, categories, onClose, onSaved }: RuleModalProps) {
  const isEdit = !!rule
  const [childId, setChildId]       = useState<number>(rule?.child_id ?? children[0]?.id ?? 0)
  const [type, setType]             = useState<FilterRuleType>(rule?.type ?? 'domain')
  const [value, setValue]           = useState(rule?.value ?? '')
  const [statusVal, setStatusVal]   = useState<FilterRuleStatus>(rule?.status ?? 'active')
  const [selectedCats, setSelectedCats] = useState<number[]>(
    rule?.categories?.map((c) => c.id) ?? []
  )
  const [loading, setLoading]       = useState(false)
  const [errors, setErrors]         = useState<Record<string, string>>({})

  const currentType = RULE_TYPES.find((t) => t.value === type)

  const toggleCategory = (id: number) => {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      if (isEdit && rule) {
        const payload: Record<string, unknown> = { type, value, status: statusVal }
        if (type === 'category') payload.categories = selectedCats
        const updated = await filterRuleService.update(rule.id, payload as never)
        onSaved(updated, true)
      } else {
        const payload: CreateFilterRuleData = { child_id: childId, type, value, status: statusVal }
        if (type === 'category') payload.categories = selectedCats
        const created = await filterRuleService.create(payload)
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
            <div className="grid grid-cols-4 gap-2">
              {RULE_TYPES.map((t) => {
                const Icon = t.icon
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-xs font-medium transition-colors ${
                      type === t.value
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>

          {type === 'category' ? (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Catégories</label>
              <div className="max-h-40 overflow-y-auto rounded-lg border border-gray-200 p-3 space-y-2">
                {categories.length === 0 ? (
                  <p className="text-sm text-gray-400">Aucune catégorie disponible</p>
                ) : (
                  categories.map((cat) => (
                    <div key={cat.id}>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={selectedCats.includes(cat.id)}
                          onChange={() => toggleCategory(cat.id)}
                          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                        />
                        {cat.name}
                        {cat.is_sensitive && (
                          <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-600">
                            Sensible
                          </span>
                        )}
                      </label>
                      {cat.children && cat.children.length > 0 && (
                        <div className="ml-6 mt-1 space-y-1">
                          {cat.children.map((sub) => (
                            <label key={sub.id} className="flex items-center gap-2 text-xs text-gray-500">
                              <input
                                type="checkbox"
                                checked={selectedCats.includes(sub.id)}
                                onChange={() => toggleCategory(sub.id)}
                                className="h-3.5 w-3.5 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                              />
                              {sub.name}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              {errors.categories && <p className="text-sm text-red-600">{errors.categories}</p>}
            </div>
          ) : (
            <Input
              label="Valeur"
              name="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              error={errors.value}
              placeholder={currentType?.placeholder ?? ''}
              required
            />
          )}

          {isEdit && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Statut</label>
              <div className="grid grid-cols-3 gap-2">
                {STATUS_OPTIONS.map((s) => {
                  const Icon = s.icon
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setStatusVal(s.value)}
                      className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                        statusVal === s.value
                          ? s.activeStyle
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
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
  rule: FilterRule
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
          La règle <span className="font-medium text-gray-700">{rule.value}</span> sera supprimée.
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
  rule: FilterRule
  childName: string | null
  onEdit: () => void
  onDelete: () => void
}) {
  const Icon = typeIcon(rule.type)
  const StatusIcon = STATUS_OPTIONS.find((s) => s.value === rule.status)?.icon ?? Ban

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:border-gray-300 hover:shadow-lg">
      <div className="h-1 w-full bg-gradient-to-r from-brand-500 to-brand-700" />

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{rule.value}</h3>
              <p className="mt-0.5 text-xs text-gray-500">
                {typeLabel(rule.type)}
                {childName && ` · ${childName}`}
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

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(rule.status)}`}>
            <StatusIcon className="h-3 w-3" />
            {statusLabel(rule.status)}
          </span>
          {rule.categories && rule.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {rule.categories.slice(0, 3).map((cat) => (
                <span key={cat.id} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                  {cat.name}
                </span>
              ))}
              {rule.categories.length > 3 && (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-400">
                  +{rule.categories.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────────

export function AdminFilterRulesPage() {
  const { activeFamily } = useFamilyContext()

  const [rules, setRules]               = useState<FilterRule[]>([])
  const [children, setChildren]         = useState<Child[]>([])
  const [categories, setCategories]     = useState<ContentCategory[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [showModal, setShowModal]       = useState(false)
  const [editRule, setEditRule]         = useState<FilterRule | null>(null)
  const [deleteRule, setDeleteRule]     = useState<FilterRule | null>(null)
  const [filterChild, setFilterChild]   = useState<number | 'all'>('all')

  const load = useCallback(async () => {
    if (!activeFamily) return
    setLoading(true)
    setError('')
    try {
      const [kids, cats] = await Promise.all([
        childService.list(activeFamily.id),
        contentCategoryService.list(),
      ])
      setChildren(kids)
      setCategories(cats)
      const allRules = await Promise.all(
        kids.map((k) => filterRuleService.list(k.id))
      )
      setRules(allRules.flat())
    } catch {
      setError('Impossible de charger les règles de filtrage.')
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

  const handleSaved = (rule: FilterRule, isEdit: boolean) => {
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
    await filterRuleService.remove(deleteRule.id)
    setRules((prev) => prev.filter((r) => r.id !== deleteRule.id))
    setDeleteRule(null)
  }

  const openEdit = (rule: FilterRule) => {
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
          <h1 className="text-2xl font-bold text-gray-900">Règles de filtrage</h1>
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
            Vous devez d'abord ajouter au moins un enfant avant de créer des règles de filtrage.
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
          <Shield className="h-10 w-10 text-gray-200" />
          <p className="mt-3 text-sm font-medium text-gray-500">Aucune règle de filtrage</p>
          <p className="mt-1 text-xs text-gray-400">Créez une règle pour bloquer des sites, mots-clés ou catégories.</p>
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
          categories={categories}
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
