import { apiClient } from './api'

export interface Contract {
  id: string
  title: string
  description: string
  status: 'draft' | 'pending' | 'active' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
  fields: ContractField[]
}

export interface ContractField {
  id: string
  name: string
  type: 'text' | 'number' | 'date' | 'select'
  label: string
  required: boolean
  value?: string
  options?: string[]
}

export interface CreateContractRequest {
  title: string
  description: string
  fields: Omit<ContractField, 'id'>[]
}

export const contractsService = {
  async getContracts(): Promise<Contract[]> {
    return apiClient.get<Contract[]>('/contracts')
  },

  async getContract(id: string): Promise<Contract> {
    return apiClient.get<Contract>(`/contracts/${id}`)
  },

  async createContract(data: CreateContractRequest): Promise<Contract> {
    return apiClient.post<Contract>('/contracts', data)
  },

  async updateContract(id: string, data: Partial<Contract>): Promise<Contract> {
    return apiClient.put<Contract>(`/contracts/${id}`, data)
  },

  async submitContract(id: string): Promise<Contract> {
    return apiClient.post<Contract>(`/contracts/${id}/submit`)
  },
}
