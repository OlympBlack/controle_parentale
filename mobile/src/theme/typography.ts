export const typography = {
  fontFamily: {
    regular: 'SpaceGrotesk_400Regular',
    medium: 'SpaceGrotesk_500Medium',
    semibold: 'SpaceGrotesk_600SemiBold',
    bold: 'SpaceGrotesk_700Bold',
    sans: 'SpaceGrotesk_400Regular',
    mono: 'monospace',
  },
  fontForWeight: (weight: '400' | '500' | '600' | '700'): string => {
    const map: Record<string, string> = {
      '400': 'SpaceGrotesk_400Regular',
      '500': 'SpaceGrotesk_500Medium',
      '600': 'SpaceGrotesk_600SemiBold',
      '700': 'SpaceGrotesk_700Bold',
    }
    return map[weight] ?? 'SpaceGrotesk_400Regular'
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const
