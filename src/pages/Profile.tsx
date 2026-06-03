import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import PageTransition from '@/components/animations/PageTransition'
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  Bell,
  Globe,
  ChevronRight,
  LogOut,
  Settings,
} from 'lucide-react'
import { motion } from 'framer-motion'

interface SettingItem {
  icon: React.ReactNode
  label: string
  value?: string
  action: () => void
}

export default function Profile() {
  const { user, userProfile, isLoading, logout } = useAuth()
  const navigate = useNavigate()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const personalSettings: SettingItem[] = [
    {
      icon: <Mail size={20} />,
      label: 'Email',
      value: userProfile?.email || user?.email,
      action: () => {},
    },
    {
      icon: <Phone size={20} />,
      label: 'Phone Number',
      value: userProfile?.mobile_number || 'Not set',
      action: () => {},
    },
  ]

  const securitySettings: SettingItem[] = [
    {
      icon: <Shield size={20} />,
      label: 'Password',
      value: '••••••••',
      action: () => {},
    },
    {
      icon: <Shield size={20} />,
      label: 'Two-Factor Authentication',
      value: 'Enabled',
      action: () => {},
    },
  ]

  const appSettings: SettingItem[] = [
    {
      icon: <Bell size={20} />,
      label: 'Notifications',
      value: 'On',
      action: () => {},
    },
    {
      icon: <Globe size={20} />,
      label: 'Language',
      value: 'English',
      action: () => {},
    },
  ]

  return (
    <PageTransition>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-200">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account settings</p>
        </div>

        {/* Profile Card */}
        <Card hover={false} className="bg-gradient-primary text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <UserIcon size={40} />
            </div>
            <div className="flex-1">
              {isLoading ? (
                <>
                  <div className="w-32 h-8 bg-white/20 rounded animate-pulse mb-2"></div>
                  <div className="w-40 h-5 bg-white/20 rounded animate-pulse"></div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-1">
                    {userProfile?.name} {userProfile?.surname}
                  </h2>
                  <p className="text-white/80">{userProfile?.email || user?.email}</p>
                  <button className="mt-3 text-sm bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                    <Settings size={14} />
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Personal Information */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-3 px-2">Personal Information</h3>
          <Card hover={false} className="p-0 overflow-hidden">
            {personalSettings.map((item, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.98 }}
                onClick={item.action}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0 border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-600">{item.icon}</div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{item.label}</div>
                    {item.value && (
                      <div className="text-sm text-gray-600">{item.value}</div>
                    )}
                  </div>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </motion.button>
            ))}
          </Card>
        </div>

        {/* Security */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-3 px-2">Security</h3>
          <Card hover={false} className="p-0 overflow-hidden">
            {securitySettings.map((item, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.98 }}
                onClick={item.action}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0 border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-600">{item.icon}</div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{item.label}</div>
                    {item.value && (
                      <div className="text-sm text-gray-600">{item.value}</div>
                    )}
                  </div>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </motion.button>
            ))}
          </Card>
        </div>

        {/* App Settings */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-3 px-2">App Settings</h3>
          <Card hover={false} className="p-0 overflow-hidden">
            {appSettings.map((item, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.98 }}
                onClick={item.action}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0 border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-600">{item.icon}</div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{item.label}</div>
                    {item.value && (
                      <div className="text-sm text-gray-600">{item.value}</div>
                    )}
                  </div>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </motion.button>
            ))}
          </Card>
        </div>

        {/* Logout */}
        <Card hover={false} className="p-0 overflow-hidden">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 p-4 hover:bg-red-50 transition-colors text-red-600"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </motion.button>
        </Card>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Logout?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to logout from your account?
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* App Info */}
        <div className="text-center text-sm text-gray-500 pt-4">
          <p>TransAct v1.0.0</p>
          <p className="mt-1">© 2026 TransAct. All rights reserved.</p>
        </div>
      </div>
    </PageTransition>
  )
}
