import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, LoginDto, RegisterDto, AuthTokens } from '../types/user.types';
import { authApi } from '../api/auth.api';
import { saveTokens, getAccessToken, clearTokens } from '../utils/tokenStorage';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // On mount, check for stored token and restore session
  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessToken();
        if (token) {
          setState((s) => ({ ...s, accessToken: token, isAuthenticated: true, isLoading: false }));
        } else {
          setState((s) => ({ ...s, isLoading: false }));
        }
      } catch {
        setState((s) => ({ ...s, isLoading: false }));
      }
    })();
  }, []);

  const login = useCallback(async (data: LoginDto) => {
    const res = await authApi.login(data);
    const tokens: AuthTokens = res.data;
    await saveTokens(tokens.accessToken, tokens.refreshToken);
    setState((s) => ({
      ...s,
      accessToken: tokens.accessToken,
      isAuthenticated: true,
    }));
  }, []);

  const register = useCallback(async (data: RegisterDto) => {
    await authApi.register(data);
    // After registration, immediately log in
    await login({ email: data.email, password: data.password });
  }, [login]);

  const logout = useCallback(async () => {
    await clearTokens();
    setState({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
  }, []);

  const deleteAccount = useCallback(async () => {
    if (state.user?.id) {
      await authApi.deleteUser(state.user.id);
    }
    await logout();
  }, [state.user, logout]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
