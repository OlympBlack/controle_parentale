import { useState, useEffect, useCallback } from 'react'
import { View, Text, FlatList, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BarChart3, Loader2, FileText, Calendar } from 'lucide-react-native'
import { reportService } from '@/services/report.service'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { colors } from '@/theme/colors'
import { spacing } from '@/theme'
import type { Report } from '@/types'

function formatDate(date: string | null): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function scoreColor(score: number | null): string {
  if (score === null) return colors.gray[300]
  if (score >= 70) return colors.emerald[600]
  if (score >= 40) return colors.amber[600]
  return colors.red[600]
}

export function ReportsScreen() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const data = await reportService.list()
      setReports(data)
    } catch {
      setError('Impossible de charger les rapports.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const handleRefresh = () => {
    setRefreshing(true)
    void load()
  }

  const renderItem = ({ item }: { item: Report }) => (
    <Card style={{ marginBottom: spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.purple[50], justifyContent: 'center', alignItems: 'center' }}>
          <FileText size={22} color={colors.purple[600]} />
        </View>
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: colors.gray[900] }}>
            {item.period_type === 'weekly' ? 'Rapport Hebdomadaire' : 'Rapport Mensuel'}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 }}>
            <Calendar size={12} color={colors.gray[400]} />
            <Text style={{ fontSize: 12, color: colors.gray[500] }}>
              {formatDate(item.period_start)} → {formatDate(item.period_end)}
            </Text>
          </View>
        </View>
        {item.digital_health_score !== null && (
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: scoreColor(item.digital_health_score) }}>
              {item.digital_health_score}
            </Text>
            <Text style={{ fontSize: 10, color: colors.gray[400] }}>/ 100</Text>
          </View>
        )}
      </View>
    </Card>
  )

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.gray[50] }} edges={['bottom']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Loader2 size={32} color={colors.brand[600]} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.gray[50] }} edges={['bottom']}>
      <View style={{ padding: spacing.xl, paddingBottom: spacing.md }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: colors.gray[900] }}>
          Rapports
        </Text>
        <Text style={{ fontSize: 14, color: colors.gray[500], marginTop: 4 }}>
          {reports.length} rapport{reports.length > 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={reports}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: spacing.xl, paddingTop: 0 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.brand[600]} />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: spacing['5xl'] }}>
            <BarChart3 size={48} color={colors.gray[300]} />
            <Text style={{ fontSize: 15, fontWeight: '500', color: colors.gray[500], marginTop: spacing.md }}>
              Aucun rapport disponible
            </Text>
            <Text style={{ fontSize: 13, color: colors.gray[400], marginTop: 4 }}>
              Les rapports apparaîtront ici automatiquement.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}
