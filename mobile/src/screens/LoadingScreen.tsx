import { ActivityIndicator, View, Text, Image } from 'react-native'
import { colors } from '@/theme/colors'
import { spacing } from '@/theme'

export function LoadingScreen() {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.white,
    }}>
      <Image
        source={require('../../assets/safekid-logo.png')}
        style={{ width: 80, height: 80, borderRadius: 20 }}
        resizeMode="contain"
      />
      <Text style={{
        fontSize: 24,
        fontWeight: '700',
        color: colors.gray[900],
        marginTop: spacing.lg,
        letterSpacing: 0.5,
      }}>
        SafeKid
      </Text>
      <Text style={{
        fontSize: 13,
        color: colors.gray[400],
        marginTop: 4,
      }}>
        Contrôle parental
      </Text>
      <ActivityIndicator
        size="large"
        color={colors.brand[600]}
        style={{ marginTop: spacing['3xl'] }}
      />
    </View>
  )
}
