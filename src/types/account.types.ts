export type AccountStatus = 'active' | 'Inactive' | 'Suspended' | 'Closed' | 'Pending';

export interface Account {
  _id: string;
  accountNumber: number;
  fullName: string;
  pan: string;
  ledger_balance: number;
  available_balance: number;
  hold: number;
  currency: string;
  expiry: string;
  status: AccountStatus;
  mainVirtualCard: string;
  tempVirtualCard: string[];
  transactions: string[];
  customer: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountDto {
  username?: string; // Admin only; omit for regular user
}
