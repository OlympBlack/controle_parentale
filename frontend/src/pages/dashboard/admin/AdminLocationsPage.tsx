import { useState, useEffect, useCallback, useRef } from 'react'
import {
  MapPin,
  Navigation,
  AlertCircle,
  Loader2,
  Clock,
  Smartphone,
} from 'lucide-react'
import { locationService } from '@/services/location.service'
import { childService } from '@/services/child.service'
import { useFamilyContext } from '@/contexts/FamilyContext'
import type { Child, LocationData } from '@/types'

function formatDateTime(date: string | null): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function timeAgo(date: string | null): string {
  if (!date) return '—'
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "À l'instant"
  if (minutes < 60) return `Il y a ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Il y a ${hours}h`
  const days = Math.floor(hours / 24)
  return `Il y a ${days}j`
}

export function AdminLocationsPage() {
  const { activeFamily } = useFamilyContext()
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [lastLocation, setLastLocation] = useState<LocationData | null>(null)
  const [history, setHistory] = useState<LocationData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!activeFamily) return
    setLoading(true)
    setError('')
    try {
      const list = await childService.list(activeFamily.id)
      setChildren(list)
      if (list.length > 0 && !selectedChild) {
        setSelectedChild(list[0])
      }
    } catch {
      setError('Impossible de charger les données.')
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

  const loadLocationData = useCallback(async () => {
    if (!selectedChild) return
    setLoading(true)
    try {
      const [last, hist] = await Promise.all([
        locationService.getLast(selectedChild.id),
        locationService.getHistory(selectedChild.id, { per_page: 30 }),
      ])
      setLastLocation(last)
      setHistory(hist)
    } catch {
      setError('Impossible de charger la localisation.')
    } finally {
      setLoading(false)
    }
  }, [selectedChild?.id])

  useEffect(() => {
    if (selectedChild) {
      void loadLocationData()
    }
  }, [loadLocationData])

  if (loading && children.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    )
  }

  if (error && children.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Géolocalisation</h1>
        <p className="mt-1 text-sm text-gray-500">
          Suivez la position des appareils de vos enfants en temps réel.
        </p>
      </div>

      {/* Child selector */}
      {children.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(child)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                selectedChild?.id === child.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                {child.first_name.charAt(0).toUpperCase()}
              </span>
              {child.full_name}
            </button>
          ))}
        </div>
      )}

      {children.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <MapPin className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">
            Aucun enfant enregistré. Ajoutez d'abord un enfant.
          </p>
        </div>
      )}

      {selectedChild && (
        <>
          {/* Last known position */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
              <MapPin className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-semibold text-gray-900">Dernière position</h2>
            </div>

            {lastLocation ? (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-gray-400">Latitude</p>
                    <p className="text-sm font-medium text-gray-900">
                      {lastLocation.latitude.toFixed(5)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Longitude</p>
                    <p className="text-sm font-medium text-gray-900">
                      {lastLocation.longitude.toFixed(5)}
                    </p>
                  </div>
                  {lastLocation.accuracy_meters != null && (
                    <div>
                      <p className="text-xs text-gray-400">Précision</p>
                      <p className="text-sm font-medium text-gray-900">
                        ±{Math.round(lastLocation.accuracy_meters)} m
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  {formatDateTime(lastLocation.recorded_at)} ({timeAgo(lastLocation.recorded_at)})
                </div>
                <a
                  href={`https://www.google.com/maps?q=${lastLocation.latitude},${lastLocation.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
                >
                  <Navigation className="h-4 w-4" />
                  Voir sur la carte
                </a>
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-400">
                Aucune position connue pour cet enfant.
              </p>
            )}
          </div>

          {/* History */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
              <Clock className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Historique récent</h2>
            </div>

            {history.length > 0 ? (
              <div className="mt-4 divide-y divide-gray-100">
                {history.map((loc, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                      <Smartphone className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDateTime(loc.recorded_at)}
                      </p>
                    </div>
                    {loc.accuracy_meters != null && (
                      <span className="text-xs text-gray-400">
                        ±{Math.round(loc.accuracy_meters)}m
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-400">
                Aucun historique disponible.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
