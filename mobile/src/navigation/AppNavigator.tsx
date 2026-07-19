import { createNativeStackNavigator, type NativeStackNavigationProp } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Users, Shield, Clock, Bell, BarChart3 } from 'lucide-react-native'
import { colors } from '@/theme/colors'
import { ChildrenScreen } from '@/screens/ChildrenScreen'
import { ChildDetailScreen } from '@/screens/ChildDetailScreen'
import { RulesScreen } from '@/screens/RulesScreen'
import { AlertsScreen } from '@/screens/AlertsScreen'
import { ReportsScreen } from '@/screens/ReportsScreen'

// ─── Tab Param List ─────────────────────────────────────────────────────────────
export type TabParamList = {
  Children: undefined
  Rules: undefined
  Reports: undefined
  Alerts: undefined
}

export type TabNavigation = NativeStackNavigationProp<TabParamList>

const Tab = createBottomTabNavigator<TabParamList>()

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
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
          tabBarLabel: 'Enfants',
          tabBarIcon: ({ color }) => <Users size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Rules"
        component={RulesScreen}
        options={{
          tabBarLabel: 'Règles',
          tabBarIcon: ({ color }) => <Shield size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          tabBarLabel: 'Rapports',
          tabBarIcon: ({ color }) => <BarChart3 size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          tabBarLabel: 'Alertes',
          tabBarIcon: ({ color }) => <Bell size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}

// ─── App Stack Param List ───────────────────────────────────────────────────────
export type AppStackParamList = {
  Tabs: undefined
  ChildDetail: { childId: number; childName?: string }
}

export type AppNavigation = NativeStackNavigationProp<AppStackParamList>

const Stack = createNativeStackNavigator<AppStackParamList>()

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
    </Stack.Navigator>
  )
}
