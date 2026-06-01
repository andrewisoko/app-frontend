import { apiClient } from './api'

export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface UpdateProfileData {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  avatar?: string
}

export const userService = {
  async getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>('/user/profile')
  },

  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    return apiClient.patch<UserProfile>('/user/profile', data)
  },
}
