import apiClient from './axiosInstance';
import { LoginDto, RegisterDto, AuthTokens, User } from '../types/user.types';

export const authApi = {
  register: (data: RegisterDto) =>
    apiClient.post<User>('/user/register', data),

  login: (data: LoginDto) =>
    apiClient.post<AuthTokens>('/user/login', data),

  getUser: (id: string) =>
    apiClient.get<User>(`/user/${id}`),

  deleteUser: (id: string) =>
    apiClient.delete(`/user/${id}`),
};
