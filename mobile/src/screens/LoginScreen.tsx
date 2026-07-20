import { useState } from 'react'
import { View, Text, ScrollView, Pressable, Image, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AlertCircle } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import type { AuthNavigation } from '@/navigation/AuthNavigator'
import { useAuthStore } from '@/store/auth.store'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { colors } from '@/theme/colors'
import { spacing } from '@/theme'

export function LoginScreen() {
  const navigation = useNavigation<AuthNavigation>()
  const { login, loading, error, fieldErrors, clearError } = useAuthStore()

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
          <Image
            source={require('../../assets/safekid-logo.png')}
            style={{ width: 80, height: 80, borderRadius: 20 }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 28, fontWeight: '700', fontFamily: 'Space Grotesk', color: colors.gray[900], marginTop: spacing.lg }}>
            SafeKid
          </Text>
          <Text style={{ fontSize: 14, fontFamily: 'Space Grotesk', color: colors.gray[500], marginTop: spacing.xs }}>
            Contrôle parental intelligent
          </Text>
        </View>

        {/* Hero text */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={{ fontSize: 22, fontWeight: '700', fontFamily: 'Space Grotesk', color: colors.gray[900] }}>
            Connexion
          </Text>
          <Text style={{ fontSize: 14, fontFamily: 'Space Grotesk', color: colors.gray[600], marginTop: spacing.xs }}>
            Bienvenue ! Connectez-vous pour accéder à votre tableau de bord.
          </Text>
        </View>

        {/* Form */}
        <View style={{ backgroundColor: colors.white, borderRadius: 16, padding: spacing.xl, ...{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 } }}>
          {error && (
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: colors.red[50], borderRadius: 8, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.red[100] }}>
              <AlertCircle size={20} color={colors.red[600]} />
              <Text style={{ color: colors.red[700], fontSize: 13, fontFamily: 'Space Grotesk', flex: 1 }}>{error}</Text>
            </View>
          )}

          <Input
            label="Email"
            value={email}
            onChangeText={(text) => { setEmail(text); clearError() }}
            placeholder="vous@exemple.com"
            keyboardType="email-address"
            error={fieldErrors.email?.[0]}
          />

          <Input
            label="Mot de passe"
            value={password}
            onChangeText={(text) => { setPassword(text); clearError() }}
            placeholder="••••••••"
            secureTextEntry
            error={fieldErrors.password?.[0]}
          />

          <Pressable onPress={() => Linking.openURL('https://safekid.app/forgot-password')} style={{ alignSelf: 'flex-end', marginBottom: spacing.sm }}>
            <Text style={{ color: colors.brand[600], fontSize: 14, fontFamily: 'Space Grotesk', fontWeight: '500' }}>
              Mot de passe oublié ?
            </Text>
          </Pressable>

          <Button label="Se connecter" onPress={handleLogin} loading={loading} />
        </View>

        <Pressable
          onPress={() => navigation.navigate('Register')}
          style={{ marginTop: spacing.xl, alignItems: 'center' }}
        >
          <Text style={{ color: colors.gray[600], fontSize: 14, fontFamily: 'Space Grotesk' }}>
            Pas encore de compte ? <Text style={{ color: colors.brand[600], fontWeight: '600', fontFamily: 'Space Grotesk' }}>Créer un compte</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}
