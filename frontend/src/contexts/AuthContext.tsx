import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { authService } from '@/services/auth.service'
import type { RegisterData, User } from '@/types'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isInitializing: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  logoutAll: () => Promise<void>
  changePassword: (current: string, next: string, confirmation: string) => Promise<void>
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const TOKEN_KEY = 'auth_token'

function persistAuth(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

function clearPersistedAuth(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [loading, setLoading] = useState(false)

  const clearAuth = useCallback((): void => {
    clearPersistedAuth()
    setUser(null)
  }, [])

  const clearAuthRef = useRef(clearAuth)
  clearAuthRef.current = clearAuth

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)

    if (!token) {
      setIsInitializing(false)
      return
    }

    authService
      .me()
      .then((fetchedUser) => setUser(fetchedUser))
      .catch(() => clearPersistedAuth())
      .finally(() => setIsInitializing(false))
  }, [])

  useEffect(() => {
    const handleExpired = (): void => clearAuthRef.current()
    window.addEventListener('auth:expired', handleExpired)
    return () => window.removeEventListener('auth:expired', handleExpired)
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setLoading(true)
    try {
      const res = await authService.login(email, password)
      persistAuth(res.token)
      setUser(res.user)
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (data: RegisterData): Promise<void> => {
    setLoading(true)
    try {
      const res = await authService.register(data)
      persistAuth(res.token)
      setUser(res.user)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout()
    } catch {
      // Token may already be invalid — proceed with local cleanup regardless
    } finally {
      clearAuth()
    }
  }, [clearAuth])

  const logoutAll = useCallback(async (): Promise<void> => {
    try {
      await authService.logoutAll()
    } catch {
      // Same as logout — clean up locally regardless
    } finally {
      clearAuth()
    }
  }, [clearAuth])

  const changePassword = useCallback(
    async (current: string, next: string, confirmation: string): Promise<void> => {
      await authService.changePassword(current, next, confirmation)
    },
    []
  )

  const updateUser = useCallback((updated: User): void => {
    setUser(updated)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isInitializing,
        loading,
        login,
        register,
        logout,
        logoutAll,
        changePassword,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
