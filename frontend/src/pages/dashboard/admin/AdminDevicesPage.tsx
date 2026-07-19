import { useState, useEffect, useCallback, type FormEvent } from 'react'
import type { AxiosError } from 'axios'
import {
  Smartphone,
  Tablet,
  Monitor,
  Plus,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  Loader2,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Wifi,
  WifiOff,
} from 'lucide-react'
import { deviceService, type CreateDeviceData } from '@/services/device.service'
import { childService } from '@/services/child.service'
import { useFamilyContext } from '@/contexts/FamilyContext'
import type { ApiErrorResponse, Child, Device, DeviceStatus, DeviceType } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const DEVICE_TYPES: { value: DeviceType; label: string; icon: typeof Smartphone }[] = [
  { value: 'mobile',    label: 'Mobile',    icon: Smartphone },
  { value: 'tablette',  label: 'Tablette',  icon: Tablet },
  { value: 'pc',        label: 'PC',        icon: Monitor },
  { value: 'autre',     label: 'Autre',     icon: Monitor },
]

const STATUS_OPTIONS: { value: DeviceStatus; label: string; badge: string; activeStyle: string }[] = [
  { value: 'pending',  label: 'En attente', badge: 'bg-amber-100 text-amber-700',   activeStyle: 'border-amber-500 bg-amber-50 text-amber-700' },
  { value: 'active',   label: 'Actif',      badge: 'bg-emerald-100 text-emerald-700', activeStyle: 'border-emerald-500 bg-emerald-50 text-emerald-700' },
  { value: 'inactive', label: 'Inactif',    badge: 'bg-gray-100 text-gray-600',     activeStyle: 'border-gray-400 bg-gray-100 text-gray-700' },
  { value: 'blocked',  label: 'Bloqué',     badge: 'bg-red-100 text-red-700',       activeStyle: 'border-red-500 bg-red-50 text-red-700' },
]

function statusBadge(status: string): string {
  return STATUS_OPTIONS.find((s) => s.value === status)?.badge ?? 'bg-gray-100 text-gray-600'
}

function statusLabel(status: string): string {
  return STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status
}

function typeIcon(type: string): typeof Smartphone {
  return DEVICE_TYPES.find((t) => t.value === type)?.icon ?? Smartphone
}

function typeLabel(type: string): string {
  return DEVICE_TYPES.find((t) => t.value === type)?.label ?? type
}

function BatteryIcon({ level }: { level: number | null }) {
  if (level === null) return null
  if (level <= 20) return <BatteryLow className="h-4 w-4 text-red-500" />
  if (level <= 60) return <BatteryMedium className="h-4 w-4 text-amber-500" />
  return <BatteryFull className="h-4 w-4 text-emerald-500" />
}

function timeAgo(iso: string | null): string {
  if (!iso) return 'Jamais'
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'À l\'instant'
  if (mins < 60) return `Il y a ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Il y a ${hours}h`
  const days = Math.floor(hours / 24)
  return `Il y a ${days}j`
}

// ─── Add/Edit Modal ─────────────────────────────────────────────────────────────

interface DeviceModalProps {
  device?: Device | null
  children: Child[]
  onClose: () => void
  onSaved: (device: Device, isEdit: boolean) => void
}

