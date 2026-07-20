import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Smartphone,
  Tablet,
  Monitor,
  Wifi,
  WifiOff,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  MapPin,
  Clock,
  AppWindow,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Shield,
  Bell,
  BarChart3,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { deviceService } from '@/services/device.service'
import type { Device } from '@/types'
import { Button } from '@/components/ui/Button'
import { DeviceMap } from '@/components/DeviceMap'

const STATUS_BADGES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-gray-100 text-gray-600',
  blocked: 'bg-red-100 text-red-700',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  active: 'Actif',
  inactive: 'Inactif',
  blocked: 'Bloqué',
}

function typeIcon(type: string) {
  switch (type) {
    case 'mobile': return Smartphone
    case 'tablette': return Tablet
    case 'pc': return Monitor
    default: return Monitor
  }
}

function BatteryIcon({ level }: { level: number | null }) {
  if (level === null) return null
  if (level <= 20) return <BatteryLow className="h-5 w-5 text-red-500" />
  if (level <= 60) return <BatteryMedium className="h-5 w-5 text-amber-500" />
  return <BatteryFull className="h-5 w-5 text-emerald-500" />
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

function formatDuration(seconds: number | null): string {
  if (!seconds) return '—'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}min`
  return `${m}min`
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function AdminDeviceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [device, setDevice] = useState<Device | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    if (!id) return
    load()
  }, [id])

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const d = await deviceService.getById(Number(id))
      setDevice(d)
    } catch {
      setError('Impossible de charger les détails de l\'appareil.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    )
  }

  if (error || !device) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-700">{error || 'Appareil introuvable.'}</p>
        </div>
        <Button variant="ghost" onClick={() => navigate('/dashboard/admin/devices')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux appareils
        </Button>
      </div>
    )
  }

  const Icon = typeIcon(device.type)
  const perms = device.permissions_accordees

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard/admin/devices')}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux appareils
      </button>

      {/* Header card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className={`h-2 w-full ${device.is_online ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-gray-300 to-gray-400'}`} />
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${device.is_online ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200' : 'bg-gray-100 text-gray-400 ring-1 ring-gray-200'}`}>
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{device.name}</h1>
                <p className="mt-1 text-sm text-gray-500">
                  {device.brand} {device.model} · {device.os} {device.os_version} · v{device.app_version}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGES[device.status] ?? 'bg-gray-100 text-gray-600'}`}>
                {STATUS_LABELS[device.status] ?? device.status}
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${device.is_online ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                {device.is_online ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
                {device.is_online ? 'En ligne' : 'Hors ligne'}
              </span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <BatteryIcon level={device.battery_level} />
                <span className="text-xs font-medium text-gray-400">Batterie</span>
              </div>
              <p className="mt-1 text-xl font-bold text-gray-900">{device.battery_level !== null ? `${device.battery_level}%` : '—'}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="text-xs font-medium text-gray-400">Vu</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-gray-900">{timeAgo(device.last_seen_at)}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-gray-400" />
                <span className="text-xs font-medium text-gray-400">Sync</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-gray-900">{timeAgo(device.derniere_synchronisation)}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-gray-400" />
                <span className="text-xs font-medium text-gray-400">Enfant</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-gray-900">{device.child?.full_name ?? '—'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: Pairing + Permissions + Device info */}
        <div className="space-y-6">
          {/* Pairing code */}
          {device.pairing_code && (
            <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
              <h3 className="text-sm font-bold text-brand-900">Code d'appairage</h3>
              <div className="mt-3 flex items-center gap-4">
                <div className="rounded-xl bg-white p-3">
                  <QRCodeSVG value={device.pairing_code} size={80} level="M" />
                </div>
                <div>
                  <code className="text-2xl font-bold tracking-wider text-brand-900">{device.pairing_code}</code>
                  <p className="mt-1 text-xs text-brand-600">Scannez ce QR dans l'app mobile</p>
                </div>
              </div>
            </div>
          )}

          {/* Permissions */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-bold text-gray-900">Permissions accordées</h3>
            <div className="mt-3 space-y-2">
              {perms ? (
                <>
                  <PermRow granted={perms.usage_access} icon={BarChart3} label="Accès usage" />
                  <PermRow granted={perms.location} icon={MapPin} label="Localisation" />
                  <PermRow granted={perms.notifications} icon={Bell} label="Notifications" />
                </>
              ) : (
                <p className="text-sm text-gray-400">Aucune permission accordée.</p>
              )}
            </div>
          </div>

          {/* Device info */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-bold text-gray-900">Informations techniques</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <InfoRow label="Type" value={device.type} />
              <InfoRow label="Marque" value={device.brand} />
              <InfoRow label="Modèle" value={device.model} />
              <InfoRow label="OS" value={`${device.os ?? '—'} ${device.os_version ?? ''}`.trim()} />
              <InfoRow label="Version app" value={device.app_version} />
              <InfoRow label="Appairé le" value={formatDate(device.paired_at)} />
              <InfoRow label="Créé le" value={formatDate(device.created_at)} />
            </dl>
          </div>
        </div>

        {/* Right column: Apps + Locations + Usage */}
        <div className="space-y-6 lg:col-span-2">
          {/* Installed apps */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <AppWindow className="h-5 w-5 text-gray-400" />
              <h3 className="text-sm font-bold text-gray-900">
                Applications installées
                {device.installed_apps && (
                  <span className="ml-2 text-xs font-normal text-gray-400">({device.installed_apps.length})</span>
                )}
              </h3>
            </div>
            <div className="mt-3">
              {!device.installed_apps || device.installed_apps.length === 0 ? (
                <p className="text-sm text-gray-400">Aucune application enregistrée. Synchronisez l'appareil pour récupérer la liste.</p>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {device.installed_apps.map((app) => (
                    <div key={app.id} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white ring-1 ring-gray-200">
                        {app.icon_url ? (
                          <img src={app.icon_url} alt={app.name} className="h-8 w-8 rounded" />
                        ) : (
                          <AppWindow className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">{app.name}</p>
                        <p className="truncate text-xs text-gray-400">
                          {app.package_name}
                          {app.version && ` · v${app.version}`}
                        </p>
                      </div>
                      {app.is_system_app && (
                        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-500">Système</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent locations */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <h3 className="text-sm font-bold text-gray-900">
                  Localisations récentes
                  {device.recent_locations && (
                    <span className="ml-2 text-xs font-normal text-gray-400">({device.recent_locations.length})</span>
                  )}
                </h3>
              </div>
              {device.recent_locations && device.recent_locations.length > 0 && (
                <button
                  onClick={() => setShowMap((v) => !v)}
                  className="flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-100"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  {showMap ? 'Masquer la carte' : 'Voir sur la carte'}
                </button>
              )}
            </div>

            {showMap && device.recent_locations && device.recent_locations.length > 0 && (
              <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
                <DeviceMap locations={device.recent_locations} />
              </div>
            )}

            <div className="mt-3">
              {!device.recent_locations || device.recent_locations.length === 0 ? (
                <p className="text-sm text-gray-400">Aucune localisation enregistrée.</p>
              ) : (
                <div className="space-y-2">
                  {device.recent_locations.map((loc, i) => (
                    <div key={loc.id} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${i === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-400'}`}>
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {Number(loc.latitude).toFixed(5)}, {Number(loc.longitude).toFixed(5)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(loc.recorded_at)}
                          {loc.accuracy && ` · ±${Math.round(loc.accuracy)}m`}
                        </p>
                      </div>
                      {i === 0 && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">Dernière</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent usage sessions */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-gray-400" />
              <h3 className="text-sm font-bold text-gray-900">
                Sessions d'utilisation récentes
                {device.recent_usage_sessions && (
                  <span className="ml-2 text-xs font-normal text-gray-400">({device.recent_usage_sessions.length})</span>
                )}
              </h3>
            </div>
            <div className="mt-3">
              {!device.recent_usage_sessions || device.recent_usage_sessions.length === 0 ? (
                <p className="text-sm text-gray-400">Aucune session d'utilisation enregistrée.</p>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-100">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Application</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Date</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Durée</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Catégorie</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 bg-white">
                      {device.recent_usage_sessions.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-900">{s.app_name ?? s.package_name ?? '—'}</td>
                          <td className="px-3 py-2 text-sm text-gray-500">{formatDate(s.date_utilisation)}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{formatDuration(s.duration_seconds)}</td>
                          <td className="px-3 py-2 text-sm text-gray-500">{s.categorie ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PermRow({ granted, icon: Icon, label }: { granted: boolean | undefined; icon: typeof Shield; label: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-700">{label}</span>
      </div>
      {granted ? (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <CheckCircle2 className="h-4 w-4" /> Accordée
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400">
          <XCircle className="h-4 w-4" /> Non accordée
        </span>
      )}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value || '—'}</dd>
    </div>
  )
}
