import { apiClient } from './api'

export interface ReceivedCard {
  id: string
  senderId: string
  senderName: string
  cardNumber: string
  expiryDate: string
  status: 'new' | 'accepted' | 'declined' | 'expired'
  receivedAt: string
  message?: string
}

export const inboxService = {
  async getReceivedCards(): Promise<ReceivedCard[]> {
    return apiClient.get<ReceivedCard[]>('/inbox/cards')
  },

  async acceptCard(id: string): Promise<void> {
    return apiClient.post<void>(`/inbox/cards/${id}/accept`)
  },

  async declineCard(id: string): Promise<void> {
    return apiClient.post<void>(`/inbox/cards/${id}/decline`)
  },
}