function DeviceModal({ device, children, onClose, onSaved }: DeviceModalProps) {
  const isEdit = !!device
  const [name, setName]             = useState(device?.name ?? '')
  const [type, setType]             = useState<DeviceType>(device?.type ?? 'mobile')
  const [os, setOs]                 = useState(device?.os ?? '')
  const [osVersion, setOsVersion]   = useState(device?.os_version ?? '')
  const [childId, setChildId]       = useState<number | null>(device?.child_id ?? children[0]?.id ?? null)
  const [statusVal, setStatusVal]   = useState<DeviceStatus>(device?.status ?? 'pending')
  const [loading, setLoading]       = useState(false)
  const [errors, setErrors]         = useState<Record<string, string>>({})

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      if (isEdit && device) {
        const updated = await deviceService.update(device.id, {
          name,
          type,
          os: os || undefined,
          os_version: osVersion || undefined,
          status: statusVal,
        })
        onSaved(updated, true)
      } else {
        if (!childId) {
          setErrors({ child_id: 'Veuillez sélectionner un enfant.' })
          setLoading(false)
          return
        }
        const payload: CreateDeviceData = {
          child_id: childId,
          name,
          type,
          os: os || undefined,
          os_version: osVersion || undefined,
        }
        const created = await deviceService.create(payload)
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
            {isEdit ? 'Modifier l\'appareil' : 'Ajouter un appareil'}
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
          <Input
            label="Nom de l'appareil"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            placeholder="iPhone de Lucas"
            required
          />

          {!isEdit && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Enfant associé</label>
              <select
                value={childId ?? ''}
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
            <label className="block text-sm font-medium text-gray-700">Type d'appareil</label>
            <div className="grid grid-cols-4 gap-2">
              {DEVICE_TYPES.map((t) => {
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

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Système (optionnel)"
              name="os"
              value={os}
              onChange={(e) => setOs(e.target.value)}
              error={errors.os}
              placeholder="iOS, Android..."
            />
            <Input
              label="Version OS"
              name="os_version"
              value={osVersion}
              onChange={(e) => setOsVersion(e.target.value)}
              error={errors.os_version}
              placeholder="17.2"
            />
          </div>

          {isEdit && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Statut</label>
              <div className="grid grid-cols-4 gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setStatusVal(s.value)}
                    className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                      statusVal === s.value
                        ? s.activeStyle
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
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
  device,
  onConfirm,
  onCancel,
}: {
  device: Device
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
        <h2 className="text-base font-bold text-gray-900">Supprimer cet appareil ?</h2>
        <p className="mt-2 text-sm text-gray-500">
          <span className="font-medium text-gray-700">{device.name}</span> sera supprimé.
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

// ─── Device Card ─────────────────────────────────────────────────────────────────

function DeviceCard({
  device,
  onEdit,
  onDelete,
}: {
  device: Device
  onEdit: () => void
  onDelete: () => void
}) {
  const Icon = typeIcon(device.type)
  const childName = device.child?.full_name ?? null

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:border-gray-300 hover:shadow-lg">
      {/* Top accent bar */}
      <div className={`h-1 w-full ${device.is_online ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-gray-300 to-gray-400'}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${device.is_online ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200' : 'bg-gray-100 text-gray-400 ring-1 ring-gray-200'}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">{device.name || 'Appareil sans nom'}</h3>
              <p className="mt-0.5 text-xs text-gray-500">
                {typeLabel(device.type)}{device.os ? ` · ${device.os}` : ''}{device.os_version ? ` ${device.os_version}` : ''}
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
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(device.status)}`}>
            {statusLabel(device.status)}
          </span>
          {childName && (
            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
              {childName}
            </span>
          )}
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${device.is_online ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
            {device.is_online ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {device.is_online ? 'En ligne' : 'Hors ligne'}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-5 py-3">
        <div className="flex items-center gap-3">
          {device.battery_level !== null && (
            <div className="flex items-center gap-1.5">
              <BatteryIcon level={device.battery_level} />
              <span className="text-xs font-medium text-gray-600">{device.battery_level}%</span>
            </div>
          )}
          <span className="text-xs text-gray-400">
            Vu : {timeAgo(device.last_seen_at)}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────────

export function AdminDevicesPage() {
  const { activeFamily } = useFamilyContext()

  const [devices, setDevices]             = useState<Device[]>([])
  const [children, setChildren]           = useState<Child[]>([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState('')
  const [showModal, setShowModal]         = useState(false)
  const [editDevice, setEditDevice]       = useState<Device | null>(null)
  const [deleteDevice, setDeleteDevice]   = useState<Device | null>(null)

  const load = useCallback(async () => {
    if (!activeFamily) return
    setLoading(true)
    setError('')
    try {
      const [devs, kids] = await Promise.all([
        deviceService.list(),
        childService.list(activeFamily.id),
      ])
      setDevices(devs)
      setChildren(kids)
    } catch {
      setError('Impossible de charger les appareils.')
    } finally {
      setLoading(false)
    }
  }, [activeFamily])

  useEffect(() => { void load() }, [load])

  const handleSaved = (device: Device, isEdit: boolean) => {
    if (isEdit) {
      setDevices((prev) => prev.map((d) => (d.id === device.id ? device : d)))
    } else {
      setDevices((prev) => [...prev, device])
    }
    setShowModal(false)
    setEditDevice(null)
  }

  const handleDelete = async () => {
    if (!deleteDevice) return
    await deviceService.remove(deleteDevice.id)
    setDevices((prev) => prev.filter((d) => d.id !== deleteDevice.id))
    setDeleteDevice(null)
  }

  const openEdit = (device: Device) => {
    setEditDevice(device)
    setShowModal(true)
  }

  const openAdd = () => {
    setEditDevice(null)
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appareils</h1>
          <p className="mt-1 text-sm text-gray-500">
            {activeFamily?.name} · {devices.length} appareil{devices.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={openAdd} className="flex items-center gap-2" disabled={children.length === 0}>
          <Plus className="h-4 w-4" />
          Ajouter un appareil
        </Button>
      </div>

      {children.length === 0 && !loading && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <p className="text-sm text-amber-700">
            Vous devez d'abord ajouter au moins un enfant avant de pouvoir associer un appareil.
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
      ) : devices.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <Smartphone className="h-10 w-10 text-gray-200" />
          <p className="mt-3 text-sm font-medium text-gray-500">Aucun appareil pour l'instant</p>
          <p className="mt-1 text-xs text-gray-400">Ajoutez un appareil pour commencer la supervision.</p>
          {children.length > 0 && (
            <Button onClick={openAdd} className="mt-4 flex items-center gap-2" size="sm">
              <Plus className="h-4 w-4" />
              Ajouter un appareil
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onEdit={() => openEdit(device)}
              onDelete={() => setDeleteDevice(device)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <DeviceModal
          device={editDevice}
          children={children}
          onClose={() => { setShowModal(false); setEditDevice(null) }}
          onSaved={handleSaved}
        />
      )}

      {deleteDevice && (
        <DeleteConfirm
          device={deleteDevice}
          onConfirm={handleDelete}
          onCancel={() => setDeleteDevice(null)}
        />
      )}
    </div>
  )
}
