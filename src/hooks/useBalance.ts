import { useState, useEffect, useCallback } from 'react';
import { getHorizonServer } from '../lib/stellar/server';
import { STELLAR_CONFIG } from '../config/env';

export interface AccountBalanceState {
  balance: string | null;
  spendableBalance: string | null;
  subentryCount: number;
  isLoading: boolean;
  isUnfunded: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useBalance(publicKey: string | null) {
  const [state, setState] = useState<AccountBalanceState>({
    balance: null,
    spendableBalance: null,
    subentryCount: 0,
    isLoading: false,
    isUnfunded: false,
    error: null,
    lastUpdated: null,
  });

  const fetchBalance = useCallback(async () => {
    if (!publicKey) {
      setState({
        balance: null,
        spendableBalance: null,
        subentryCount: 0,
        isLoading: false,
        isUnfunded: false,
        error: null,
        lastUpdated: null,
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const server = getHorizonServer();
      const account = await server.loadAccount(publicKey);

      // Find native (XLM) balance
      const nativeBalanceObj = account.balances.find(
        (b) => b.asset_type === 'native'
      );

      const rawBalance = nativeBalanceObj ? nativeBalanceObj.balance : '0.0000000';
      const subentries = account.subentry_count || 0;

      // Minimum reserve: 1.0 XLM base + 0.5 XLM per subentry
      const reserve = 1.0 + subentries * 0.5;
      const numBalance = parseFloat(rawBalance);
      const spendable = Math.max(0, numBalance - reserve);

      setState({
        balance: rawBalance,
        spendableBalance: spendable.toFixed(7),
        subentryCount: subentries,
        isLoading: false,
        isUnfunded: false,
        error: null,
        lastUpdated: new Date(),
      });
    } catch (err: unknown) {
      const serverError = err as { response?: { status?: number }; message?: string };
      // 404 indicates account is not yet created/funded on Stellar Testnet
      if (serverError.response && serverError.response.status === 404) {
        setState({
          balance: '0.0000000',
          spendableBalance: '0.0000000',
          subentryCount: 0,
          isLoading: false,
          isUnfunded: true,
          error: null,
          lastUpdated: new Date(),
        });
      } else {
        const errorMsg =
          serverError.message ||
          'Failed to retrieve balance from Stellar Testnet Horizon';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMsg,
          lastUpdated: null,
        }));
      }
    }
  }, [publicKey]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Quick helper to fund account via Stellar Friendbot
  const fundWithFriendbot = useCallback(async (): Promise<boolean> => {
    if (!publicKey) return false;
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const res = await fetch(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
      );
      if (res.ok) {
        await fetchBalance();
        return true;
      }
      throw new Error(`Friendbot returned HTTP ${res.status}`);
    } catch (err) {
      console.error('[Friendbot] Funding failed:', err);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Friendbot funding request failed. Try again or use the official Stellar Lab faucet.',
      }));
      return false;
    }
  }, [publicKey, fetchBalance]);

  return {
    ...state,
    refetch: fetchBalance,
    fundWithFriendbot,
    network: STELLAR_CONFIG.network,
  };
}
