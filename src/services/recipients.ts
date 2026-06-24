import { apiClient } from './apis/api'

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
  async getRecipients(id: string): Promise<Recipient[]> {
    // Backend returns array of usernames (strings)
    const usernames = await apiClient.get<string[]>(`/user/recipients/${id}`)
    
    // Convert usernames to Recipient objects
    return usernames.map(username => ({
      id: username,
      name: username,
      createdAt: new Date().toISOString()
    }))
  },

  async getRecipient(id: string, recipientUsername: string): Promise<Recipient> {
    return apiClient.get<Recipient>(`/user/${id}/recipient/${recipientUsername}`)
  },

  async addRecipient(): Promise<Recipient> {
    return apiClient.post<Recipient>('/user/add-recipient')
  },

  async deleteRecipient(id: string): Promise<void> {
    return apiClient.delete<void>(`/recipient/${id}`)
  },
}


