import { apiClient } from './apis/api'
import { ContractForm } from './contracts'
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
  most_recent:Partial<ContractForm>[];
  history: Partial<ContractForm>[];
  user: User;

}

export const inboxService = {

  // async getReceivedContracts(): Promise<ReceivedContract[]> {
  //   return apiClient.get<ReceivedContract[]>('/inbox/contracts')
  // },
  async getInbox(inboxId:string): Promise<Inbox> {
    return apiClient.get<Inbox>(`/inbox/${inboxId}`)
  },

  async postInbox(contract: ContractForm, user: User): Promise<void> {
    return apiClient.post<void>('/inbox/post-inbox', {
      contract,
      user,
    })
  },

  async contractReceivedOnInbox(contractId: string, receiverAccountId: string, decision: boolean): Promise<any> {
    return apiClient.post('/inbox/receiver-inbox-contract', {
      contractId,
      receiverAccountId,
      accepted: decision,
    })
  },
}
