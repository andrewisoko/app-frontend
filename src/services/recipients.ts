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

  async getRecipient(id: string, recipientUsername:string): Promise<Recipient> {
    return apiClient.get<Recipient>(`user/${id}/recipient/${recipientUsername}`)
  },

  async addRecipient(userNameRecipient: string): Promise<Recipient> {
    return apiClient.post<Recipient>('/user/add-recipients', userNameRecipient)
  },

  async deleteRecipient(id: string): Promise<void> {
    return apiClient.delete<void>(`/recipients/${id}`)
  },
}
