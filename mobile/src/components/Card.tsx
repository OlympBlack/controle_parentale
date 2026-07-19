import { View, type ViewStyle } from 'react-native'
import { cardStyles } from '@/theme/component-styles'

interface CardProps {
  children: React.ReactNode
  variant?: 'base' | 'elevated' | 'gradient'
  style?: ViewStyle
}

export function Card({ children, variant = 'base', style }: CardProps) {
  const variantStyle = cardStyles[variant]
  return <View style={[variantStyle, style]}>{children}</View>
}
