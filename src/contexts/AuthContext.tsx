import { createContext, useState, useEffect, ReactNode } from 'react'
import { authService, User } from '@/services/auth'
import { userService, UserProfile } from '@/services/user'

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user: User) => Promise<void>
  qrCodeSignIn: (token: string, user: User) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initialize = async () => {
      const token = authService.getToken()
      if (token) {
        if (authService.isTokenExpired(token)) {
          authService.logout()
        } else {
          const currentUser = authService.getCurrentUser()
          if (currentUser) {
            setUser(currentUser)
            try {
              const profile = await userService.getProfile(currentUser.id)
              setUserProfile(profile)
            } catch {
              // Profile fetch failed — user remains authenticated via token
            }
          } else {
            authService.logout()
          }
        }
      }
      setIsLoading(false)
    }
    initialize()
  }, [])

  const login = async (token: string, userData: User) => {
    authService.setToken(token)
    setUser(userData)
    try {
      const profile = await userService.getProfile(userData.id)
      setUserProfile(profile)
    } catch {
      // Profile fetch failed — proceed without profile
    }
  }

  const qrCodeSignIn = async (token: string, userData: User) => {
    authService.setToken(token)
    setUser(userData)
    try {
      const profile = await userService.getProfile(userData.id)
      setUserProfile(profile)
    } catch {
      // Profile fetch failed — proceed without profile
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setUserProfile(null)
  }

  const updateUser = (userData: User) => {
    setUser(userData)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isAuthenticated: !!user,
        isLoading,
        login,
        qrCodeSignIn,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
