import { apiClient } from './api'

export interface Account {
  _id: string
  fullName: string
  accountNumber: number
  pan: string
  ledger_balance: number
  available_balance: number
  hold: number
  currency: string
  expiry: string
  status: string
  mainVirtualCard: string
  tempVirtualCard: string[]
  transactions: unknown[]
  ledgerEntries: unknown[]
  customer: string
  createdAt: string
  updatedAt: string
}

export interface FindAccountResponse {
  account: Account
  userName: string
}

export const accountsService = {
  async findAccount(username: string, accountId: string): Promise<FindAccountResponse> {
    return apiClient.post<FindAccountResponse>('/account/find-account', {
      userName: username,
      accountId,
    })
  },
}
