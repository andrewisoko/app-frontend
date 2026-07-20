import { apiClient } from './apis/api'


export interface SignInData{
  name:string,
  surname:string,
  mobile_number:string,
  email:string
}

export interface QRcodeNewUser {
    contractId:string,
    decision: boolean,
    amount?:number,
    bank?:string,
}

export interface ContractForm{
    id?: string
    participants: number,
    contract_type:string,
    sender: string,
    receiver: string[],
    all_usernames:string[],
    split_agreement: string,
    contract_status: string,
    time_agreement: string[]
    sender_percentage: number | null;
    sender_amount: number | null;
    receiver_percentage: number[];
    receiver_amount: number[];
    repayment_agreement?:string,
    event_agreement?:string,
    location_agreement?:string,
} 




export interface Contract {
  id:string,
  participants: number,
  contract_type: string,
  transaction_type:string,
  sender: string
  receiver: string[]
  all_usernames:string[]
  contract_status?: string,
  sender_percentage: number | null
  sender_amount: number | null
  receiver_percentage: number[]
  receiver_amount: number[]
  split_agreement: string
  time_agreement: string[] | null
}

export const contractsService = {
  // async getContracts(): Promise<Contract[]> {
  //   return apiClient.get<Contract[]>('contract/contracts')
  // },

  async getContract(id: string): Promise<Contract> {
    return await apiClient.get<Contract>(`/contract/${id}`)
  },

  async createContract(data:Contract): Promise<ContractForm> {
    return await apiClient.post<ContractForm>('/contract/create-contract', data)
  },

  async sendContract(id:string): Promise<string> {
    return await apiClient.post<string>('/contract/send-contract',id)
  },
 
  async newAUserQRcode( data: QRcodeNewUser ):Promise<string>{
    return await apiClient.post<string>('/contract/qrcode-new-user',{data})
  }
         
}
