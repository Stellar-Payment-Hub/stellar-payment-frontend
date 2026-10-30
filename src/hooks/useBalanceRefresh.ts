import { useState, useEffect, useCallback } from 'react';

export const BALANCE_REFRESH_EVENT = 'stellar:balance-refresh';

export function triggerBalanceRefresh(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(BALANCE_REFRESH_EVENT, { detail: { timestamp: Date.now() } }));
  }
}

export function useBalanceRefresh(callback?: () => void) {
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const refresh = useCallback(() => {
    triggerBalanceRefresh();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handler = () => {
      setRefreshKey((prev) => prev + 1);
      if (callback) callback();
    };

    window.addEventListener(BALANCE_REFRESH_EVENT, handler);
    return () => {
      window.removeEventListener(BALANCE_REFRESH_EVENT, handler);
    };
  }, [callback]);

  return { refreshKey, refresh };
}
