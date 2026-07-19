import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { FamilyProvider } from '@/contexts/FamilyContext'
import { RoleGuard } from '@/guards/RoleGuard'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { DashboardRouter } from '@/pages/dashboard/DashboardRouter'
import { OnboardingPage } from '@/pages/OnboardingPage'
import { InvitationPage } from '@/pages/InvitationPage'
import { AdminLayout } from '@/pages/dashboard/admin/AdminLayout'
import { AdminDashboard } from '@/pages/dashboard/admin/AdminDashboard'
import { AdminFamilyPage } from '@/pages/dashboard/admin/AdminFamilyPage'
import { GestionnaireLayout } from '@/pages/dashboard/gestionnaire/GestionnaireLayout'
import { GestionnaireDashboard } from '@/pages/dashboard/gestionnaire/GestionnaireDashboard'
import { ObservateurLayout } from '@/pages/dashboard/observateur/ObservateurLayout'
import { ObservateurDashboard } from '@/pages/dashboard/observateur/ObservateurDashboard'
import { CguPage } from '@/pages/legal/CguPage'
import { PrivacyPage } from '@/pages/legal/PrivacyPage'
import type { ReactNode } from 'react'

function AppLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
    </div>
  )
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth()
  if (isInitializing) return <AppLoader />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth()
  if (isInitializing) return <AppLoader />
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function DashboardShell() {
  return (
    <ProtectedRoute>
      <FamilyProvider>
        <Outlet />
      </FamilyProvider>
    </ProtectedRoute>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login"    element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
          <Route path="/cgu"            element={<CguPage />} />
          <Route path="/confidentialite" element={<PrivacyPage />} />

          {/* Dashboard — protected + family context */}
          <Route path="/dashboard" element={<DashboardShell />}>
            {/* /dashboard → redirected to correct role by DashboardRouter */}
            <Route index element={<DashboardRouter />} />

            {/* Admin */}
            <Route
              path="admin"
              element={<RoleGuard allowedRoles={['admin']}><AdminLayout /></RoleGuard>}
            >
              <Route index element={<AdminDashboard />} />
              <Route path="family" element={<AdminFamilyPage />} />
            </Route>

            {/* Gestionnaire */}
            <Route
              path="gestionnaire"
              element={<RoleGuard allowedRoles={['gestionnaire']}><GestionnaireLayout /></RoleGuard>}
            >
              <Route index element={<GestionnaireDashboard />} />
            </Route>

            {/* Observateur */}
            <Route
              path="observateur"
              element={<RoleGuard allowedRoles={['observateur']}><ObservateurLayout /></RoleGuard>}
            >
              <Route index element={<ObservateurDashboard />} />
            </Route>
          </Route>

          {/* Onboarding (no family yet) */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <FamilyProvider>
                  <OnboardingPage />
                </FamilyProvider>
              </ProtectedRoute>
            }
          />

          <Route path="/invitation/:token" element={<InvitationPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
