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

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', credentials)
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register', data)
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/me')
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
}
