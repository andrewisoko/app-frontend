import React, { createContext, useContext, useState, useCallback } from 'react';
import { VirtualCard, CreateMainCardDto, CreateTempCardDto } from '../types/card.types';
import { cardsApi } from '../api/cards.api';

interface CardState {
  mainCard: VirtualCard | null;
  tempCards: VirtualCard[];
  isLoading: boolean;
}

interface CardContextValue extends CardState {
  createMainCard: (data: CreateMainCardDto) => Promise<VirtualCard>;
  createTempCard: (data: CreateTempCardDto) => Promise<VirtualCard>;
  generateQr: (token: string) => Promise<string>;
  setCards: (main: VirtualCard | null, temps: VirtualCard[]) => void;
  reorderTempCards: (cards: VirtualCard[]) => void;
}

const CardContext = createContext<CardContextValue | undefined>(undefined);

export function CardProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CardState>({
    mainCard: null,
    tempCards: [],
    isLoading: false,
  });

  const createMainCard = useCallback(async (data: CreateMainCardDto): Promise<VirtualCard> => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const res = await cardsApi.createMainCard(data);
      setState((s) => ({ ...s, mainCard: res.data, isLoading: false }));
      return res.data;
    } catch (e) {
      setState((s) => ({ ...s, isLoading: false }));
      throw e;
    }
  }, []);

  const createTempCard = useCallback(async (data: CreateTempCardDto): Promise<VirtualCard> => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const res = await cardsApi.createTempCard(data);
      setState((s) => ({ ...s, tempCards: [...s.tempCards, res.data], isLoading: false }));
      return res.data;
    } catch (e) {
      setState((s) => ({ ...s, isLoading: false }));
      throw e;
    }
  }, []);

  const generateQr = useCallback(async (token: string): Promise<string> => {
    const res = await cardsApi.generateQrCode(token);
    return res.data.qrData;
  }, []);

  const setCards = useCallback((main: VirtualCard | null, temps: VirtualCard[]) => {
    setState((s) => ({ ...s, mainCard: main, tempCards: temps }));
  }, []);

  const reorderTempCards = useCallback((cards: VirtualCard[]) => {
    setState((s) => ({ ...s, tempCards: cards }));
  }, []);

  return (
    <CardContext.Provider value={{ ...state, createMainCard, createTempCard, generateQr, setCards, reorderTempCards }}>
      {children}
    </CardContext.Provider>
  );
}

export function useCards(): CardContextValue {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error('useCards must be used inside CardProvider');
  return ctx;
}
