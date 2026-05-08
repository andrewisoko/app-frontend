export type Role = 'user' | 'admin';
export type UserType = 'default' | 'completed';

export interface User {
  id: string;
  role: Role;
  user_type: UserType;
  name: string;
  surname: string;
  mobile_number: string;
  user_name: string;
  email: string;
  accounts: string[];
  created_at: string;
  updated_at: string;
}

export interface RegisterDto {
  name: string;
  surname: string;
  email: string;
  mobile_number?: string;
  password: string;
  confirmPassword: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
