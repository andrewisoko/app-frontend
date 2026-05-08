import apiClient from './axiosInstance';
import { Contract, SendContractDto, RespondContractDto } from '../types/contract.types';

export const contractApi = {
  sendContract: (data: SendContractDto) =>
    apiClient.post<Contract>('/contract/send-contract', data),

  respondToContract: (data: RespondContractDto) =>
    apiClient.post('/contract/receiver-inbox-contract', data),
};
