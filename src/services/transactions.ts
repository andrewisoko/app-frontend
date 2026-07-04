import { apiClient } from './apis/api'
import { Contract } from './contracts';

export interface Transaction {

    id:string;
    type:string
    merchant:string;
    status:string;
    amount:number;
    timestamp:string
    currency:string;
    contract?: Contract;
}



export const transactionsService = {
  async getTransactions( account_id: string): Promise<any> {
    return apiClient.get<Transaction[]>(`/transactions/${account_id}`)
  },

  async getTransaction(id: string): Promise<Transaction> {
    return apiClient.get<Transaction>(`/transactions/transaction${id}`)
  },
}
