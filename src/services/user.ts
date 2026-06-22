import { apiClient } from './api'
import { Contract } from './contracts'


export interface UserProfile {
  id: string
  role: string
  user_type: string
  name: string
  surname: string
  mobile_number: string
  user_name: string
  email: string
  account: string 
  inbox: string | { id: string } // Can be either ID string or object with id
  recipients: string[]
  created_contract:  Contract[]
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
  async getProfileByUsername(userId: string): Promise<UserProfile> {
    return apiClient.get<UserProfile>(`/user/${userId}`)
  },

  async updateProfile(userId: string, data: UpdateProfileData): Promise<UserProfile> {
    return apiClient.patch<UserProfile>(`/user/${userId}`, data)
  },
}
