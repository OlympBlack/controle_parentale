import { useState } from 'react'
import { View, Text, ScrollView, Pressable, Image, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AlertCircle, Check } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import type { AuthNavigation } from '@/navigation/AuthNavigator'
import { useAuthStore } from '@/store/auth.store'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { colors } from '@/theme/colors'
import { spacing } from '@/theme'

export function RegisterScreen() {
  const navigation = useNavigation<AuthNavigation>()
  const { register, loading, error, fieldErrors, clearError } = useAuthStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const handleRegister = async () => {
    if (!name || !email || !password || !passwordConfirmation || !acceptedTerms) return
    await register({
      name,
      email,
      password,
      passwordConfirmation,
    })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.brand[50] }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: spacing['2xl'] }}>
        {/* Logo */}
        <View style={{ alignItems: 'center', marginBottom: spacing['3xl'] }}>
          <Image
            source={require('../../assets/safekid-logo.png')}
            style={{ width: 72, height: 72, borderRadius: 18 }}
            resizeMode="contain"
          />
        </View>

        {/* Hero text */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={{ fontSize: 22, fontWeight: '700', fontFamily: 'Space Grotesk', color: colors.gray[900] }}>
            Créer un compte
          </Text>
          <Text style={{ fontSize: 14, fontFamily: 'Space Grotesk', color: colors.gray[600], marginTop: spacing.xs }}>
            Commencez votre essai gratuit. Aucune carte requise.
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
            label="Nom complet"
            value={name}
            onChangeText={(text) => { setName(text); clearError() }}
            placeholder="Jean Dupont"
            autoCapitalize="words"
            error={fieldErrors.name?.[0]}
          />

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

          <Input
            label="Confirmer le mot de passe"
            value={passwordConfirmation}
            onChangeText={(text) => { setPasswordConfirmation(text); clearError() }}
            placeholder="••••••••"
            secureTextEntry
            error={fieldErrors.password_confirmation?.[0]}
          />

          {/* Terms checkbox */}
          <Pressable
            onPress={() => setAcceptedTerms((v) => !v)}
            style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: spacing.md, marginTop: spacing.xs }}
          >
            <View style={{
              width: 20, height: 20, borderRadius: 6, marginTop: 2,
              borderWidth: 2, borderColor: acceptedTerms ? colors.brand[600] : colors.gray[300],
              backgroundColor: acceptedTerms ? colors.brand[600] : 'transparent',
              justifyContent: 'center', alignItems: 'center',
            }}>
              {acceptedTerms && <Check size={12} color={colors.white} strokeWidth={3} />}
            </View>
            <Text style={{ fontSize: 13, fontFamily: 'Space Grotesk', color: colors.gray[600], flex: 1 }}>
              J'accepte les{' '}
              <Text style={{ color: colors.brand[600], fontWeight: '500', fontFamily: 'Space Grotesk' }} onPress={() => Linking.openURL('https://safekid.app/cgu')}>CGU</Text>
              {' '}et la{' '}
              <Text style={{ color: colors.brand[600], fontWeight: '500', fontFamily: 'Space Grotesk' }} onPress={() => Linking.openURL('https://safekid.app/confidentialite')}>politique de confidentialité</Text>
            </Text>
          </Pressable>

          <Button label="Créer mon compte" onPress={handleRegister} loading={loading} disabled={!acceptedTerms} />
        </View>

        <Pressable
          onPress={() => navigation.navigate('Login')}
          style={{ marginTop: spacing.xl, alignItems: 'center' }}
        >
          <Text style={{ color: colors.gray[600], fontSize: 14, fontFamily: 'Space Grotesk' }}>
            Déjà un compte ? <Text style={{ color: colors.brand[600], fontWeight: '600', fontFamily: 'Space Grotesk' }}>Se connecter</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}
