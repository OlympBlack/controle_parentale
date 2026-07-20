import { ActivityIndicator, Pressable, Text, type ViewStyle, type TextStyle } from 'react-native'
import { colors } from '@/theme/colors'
import { buttonStyles, type ButtonVariant, type ButtonSize } from '@/theme/component-styles'

interface ButtonProps {
  label: string
  onPress?: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  style?: ViewStyle
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const variantStyle = buttonStyles.variants[variant]
  const sizeStyle = buttonStyles.sizes[size]
  const textStyle = buttonStyles.text[variant]

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        buttonStyles.base,
        variantStyle,
        sizeStyle,
        style,
        (pressed || disabled) && { opacity: 0.7 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textStyle.color} size="small" />
      ) : (
        <Text style={{ ...textStyle, fontSize: sizeStyle.fontSize, fontFamily: 'Space Grotesk' } as TextStyle}>
          {label}
        </Text>
      )}
    </Pressable>
  )
}
