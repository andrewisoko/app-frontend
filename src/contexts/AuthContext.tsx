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
    const token = authService.getToken()
    if (token) {
      if (authService.isTokenExpired(token)) {
        authService.logout()
      } else {
        const currentUser = authService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
        } else {
          authService.logout()
        }
      }
    }
    setIsLoading(false)
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
