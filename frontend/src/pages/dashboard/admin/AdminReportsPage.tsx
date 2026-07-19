import { useState, useEffect, useCallback } from 'react'
import {
  BarChart3,
  FileText,
  X,
  AlertCircle,
  Loader2,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Globe,
  Smartphone,
  Shield,
  ChevronRight,
} from 'lucide-react'
import { reportService } from '@/services/report.service'
import { childService } from '@/services/child.service'
import { useFamilyContext } from '@/contexts/FamilyContext'
import type { Child, Report, ReportPeriodType } from '@/types'
import { Button } from '@/components/ui/Button'

const PERIOD_LABELS: Record<ReportPeriodType, string> = {
  weekly: 'Hebdomadaire',
  monthly: 'Mensuel',
}

function formatDate(date: string | null): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatDateTime(date: string | null): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function scoreColor(score: number | null): string {
  if (score === null) return 'text-gray-300'
  if (score >= 70) return 'text-emerald-600'
  if (score >= 40) return 'text-amber-600'
  return 'text-red-600'
}

function scoreBg(score: number | null): string {
  if (score === null) return 'from-gray-300 to-gray-400'
  if (score >= 70) return 'from-emerald-400 to-emerald-600'
  if (score >= 40) return 'from-amber-400 to-amber-600'
  return 'from-red-400 to-red-600'
}

function scoreLabel(score: number | null): string {
  if (score === null) return 'N/A'
  if (score >= 70) return 'Bon'
  if (score >= 40) return 'Moyen'
  return 'Faible'
}

function ScoreTrend({ value }: { value: unknown }) {
  if (typeof value !== 'number') return null
  if (value > 0) return <span className="inline-flex items-center gap-0.5 text-emerald-600"><TrendingUp className="h-3 w-3" />+{value}</span>
  if (value < 0) return <span className="inline-flex items-center gap-0.5 text-red-600"><TrendingDown className="h-3 w-3" />{value}</span>
  return <span className="inline-flex items-center gap-0.5 text-gray-400"><Minus className="h-3 w-3" />0</span>
}

// ─── Statistics Display ──────────────────────────────────────────────────────────

function StatRow({ icon: Icon, label, value, color }: { icon: typeof Clock; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <span className="text-sm font-bold text-gray-900">{value}</span>
    </div>
  )
}

