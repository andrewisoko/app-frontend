import { paymentDraft } from "./apis/PaymentDraftApi"

export type DraftStatus =
  | 'AWAITING_CARD_SCAN'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'EXPIRE'

export interface PaymentDraft {

    id: string;
    terminalId: string;
    amount: number;
    currency: string;
    status: DraftStatus;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    cardToken?: string;
}

export interface CreateDraft {
    terminalId:string,
    amount:number,
    currency:string
}

export interface AttachCard {
    id: string,
    cardToken: string

}

export const terminalService = {
  async createTerminal(data: CreateDraft): Promise<PaymentDraft> {
    const response = await paymentDraft.post<PaymentDraft>('/create', data);
    return response.data;
  },
  async attachCard(data:AttachCard):Promise<PaymentDraft>{
    const response = await paymentDraft.post<PaymentDraft>('attach-card',data)
        return response.data
  },
async getDraft(id: string): Promise<PaymentDraft> {
  const response = await paymentDraft.get<PaymentDraft>(`${id}`)
  return response.data
}
};
