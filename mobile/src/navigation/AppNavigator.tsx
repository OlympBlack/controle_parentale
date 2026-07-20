import { Pressable } from 'react-native'
import { createNativeStackNavigator, type NativeStackNavigationProp } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useRoute, useNavigation, type RouteProp } from '@react-navigation/native'
import { Users, Shield, Bell, BarChart3, User as UserIcon } from 'lucide-react-native'
import * as SecureStore from 'expo-secure-store'
import { colors } from '@/theme/colors'
import { SECURE_STORE_KEYS } from '@/constants/config'
import { ChildrenScreen } from '@/screens/ChildrenScreen'
import { ChildDetailScreen } from '@/screens/ChildDetailScreen'
import { RulesScreen } from '@/screens/RulesScreen'
import { AlertsScreen } from '@/screens/AlertsScreen'
import { ReportsScreen } from '@/screens/ReportsScreen'
import { DevicesScreen } from '@/screens/parent/DevicesScreen'
import { ScreenTimeScreen } from '@/screens/parent/ScreenTimeScreen'
import { LocationScreen } from '@/screens/parent/LocationScreen'
import { ProfileScreen } from '@/screens/ProfileScreen'

// ─── Tab Param List ─────────────────────────────────────────────────────────────
export type TabParamList = {
  Children: undefined
  Rules: undefined
  Reports: undefined
  Alerts: undefined
  Profile: undefined
}

export type TabNavigation = NativeStackNavigationProp<TabParamList>

const Tab = createBottomTabNavigator<TabParamList>()

function TabNavigator() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const headerRight = () => (
    <Pressable
      onPress={() => navigation.navigate('Profile')}
      style={({ pressed }) => ({
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center', alignItems: 'center',
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <UserIcon size={20} color={colors.white} />
    </Pressable>
  )

  const tabScreenOptions = {
    headerShown: true,
    headerTintColor: colors.white,
    headerStyle: { backgroundColor: colors.brand[600] },
    headerTitleStyle: { fontFamily: 'SpaceGrotesk_600SemiBold' },
    headerRight,
  } as const

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.brand[600],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          borderTopColor: colors.gray[200],
          paddingBottom: 4,
          paddingTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Children"
        component={ChildrenScreen}
        options={{
          ...tabScreenOptions,
          title: 'Enfants',
          tabBarLabel: 'Enfants',
          tabBarIcon: ({ color }) => <Users size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Rules"
        component={RulesScreen}
        options={{
          ...tabScreenOptions,
          title: 'Règles',
          tabBarLabel: 'Règles',
          tabBarIcon: ({ color }) => <Shield size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          ...tabScreenOptions,
          title: 'Rapports',
          tabBarLabel: 'Rapports',
          tabBarIcon: ({ color }) => <BarChart3 size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          ...tabScreenOptions,
          title: 'Alertes',
          tabBarLabel: 'Alertes',
          tabBarIcon: ({ color }) => <Bell size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileTabWrapper}
        options={{
          headerShown: false,
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color }) => <UserIcon size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}

// ─── App Stack Param List ───────────────────────────────────────────────────────
export type AppStackParamList = {
  Tabs: undefined
  ChildDetail: { childId: number; childName?: string }
  Devices: { childId: number; childName?: string }
  ScreenTime: { childId: number; childName?: string }
  Location: { childId: number; childName?: string }
  Profile: undefined
}

export type AppNavigation = NativeStackNavigationProp<AppStackParamList>

const Stack = createNativeStackNavigator<AppStackParamList>()

function DevicesScreenWrapper() {
  const route = useRoute<RouteProp<AppStackParamList, 'Devices'>>()
  return <DevicesScreen childId={route.params.childId} childName={route.params.childName} />
}

function ScreenTimeScreenWrapper() {
  const route = useRoute<RouteProp<AppStackParamList, 'ScreenTime'>>()
  return <ScreenTimeScreen childId={route.params.childId} childName={route.params.childName} />
}

function LocationScreenWrapper() {
  const route = useRoute<RouteProp<AppStackParamList, 'Location'>>()
  return <LocationScreen childId={route.params.childId} childName={route.params.childName} />
}

function ProfileTabWrapper() {
  return <ProfileScreen />
}

function ProfileStackWrapper() {
  return <ProfileScreen />
}

export function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="ChildDetail"
        component={ChildDetailScreen}
        options={({ route }) => ({
          title: route.params.childName ?? 'Détail',
          headerTintColor: colors.white,
          headerStyle: { backgroundColor: colors.brand[600] },
          headerTitleStyle: { fontWeight: '600' },
        })}
      />
      <Stack.Screen
        name="Devices"
        component={DevicesScreenWrapper}
        options={{
          title: 'Appareils',
          headerTintColor: colors.white,
          headerStyle: { backgroundColor: colors.brand[600] },
        }}
      />
      <Stack.Screen
        name="ScreenTime"
        component={ScreenTimeScreenWrapper}
        options={{
          title: "Temps d'écran",
          headerTintColor: colors.white,
          headerStyle: { backgroundColor: colors.brand[600] },
        }}
      />
      <Stack.Screen
        name="Location"
        component={LocationScreenWrapper}
        options={{
          title: 'Localisation',
          headerTintColor: colors.white,
          headerStyle: { backgroundColor: colors.brand[600] },
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileStackWrapper}
        options={{
          title: 'Profil',
          headerTintColor: colors.white,
          headerStyle: { backgroundColor: colors.brand[600] },
          headerTitleStyle: { fontFamily: 'SpaceGrotesk_600SemiBold' },
        }}
      />
    </Stack.Navigator>
  )
}
