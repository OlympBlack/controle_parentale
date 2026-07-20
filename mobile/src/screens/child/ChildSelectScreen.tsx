import { useEffect, useState } from 'react'
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native'
import { colors } from '@/theme/colors'
import { spacing } from '@/theme'
import { childService } from '@/services/child.service'
import { useChildAppStore } from '@/store/child-app.store'
import type { Child } from '@/types'

interface ChildSelectScreenProps {
  onSelected: () => void
}

export function ChildSelectScreen({ onSelected }: ChildSelectScreenProps) {
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { registerDevice } = useChildAppStore()

  useEffect(() => {
    loadChildren()
  }, [])

  const loadChildren = async () => {
    try {
      const list = await childService.list()
      setChildren(list)
    } catch {
      setError('Impossible de charger les enfants')
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = async (child: Child) => {
    setLoading(true)
    const ok = await registerDevice(child)
    if (ok) {
      onSelected()
    } else {
      setError('Impossible d\'associer cet appareil')
      setLoading(false)
    }
  }

  if (loading && children.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white }}>
        <ActivityIndicator size="large" color={colors.brand[600]} />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.white, padding: spacing.xl }}>
      <Text style={{
        fontSize: 24,
        fontFamily: 'SpaceGrotesk_700Bold',
        color: colors.gray[900],
        marginBottom: spacing.sm,
      }}>
        Sélectionnez l'enfant
      </Text>
      <Text style={{
        fontSize: 14,
        fontFamily: 'SpaceGrotesk_400Regular',
        color: colors.gray[500],
        marginBottom: spacing.xl,
      }}>
        Choisissez le profil de l'enfant qui utilise cet appareil.
      </Text>

      {error && (
        <Text style={{
          fontSize: 14,
          fontFamily: 'SpaceGrotesk_400Regular',
          color: colors.red[600],
          marginBottom: spacing.md,
        }}>
          {error}
        </Text>
      )}

      <FlatList
        data={children}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleSelect(item)}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.lg,
              backgroundColor: pressed ? colors.gray[100] : colors.gray[50],
              borderRadius: 12,
              marginBottom: spacing.sm,
              borderWidth: 1,
              borderColor: colors.gray[200],
            })}
          >
            <View style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.brand[100],
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: spacing.md,
            }}>
              <Text style={{
                fontSize: 18,
                fontFamily: 'SpaceGrotesk_600SemiBold',
                color: colors.brand[700],
              }}>
                {item.first_name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 16,
                fontFamily: 'SpaceGrotesk_500Medium',
                color: colors.gray[900],
              }}>
                {item.full_name}
              </Text>
              <Text style={{
                fontSize: 13,
                fontFamily: 'SpaceGrotesk_400Regular',
                color: colors.gray[500],
              }}>
                {item.maturity_level ?? 'Enfant'}
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={{
            fontSize: 14,
            fontFamily: 'SpaceGrotesk_400Regular',
            color: colors.gray[500],
            textAlign: 'center',
            marginTop: spacing['2xl'],
          }}>
            Aucun enfant trouvé. Créez d'abord un profil depuis l'app parent.
          </Text>
        }
      />
    </View>
  )
}
