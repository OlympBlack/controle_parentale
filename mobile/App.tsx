import { StatusBar } from 'expo-status-bar'
import {
  useFonts,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk'
import { RootNavigator } from '@/navigation/RootNavigator'
import { LoadingScreen } from '@/screens/LoadingScreen'

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  })

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
