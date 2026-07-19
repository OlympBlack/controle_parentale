import { useEffect } from 'react'
import { NavigationContainer, type NavigationProp } from '@react-navigation/native'
import { useAuthStore } from '@/store/auth.store'
import { AuthNavigator } from './AuthNavigator'
import { AppNavigator } from './AppNavigator'
import { LoadingScreen } from '@/screens/LoadingScreen'

export type RootStackParamList = {
  Auth: undefined
  App: undefined
}

export type RootNavigation = NavigationProp<RootStackParamList>

export function RootNavigator() {
  const { isInitializing, isAuthenticated, initialize } = useAuthStore()

  useEffect(() => {
    void initialize()
  }, [initialize])

  if (isInitializing) {
    return <LoadingScreen />
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  )
}
