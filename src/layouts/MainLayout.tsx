import { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, CreditCard, Inbox, FileText, User } from 'lucide-react'
import { inboxService } from '@/services/inbox'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
  { path: '/app', icon: Home, label: 'Home' },
  { path: '/app/cards', icon: CreditCard, label: 'Cards' },
  { path: '/app/contracts', icon: FileText, label: 'Contracts' },
  { path: '/app/inbox', icon: Inbox, label: 'Inbox' },
  { path: '/app/profile', icon: User, label: 'Profile' },
]

export default function MainLayout() {
  const location = useLocation()
  const { user, userProfile } = useAuth()
  const [inboxCount, setInboxCount] = useState(0)

  useEffect(() => {
    // Extract inbox ID - handle both string and object
    let inboxId: string | undefined
    if (userProfile?.inbox) {
      if (typeof userProfile.inbox === 'string') {
        inboxId = userProfile.inbox
      } else if (typeof userProfile.inbox === 'object' && 'id' in userProfile.inbox) {
        inboxId = userProfile.inbox.id
      }
    }
    
    // Try inbox ID first, fallback to user ID
    const fetchId = inboxId || user?.id
    if (!fetchId) return
    
    inboxService.getInbox(fetchId)
      .then((inbox) => {
        // Count pending contracts in mostRecent
        const pendingCount = inbox.most_recent.filter((c) => c.contract_status === 'pending').length || 0
        setInboxCount(pendingCount)
      })
      .catch(() => setInboxCount(0))
  }, [userProfile?.inbox, user?.id])

  return (
    <div className="min-h-screen pb-20" style={{ background: 'linear-gradient(180deg, #140021 0%, #1B012B 100%)' }}>
      <main className="max-w-lg mx-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10" style={{ background: 'rgba(27,1,43,0.9)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-lg mx-auto flex justify-around items-center h-20 px-2">
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
                  className="flex flex-col items-center gap-1 transition-colors"
                  style={{ color: isActive ? '#B15CFF' : 'rgba(255,255,255,0.45)' }}
                >
                  <div className="relative">
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                    {item.path === '/app/inbox' && inboxCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {inboxCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-medium">{item.label}</span>
                </motion.div>

                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: '#B15CFF' }}
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
