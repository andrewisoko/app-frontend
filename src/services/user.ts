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
  async getProfile(userId: string): Promise<UserProfile> {
    return apiClient.get<UserProfile>(`/user/${userId}`)
  },

  async updateProfile(userId: string, data: UpdateProfileData): Promise<UserProfile> {
    return apiClient.patch<UserProfile>(`/user/${userId}`, data)
  },
}