function ReportDetail({ report, onClose }: { report: Report; onClose: () => void }) {
  const stats = report.statistics as Record<string, unknown> | null
  const childName = report.child?.full_name ?? 'Enfant'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header with gradient */}
        <div className={`h-2 w-full rounded-t-2xl bg-gradient-to-r ${scoreBg(report.digital_health_score)}`} />

        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">Rapport {PERIOD_LABELS[report.period_type]}</h2>
                <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                  {childName}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {formatDate(report.period_start)} → {formatDate(report.period_end)}
              </p>
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Score circle */}
          <div className="mt-6 flex items-center gap-6 rounded-xl border border-gray-200 bg-gray-50/50 p-5">
            <div className="relative flex h-24 w-24 items-center justify-center">
              <svg className="h-24 w-24 -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-gray-200" />
                <circle
                  cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="6"
                  className={scoreColor(report.digital_health_score)}
                  strokeDasharray={`${(report.digital_health_score ?? 0) * 2.64} 264`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className={`text-2xl font-bold ${scoreColor(report.digital_health_score)}`}>
                  {report.digital_health_score ?? '—'}
                </span>
                <span className="text-[10px] text-gray-400">/ 100</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Santé digitale</p>
              <p className={`text-xl font-bold ${scoreColor(report.digital_health_score)}`}>
                {scoreLabel(report.digital_health_score)}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Généré le {formatDateTime(report.generated_at)}
              </p>
            </div>
          </div>

          {/* Statistics */}
          {stats && (
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Statistiques</h3>

              {typeof stats.total_screen_time_minutes === 'number' && (
                <StatRow icon={Clock} label="Temps d'écran total" value={`${Math.floor(stats.total_screen_time_minutes / 60)}h${(stats.total_screen_time_minutes % 60).toString().padStart(2, '0')}`} color="bg-blue-50 text-blue-600" />
              )}
              {typeof stats.web_visits === 'number' && (
                <StatRow icon={Globe} label="Sites visités" value={String(stats.web_visits)} color="bg-emerald-50 text-emerald-600" />
              )}
              {typeof stats.apps_used === 'number' && (
                <StatRow icon={Smartphone} label="Applications utilisées" value={String(stats.apps_used)} color="bg-purple-50 text-purple-600" />
              )}
              {typeof stats.blocked_attempts === 'number' && (
                <StatRow icon={Shield} label="Tentatives bloquées" value={String(stats.blocked_attempts)} color="bg-red-50 text-red-600" />
              )}

              {/* Trend */}
              {typeof stats.score_trend === 'number' && (
                <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                  <span className="text-sm text-gray-600">Évolution du score</span>
                  <ScoreTrend value={stats.score_trend} />
                </div>
              )}

              {/* Raw stats fallback */}
              {!stats.total_screen_time_minutes && !stats.web_visits && !stats.apps_used && !stats.blocked_attempts && (
                <div className="rounded-lg border border-dashed border-gray-200 p-4">
                  <pre className="text-xs text-gray-500 overflow-x-auto">{JSON.stringify(stats, null, 2)}</pre>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={onClose}>Fermer</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Report Card ────────────────────────────────────────────────────────────────

function ReportCard({
  report,
  childName,
  onClick,
}: {
  report: Report
  childName: string | null
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group w-full overflow-hidden rounded-2xl border border-gray-200 bg-white text-left transition-all hover:border-gray-300 hover:shadow-lg"
    >
      <div className={`h-1 w-full bg-gradient-to-r ${scoreBg(report.digital_health_score)}`} />

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Rapport {PERIOD_LABELS[report.period_type]}
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">
                {childName && `${childName} · `}
                {formatDate(report.period_start)} → {formatDate(report.period_end)}
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-400" />
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Score</span>
            <span className={`text-lg font-bold ${scoreColor(report.digital_health_score)}`}>
              {report.digital_health_score ?? '—'}
              {report.digital_health_score !== null && <span className="text-xs font-medium text-gray-400">/100</span>}
            </span>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            report.period_type === 'weekly' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
          }`}>
            {PERIOD_LABELS[report.period_type]}
          </span>
          <span className="ml-auto flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="h-3 w-3" />
            {formatDate(report.generated_at)}
          </span>
        </div>
      </div>
    </button>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────────

export function AdminReportsPage() {
  const { activeFamily } = useFamilyContext()

  const [reports, setReports]             = useState<Report[]>([])
  const [children, setChildren]           = useState<Child[]>([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState('')
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [filterChild, setFilterChild]     = useState<number | 'all'>('all')
  const [filterPeriod, setFilterPeriod]   = useState<ReportPeriodType | 'all'>('all')

  const load = useCallback(async () => {
    if (!activeFamily) return
    setLoading(true)
    setError('')
    try {
      const kids = await childService.list(activeFamily.id)
      setChildren(kids)
      const params: { child_id?: number; period_type?: ReportPeriodType } = {}
      const allReports = await reportService.list(params)
      setReports(allReports)
    } catch {
      setError('Impossible de charger les rapports.')
    } finally {
      setLoading(false)
    }
  }, [activeFamily])

  useEffect(() => { void load() }, [load])

  const childMap = new Map(children.map((c) => [c.id, c.full_name || c.first_name]))
  const filteredReports = reports.filter((r) => {
    if (filterChild !== 'all' && r.child_id !== filterChild) return false
    if (filterPeriod !== 'all' && r.period_type !== filterPeriod) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rapports</h1>
        <p className="mt-1 text-sm text-gray-500">
          {activeFamily?.name} · {filteredReports.length} rapport{filteredReports.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Filters */}
      {children.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Enfant :</span>
            <select
              value={filterChild}
              onChange={(e) => setFilterChild(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="all">Tous</option>
              {children.map((c) => (
                <option key={c.id} value={c.id}>{c.full_name || c.first_name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Période :</span>
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value as ReportPeriodType | 'all')}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="all">Toutes</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuel</option>
            </select>
          </div>
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
      ) : filteredReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <BarChart3 className="h-10 w-10 text-gray-200" />
          <p className="mt-3 text-sm font-medium text-gray-500">Aucun rapport disponible</p>
          <p className="mt-1 text-xs text-gray-400">Les rapports de synthèse apparaîtront ici automatiquement.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              childName={childMap.get(report.child_id) ?? null}
              onClick={() => setSelectedReport(report)}
            />
          ))}
        </div>
      )}

      {selectedReport && (
        <ReportDetail
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  )
}
