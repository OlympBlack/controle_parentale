import { useState } from 'react'
import { View, Text, ScrollView, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Shield } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import type { AuthNavigation } from '@/navigation/AuthNavigator'
import { useAuthStore } from '@/store/auth.store'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { colors } from '@/theme/colors'
import { spacing } from '@/theme'

export function RegisterScreen() {
  const navigation = useNavigation<AuthNavigation>()
  const { register, loading, error, clearError } = useAuthStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [phone, setPhone] = useState('')

  const handleRegister = async () => {
    if (!name || !email || !password || !passwordConfirmation) return
    await register({
      name,
      email,
      password,
      passwordConfirmation,
      phone: phone || undefined,
    })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.brand[50] }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: spacing['2xl'] }}>
        {/* Logo */}
        <View style={{ alignItems: 'center', marginBottom: spacing['3xl'] }}>
          <View style={{
            width: 56, height: 56, borderRadius: 16,
            backgroundColor: colors.brand[600],
            justifyContent: 'center', alignItems: 'center',
          }}>
            <Shield size={28} color={colors.white} />
          </View>
          <Text style={{ fontSize: 24, fontWeight: '700', color: colors.gray[900], marginTop: spacing.md }}>
            Créer un compte
          </Text>
        </View>

        {/* Form */}
        <View style={{ backgroundColor: colors.white, borderRadius: 16, padding: spacing.xl, ...{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 } }}>
          {error && (
            <View style={{ backgroundColor: colors.red[50], borderRadius: 8, padding: spacing.md, marginBottom: spacing.md }}>
              <Text style={{ color: colors.red[700], fontSize: 13 }}>{error}</Text>
            </View>
          )}

          <Input
            label="Nom complet"
            value={name}
            onChangeText={(text) => { setName(text); clearError() }}
            placeholder="Jean Dupont"
            autoCapitalize="words"
          />

          <Input
            label="Email"
            value={email}
            onChangeText={(text) => { setEmail(text); clearError() }}
            placeholder="vous@exemple.com"
            keyboardType="email-address"
          />

          <Input
            label="Téléphone (optionnel)"
            value={phone}
            onChangeText={setPhone}
            placeholder="06 12 34 56 78"
            keyboardType="phone-pad"
          />

          <Input
            label="Mot de passe"
            value={password}
            onChangeText={(text) => { setPassword(text); clearError() }}
            placeholder="••••••••"
            secureTextEntry
          />

          <Input
            label="Confirmer le mot de passe"
            value={passwordConfirmation}
            onChangeText={(text) => { setPasswordConfirmation(text); clearError() }}
            placeholder="••••••••"
            secureTextEntry
          />

          <Button label="S'inscrire" onPress={handleRegister} loading={loading} style={{ marginTop: spacing.sm }} />

          <Pressable
            onPress={() => navigation.navigate('Login')}
            style={{ marginTop: spacing.lg, alignItems: 'center' }}
          >
            <Text style={{ color: colors.gray[500], fontSize: 14 }}>
              Déjà un compte ? <Text style={{ color: colors.brand[600], fontWeight: '600' }}>Se connecter</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
