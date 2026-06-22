import { apiClient } from './api'

export interface VirtualCard {
  id: string
  card_type: 'main' | 'temporary'
  pan: string
  account_number: string
  CVC: string
  expiry: string
  cardholder_name: string
  billing_address:string
  POS_token:string
  status: 'active' | 'inactive' | 'expired'
  created_at: string
  updated_at: string
  account_users?:string[]
  expiry_time?:string
  balance?: number
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
  // async getCardsByAccountId(accountId: string): Promise<VirtualCard[]> {
  //   return apiClient.get<VirtualCard[]>(`/virtual-card/account/${accountId}`)
  // },
    async getAllCards(accountId: string): Promise<VirtualCard[]> {
    return apiClient.post<VirtualCard[]>(`/virtual-card/bulk`, { accountId });
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
    return apiClient.post<string>('/virtual-card/generate-qr-code',{token})
  },

  async toggleCardStatus(id: string, status: 'active' | 'inactive'): Promise<VirtualCard> {
    return apiClient.patch<VirtualCard>(`/virtual-card/${id}/status`, { status })
  },

  async deleteCard(id: string): Promise<void> {
    return apiClient.delete<void>(`/cards/${id}`)
  },
}
