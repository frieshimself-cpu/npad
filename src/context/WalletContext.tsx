import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { fakeAddress } from "../lib/seed";

/**
 * Mock wallet state. Replace with @solana/wallet-adapter-react once the
 * on-chain program is ready — the component API is intentionally similar.
 */
type WalletState = {
  connected: boolean;
  address: string | null;
  walletName: string | null;
  balanceSol: number;
  connect: (name: string) => void;
  disconnect: () => void;
  openModal: () => void;
  closeModal: () => void;
  modalOpen: boolean;
};

const Ctx = createContext<WalletState | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletName, setWalletName] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const connect = useCallback((name: string) => {
    setWalletName(name);
    setModalOpen(false);
  }, []);
  const disconnect = useCallback(() => setWalletName(null), []);

  const value = useMemo<WalletState>(
    () => ({
      connected: walletName !== null,
      address: walletName ? fakeAddress(`user-${walletName}`) : null,
      walletName,
      balanceSol: walletName ? 12.48 : 0,
      connect,
      disconnect,
      openModal: () => setModalOpen(true),
      closeModal: () => setModalOpen(false),
      modalOpen,
    }),
    [walletName, modalOpen, connect, disconnect],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWallet(): WalletState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useWallet must be used inside WalletProvider");
  return v;
}
