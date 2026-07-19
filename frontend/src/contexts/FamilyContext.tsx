import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { familyService } from '@/services/family.service'
import { useAuth } from '@/contexts/AuthContext'
import type { Family, UserRole } from '@/types'

const ACTIVE_FAMILY_KEY = 'active_family_id'

interface FamilyContextValue {
  families: Family[]
  activeFamily: Family | null
  currentRole: UserRole | null
  isLoadingFamily: boolean
  setActiveFamily: (family: Family) => void
  refreshFamilies: () => Promise<void>
}

const FamilyContext = createContext<FamilyContextValue | undefined>(undefined)

export function FamilyProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [families, setFamilies] = useState<Family[]>([])
  const [activeFamily, setActiveFamilyState] = useState<Family | null>(null)
  const [isLoadingFamily, setIsLoadingFamily] = useState(true)

  const resolveActiveFamily = useCallback(
    (list: Family[]): Family | null => {
      if (list.length === 0) return null

      const storedId = sessionStorage.getItem(ACTIVE_FAMILY_KEY)
      if (storedId) {
        const found = list.find((f) => String(f.id) === storedId)
        if (found) return found
      }

      return list[0]
    },
    []
  )

  const loadFamilies = useCallback(async (): Promise<void> => {
    setIsLoadingFamily(true)
    try {
      const list = await familyService.list()
      setFamilies(list)
      setActiveFamilyState(resolveActiveFamily(list))
    } catch {
      setFamilies([])
      setActiveFamilyState(null)
    } finally {
      setIsLoadingFamily(false)
    }
  }, [resolveActiveFamily])

  useEffect(() => {
    if (isAuthenticated) {
      void loadFamilies()
    } else {
      setFamilies([])
      setActiveFamilyState(null)
      setIsLoadingFamily(false)
    }
  }, [isAuthenticated, loadFamilies])

  const setActiveFamily = useCallback((family: Family): void => {
    sessionStorage.setItem(ACTIVE_FAMILY_KEY, String(family.id))
    setActiveFamilyState(family)
  }, [])

  const currentRole: UserRole | null = activeFamily?.my_role ?? null

  return (
    <FamilyContext.Provider
      value={{
        families,
        activeFamily,
        currentRole,
        isLoadingFamily,
        setActiveFamily,
        refreshFamilies: loadFamilies,
      }}
    >
      {children}
    </FamilyContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFamilyContext(): FamilyContextValue {
  const ctx = useContext(FamilyContext)
  if (!ctx) throw new Error('useFamilyContext must be used within <FamilyProvider>')
  return ctx
}
