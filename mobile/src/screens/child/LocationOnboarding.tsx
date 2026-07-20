import { useEffect, useState } from 'react'
import { View, Text, Pressable, AppState } from 'react-native'
import { MapPin, ChevronRight } from 'lucide-react-native'
import * as Location from 'expo-location'
import { colors } from '@/theme/colors'
import { spacing } from '@/theme'
import { useChildAppStore } from '@/store/child-app.store'
import { requestLocationPermissions, startBackgroundLocation } from '@/services/collect.service'

interface LocationOnboardingProps {
  onGranted: () => void
}

export function LocationOnboarding({ onGranted }: LocationOnboardingProps) {
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
    const { status: fg } = await Location.getForegroundPermissionsAsync()
    const { status: bg } = await Location.getBackgroundPermissionsAsync()
    const granted = fg === 'granted' && bg === 'granted'
    setHasPermission(granted)
    setChecking(false)
    if (granted) {
      updatePermission('location', true)
      await syncPermissionsToBackend()
      await startBackgroundLocation()
    }
  }

  const handleRequest = async () => {
    const granted = await requestLocationPermissions()
    setHasPermission(granted)
    if (granted) {
      updatePermission('location', true)
      await syncPermissionsToBackend()
      await startBackgroundLocation()
    }
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
          <MapPin size={32} color={colors.emerald[600]} />
        </View>
        <Text style={{
          fontSize: 20, fontFamily: 'SpaceGrotesk_600SemiBold',
          color: colors.gray[900], marginBottom: spacing.sm,
        }}>
          Localisation activée
        </Text>
        <Text style={{
          fontSize: 14, fontFamily: 'SpaceGrotesk_400Regular',
          color: colors.gray[500], textAlign: 'center',
        }}>
          SafeKid peut maintenant suivre la position de l'appareil en arrière-plan.
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
        <MapPin size={32} color={colors.brand[600]} />
      </View>

      <Text style={{
        fontSize: 22, fontFamily: 'SpaceGrotesk_700Bold',
        color: colors.gray[900], textAlign: 'center', marginBottom: spacing.md,
      }}>
        Autoriser la localisation
      </Text>

      <Text style={{
        fontSize: 14, fontFamily: 'SpaceGrotesk_400Regular',
        color: colors.gray[600], textAlign: 'center', marginBottom: spacing.xl,
        lineHeight: 22,
      }}>
        SafeKid a besoin de la localisation en arrière-plan pour suivre la position de l'enfant.{'\n\n'}
        La position est envoyée périodiquement (toutes les 15 minutes) pour préserver la batterie.
      </Text>

      <Pressable
        onPress={handleRequest}
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
          Accorder la permission
        </Text>
      </Pressable>

      <Text style={{
        fontSize: 13, fontFamily: 'SpaceGrotesk_400Regular',
        color: colors.gray[400], textAlign: 'center',
        marginTop: spacing.md,
      }}>
        {checking ? 'Vérification...' : 'Vous devrez accorder la localisation "Toujours" pour le suivi en arrière-plan.'}
      </Text>
    </View>
  )
}
