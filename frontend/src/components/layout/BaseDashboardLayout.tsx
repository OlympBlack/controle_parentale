import { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Menu, X, ChevronDown, Settings } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import safekidLogo from '@/assets/safekid.png'
import { useAuth } from '@/contexts/AuthContext'
import { useFamilyContext } from '@/contexts/FamilyContext'

export interface NavItem {
  label: string
  icon: LucideIcon
  path: string
}

interface BaseDashboardLayoutProps {
  navItems: NavItem[]
  settingsPath?: string
  roleLabel: string
  roleBadgeClass: string
}

function SidebarNav({
  items,
  settingsPath,
  onLinkClick,
}: {
  items: NavItem[]
  settingsPath?: string
  onLinkClick?: () => void
}) {
  const location = useLocation()

  return (
    <>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          const active =
            location.pathname === item.path ||
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onLinkClick}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {settingsPath && (
        <div className="border-t border-gray-200 p-3">
          <Link
            to={settingsPath}
            onClick={onLinkClick}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <Settings className="h-5 w-5" />
            Paramètres
          </Link>
        </div>
      )}
    </>
  )
}

export function BaseDashboardLayout({
  navItems,
  settingsPath,
  roleLabel,
  roleBadgeClass,
}: BaseDashboardLayoutProps) {
  const { user, logout } = useAuth()
  const { activeFamily } = useFamilyContext()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar — desktop */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <img src={safekidLogo} alt="Safekid" className="h-8 w-auto" />
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleBadgeClass}`}>
            {roleLabel}
          </span>
        </div>

        {activeFamily && (
          <div className="border-b border-gray-100 px-4 py-2.5">
            <p className="truncate text-xs font-medium text-gray-500">Famille</p>
            <p className="truncate text-sm font-semibold text-gray-900">{activeFamily.name}</p>
          </div>
        )}

        <SidebarNav items={navItems} settingsPath={settingsPath} />
      </aside>

      {/* Sidebar — mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-gray-200 bg-white"
            >
              <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
                <img src={safekidLogo} alt="Safekid" className="h-8 w-auto" />
                <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {activeFamily && (
                <div className="border-b border-gray-100 px-4 py-2.5">
                  <p className="truncate text-xs font-medium text-gray-500">Famille</p>
                  <p className="truncate text-sm font-semibold text-gray-900">{activeFamily.name}</p>
                </div>
              )}

              <SidebarNav
                items={navItems}
                settingsPath={settingsPath}
                onLinkClick={() => setSidebarOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 items-center justify-end gap-3">
            <div className="relative">
              <button
                onClick={() => setProfileOpen((s) => !s)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-100"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase() ?? '?'}
                </div>
                <span className="hidden text-sm font-medium text-gray-700 sm:block">
                  {user?.name}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full z-20 mt-2 w-52 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
                    >
                      <div className="border-b border-gray-100 px-4 py-2">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="truncate text-xs text-gray-500">{user?.email}</p>
                        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${roleBadgeClass}`}>
                          {roleLabel}
                        </span>
                      </div>
                      {settingsPath && (
                        <Link
                          to={settingsPath}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                        >
                          <Settings className="h-4 w-4" />
                          Paramètres
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Se déconnecter
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
