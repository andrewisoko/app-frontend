import { apiClient } from './apis/api'
import { Contract } from './contracts'
import { User } from './auth'

export interface ReceivedContract {
  id: string
  senderId: string
  senderName: string
  cardNumber: string
  expiryDate: string
  status: 'new' | 'accepted' | 'declined' | 'expired' | 'pending'
  receivedAt: string
  message?: string
}

export interface Inbox{
  id:string
  createdAt:Date;
  updatedAt:Date;
  most_recent:Partial<Contract>[];
  history: Partial<Contract>[];
  user: User;

}

export const inboxService = {

  // async getReceivedContracts(): Promise<ReceivedContract[]> {
  //   return apiClient.get<ReceivedContract[]>('/inbox/contracts')
  // },
  async getInbox(inboxId:string): Promise<Inbox> {
    return apiClient.get<Inbox>(`/inbox/${inboxId}`)
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
