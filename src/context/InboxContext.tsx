import React, { createContext, useContext, useState, useCallback } from 'react';
import { Inbox, RespondInboxDto } from '../types/inbox.types';
import { Contract } from '../types/contract.types';
import { inboxApi } from '../api/inbox.api';

interface InboxState {
  recent: Partial<Contract>[];
  history: Partial<Contract>[];
  unreadCount: number;
  isLoading: boolean;
}

interface InboxContextValue extends InboxState {
  setInbox: (inbox: Inbox) => void;
  respondToInboxContract: (data: RespondInboxDto) => Promise<void>;
  clearUnread: () => void;
}

const InboxContext = createContext<InboxContextValue | undefined>(undefined);

export function InboxProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<InboxState>({
    recent: [],
    history: [],
    unreadCount: 0,
    isLoading: false,
  });

  const setInbox = useCallback((inbox: Inbox) => {
    setState((s) => ({
      ...s,
      recent: inbox.most_recent,
      history: inbox.history,
      unreadCount: inbox.most_recent.filter((c) => c.contract_status === 'pending').length,
    }));
  }, []);

  const respondToInboxContract = useCallback(async (data: RespondInboxDto): Promise<void> => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      await inboxApi.respondToInboxContract(data);
      setState((s) => ({
        ...s,
        recent: s.recent.map((c) =>
          c.id === data.contractId
            ? { ...c, contract_status: data.accepted ? 'accepted' : 'declined' }
            : c,
        ),
        isLoading: false,
      }));
    } catch (e) {
      setState((s) => ({ ...s, isLoading: false }));
      throw e;
    }
  }, []);

  const clearUnread = useCallback(() => {
    setState((s) => ({ ...s, unreadCount: 0 }));
  }, []);

  return (
    <InboxContext.Provider value={{ ...state, setInbox, respondToInboxContract, clearUnread }}>
      {children}
    </InboxContext.Provider>
  );
}

export function useInbox(): InboxContextValue {
  const ctx = useContext(InboxContext);
  if (!ctx) throw new Error('useInbox must be used inside InboxProvider');
  return ctx;
}
