import { useEffect, useState } from 'react'
import { createNativeStackNavigator, type NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store'
import { SECURE_STORE_KEYS } from '@/constants/config'
import { useChildAppStore } from '@/store/child-app.store'
import { ChildSelectScreen } from '@/screens/child/ChildSelectScreen'
import { UsageAccessOnboarding } from '@/screens/child/UsageAccessOnboarding'
import { LocationOnboarding } from '@/screens/child/LocationOnboarding'
import { ChildStatusScreen } from '@/screens/child/ChildStatusScreen'
import { LoadingScreen } from '@/screens/LoadingScreen'

export type ChildStackParamList = {
  ChildSelect: undefined
  UsageOnboarding: undefined
  LocationOnboarding: undefined
  ChildStatus: undefined
}

const Stack = createNativeStackNavigator<ChildStackParamList>()

function ChildSelectWrapper() {
  const navigation = useNavigation<NativeStackNavigationProp<ChildStackParamList>>()
  return <ChildSelectScreen onSelected={() => navigation.navigate('UsageOnboarding')} />
}

function UsageOnboardingWrapper() {
  const navigation = useNavigation<NativeStackNavigationProp<ChildStackParamList>>()
  return <UsageAccessOnboarding onGranted={() => navigation.navigate('LocationOnboarding')} />
}

function LocationOnboardingWrapper() {
  const navigation = useNavigation<NativeStackNavigationProp<ChildStackParamList>>()
  return <LocationOnboarding onGranted={() => navigation.navigate('ChildStatus')} />
}

export function ChildNavigator() {
  const { loadStoredDevice, permissions } = useChildAppStore()
  const [isLoading, setIsLoading] = useState(true)
  const [initialRoute, setInitialRoute] = useState<keyof ChildStackParamList>('ChildSelect')

  useEffect(() => {
    determineRoute()
  }, [])

  const determineRoute = async () => {
    await loadStoredDevice()
    const storedDeviceId = await SecureStore.getItemAsync(SECURE_STORE_KEYS.DEVICE_ID)

    if (!storedDeviceId) {
      setInitialRoute('ChildSelect')
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
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="ChildSelect" component={ChildSelectWrapper} />
      <Stack.Screen name="UsageOnboarding" component={UsageOnboardingWrapper} />
      <Stack.Screen name="LocationOnboarding" component={LocationOnboardingWrapper} />
      <Stack.Screen
        name="ChildStatus"
        component={ChildStatusScreen}
        options={{
          headerShown: true,
          title: 'SafeKid Enfant',
          headerBackVisible: false,
        }}
      />
    </Stack.Navigator>
  )
}
