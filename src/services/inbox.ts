import { apiClient } from './api'
import { Contract } from './contracts'
import { User } from './auth'

export interface ReceivedContract {
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
  async getReceivedContracts(): Promise<ReceivedContract[]> {
    return apiClient.get<ReceivedContract[]>('/inbox/contracts')
  },
  async getInbox(inboxId:string): Promise<ReceivedContract[]> {
    return apiClient.get<ReceivedContract[]>(`/inbox/${inboxId}`)
  },

  // async acceptContract(id: string): Promise<void> {
  //   return apiClient.post<void>(`/inbox/contract/${id}/accept`)
  // },

  // async declineContract(id: string): Promise<void> {
  //   return apiClient.post<void>(`/inbox/contract/${id}/decline`)
  // },

  async postInbox(contract: Contract, user: User): Promise<void> {
    return apiClient.post<void>('/inbox/post-inbox', {
      contract,
      user,
    })
  },
}
