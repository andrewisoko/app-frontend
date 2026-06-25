import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import { PaymentDraft } from "@/services/paymentDrafts";

interface DraftContextType {
  draft: PaymentDraft | null;
  setDraft: (draft: PaymentDraft) => void;
}

const DraftContext =
  createContext<DraftContextType | null>(null);

export function DraftProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [draft, setDraftState] =
    useState<PaymentDraft | null>(null);

  const setDraft = (draft: PaymentDraft|null) =>
    setDraftState(draft);

  return (
    <DraftContext.Provider
      value={{
        draft,
        setDraft,
      }}
    >
      {children}
    </DraftContext.Provider>
  );
}

export function useDraft() {
  const context = useContext(DraftContext);

  if (!context) {
    throw new Error("useDraft missing provider");
  }

  return context;
}