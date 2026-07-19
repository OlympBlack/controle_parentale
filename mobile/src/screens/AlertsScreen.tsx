import { useState, useEffect, useCallback } from 'react'
import { View, Text, FlatList, RefreshControl, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Bell, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react-native'
import { alertService } from '@/services/alert.service'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { colors } from '@/theme/colors'
import { spacing } from '@/theme'
import type { Alert, AlertSeverity } from '@/types'

const SEVERITY_CONFIG: Record<AlertSeverity, { color: 'gray' | 'blue' | 'amber' | 'red'; bg: string; icon_color: string }> = {
  low:      { color: 'gray',   bg: colors.gray[100],   icon_color: colors.gray[500] },
  medium:   { color: 'blue',   bg: colors.blue[50],    icon_color: colors.blue[600] },
  high:     { color: 'amber',  bg: colors.amber[50],   icon_color: colors.amber[600] },
  critical: { color: 'red',    bg: colors.red[50],     icon_color: colors.red[600] },
}

const SEVERITY_LABELS: Record<AlertSeverity, string> = {
  low: 'Faible',
  medium: 'Moyenne',
  high: 'Haute',
  critical: 'Critique',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  acknowledged: 'Reconnue',
  resolved: 'Résolue',
}

export function AlertsScreen() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const data = await alertService.list()
      setAlerts(data)
    } catch {
      setError('Impossible de charger les alertes.')
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

  const renderItem = ({ item }: { item: Alert }) => {
    const sev = SEVERITY_CONFIG[item.severity] ?? SEVERITY_CONFIG.low
    return (
      <Card style={{ marginBottom: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: sev.bg, justifyContent: 'center', alignItems: 'center' }}>
            <AlertCircle size={20} color={sev.icon_color} />
          </View>
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.gray[900], flex: 1 }}>
                {item.title}
              </Text>
              <Badge label={SEVERITY_LABELS[item.severity] ?? item.severity} color={sev.color} />
            </View>
            <Text style={{ fontSize: 13, color: colors.gray[500], marginTop: 4 }}>
              {item.message}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 }}>
              <Badge label={STATUS_LABELS[item.status] ?? item.status} color={item.status === 'resolved' ? 'green' : 'gray'} />
              <Text style={{ fontSize: 12, color: colors.gray[400] }}>
                {new Date(item.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    )
  }

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
          Alertes
        </Text>
        <Text style={{ fontSize: 14, color: colors.gray[500], marginTop: 4 }}>
          {alerts.length} alerte{alerts.length > 1 ? 's' : ''}
        </Text>
      </View>

      {error && (
        <View style={{ marginHorizontal: spacing.xl, marginBottom: spacing.md, backgroundColor: colors.red[50], borderRadius: 8, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={18} color={colors.red[500]} />
          <Text style={{ color: colors.red[700], fontSize: 13 }}>{error}</Text>
        </View>
      )}

      <FlatList
        data={alerts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: spacing.xl, paddingTop: 0 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.brand[600]} />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: spacing['5xl'] }}>
            <CheckCircle2 size={48} color={colors.emerald[500]} />
            <Text style={{ fontSize: 15, fontWeight: '500', color: colors.gray[500], marginTop: spacing.md }}>
              Aucune alerte
            </Text>
            <Text style={{ fontSize: 13, color: colors.gray[400], marginTop: 4 }}>
              Tout va bien pour le moment.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}
