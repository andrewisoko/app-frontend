import { apiClient } from './api'

export interface VirtualCard {
  id: string
  card_number: string
  cardholder_name: string
  expiry: string
  cvv: string
  card_type: 'main' | 'temporary'
  status: 'active' | 'inactive' | 'expired'
  balance?: number
  created_at: string
  account_number: string
}

export interface CreateMainCardRequest {
        fullName:string,
        pan:string,
        accountNumber:number
        id:string,
}

export interface CreateTempCardRequest {
        fullName:string,
        expiryTime:string,
        id:string,
        accountNumber:number,
        expiry:string,
        accountUsers:string[]
}

export const cardsService = {
  async getCardsByAccountNumber(accountNumber: string): Promise<VirtualCard[]> {
    return apiClient.get<VirtualCard[]>(`/virtual-card/account/${accountNumber}`)
  },

  async getVirtualCard(id: string): Promise<VirtualCard> {
    return apiClient.get<VirtualCard>(`/virtual-card/${id}`)
  },

  async createMainVirtualCard(data: CreateMainCardRequest): Promise<VirtualCard> {
    return apiClient.post<VirtualCard>('/virtual-card/create-main', data)
  },
  async createTempVirtualCard(data: CreateTempCardRequest): Promise<VirtualCard> {
    return apiClient.post<VirtualCard>('/virtual-card/create-temp', data)
  },

  async generateQRcode( token:string ){
    return apiClient.post<VirtualCard>('/virtual-card/generate-qr-code', token)
  },

  async toggleCardStatus(id: string, status: 'active' | 'inactive'): Promise<VirtualCard> {
    return apiClient.patch<VirtualCard>(`/virtual-card/${id}/status`, { status })
  },

  async deleteCard(id: string): Promise<void> {
    return apiClient.delete<void>(`/cards/${id}`)
  },
}
