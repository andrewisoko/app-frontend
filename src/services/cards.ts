import { apiClient } from './api'

export interface VirtualCard {
  id: string
  cardNumber: string
  cardholderName: string
  expiryDate: string
  cvv: string
  type: 'main' | 'temporary'
  status: 'active' | 'inactive' | 'expired'
  balance: number
  createdAt: string
}

export interface CreateCardRequest {
  type: 'temporary'
  expiryDays?: number
  limit?: number
}

export const cardsService = {
  async getCards(): Promise<VirtualCard[]> {
    return apiClient.get<VirtualCard[]>('/cards')
  },

  async getCard(id: string): Promise<VirtualCard> {
    return apiClient.get<VirtualCard>(`/cards/${id}`)
  },

  async createCard(data: CreateCardRequest): Promise<VirtualCard> {
    return apiClient.post<VirtualCard>('/cards', data)
  },

  async toggleCardStatus(id: string, status: 'active' | 'inactive'): Promise<VirtualCard> {
    return apiClient.patch<VirtualCard>(`/cards/${id}/status`, { status })
  },

  async deleteCard(id: string): Promise<void> {
    return apiClient.delete<void>(`/cards/${id}`)
  },
}
