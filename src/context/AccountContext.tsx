import React, { createContext, useContext, useState, useCallback } from 'react';
import { Account } from '../types/account.types';
import { accountApi } from '../api/account.api';

interface AccountState {
  account: Account | null;
  isLoading: boolean;
}

interface AccountContextValue extends AccountState {
  createAccount: () => Promise<void>;
  setAccount: (account: Account | null) => void;
}

const AccountContext = createContext<AccountContextValue | undefined>(undefined);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AccountState>({ account: null, isLoading: false });

  const createAccount = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const res = await accountApi.createAccount();
      setState({ account: res.data, isLoading: false });
    } catch {
      setState((s) => ({ ...s, isLoading: false }));
      throw new Error('Failed to create account');
    }
  }, []);

  const setAccount = useCallback((account: Account | null) => {
    setState((s) => ({ ...s, account }));
  }, []);

  return (
    <AccountContext.Provider value={{ ...state, createAccount, setAccount }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount(): AccountContextValue {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be used inside AccountProvider');
  return ctx;
}
