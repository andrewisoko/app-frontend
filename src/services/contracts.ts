import { apiClient } from './api'


export interface SignInData{

  name:string,
  surname:string,
  mobile_number:string,
  email:string
}


export interface Contract{
    id?: string
    title?: string
    description?: string
    status?: string
    fields?: any[]
    updatedAt?: string
    sender: string,
    receiver: string[],
    split_agreement: string,
    contractStatus: string,
    time_agreement:Date[]
    sender_percentage: number;
    sender_amount: number;
    receiver_percentage: number[];
    receiver_amount: number[];
    repayment_agreement:string,
    event_agreement:string,
    location_agreement:string,
} 



export interface CreateContractRequest {
  contract: Partial<Contract>
  senderAccountId: string
  receiverAccountIds: string[]
}

export interface SendContractRequest extends Partial<SignInData> {
  sender: string
  receiver: string[]
  split_agreement: string
  contractStatus: string
  time_agreement: Date[]
  sender_percentage: number
  sender_amount: number
  receiver_percentage: number[]
  receiver_amount: number[]
  repayment_agreement: string
  event_agreement: string
  location_agreement: string
}

export const contractsService = {
  async getContracts(): Promise<Contract[]> {
    return apiClient.get<Contract[]>('/contracts')
  },

  async getContract(id: string): Promise<Contract> {
    return apiClient.get<Contract>(`/contracts/${id}`)
  },

  async createContract(data: CreateContractRequest): Promise<Contract> {
    return apiClient.post<Contract>('/contracts/create-contract', data)
  },

  async sendContract(data: SendContractRequest): Promise<string> {
    return apiClient.post<string>('/contracts/send-contract', data)
  },

  async contractReceivedOnInbox(contractId: string, receiverId: string, accepted: boolean): Promise<any> {
    return apiClient.post('/inbox/receiver-inbox-contract', {
      contractId,
      receiverId,
      accepted,
    })
  },

}
