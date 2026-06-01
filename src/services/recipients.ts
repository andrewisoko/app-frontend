import { apiClient } from './api'

export interface Recipient {
  id: string
  name: string
  email?: string
  initials?: string
  avatarColor?: string
  phoneNumber?: string
  createdAt: string
}

export const recipientsService = {
  async getRecipients(): Promise<Recipient[]> {
    return apiClient.get<Recipient[]>('/recipients')
  },

  async getRecipient(id: string): Promise<Recipient> {
    return apiClient.get<Recipient>(`/recipients/${id}`)
  },

  async addRecipient(data: Omit<Recipient, 'id' | 'createdAt'>): Promise<Recipient> {
    return apiClient.post<Recipient>('/recipients', data)
  },

  async deleteRecipient(id: string): Promise<void> {
    return apiClient.delete<void>(`/recipients/${id}`)
  },
}
