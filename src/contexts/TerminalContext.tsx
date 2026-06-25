// contexts/TerminalContext.tsx

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { Terminal } from "@/services/terminal";

interface TerminalContextType {
  terminal: Terminal | null;
  setTerminal: (terminal: Terminal) => void;
}

const TerminalContext = createContext<TerminalContextType | null>(null);

export function TerminalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [terminal, setTerminalState] =
    useState<Terminal | null>(null);

  const setTerminal = (terminal: Terminal) =>
    setTerminalState(terminal);

  return (
    <TerminalContext.Provider
      value={{
        terminal,
        setTerminal,
      }}
    >
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  const context = useContext(TerminalContext);

  if (!context) {
    throw new Error(
      "useTerminal must be used inside TerminalProvider"
    );
  }

  return context;
}