import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react-native'
import { Pressable, Text, TextInput, View, type ViewStyle } from 'react-native'
import { colors } from '@/theme/colors'
import { inputStyles } from '@/theme/component-styles'

interface InputProps {
  label?: string
  value: string
  onChangeText?: (text: string) => void
  placeholder?: string
  secureTextEntry?: boolean
  error?: string
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'
  style?: ViewStyle
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  autoCapitalize = 'none',
  keyboardType = 'default',
  style,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = secureTextEntry
  const effectiveSecure = isPassword && !showPassword

  return (
    <View style={{ marginBottom: 16 }}>
      {label && <Text style={inputStyles.label}>{label}</Text>}
      <View style={{ position: 'relative' }}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.gray[400]}
          secureTextEntry={effectiveSecure}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            inputStyles.base,
            isFocused && inputStyles.focused,
            error && inputStyles.error,
            isPassword && { paddingRight: 44 },
            style,
          ]}
        />
        {isPassword && (
          <Pressable
            onPress={() => setShowPassword((s) => !s)}
            style={{ position: 'absolute', right: 12, top: 12 }}
          >
            {showPassword ? (
              <EyeOff size={20} color={colors.gray[400]} />
            ) : (
              <Eye size={20} color={colors.gray[400]} />
            )}
          </Pressable>
        )}
      </View>
      {error && <Text style={inputStyles.errorText}>{error}</Text>}
    </View>
  )
}
