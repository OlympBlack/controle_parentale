import { useEffect, useState, useCallback } from 'react'
import { View, Text, FlatList, Pressable, RefreshControl } from 'react-native'
import { Smartphone, Plus, CircleAlert } from 'lucide-react-native'
import { colors } from '@/theme/colors'
import { spacing } from '@/theme'
import { childService } from '@/services/child.service'
import { deviceService, type DeviceData } from '@/services/device.service'
import type { Child } from '@/types'

interface DevicesScreenProps {
  childId: number
  childName?: string
}

export function DevicesScreen({ childId }: DevicesScreenProps) {
  const [devices, setDevices] = useState<DeviceData[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadDevices = useCallback(async () => {
    try {
      const child = await childService.get(childId)
      // Fetch devices for this child via the devices endpoint
      const { apiClient } = await import('@/services/api-client')
      const { data } = await apiClient.get(`/devices`, { params: { child_id: childId, per_page: 100 } })
      setDevices(data.data ?? [])
    } catch {
      setDevices([])
    } finally {
      setLoading(false)
    }
  }, [childId])

  useEffect(() => {
    loadDevices()
  }, [loadDevices])

  const onRefresh = async () => {
    setRefreshing(true)
    await loadDevices()
    setRefreshing(false)
  }

  const getPermissionBadge = (device: DeviceData) => {
    const perms = device.permissions_accordees
    if (!perms) return { color: colors.red[500], label: 'Aucune' }
    const count = Object.values(perms).filter(Boolean).length
    if (count === 0) return { color: colors.red[500], label: 'Aucune' }
    if (count < Object.keys(perms).length) return { color: colors.amber[500], label: 'Partiel' }
    return { color: colors.emerald[500], label: 'Complet' }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.gray[50] }}>
      <FlatList
        data={devices}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ padding: spacing.lg }}
        ListHeaderComponent={
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <Text style={{
              fontSize: 20, fontFamily: 'SpaceGrotesk_700Bold',
              color: colors.gray[900],
            }}>
              Appareils
            </Text>
            <Pressable
              style={({ pressed }) => ({
                flexDirection: 'row', alignItems: 'center',
                paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
                backgroundColor: colors.brand[600],
                borderRadius: 10,
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Plus size={18} color={colors.white} style={{ marginRight: 6 }} />
              <Text style={{
                fontSize: 14, fontFamily: 'SpaceGrotesk_500Medium',
                color: colors.white,
              }}>
                Ajouter
              </Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => {
          const badge = getPermissionBadge(item)
          return (
            <View style={{
              backgroundColor: colors.white,
              borderRadius: 16,
              padding: spacing.lg,
              marginBottom: spacing.md,
              borderWidth: 1,
              borderColor: colors.gray[200],
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
                <Smartphone size={22} color={colors.gray[600]} style={{ marginRight: spacing.sm }} />
                <Text style={{
                  fontSize: 16, fontFamily: 'SpaceGrotesk_600SemiBold',
                  color: colors.gray[900], flex: 1,
                }}>
                  {item.name}
                </Text>
                <View style={{
                  flexDirection: 'row', alignItems: 'center',
                  paddingHorizontal: 10, paddingVertical: 4,
                  borderRadius: 8,
                  backgroundColor: badge.color + '20',
                }}>
                  <View style={{
                    width: 8, height: 8, borderRadius: 4,
                    backgroundColor: badge.color,
                    marginRight: 6,
                  }} />
                  <Text style={{
                    fontSize: 12, fontFamily: 'SpaceGrotesk_500Medium',
                    color: badge.color,
                  }}>
                    {badge.label}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: spacing.md }}>
                <Text style={{
                  fontSize: 13, fontFamily: 'SpaceGrotesk_400Regular',
                  color: colors.gray[500],
                }}>
                  OS: {item.os ?? 'N/A'}
                </Text>
                <Text style={{
                  fontSize: 13, fontFamily: 'SpaceGrotesk_400Regular',
                  color: colors.gray[500],
                }}>
                  Statut: {item.status}
                </Text>
              </View>

              {item.derniere_synchronisation && (
                <Text style={{
                  fontSize: 12, fontFamily: 'SpaceGrotesk_400Regular',
                  color: colors.gray[400], marginTop: 4,
                }}>
                  Dernière sync: {new Date(item.derniere_synchronisation).toLocaleString('fr-FR')}
                </Text>
              )}
            </View>
          )
        }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: spacing['3xl'] }}>
            <CircleAlert size={40} color={colors.gray[300]} style={{ marginBottom: spacing.md }} />
            <Text style={{
              fontSize: 14, fontFamily: 'SpaceGrotesk_400Regular',
              color: colors.gray[500], textAlign: 'center',
            }}>
              Aucun appareil associé.{'\n'}Installez l'app SafeKid Enfant sur le téléphone à surveiller.
            </Text>
          </View>
        }
      />
    </View>
  )
}
