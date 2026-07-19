import { Navigate } from 'react-router-dom'
import { useFamilyContext } from '@/contexts/FamilyContext'

function AppLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
    </div>
  )
}

/**
 * Entry point for /dashboard.
 * Reads the current role from FamilyContext and redirects to the correct role dashboard.
 *
 * Flow:
 *  isLoadingFamily → spinner
 *  no activeFamily → /onboarding (create first family)
 *  role = admin    → /dashboard/admin
 *  role = gestionnaire → /dashboard/gestionnaire
 *  role = observateur  → /dashboard/observateur
 *  unknown state   → /login (safety net)
 */
export function DashboardRouter() {
  const { currentRole, isLoadingFamily, activeFamily } = useFamilyContext()

  if (isLoadingFamily) return <AppLoader />

  if (!activeFamily) return <Navigate to="/onboarding" replace />

  switch (currentRole) {
    case 'admin':        return <Navigate to="/dashboard/admin" replace />
    case 'gestionnaire': return <Navigate to="/dashboard/gestionnaire" replace />
    case 'observateur':  return <Navigate to="/dashboard/observateur" replace />
    default:             return <Navigate to="/onboarding" replace />
  }
}
