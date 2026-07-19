import { useFamilyContext } from '@/contexts/FamilyContext'
import type { UserRole } from '@/types'

interface UseRoleReturn {
  currentRole: UserRole | null
  isAdmin: boolean
  isGestionnaire: boolean
  isObservateur: boolean
  can: (role: UserRole) => boolean
  canAny: (roles: UserRole[]) => boolean
}

/**
 * Convenience hook to check the current user's role within the active family.
 * Must be used inside a component rendered within <FamilyProvider>.
 */
export function useRole(): UseRoleReturn {
  const { currentRole } = useFamilyContext()

  return {
    currentRole,
    isAdmin: currentRole === 'admin',
    isGestionnaire: currentRole === 'gestionnaire',
    isObservateur: currentRole === 'observateur',
    can: (role) => currentRole === role,
    canAny: (roles) => currentRole !== null && roles.includes(currentRole),
  }
}
