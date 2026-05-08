import apiClient from './axiosInstance';
import { Account, CreateAccountDto } from '../types/account.types';

export const accountApi = {
  createAccount: (data?: CreateAccountDto) =>
    apiClient.post<Account>('/account/create', data ?? {}),
};
