import { View, Text, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { User } from 'lucide-react-native'
import { colors } from '@/theme/colors'
import { spacing } from '@/theme'

interface AppHeaderProps {
  title: string
  onProfilePress?: () => void
  rightIcon?: React.ReactNode
  onRightPress?: () => void
}

export function AppHeader({ title, onProfilePress, rightIcon, onRightPress }: AppHeaderProps) {
  return (
    <SafeAreaView
      edges={['top']}
      style={{ backgroundColor: colors.brand[600] }}
    >
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        height: 56,
      }}>
        <Text
          style={{
            fontSize: 18, fontFamily: 'SpaceGrotesk_600SemiBold',
            color: colors.white,
          }}
          numberOfLines={1}
        >
          {title}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {rightIcon && (
            <Pressable
              onPress={onRightPress}
              style={({ pressed }) => ({
                width: 36, height: 36, borderRadius: 18,
                justifyContent: 'center', alignItems: 'center',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              {rightIcon}
            </Pressable>
          )}

          <Pressable
            onPress={onProfilePress}
            style={({ pressed }) => ({
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: 'rgba(255,255,255,0.2)',
              justifyContent: 'center', alignItems: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <User size={20} color={colors.white} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}
