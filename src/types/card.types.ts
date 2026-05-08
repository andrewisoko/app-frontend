export type CardType = 'main' | 'temporary';

export interface VirtualCard {
  id: string;
  card_type: CardType;
  full_name: string;
  pan: string;
  account_number: number;
  CVC: string;
  expiry: string;
  expiry_time: string | null;
  billing_address: string;
  account_users: string[] | null;
  qr_token: string;
}

export interface CreateMainCardDto {
  accountId: string;
}

export interface CreateTempCardDto {
  accountId: string;
  expiry_time: string; // ISO datetime string
  account_users?: string[];
}
