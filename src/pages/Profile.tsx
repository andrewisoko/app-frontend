import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import PageTransition from '@/components/animations/PageTransition'
import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

// Generate initials from name
const getInitials = (name: string): string => {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

interface MenuItem {
  label: string
  action: () => void
  isSignOut?: boolean
}

export default function Profile() {
  const { user, userProfile, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems: MenuItem[] = [
    {
      label: 'Account Settings',
      action: () => {},
    },
    {
      label: 'Notifications',
      action: () => {},
    },
    {
      label: 'Security & Privacy',
      action: () => {},
    },
    {
      label: 'Payment Methods',
      action: () => {},
    },
    {
      label: 'Help & Support',
      action: () => {},
    },
    {
      label: 'Sign Out',
      action: handleLogout,
      isSignOut: true,
    },
  ]

  const userName = userProfile?.user_name || user?.username || 'User'
  const userEmail = userProfile?.email || user?.email || 'user@email.com'
  const initials = getInitials(userName)

  return (
    <PageTransition>
      <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(180deg, #140021 0%, #1B012B 100%)' }}>
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <h1 className="text-xl font-semibold text-white">Profile</h1>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-center px-6 pt-4 pb-8">
          {/* Avatar */}
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-4"
            style={{ background: 'linear-gradient(135deg, #8A00FF 0%, #5B4DFF 100%)' }}
          >
            {initials}
          </div>

          {/* User Info */}
          <h2 className="text-xl font-bold text-white mb-1">
            {userName}
          </h2>
          <p className="text-white/60 text-sm">
            {userEmail}
          </p>
        </div>

        {/* Menu Items */}
        <div className="px-4">
          <div className="rounded-3xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            {menuItems.map((item, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.98 }}
                onClick={item.action}
                className={`w-full flex items-center justify-between px-5 py-4 transition-colors border-b border-white/[0.05] last:border-b-0 ${
                  item.isSignOut ? '' : 'hover:bg-white/[0.02]'
                }`}
              >
                <span 
                  className={`font-medium ${
                    item.isSignOut ? 'text-red-500' : 'text-white'
                  }`}
                >
                  {item.label}
                </span>
                {!item.isSignOut && (
                  <ChevronRight size={20} className="text-white/40" />
                )}
              </motion.button>
            ))}
          </div>
        </div>

      </div>
    </PageTransition>
  )
}
