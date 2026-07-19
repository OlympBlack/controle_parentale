import { colors } from '@/theme/colors'
import { typography } from '@/theme/typography'
import { spacing, radius, shadows } from '@/theme'
import type { TextStyle, ViewStyle } from 'react-native'

// ─── Button styles ──────────────────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

const buttonVariants: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: colors.brand[600] },
  secondary: { backgroundColor: colors.gray[900] },
  outline: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray[300] },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.red[600] },
}

const buttonSizes: Record<ButtonSize, ViewStyle & TextStyle> = {
  sm: { height: 36, paddingHorizontal: 12, fontSize: typography.fontSize.sm },
  md: { height: 44, paddingHorizontal: 20, fontSize: typography.fontSize.sm },
  lg: { height: 48, paddingHorizontal: 24, fontSize: typography.fontSize.base },
}

export const buttonStyles = {
  base: {
    borderRadius: radius.md,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    flexDirection: 'row' as const,
    fontWeight: typography.fontWeight.medium,
  },
  variants: buttonVariants,
  sizes: buttonSizes,
  text: {
    primary: { color: colors.white, fontWeight: '500' },
    secondary: { color: colors.white, fontWeight: '500' },
    outline: { color: colors.gray[700], fontWeight: '500' },
    ghost: { color: colors.gray[700], fontWeight: '500' },
    danger: { color: colors.white, fontWeight: '500' },
  },
}

// ─── Input styles ───────────────────────────────────────────────────────────────
export const inputStyles = {
  base: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: radius.md,
    paddingHorizontal: 14,
    fontSize: typography.fontSize.sm,
    color: colors.gray[900],
    backgroundColor: colors.white,
  } as ViewStyle & TextStyle,
  focused: {
    borderColor: colors.brand[500],
    borderWidth: 2,
  } as ViewStyle & TextStyle,
  error: {
    borderColor: colors.red[500],
  } as ViewStyle & TextStyle,
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium as TextStyle['fontWeight'],
    color: colors.gray[700],
    marginBottom: 6,
  } as TextStyle,
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.red[600],
    marginTop: 4,
  } as TextStyle,
}

// ─── Card styles ────────────────────────────────────────────────────────────────
export const cardStyles = {
  base: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.gray[200],
    padding: spacing.xl,
    ...shadows.sm,
  } as ViewStyle,
  elevated: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xl,
    ...shadows.md,
  } as ViewStyle,
  gradient: {
    backgroundColor: colors.brand[50],
    borderRadius: radius.xl,
    padding: spacing.xl,
  } as ViewStyle,
}

// ─── Badge styles ───────────────────────────────────────────────────────────────
type BadgeColor = 'brand' | 'green' | 'red' | 'amber' | 'gray' | 'blue' | 'purple'

export const badgeStyles: Record<BadgeColor, ViewStyle & TextStyle> = {
  brand: { backgroundColor: colors.brand[50], color: colors.brand[700] },
  green: { backgroundColor: colors.emerald[100], color: colors.emerald[700] },
  red: { backgroundColor: colors.red[100], color: colors.red[700] },
  amber: { backgroundColor: colors.amber[100], color: colors.amber[700] },
  gray: { backgroundColor: colors.gray[100], color: colors.gray[600] },
  blue: { backgroundColor: colors.blue[100], color: colors.blue[600] },
  purple: { backgroundColor: colors.purple[100], color: colors.purple[600] },
}

export { colors, typography, spacing, radius, shadows }
export type { ButtonVariant, ButtonSize, BadgeColor }
