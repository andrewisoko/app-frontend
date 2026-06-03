import { apiClient } from './api'

export interface UserProfile {
  id: string
  role: string
  user_type: string
  name: string
  surname: string
  mobile_number: string
  user_name: string
  email: string
  accounts: string // JSON stringified array of account IDs
  recipients: unknown[]
  created_contract: unknown | null
  main_bank: string
  created_at: string
  updated_at: string
}

export interface UpdateProfileData {
  name?: string
  surname?: string
  mobileNumber?: string
  email?: string
  password:string
}

export const userService = {
  async getProfile(userId: string): Promise<UserProfile> {
    return apiClient.get<UserProfile>(`/user/${userId}`)
  },

  async updateProfile(userId: string, data: UpdateProfileData): Promise<UserProfile> {
    return apiClient.patch<UserProfile>(`/user/${userId}`, data)
  },
}
