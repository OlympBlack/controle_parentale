import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useFamilyContext } from '@/contexts/FamilyContext'
import type { UserRole } from '@/types'

interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: ReactNode
}

function AppLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
    </div>
  )
}

/**
 * Protects a route section by checking the current user's role within the active family.
 *
 * - If families are still loading  → shows a spinner
 * - If no active family            → redirects to /onboarding
 * - If role not in allowedRoles    → redirects to /dashboard (re-dispatch by DashboardRouter)
 * - Otherwise                      → renders children
 */
export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { currentRole, isLoadingFamily, activeFamily } = useFamilyContext()

  if (isLoadingFamily) return <AppLoader />

  if (!activeFamily) return <Navigate to="/onboarding" replace />

  if (!currentRole || !allowedRoles.includes(currentRole)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
