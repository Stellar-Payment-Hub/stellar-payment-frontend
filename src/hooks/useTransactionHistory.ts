import { useState, useCallback } from 'react';

export interface TransactionHistoryItem {
  id: string;
  hash: string;
  type: 'payment' | 'split' | 'stream' | 'escrow';
  amount: string;
  asset: string;
  counterparty: string;
  timestamp: number;
  successful: boolean;
}

export function useTransactionHistory() {
  const [items, setItems] = useState<TransactionHistoryItem[]>([
    {
      id: 'tx-1',
      hash: '3a7b98f2e1c0d4a5b6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9',
      type: 'payment',
      amount: '50.0000000',
      asset: 'XLM',
      counterparty: 'GBALICERECEIVER7777777777777777777777777777777777777777777',
      timestamp: Date.now() - 3600000,
      successful: true,
    },
  ]);

  const addTransaction = useCallback((item: TransactionHistoryItem) => {
    setItems((prev) => [item, ...prev]);
  }, []);

  return { items, addTransaction };
}
