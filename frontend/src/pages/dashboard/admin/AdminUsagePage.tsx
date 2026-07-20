import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Clock,
  Smartphone,
  AlertCircle,
  Loader2,
  BarChart3,
  TrendingUp,
} from 'lucide-react'
import { usageService } from '@/services/usage.service'
import { childService } from '@/services/child.service'
import { useFamilyContext } from '@/contexts/FamilyContext'
import type { Child, UsageSession, ChildUsageToday } from '@/types'

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}min`
  if (m > 0) return `${m}min`
  return `${seconds}s`
}

function formatDurationShort(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h${m > 0 ? `${m}` : ''}`
  return `${m}min`
}

export function AdminUsagePage() {
  const { activeFamily } = useFamilyContext()
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [todayData, setTodayData] = useState<ChildUsageToday | null>(null)
  const [allSessions, setAllSessions] = useState<UsageSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadChildren = useCallback(async () => {
    if (!activeFamily) return
    setLoading(true)
    try {
      const list = await childService.list(activeFamily.id)
      setChildren(list)
      if (list.length > 0 && !selectedChild) {
        setSelectedChild(list[0])
      }
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
    void loadChildren().finally(() => { loadRef.current = false })
  }, [loadChildren])

  const loadUsageData = useCallback(async () => {
    if (!selectedChild) return
    setLoading(true)
    setError('')
    try {
      const [today, sessions] = await Promise.all([
        usageService.getChildUsageToday(selectedChild.id),
        usageService.getChildUsage(selectedChild.id),
      ])
      setTodayData(today)
      setAllSessions(sessions)
    } catch {
      setError('Impossible de charger les données d\'usage.')
      setTodayData(null)
      setAllSessions([])
    } finally {
      setLoading(false)
    }
  }, [selectedChild?.id])

  useEffect(() => {
    if (selectedChild) {
      void loadUsageData()
    }
  }, [loadUsageData])

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

  const maxDuration = todayData?.sessions?.length
    ? Math.max(...todayData.sessions.map((s) => s.duree_secondes))
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Temps d'écran</h1>
        <p className="mt-1 text-sm text-gray-500">
          Données d'usage des applications collectées depuis l'appareil de l'enfant.
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
          <Clock className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">
            Aucun enfant enregistré.
          </p>
        </div>
      )}

      {selectedChild && todayData && (
        <>
          {/* Today summary */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-brand-500 to-brand-700 p-6 text-white">
              <Clock className="h-8 w-8 opacity-80" />
              <p className="mt-3 text-3xl font-bold">
                {formatDuration(todayData.resume.temps_ecran_total_secondes)}
              </p>
              <p className="text-sm text-brand-100">Temps d'écran aujourd'hui</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <Smartphone className="h-8 w-8 text-gray-400" />
              <p className="mt-3 text-3xl font-bold text-gray-900">
                {todayData.resume.nombre_apps_utilisees}
              </p>
              <p className="text-sm text-gray-500">Applications utilisées</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <TrendingUp className="h-8 w-8 text-gray-400" />
              <p className="mt-3 text-3xl font-bold text-gray-900">
                {todayData.sessions.length > 0
                  ? formatDurationShort(
                      Math.max(...todayData.sessions.map((s) => s.duree_secondes))
                    )
                  : '—'}
              </p>
              <p className="text-sm text-gray-500">App la plus utilisée</p>
            </div>
          </div>

          {/* Today's app usage bars */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
              <BarChart3 className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Applications — Aujourd'hui
              </h2>
            </div>

            {todayData.sessions.length > 0 ? (
              <div className="mt-4 space-y-3">
                {todayData.sessions.map((session, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                          <Smartphone className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {session.nom_application ?? session.package_name}
                          </p>
                          <p className="text-xs text-gray-400">{session.package_name}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-brand-600">
                        {formatDuration(session.duree_secondes)}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-brand-500"
                        style={{
                          width: `${maxDuration > 0 ? (session.duree_secondes / maxDuration) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-400">
                Aucune donnée d'usage pour aujourd'hui.
              </p>
            )}
          </div>

          {/* All-time sessions table */}
          {allSessions.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                <Clock className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Historique des sessions</h2>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                      <th className="pb-2 pr-4">Application</th>
                      <th className="pb-2 pr-4">Date</th>
                      <th className="pb-2 pr-4 text-right">Durée</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {allSessions.slice(0, 20).map((session) => (
                      <tr key={session.id} className="text-gray-700">
                        <td className="py-2 pr-4">
                          {session.nom_application ?? session.package_name}
                        </td>
                        <td className="py-2 pr-4 text-gray-500">
                          {new Date(session.date_utilisation).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="py-2 pr-4 text-right font-medium text-brand-600">
                          {formatDuration(session.duree_secondes)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
