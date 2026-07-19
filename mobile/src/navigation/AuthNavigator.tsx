import { createNativeStackNavigator, type NativeStackNavigationProp } from '@react-navigation/native-stack'
import { LoginScreen } from '@/screens/LoginScreen'
import { RegisterScreen } from '@/screens/RegisterScreen'

export type AuthStackParamList = {
  Login: undefined
  Register: undefined
}

export type AuthNavigation = NativeStackNavigationProp<AuthStackParamList>

const Stack = createNativeStackNavigator<AuthStackParamList>()

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  )
}
