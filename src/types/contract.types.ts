export type ContractType = 'one_time' | 'existing_user';
export type SplitAgreement = 'percentage' | 'amount';
export type ContractStatus = 'accepted' | 'declined' | 'failed' | 'pending';

export interface Contract {
  id: string;
  contract_type: ContractType;
  sender: string;
  receiver: string[];
  split_agreement: SplitAgreement;
  contract_status: ContractStatus;
  time_agreement: string; // "[startDate, endDate]" stored as string
  sender_percentage: number;
  receiver_percentage: number[];
  sender_amount: number;
  receiver_amount: number[];
  repayment_agreement: string | null;
  event_agreement: string | null;
  location_agreement: string | null;
}

export interface SendContractDto {
  sender: string;
  receiver: string[];
  contract_type: ContractType;
  split_agreement: SplitAgreement;
  time_agreement: [string, string]; // [start ISO, end ISO]
  sender_percentage?: number;
  receiver_percentage?: number[];
  sender_amount?: number;
  receiver_amount?: number[];
  repayment_agreement?: string;
  event_agreement?: string;
  location_agreement?: string;
}

export interface RespondContractDto {
  contractId: string;
  receiverId: string;
  accepted: boolean;
}
