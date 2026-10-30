import { useState, useEffect, useCallback } from 'react';
import { SupportedWalletProvider, WalletSessionState } from '../types/wallet-hub';
import { WalletSessionManager } from '../lib/wallet/wallet-session';

export function useMultiWallet() {
  const [session, setSession] = useState<WalletSessionState | null>(() => WalletSessionManager.getSession());
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = useCallback(async (provider: SupportedWalletProvider, address?: string) => {
    setIsConnecting(true);
    setError(null);
    try {
      const simulatedAddress = address || 'GBTESTWALLETADDRESSFORSOROBANHUB777777777777777777777777777';
      const newSession = WalletSessionManager.saveSession({
        address: simulatedAddress,
        provider,
        network: 'TESTNET',
        isHardware: provider === 'ledger',
      });
      setSession(newSession);
      return newSession;
    } catch (err: any) {
      setError(err?.message || 'Failed to connect wallet');
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    WalletSessionManager.clearSession();
    setSession(null);
  }, []);

  return {
    session,
    address: session?.address || null,
    provider: session?.provider || null,
    isConnected: !!session,
    isConnecting,
    isHardware: session?.isHardware || false,
    error,
    connectWallet,
    disconnect,
  };
}
