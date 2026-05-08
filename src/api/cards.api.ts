import apiClient from './axiosInstance';
import { VirtualCard, CreateMainCardDto, CreateTempCardDto } from '../types/card.types';

export const cardsApi = {
  createMainCard: (data: CreateMainCardDto) =>
    apiClient.post<VirtualCard>('/virtual-card/create-main', data),

  createTempCard: (data: CreateTempCardDto) =>
    apiClient.post<VirtualCard>('/virtual-card/create-temp', data),

  generateQrCode: (token: string) =>
    apiClient.post<{ qrData: string }>('/virtual-card/generate-qr-code', { token }),
};
