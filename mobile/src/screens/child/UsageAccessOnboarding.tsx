import { useEffect, useState } from 'react'
import { View, Text, Pressable, AppState } from 'react-native'
import { BarChart3, ChevronRight } from 'lucide-react-native'
import { colors } from '@/theme/colors'
import { spacing } from '@/theme'
import { useChildAppStore } from '@/store/child-app.store'
import { checkUsageAccessPermission, openUsageAccessSettings } from '@/services/collect.service'

interface UsageAccessOnboardingProps {
  onGranted: () => void
}

export function UsageAccessOnboarding({ onGranted }: UsageAccessOnboardingProps) {
  const [hasPermission, setHasPermission] = useState(false)
  const [checking, setChecking] = useState(false)
  const { updatePermission, syncPermissionsToBackend } = useChildAppStore()

  useEffect(() => {
    checkPermission()
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        checkPermission()
      }
    })
    return () => sub.remove()
  }, [])

  const checkPermission = async () => {
    setChecking(true)
    const granted = await checkUsageAccessPermission()
    setHasPermission(granted)
    setChecking(false)
    if (granted) {
      updatePermission('usage_access', true)
      await syncPermissionsToBackend()
    }
  }

  const handleOpenSettings = async () => {
    await openUsageAccessSettings()
  }

  if (hasPermission) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white, padding: spacing.xl, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{
          width: 64, height: 64, borderRadius: 32,
          backgroundColor: colors.emerald[100],
          justifyContent: 'center', alignItems: 'center',
          marginBottom: spacing.lg,
        }}>
          <BarChart3 size={32} color={colors.emerald[600]} />
        </View>
        <Text style={{
          fontSize: 20, fontFamily: 'SpaceGrotesk_600SemiBold',
          color: colors.gray[900], marginBottom: spacing.sm,
        }}>
          Accès aux données d'usage accordé
        </Text>
        <Text style={{
          fontSize: 14, fontFamily: 'SpaceGrotesk_400Regular',
          color: colors.gray[500], textAlign: 'center',
        }}>
          SafeKid peut maintenant suivre le temps d'écran et les applications utilisées.
        </Text>
        <Pressable
          onPress={onGranted}
          style={({ pressed }) => ({
            flexDirection: 'row', alignItems: 'center',
            marginTop: spacing.xl,
            paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
            backgroundColor: colors.brand[600],
            borderRadius: 12,
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Text style={{
            fontSize: 16, fontFamily: 'SpaceGrotesk_500Medium',
            color: colors.white, marginRight: spacing.sm,
          }}>
            Continuer
          </Text>
          <ChevronRight size={20} color={colors.white} />
        </Pressable>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.white, padding: spacing.xl, justifyContent: 'center' }}>
      <View style={{
        width: 64, height: 64, borderRadius: 32,
        backgroundColor: colors.brand[100],
        justifyContent: 'center', alignItems: 'center',
        alignSelf: 'center', marginBottom: spacing.lg,
      }}>
        <BarChart3 size={32} color={colors.brand[600]} />
      </View>

      <Text style={{
        fontSize: 22, fontFamily: 'SpaceGrotesk_700Bold',
        color: colors.gray[900], textAlign: 'center', marginBottom: spacing.md,
      }}>
        Autoriser l'accès aux données d'usage
      </Text>

      <Text style={{
        fontSize: 14, fontFamily: 'SpaceGrotesk_400Regular',
        color: colors.gray[600], textAlign: 'center', marginBottom: spacing.xl,
        lineHeight: 22,
      }}>
        SafeKid a besoin de cette permission pour suivre le temps passé sur chaque application.{'\n\n'}
        Vos données restent privées et sont uniquement visible par les parents configurés.
      </Text>

      <Pressable
        onPress={handleOpenSettings}
        style={({ pressed }) => ({
          backgroundColor: colors.brand[600],
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.xl,
          borderRadius: 12,
          alignItems: 'center',
          opacity: pressed ? 0.9 : 1,
        })}
      >
        <Text style={{
          fontSize: 16, fontFamily: 'SpaceGrotesk_500Medium',
          color: colors.white,
        }}>
          Ouvrir les paramètres d'accès
        </Text>
      </Pressable>

      <Text style={{
        fontSize: 13, fontFamily: 'SpaceGrotesk_400Regular',
        color: colors.gray[400], textAlign: 'center',
        marginTop: spacing.md,
      }}>
        {checking ? 'Vérification des permissions...' : 'Revenez sur cette app après avoir accordé la permission.'}
      </Text>
    </View>
  )
}
