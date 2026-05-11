import { createContext, useState, useEffect, ReactNode } from 'react'
import { authService, User } from '@/services/auth'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => void
  updateUser: (user: User) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken()
      
      if (token) {
        try {
          const currentUser = await authService.getCurrentUser()
          setUser(currentUser)
        } catch (error) {
          authService.logout()
        }
      }
      
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = (token: string, userData: User) => {
    authService.setToken(token)
    setUser(userData)
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const updateUser = (userData: User) => {
    setUser(userData)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
