import { useEffect, useState, useCallback } from 'react'
import { View, Text, ScrollView, RefreshControl } from 'react-native'
import { MapPin, Navigation } from 'lucide-react-native'
import { colors } from '@/theme/colors'
import { spacing } from '@/theme'
import { locationService, type LocationData } from '@/services/location.service'

interface LocationScreenProps {
  childId: number
  childName?: string
}

export function LocationScreen({ childId }: LocationScreenProps) {
  const [lastLocation, setLastLocation] = useState<LocationData | null>(null)
  const [history, setHistory] = useState<LocationData[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const [last, hist] = await Promise.all([
        locationService.getLast(childId),
        locationService.getHistory(childId, { per_page: 20 }),
      ])
      setLastLocation(last)
      setHistory(hist)
    } catch {
      setLastLocation(null)
      setHistory([])
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
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.gray[50] }}
      contentContainerStyle={{ padding: spacing.lg }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={{
        fontSize: 20, fontFamily: 'SpaceGrotesk_700Bold',
        color: colors.gray[900], marginBottom: spacing.md,
      }}>
        Localisation
      </Text>

      {/* Last known position */}
      <View style={{
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.gray[200],
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
          <MapPin size={22} color={colors.brand[600]} style={{ marginRight: spacing.sm }} />
          <Text style={{
            fontSize: 16, fontFamily: 'SpaceGrotesk_600SemiBold',
            color: colors.gray[900],
          }}>
            Dernière position
          </Text>
        </View>

        {lastLocation ? (
          <View>
            <View style={{ flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.sm }}>
              <View>
                <Text style={{
                  fontSize: 12, fontFamily: 'SpaceGrotesk_400Regular',
                  color: colors.gray[400],
                }}>
                  Latitude
                </Text>
                <Text style={{
                  fontSize: 14, fontFamily: 'SpaceGrotesk_500Medium',
                  color: colors.gray[900],
                }}>
                  {lastLocation.latitude.toFixed(5)}
                </Text>
              </View>
              <View>
                <Text style={{
                  fontSize: 12, fontFamily: 'SpaceGrotesk_400Regular',
                  color: colors.gray[400],
                }}>
                  Longitude
                </Text>
                <Text style={{
                  fontSize: 14, fontFamily: 'SpaceGrotesk_500Medium',
                  color: colors.gray[900],
                }}>
                  {lastLocation.longitude.toFixed(5)}
                </Text>
              </View>
              {lastLocation.accuracy_meters != null && (
                <View>
                  <Text style={{
                    fontSize: 12, fontFamily: 'SpaceGrotesk_400Regular',
                    color: colors.gray[400],
                  }}>
                    Précision
                  </Text>
                  <Text style={{
                    fontSize: 14, fontFamily: 'SpaceGrotesk_500Medium',
                    color: colors.gray[900],
                  }}>
                    ±{Math.round(lastLocation.accuracy_meters)}m
                  </Text>
                </View>
              )}
            </View>
            <Text style={{
              fontSize: 12, fontFamily: 'SpaceGrotesk_400Regular',
              color: colors.gray[400],
            }}>
              {new Date(lastLocation.recorded_at).toLocaleString('fr-FR')}
            </Text>
          </View>
        ) : (
          <Text style={{
            fontSize: 14, fontFamily: 'SpaceGrotesk_400Regular',
            color: colors.gray[400],
          }}>
            Aucune position connue
          </Text>
        )}
      </View>

      {/* History */}
      <Text style={{
        fontSize: 16, fontFamily: 'SpaceGrotesk_600SemiBold',
        color: colors.gray[900], marginBottom: spacing.sm,
      }}>
        Historique récent
      </Text>

      {history.length > 0 ? (
        history.map((loc, idx) => (
          <View key={idx} style={{
            flexDirection: 'row', alignItems: 'center',
            backgroundColor: colors.white,
            borderRadius: 10,
            padding: spacing.md,
            marginBottom: spacing.sm,
            borderWidth: 1,
            borderColor: colors.gray[200],
          }}>
            <Navigation size={16} color={colors.gray[400]} style={{ marginRight: spacing.sm }} />
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 13, fontFamily: 'SpaceGrotesk_400Regular',
                color: colors.gray[700],
              }}>
                {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
              </Text>
              <Text style={{
                fontSize: 11, fontFamily: 'SpaceGrotesk_400Regular',
                color: colors.gray[400],
              }}>
                {new Date(loc.recorded_at).toLocaleString('fr-FR')}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={{
          fontSize: 14, fontFamily: 'SpaceGrotesk_400Regular',
          color: colors.gray[400], textAlign: 'center',
          marginTop: spacing.lg,
        }}>
          Aucun historique disponible
        </Text>
      )}
    </ScrollView>
  )
}
