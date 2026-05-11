import { apiClient } from './api'

export interface Account {
  id: string
  accountNumber: string
  accountName: string
  balance: number
  currency: string
  type: 'checking' | 'savings'
  status: 'active' | 'inactive' | 'frozen'
  createdAt: string
}

export const accountsService = {
  async getAccounts(): Promise<Account[]> {
    return apiClient.get<Account[]>('/accounts')
  },

  async getAccount(id: string): Promise<Account> {
    return apiClient.get<Account>(`/accounts/${id}`)
  },

  async switchAccount(id: string): Promise<void> {
    return apiClient.post<void>(`/accounts/${id}/switch`)
  },
}
