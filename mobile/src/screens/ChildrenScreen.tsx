import { useState, useEffect, useCallback } from 'react'
import { View, Text, FlatList, RefreshControl, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Users, Plus, Loader2, AlertCircle, ChevronRight } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import type { AppNavigation } from '@/navigation/AppNavigator'
import { childService } from '@/services/child.service'
import { useAuthStore } from '@/store/auth.store'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { colors } from '@/theme/colors'
import { spacing } from '@/theme'
import type { Child } from '@/types'

export function ChildrenScreen() {
  const navigation = useNavigation<AppNavigation>()
  const { user } = useAuthStore()

  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    if (!user?.family_id) return
    try {
      const data = await childService.list(user.family_id)
      setChildren(data)
    } catch {
      setError('Impossible de charger les enfants.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [user?.family_id])

  useEffect(() => { void load() }, [load])

  const handleRefresh = () => {
    setRefreshing(true)
    void load()
  }

  const getChildInitials = (child: Child) => {
    return (child.full_name || child.first_name || '?')
      .split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
  }

  const statusBadgeColor = (status: string): 'green' | 'amber' | 'gray' => {
    if (status === 'active') return 'green'
    if (status === 'paused') return 'amber'
    return 'gray'
  }

  const statusLabel = (status: string) => {
    if (status === 'active') return 'Actif'
    if (status === 'paused') return 'En pause'
    return 'Archivé'
  }

  const renderItem = ({ item }: { item: Child }) => (
    <Pressable
      onPress={() => navigation.navigate('ChildDetail', { childId: item.id, childName: item.full_name || item.first_name })}
      style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
    >
      <Card style={{ marginBottom: spacing.md, flexDirection: 'row', alignItems: 'center' }}>
        {/* Avatar */}
        <View style={{
          width: 48, height: 48, borderRadius: 24,
          backgroundColor: colors.brand[100],
          justifyContent: 'center', alignItems: 'center',
        }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: colors.brand[700] }}>
            {getChildInitials(item)}
          </Text>
        </View>

        {/* Info */}
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.gray[900] }}>
            {item.full_name || item.first_name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 }}>
            <Badge label={statusLabel(item.status)} color={statusBadgeColor(item.status)} />
            {item.devices_count !== undefined && item.devices_count > 0 && (
              <Text style={{ fontSize: 12, color: colors.gray[400] }}>
                {item.devices_count} appareil{item.devices_count > 1 ? 's' : ''}
              </Text>
            )}
          </View>
        </View>

        <ChevronRight size={20} color={colors.gray[300]} />
      </Card>
    </Pressable>
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
      {/* Header */}
      <View style={{ padding: spacing.xl, paddingBottom: spacing.md }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: colors.gray[900] }}>
          Mes enfants
        </Text>
        <Text style={{ fontSize: 14, color: colors.gray[500], marginTop: 4 }}>
          {children.length} enfant{children.length > 1 ? 's' : ''} supervisé{children.length > 1 ? 's' : ''}
        </Text>
      </View>

      {error && (
        <View style={{ marginHorizontal: spacing.xl, marginBottom: spacing.md, backgroundColor: colors.red[50], borderRadius: 8, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={18} color={colors.red[500]} />
          <Text style={{ color: colors.red[700], fontSize: 13 }}>{error}</Text>
        </View>
      )}

      <FlatList
        data={children}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: spacing.xl, paddingTop: 0 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.brand[600]} />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: spacing['5xl'] }}>
            <Users size={48} color={colors.gray[300]} />
            <Text style={{ fontSize: 15, fontWeight: '500', color: colors.gray[500], marginTop: spacing.md }}>
              Aucun enfant pour le moment
            </Text>
            <Text style={{ fontSize: 13, color: colors.gray[400], marginTop: 4 }}>
              Ajoutez un enfant depuis le dashboard web.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}
