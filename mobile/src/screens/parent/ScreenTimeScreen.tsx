import { useEffect, useState, useCallback } from 'react'
import { View, Text, FlatList, RefreshControl } from 'react-native'
import { Clock, Smartphone } from 'lucide-react-native'
import { colors } from '@/theme/colors'
import { spacing } from '@/theme'
import { usageService, type UsageSessionData } from '@/services/usage.service'
import type { AppUsageSummary } from '@/types'

interface ScreenTimeScreenProps {
  childId: number
  childName?: string
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}min`
  return `${m}min`
}

export function ScreenTimeScreen({ childId }: ScreenTimeScreenProps) {
  const [sessions, setSessions] = useState<UsageSessionData[]>([])
  const [summary, setSummary] = useState<AppUsageSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const data = await usageService.getChildUsageToday(childId)
      setSessions(data.sessions)
      setSummary(data.resume)
    } catch {
      setSessions([])
      setSummary(null)
    } finally {
      setLoading(false)
    }
  }, [childId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const onRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray[50] }}>
      <FlatList
        data={sessions}
        keyExtractor={(item, idx) => `${item.id}-${idx}`}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ padding: spacing.lg }}
        ListHeaderComponent={
          <View>
            <Text style={{
              fontSize: 20, fontFamily: 'SpaceGrotesk_700Bold',
              color: colors.gray[900], marginBottom: spacing.md,
            }}>
              Temps d'écran — Aujourd'hui
            </Text>

            {summary && (
              <View style={{
                backgroundColor: colors.brand[600],
                borderRadius: 16,
                padding: spacing.xl,
                marginBottom: spacing.lg,
                alignItems: 'center',
              }}>
                <Clock size={32} color={colors.white} style={{ marginBottom: spacing.sm }} />
                <Text style={{
                  fontSize: 32, fontFamily: 'SpaceGrotesk_700Bold',
                  color: colors.white,
                }}>
                  {formatDuration(summary.temps_ecran_total_secondes)}
                </Text>
                <Text style={{
                  fontSize: 14, fontFamily: 'SpaceGrotesk_400Regular',
                  color: colors.brand[100], marginTop: 4,
                }}>
                  {summary.nombre_apps_utilisees} application(s) utilisée(s)
                </Text>
              </View>
            )}

            <Text style={{
              fontSize: 16, fontFamily: 'SpaceGrotesk_600SemiBold',
              color: colors.gray[900], marginBottom: spacing.sm,
            }}>
              Applications
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{
            flexDirection: 'row', alignItems: 'center',
            backgroundColor: colors.white,
            borderRadius: 12,
            padding: spacing.md,
            marginBottom: spacing.sm,
            borderWidth: 1,
            borderColor: colors.gray[200],
          }}>
            <View style={{
              width: 40, height: 40, borderRadius: 10,
              backgroundColor: colors.gray[100],
              justifyContent: 'center', alignItems: 'center',
              marginRight: spacing.md,
            }}>
              <Smartphone size={20} color={colors.gray[500]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 14, fontFamily: 'SpaceGrotesk_500Medium',
                color: colors.gray[900],
              }}>
                {item.nom_application ?? item.package_name}
              </Text>
              <Text style={{
                fontSize: 12, fontFamily: 'SpaceGrotesk_400Regular',
                color: colors.gray[400],
              }}>
                {item.package_name}
              </Text>
            </View>
            <Text style={{
              fontSize: 14, fontFamily: 'SpaceGrotesk_600SemiBold',
              color: colors.brand[600],
            }}>
              {formatDuration(item.duree_secondes)}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          !loading ? (
            <Text style={{
              fontSize: 14, fontFamily: 'SpaceGrotesk_400Regular',
              color: colors.gray[500], textAlign: 'center',
              marginTop: spacing['2xl'],
            }}>
              Aucune donnée d'usage pour aujourd'hui.
            </Text>
          ) : null
        }
      />
    </View>
  )
}
