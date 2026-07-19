import { Text, View, type ViewStyle, type TextStyle } from 'react-native'
import { badgeStyles, type BadgeColor } from '@/theme/component-styles'
import { spacing } from '@/theme'

interface BadgeProps {
  label: string
  color?: BadgeColor
  style?: ViewStyle
}

export function Badge({ label, color = 'gray', style }: BadgeProps) {
  const badgeStyle = badgeStyles[color]
  return (
    <View
      style={[
        {
          backgroundColor: badgeStyle.backgroundColor,
          borderRadius: 9999,
          paddingHorizontal: spacing.sm + 2,
          paddingVertical: spacing.xs,
        },
        style,
      ]}
    >
      <Text style={{ color: badgeStyle.color, fontSize: 12, fontWeight: '600' } as TextStyle}>
        {label}
      </Text>
    </View>
  )
}
