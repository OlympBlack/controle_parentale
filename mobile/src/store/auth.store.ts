import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import { authService } from '@/services/auth.service'
import { SECURE_STORE_KEYS } from '@/constants/config'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isInitializing: boolean
  loading: boolean
  error: string | null
  fieldErrors: Record<string, string[]>

  initialize: () => Promise<void>
  login: (email: string, password: string) => Promise<boolean>
  register: (data: {
    name: string
    email: string
    password: string
    passwordConfirmation: string
    phone?: string
  }) => Promise<boolean>
  logout: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isInitializing: true,
  loading: false,
  error: null,
  fieldErrors: {},

  initialize: async () => {
    try {
      const token = await SecureStore.getItemAsync(SECURE_STORE_KEYS.AUTH_TOKEN)
      if (!token) {
        set({ isInitializing: false })
        return
      }
      const user = await authService.me()
      set({ user, token, isAuthenticated: true, isInitializing: false })
    } catch {
      await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.AUTH_TOKEN)
      set({ user: null, token: null, isAuthenticated: false, isInitializing: false })
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null, fieldErrors: {} })
    try {
      const res = await authService.login(email, password)
      await SecureStore.setItemAsync(SECURE_STORE_KEYS.AUTH_TOKEN, res.token)
      set({ user: res.user, token: res.token, isAuthenticated: true, loading: false })
      return true
    } catch (err) {
      const e = err as { response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } } }
      const status = e?.response?.status
      const fieldErrors = e?.response?.data?.errors ?? {}
      let msg = ''
      if (status === 422) {
        msg = e?.response?.data?.message ?? 'Veuillez corriger les erreurs ci-dessous.'
      } else if (status === 401) {
        msg = e?.response?.data?.message ?? 'Identifiants incorrects.'
      } else if (status === 403) {
        msg = e?.response?.data?.message ?? 'Votre compte est inactif. Contactez le support.'
      } else if (status === 429) {
        msg = 'Trop de tentatives. Veuillez patienter avant de réessayer.'
      } else {
        msg = 'Une erreur est survenue. Veuillez réessayer.'
      }
      set({ loading: false, error: msg, fieldErrors })
      return false
    }
  },

  register: async (data) => {
    set({ loading: true, error: null, fieldErrors: {} })
    try {
      const res = await authService.register(data)
      await SecureStore.setItemAsync(SECURE_STORE_KEYS.AUTH_TOKEN, res.token)
      set({ user: res.user, token: res.token, isAuthenticated: true, loading: false })
      return true
    } catch (err) {
      const e = err as { response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } } }
      const status = e?.response?.status
      const fieldErrors = e?.response?.data?.errors ?? {}
      let msg = ''
      if (status === 422) {
        msg = e?.response?.data?.message ?? 'Veuillez corriger les erreurs ci-dessous.'
      } else if (status === 429) {
        msg = 'Trop de tentatives. Veuillez patienter avant de réessayer.'
      } else {
        msg = 'Une erreur est survenue. Veuillez réessayer.'
      }
      set({ loading: false, error: msg, fieldErrors })
      return false
    }
  },

  logout: async () => {
    try {
      await authService.logout()
    } catch {
      // Token may already be invalid
    } finally {
      await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.AUTH_TOKEN)
      set({ user: null, token: null, isAuthenticated: false })
    }
  },

  clearError: () => set({ error: null, fieldErrors: {} }),
}))
