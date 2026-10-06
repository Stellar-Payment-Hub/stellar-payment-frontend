import { useState, useEffect, useCallback } from 'react';
import { WalletStatusState } from '../types/wallet';
import {
  connectFreighter,
  isFreighterInstalled,
} from '../lib/wallet/freighter';
import { STELLAR_CONFIG } from '../config/env';

const STORAGE_KEY = 'sph_wallet_connected';

export function useWallet() {
  const [status, setStatus] = useState<WalletStatusState>('disconnected');
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(true);

  // Check Freighter installation on mount
  const checkInstallation = useCallback(async (): Promise<boolean> => {
    const installed = await isFreighterInstalled();
    setIsInstalled(installed);
    return installed;
  }, []);

  useEffect(() => {
    checkInstallation();
  }, [checkInstallation]);

  // Connect to Freighter
  const connect = useCallback(async () => {
    setStatus('connecting');
    setError(null);

    try {
      const pubKey = await connectFreighter();
      setAddress(pubKey);
      setStatus('connected');
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(msg);
      setStatus('error');
    }
  }, []);

  // Disconnect from wallet
  const disconnect = useCallback(() => {
    setAddress(null);
    setStatus('disconnected');
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    status,
    address,
    error,
    network: STELLAR_CONFIG.network,
    isInstalled,
    connect,
    disconnect,
    checkInstallation,
  };
}
