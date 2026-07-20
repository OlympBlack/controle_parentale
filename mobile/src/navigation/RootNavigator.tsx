import { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { useAuthStore } from '@/store/auth.store'
import { AuthNavigator } from './AuthNavigator'
import { ChildNavigator } from './ChildNavigator'
import { LoadingScreen } from '@/screens/LoadingScreen'

export function RootNavigator() {
  const { isInitializing, isAuthenticated, initialize } = useAuthStore()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    await initialize()
    setReady(true)
  }

  if (isInitializing || !ready) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    )
  }

  return (
    <NavigationContainer>
      <ChildNavigator />
    </NavigationContainer>
  )
}
