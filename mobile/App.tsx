import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { LogBox } from 'react-native'
import Constants from 'expo-constants'
import {
  useFonts,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk'
import { RootNavigator } from '@/navigation/RootNavigator'
import { LoadingScreen } from '@/screens/LoadingScreen'

LogBox.ignoreLogs([
  'expo-usage-access',
  'Native module not available',
])

if (__DEV__) {
  const originalConsoleError = console.error
  console.error = (...args: unknown[]) => {
    originalConsoleError(...args)
  }
  const originalHandler = ErrorUtils.getGlobalHandler()
  ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
    console.error('[GLOBAL ERROR]', isFatal ? '(FATAL)' : '', error?.message, error?.stack)
    if (originalHandler) originalHandler(error, isFatal)
  })
}

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  })

  useEffect(() => {
    if (__DEV__) {
      console.log('[SafeKid] App started in DEV mode')
      console.log('[SafeKid] API URL:',
        process.env.EXPO_PUBLIC_API_URL ||
        Constants.expoConfig?.extra?.apiUrl ||
        'http://localhost:8000/api'
      )
    }
  }, [])

  if (!fontsLoaded) {
    return <LoadingScreen />
  }

  return (
    <>
      <StatusBar style="light" />
      <RootNavigator />
    </>
  )
}
