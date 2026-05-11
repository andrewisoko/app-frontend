import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, CreditCard, Inbox, FileText, User } from 'lucide-react'

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/cards', icon: CreditCard, label: 'Cards' },
  { path: '/inbox', icon: Inbox, label: 'Inbox' },
  { path: '/contracts', icon: FileText, label: 'Contracts' },
  { path: '/profile', icon: User, label: 'Profile' },
]

export default function MainLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="max-w-lg mx-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-lg mx-auto flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center flex-1 h-full relative"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`flex flex-col items-center gap-1 ${
                    isActive ? 'text-primary-600' : 'text-gray-500'
                  }`}
                >
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-xs font-medium">{item.label}</span>
                </motion.div>

                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-primary"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
