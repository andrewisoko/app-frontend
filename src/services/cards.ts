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
  // async getCards(): Promise<VirtualCard[]> {
  //   return apiClient.get<VirtualCard[]>('/virtual-card')
  // },

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
