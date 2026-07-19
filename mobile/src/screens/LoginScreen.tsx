import { useState } from 'react'
import { View, Text, ScrollView, Pressable, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Shield } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import type { AuthNavigation } from '@/navigation/AuthNavigator'
import { useAuthStore } from '@/store/auth.store'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { colors } from '@/theme/colors'
import { spacing } from '@/theme'

export function LoginScreen() {
  const navigation = useNavigation<AuthNavigation>()
  const { login, loading, error, clearError } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    if (!email || !password) return
    await login(email, password)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.brand[50] }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: spacing['2xl'] }}>
        {/* Logo */}
        <View style={{ alignItems: 'center', marginBottom: spacing['4xl'] }}>
          <View style={{
            width: 64, height: 64, borderRadius: 20,
            backgroundColor: colors.brand[600],
            justifyContent: 'center', alignItems: 'center',
          }}>
            <Shield size={32} color={colors.white} />
          </View>
          <Text style={{ fontSize: 28, fontWeight: '700', color: colors.gray[900], marginTop: spacing.lg }}>
            SafeKid
          </Text>
          <Text style={{ fontSize: 14, color: colors.gray[500], marginTop: spacing.xs }}>
            Contrôle parental intelligent
          </Text>
        </View>

        {/* Form */}
        <View style={{ backgroundColor: colors.white, borderRadius: 16, padding: spacing.xl, ...{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 } }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.gray[900], marginBottom: spacing.lg }}>
            Connexion
          </Text>

          {error && (
            <View style={{ backgroundColor: colors.red[50], borderRadius: 8, padding: spacing.md, marginBottom: spacing.md }}>
              <Text style={{ color: colors.red[700], fontSize: 13 }}>{error}</Text>
            </View>
          )}

          <Input
            label="Email"
            value={email}
            onChangeText={(text) => { setEmail(text); clearError() }}
            placeholder="vous@exemple.com"
            keyboardType="email-address"
          />

          <Input
            label="Mot de passe"
            value={password}
            onChangeText={(text) => { setPassword(text); clearError() }}
            placeholder="••••••••"
            secureTextEntry
          />

          <Button label="Se connecter" onPress={handleLogin} loading={loading} style={{ marginTop: spacing.sm }} />

          <Pressable
            onPress={() => navigation.navigate('Register')}
            style={{ marginTop: spacing.lg, alignItems: 'center' }}
          >
            <Text style={{ color: colors.gray[500], fontSize: 14 }}>
              Pas de compte ? <Text style={{ color: colors.brand[600], fontWeight: '600' }}>S'inscrire</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
