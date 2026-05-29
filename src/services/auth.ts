import { apiClient } from './api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

interface RawLoginResponse {
  access_token: string
  refresh_token: string
}

function decodeTokenUser(token: string): User {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return {
      id: payload.sub ?? '',
      email: payload.email ?? '',
      firstName: payload.username ?? payload.firstName ?? '',
      lastName: payload.lastName ?? '',
    }
  } catch {
    return { id: '', email: '', firstName: '', lastName: '' }
  }
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const raw = await apiClient.post<RawLoginResponse>('/user/login', credentials)
    const user = decodeTokenUser(raw.access_token)
    return { token: raw.access_token, user }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const raw = await apiClient.post<RawLoginResponse>('/user/register', data)
    const user = decodeTokenUser(raw.access_token)
    return { token: raw.access_token, user }
  },

  getCurrentUser(): User | null {
    const token = this.getToken()
    if (!token) return null
    return decodeTokenUser(token)
  },

  logout(): void {
    localStorage.removeItem('token')
  },

  getToken(): string | null {
    return localStorage.getItem('token')
  },

  setToken(token: string): void {
    localStorage.setItem('token', token)
  },

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (!payload.exp) return false
      return Date.now() / 1000 > payload.exp
    } catch {
      return true
    }
  },
}
