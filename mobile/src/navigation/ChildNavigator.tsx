import { useEffect, useState } from 'react'
import { Pressable } from 'react-native'
import { createNativeStackNavigator, type NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { User } from 'lucide-react-native'
import * as SecureStore from 'expo-secure-store'
import { SECURE_STORE_KEYS } from '@/constants/config'
import { useChildAppStore } from '@/store/child-app.store'
import { PairingScreen } from '@/screens/child/PairingScreen'
import { UsageAccessOnboarding } from '@/screens/child/UsageAccessOnboarding'
import { LocationOnboarding } from '@/screens/child/LocationOnboarding'
import { ChildStatusScreen } from '@/screens/child/ChildStatusScreen'
import { ProfileScreen } from '@/screens/ProfileScreen'
import { LoadingScreen } from '@/screens/LoadingScreen'
import { colors } from '@/theme/colors'

export type ChildStackParamList = {
  Pairing: undefined
  UsageOnboarding: undefined
  LocationOnboarding: undefined
  ChildStatus: undefined
  Profile: undefined
}

const Stack = createNativeStackNavigator<ChildStackParamList>()

function PairingWrapper() {
  const navigation = useNavigation<NativeStackNavigationProp<ChildStackParamList>>()
  return <PairingScreen onPaired={() => navigation.navigate('UsageOnboarding')} />
}

function UsageOnboardingWrapper() {
  const navigation = useNavigation<NativeStackNavigationProp<ChildStackParamList>>()
  return <UsageAccessOnboarding onGranted={() => navigation.navigate('LocationOnboarding')} />
}

function LocationOnboardingWrapper() {
  const navigation = useNavigation<NativeStackNavigationProp<ChildStackParamList>>()
  return <LocationOnboarding onGranted={() => navigation.navigate('ChildStatus')} />
}

function ProfileWrapper() {
  return <ProfileScreen />
}

export function ChildNavigator() {
  const { loadStoredDevice, permissions } = useChildAppStore()
  const [isLoading, setIsLoading] = useState(true)
  const [initialRoute, setInitialRoute] = useState<keyof ChildStackParamList>('Pairing')

  useEffect(() => {
    determineRoute()
  }, [])

  const determineRoute = async () => {
    await loadStoredDevice()
    const storedDeviceId = await SecureStore.getItemAsync(SECURE_STORE_KEYS.DEVICE_ID)

    if (!storedDeviceId) {
      setInitialRoute('Pairing')
    } else if (!permissions.usage_access) {
      setInitialRoute('UsageOnboarding')
    } else if (!permissions.location) {
      setInitialRoute('LocationOnboarding')
    } else {
      setInitialRoute('ChildStatus')
    }
    setIsLoading(false)
  }

  if (isLoading) return <LoadingScreen />

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Pairing" component={PairingWrapper} />
      <Stack.Screen name="UsageOnboarding" component={UsageOnboardingWrapper} />
      <Stack.Screen name="LocationOnboarding" component={LocationOnboardingWrapper} />
      <Stack.Screen
        name="ChildStatus"
        component={ChildStatusScreen}
        options={({ navigation }) => ({
          headerShown: true,
          title: 'SafeKid',
          headerBackVisible: false,
          headerTintColor: colors.white,
          headerStyle: { backgroundColor: colors.brand[600] },
          headerTitleStyle: { fontFamily: 'SpaceGrotesk_600SemiBold' },
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Profile')}
              style={({ pressed }) => ({
                width: 36, height: 36, borderRadius: 18,
                backgroundColor: 'rgba(255,255,255,0.2)',
                justifyContent: 'center', alignItems: 'center',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <User size={20} color={colors.white} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileWrapper}
        options={{
          headerShown: true,
          title: 'Profil',
          headerTintColor: colors.white,
          headerStyle: { backgroundColor: colors.brand[600] },
          headerTitleStyle: { fontFamily: 'SpaceGrotesk_600SemiBold' },
        }}
      />
    </Stack.Navigator>
  )
}
