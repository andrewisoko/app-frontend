import { apiClient } from './apis/api'

export interface Transaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  currency: string
  description: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
  merchantName?: string
  category?: string
}

export interface TransactionFilters {
  startDate?: string
  endDate?: string
  type?: 'credit' | 'debit'
  minAmount?: number
  maxAmount?: number
}

export const transactionsService = {
  async getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
    return apiClient.get<Transaction[]>('/transactions', { params: filters })
  },

  async getTransaction(id: string): Promise<Transaction> {
    return apiClient.get<Transaction>(`/transactions/${id}`)
  },
}
