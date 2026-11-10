import { useState, useEffect, useCallback } from 'react';
import { WalletStatusState, WalletType } from '../types/wallet';
import { walletService, SUPPORTED_WALLETS } from '../services/wallet';
import { STELLAR_CONFIG } from '../config/env';

const STORAGE_CONNECTED_KEY = 'sph_wallet_connected';
const STORAGE_TYPE_KEY = 'sph_wallet_type';

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
        return window.localStorage.getItem(key);
      }
      return null;
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // ignore
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.removeItem === 'function') {
        window.localStorage.removeItem(key);
      }
    } catch {
      // ignore
    }
  },
};

export function useWallet() {
  const [status, setStatus] = useState<WalletStatusState>('disconnected');
  const [address, setAddress] = useState<string | null>(null);
  const [activeWallet, setActiveWallet] = useState<WalletType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState<boolean>(false);

  // Check saved connection on mount
  useEffect(() => {
    const wasConnected = safeStorage.getItem(STORAGE_CONNECTED_KEY);
    const savedType = safeStorage.getItem(STORAGE_TYPE_KEY) as WalletType | null;

    if (wasConnected === 'true' && savedType) {
      // Re-hydrate connection silently
      walletService
        .connect(savedType)
        .then((pubKey) => {
          setAddress(pubKey);
          setActiveWallet(savedType);
          setStatus('connected');
        })
        .catch(() => {
          safeStorage.removeItem(STORAGE_CONNECTED_KEY);
          safeStorage.removeItem(STORAGE_TYPE_KEY);
        });
    }
  }, []);

  const connect = useCallback(async (walletType: WalletType = 'freighter') => {
    setStatus('connecting');
    setError(null);

    try {
      const pubKey = await walletService.connect(walletType);
      setAddress(pubKey);
      setActiveWallet(walletType);
      setStatus('connected');
      setIsSelectModalOpen(false);

      safeStorage.setItem(STORAGE_CONNECTED_KEY, 'true');
      safeStorage.setItem(STORAGE_TYPE_KEY, walletType);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect wallet';

      if (msg.toLowerCase().includes('not detected') || msg.toLowerCase().includes('not installed')) {
        setStatus('not_found');
      } else if (msg.toLowerCase().includes('declined') || msg.toLowerCase().includes('reject')) {
        setStatus('rejected');
      } else {
        setStatus('error');
      }

      setError(msg);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setActiveWallet(null);
    setStatus('disconnected');
    setError(null);

    safeStorage.removeItem(STORAGE_CONNECTED_KEY);
    safeStorage.removeItem(STORAGE_TYPE_KEY);
  }, []);

  const openSelectModal = useCallback(() => {
    setIsSelectModalOpen(true);
  }, []);

  const closeSelectModal = useCallback(() => {
    setIsSelectModalOpen(false);
  }, []);

  return {
    status,
    address,
    activeWallet,
    error,
    network: STELLAR_CONFIG.network,
    isSelectModalOpen,
    openSelectModal,
    closeSelectModal,
    connect,
    disconnect,
    availableWallets: SUPPORTED_WALLETS,
  };
}
