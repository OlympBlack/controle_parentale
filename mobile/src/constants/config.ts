import Constants from 'expo-constants'

export const API_BASE_URL =
  Constants.expoConfig?.extra?.apiUrl ||
  process.env.EXPO_PUBLIC_API_URL ||
  'http://localhost:8000/api'

export const SECURE_STORE_KEYS = {
  AUTH_TOKEN: 'safekid_auth_token',
} as const

export const STORAGE_KEYS = {
  USER: 'safekid_user',
} as const
