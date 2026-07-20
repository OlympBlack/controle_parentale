import { useEffect, useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Shield, Smartphone } from 'lucide-react-native'
import { NavigationContainer, type NavigationProp } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store'
import { useAuthStore } from '@/store/auth.store'
import { AuthNavigator } from './AuthNavigator'
import { AppNavigator } from './AppNavigator'
import { ChildNavigator } from './ChildNavigator'
import { LoadingScreen } from '@/screens/LoadingScreen'
import { SECURE_STORE_KEYS } from '@/constants/config'
import { colors } from '@/theme/colors'
import { spacing } from '@/theme'

export type RootStackParamList = {
  Auth: undefined
  App: undefined
  Child: undefined
}

export type RootNavigation = NavigationProp<RootStackParamList>

type AppMode = 'parent' | 'child' | null

function ModeSelectScreen({ onSelect }: { onSelect: (mode: AppMode) => void }) {
  return (
    <View style={{
      flex: 1, backgroundColor: colors.white,
      justifyContent: 'center', alignItems: 'center',
      padding: spacing.xl,
    }}>
      <Text style={{
        fontSize: 28, fontFamily: 'SpaceGrotesk_700Bold',
        color: colors.gray[900], marginBottom: spacing.sm,
      }}>
        SafeKid
      </Text>
      <Text style={{
        fontSize: 14, fontFamily: 'SpaceGrotesk_400Regular',
        color: colors.gray[500], marginBottom: spacing['3xl'],
      }}>
        Choisissez le mode de l'application
      </Text>

      <Pressable
        onPress={() => onSelect('parent')}
        style={({ pressed }) => ({
          width: '100%', maxWidth: 320,
          flexDirection: 'row', alignItems: 'center',
          paddingVertical: spacing.lg, paddingHorizontal: spacing.xl,
          backgroundColor: colors.brand[600],
          borderRadius: 16,
          marginBottom: spacing.md,
          opacity: pressed ? 0.9 : 1,
        })}
      >
        <Shield size={28} color={colors.white} style={{ marginRight: spacing.md }} />
        <View>
          <Text style={{
            fontSize: 18, fontFamily: 'SpaceGrotesk_600SemiBold',
            color: colors.white,
          }}>
            Mode Parent
          </Text>
          <Text style={{
            fontSize: 13, fontFamily: 'SpaceGrotesk_400Regular',
            color: colors.brand[100],
          }}>
            Tableau de bord & supervision
          </Text>
        </View>
      </Pressable>

      <Pressable
        onPress={() => onSelect('child')}
        style={({ pressed }) => ({
          width: '100%', maxWidth: 320,
          flexDirection: 'row', alignItems: 'center',
          paddingVertical: spacing.lg, paddingHorizontal: spacing.xl,
          backgroundColor: colors.gray[100],
          borderRadius: 16,
          borderWidth: 1, borderColor: colors.gray[300],
          opacity: pressed ? 0.9 : 1,
        })}
      >
        <Smartphone size={28} color={colors.gray[700]} style={{ marginRight: spacing.md }} />
        <View>
          <Text style={{
            fontSize: 18, fontFamily: 'SpaceGrotesk_600SemiBold',
            color: colors.gray[900],
          }}>
            Mode Enfant
          </Text>
          <Text style={{
            fontSize: 13, fontFamily: 'SpaceGrotesk_400Regular',
            color: colors.gray[500],
          }}>
            Appareil à surveiller
          </Text>
        </View>
      </Pressable>
    </View>
  )
}

export function RootNavigator() {
  const { isInitializing, isAuthenticated, initialize } = useAuthStore()
  const [appMode, setAppMode] = useState<AppMode>(null)

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    await initialize()
    const storedMode = await SecureStore.getItemAsync(SECURE_STORE_KEYS.APP_MODE)
    if (storedMode === 'parent' || storedMode === 'child') {
      setAppMode(storedMode)
    }
  }

  const handleSelectMode = async (mode: AppMode) => {
    if (mode) {
      await SecureStore.setItemAsync(SECURE_STORE_KEYS.APP_MODE, mode)
      setAppMode(mode)
    }
  }

  if (isInitializing) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    )
  }

  if (!appMode) {
    return <ModeSelectScreen onSelect={handleSelectMode} />
  }

  return (
    <NavigationContainer>
      {appMode === 'parent' ? <AppNavigator /> : <ChildNavigator />}
    </NavigationContainer>
  )
}
