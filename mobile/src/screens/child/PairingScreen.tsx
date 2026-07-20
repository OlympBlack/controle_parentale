import { useState } from 'react'
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Smartphone, Link2, AlertCircle, QrCode } from 'lucide-react-native'
import { useChildAppStore } from '@/store/child-app.store'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { colors } from '@/theme/colors'
import { spacing } from '@/theme'
import { QRScannerScreen } from './QRScannerScreen'

interface PairingScreenProps {
  onPaired: () => void
}

export function PairingScreen({ onPaired }: PairingScreenProps) {
  const { pairDevice } = useChildAppStore()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showScanner, setShowScanner] = useState(false)

  const doPair = async (pairingCode: string) => {
    setLoading(true)
    setError('')
    const ok = await pairDevice(pairingCode)
    setLoading(false)
    if (ok) {
      onPaired()
    } else {
      setError('Code d\'appairage invalide. Vérifiez le code affiché sur le tableau de bord SafeKid.')
    }
  }

  const handlePair = async () => {
    if (!code.trim()) {
      setError('Veuillez saisir le code d\'appairage.')
      return
    }
    if (code.trim().length < 6) {
      setError('Le code d\'appairage doit contenir 6 caractères.')
      return
    }
    await doPair(code.trim().toUpperCase())
  }

  const handleQRScanned = async (data: string) => {
    setShowScanner(false)
    const scannedCode = data.trim().toUpperCase()
    if (scannedCode.length >= 6) {
      setCode(scannedCode)
      await doPair(scannedCode)
    } else {
      setError('Code QR invalide. Ce n\'est pas un code d\'appairage SafeKid.')
    }
  }

  if (showScanner) {
    return (
      <QRScannerScreen
        onScanned={handleQRScanned}
        onClose={() => setShowScanner(false)}
      />
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: spacing.xl }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: spacing['2xl'] }}>
            <View style={{
              width: 80, height: 80, borderRadius: 40,
              backgroundColor: colors.brand[100],
              justifyContent: 'center', alignItems: 'center',
              marginBottom: spacing.lg,
            }}>
              <Link2 size={36} color={colors.brand[600]} />
            </View>

            <Text style={{
              fontSize: 24, fontFamily: 'SpaceGrotesk_700Bold',
              color: colors.gray[900], marginBottom: spacing.sm,
            }}>
              Appairer cet appareil
            </Text>

            <Text style={{
              fontSize: 14, fontFamily: 'SpaceGrotesk_400Regular',
              color: colors.gray[500], textAlign: 'center',
            }}>
              Scannez le code QR ou saisissez manuellement le code d'appairage affiché sur le tableau de bord SafeKid.
            </Text>
          </View>

          {/* QR Scan button */}
          <Pressable
            onPress={() => setShowScanner(true)}
            style={({ pressed }) => ({
              backgroundColor: colors.brand[600],
              borderRadius: 16,
              padding: spacing.xl,
              alignItems: 'center',
              marginBottom: spacing.lg,
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <QrCode size={40} color={colors.white} style={{ marginBottom: spacing.sm }} />
            <Text style={{
              fontSize: 16, fontFamily: 'SpaceGrotesk_600SemiBold',
              color: colors.white,
            }}>
              Scanner un code QR
            </Text>
            <Text style={{
              fontSize: 12, fontFamily: 'SpaceGrotesk_400Regular',
              color: colors.brand[100], marginTop: 4,
            }}>
              Ouvrez la caméra et scannez le QR code
            </Text>
          </Pressable>

          {/* Divider */}
          <View style={{
            flexDirection: 'row', alignItems: 'center',
            marginVertical: spacing.md,
          }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.gray[200] }} />
            <Text style={{
              fontSize: 12, fontFamily: 'SpaceGrotesk_400Regular',
              color: colors.gray[400], marginHorizontal: spacing.md,
            }}>
              ou saisie manuelle
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.gray[200] }} />
          </View>

          {/* Manual code input */}
          <View style={{
            backgroundColor: colors.white,
            borderRadius: 16,
            padding: spacing.lg,
            borderWidth: 1,
            borderColor: colors.gray[200],
          }}>
            {error && (
              <View style={{
                flexDirection: 'row', alignItems: 'flex-start', gap: 8,
                backgroundColor: colors.red[50], borderRadius: 8,
                padding: spacing.md, marginBottom: spacing.md,
                borderWidth: 1, borderColor: colors.red[100],
              }}>
                <AlertCircle size={18} color={colors.red[600]} />
                <Text style={{
                  color: colors.red[700], fontSize: 13,
                  fontFamily: 'SpaceGrotesk_400Regular', flex: 1,
                }}>
                  {error}
                </Text>
              </View>
            )}

            <Input
              label="Code d'appairage (6 caractères)"
              value={code}
              onChangeText={(text) => { setCode(text.toUpperCase()); setError('') }}
              placeholder="ex: LK4W7H"
              autoCapitalize="characters"
            />

            <View style={{ marginTop: spacing.md }}>
              <Button
                label="Appairer"
                onPress={handlePair}
                loading={loading}
                disabled={!code.trim()}
              />
            </View>
          </View>

          {/* Info */}
          <View style={{
            flexDirection: 'row', alignItems: 'flex-start', gap: 8,
            marginTop: spacing.lg, paddingHorizontal: spacing.sm,
          }}>
            <Smartphone size={16} color={colors.gray[400]} style={{ marginTop: 2 }} />
            <Text style={{
              fontSize: 12, fontFamily: 'SpaceGrotesk_400Regular',
              color: colors.gray[400], flex: 1,
            }}>
              Le code d'appairage est un code à 6 caractères (lettres et chiffres) généré depuis le tableau de bord web SafeKid. Ajoutez un appareil à un enfant sur le web, puis utilisez le code affiché ou le QR code.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
