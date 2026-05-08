import React, { createContext, useContext, useState, useCallback } from 'react';
import { Contract, SendContractDto, RespondContractDto } from '../types/contract.types';
import { contractApi } from '../api/contract.api';

interface ContractState {
  contracts: Contract[];
  isLoading: boolean;
}

interface ContractContextValue extends ContractState {
  sendContract: (data: SendContractDto) => Promise<Contract>;
  respondToContract: (data: RespondContractDto) => Promise<void>;
  setContracts: (contracts: Contract[]) => void;
}

const ContractContext = createContext<ContractContextValue | undefined>(undefined);

export function ContractProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ContractState>({ contracts: [], isLoading: false });

  const sendContract = useCallback(async (data: SendContractDto): Promise<Contract> => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const res = await contractApi.sendContract(data);
      setState((s) => ({ contracts: [res.data, ...s.contracts], isLoading: false }));
      return res.data;
    } catch (e) {
      setState((s) => ({ ...s, isLoading: false }));
      throw e;
    }
  }, []);

  const respondToContract = useCallback(async (data: RespondContractDto): Promise<void> => {
    await contractApi.respondToContract(data);
    setState((s) => ({
      ...s,
      contracts: s.contracts.map((c) =>
        c.id === data.contractId
          ? { ...c, contract_status: data.accepted ? 'accepted' : 'declined' }
          : c,
      ),
    }));
  }, []);

  const setContracts = useCallback((contracts: Contract[]) => {
    setState((s) => ({ ...s, contracts }));
  }, []);

  return (
    <ContractContext.Provider value={{ ...state, sendContract, respondToContract, setContracts }}>
      {children}
    </ContractContext.Provider>
  );
}

export function useContracts(): ContractContextValue {
  const ctx = useContext(ContractContext);
  if (!ctx) throw new Error('useContracts must be used inside ContractProvider');
  return ctx;
}
