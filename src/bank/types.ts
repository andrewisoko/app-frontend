export interface Bank {
  id: string;
  name: string;
  fullName: string;
  brandColor: string;
  textColor: string;
  logoBg: string;
  hqLocation: string;
  founded: number;
  openBankingStatus: 'Active' | 'Optimized' | 'Maintenance';
}

export interface OnboardingState {
  amount: string;
  selectedBankId: string | null;
  status: 'input' | 'submitting' | 'success';
}

export interface SimulationLog {
  id: string;
  timestamp: string;
  event: string;
  type: 'info' | 'success' | 'warning';
}
