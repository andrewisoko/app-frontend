import { Contract } from './contract.types';

export interface Inbox {
  id: string;
  most_recent: Partial<Contract>[];
  history: Partial<Contract>[];
}

export interface RespondInboxDto {
  contractId: string;
  receiverIds: string;
  accepted: boolean;
  defaultUserId?: string;
}
