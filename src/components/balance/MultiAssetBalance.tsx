import React from 'react';
import { Coins } from 'lucide-react';

export interface TokenBalance {
  code: string;
  name: string;
  balance: string;
  symbol: string;
  decimals: number;
}

interface MultiAssetBalanceProps {
  balances?: TokenBalance[];
}

export const DEFAULT_BALANCES: TokenBalance[] = [
  { code: 'XLM', name: 'Stellar Lumens', balance: '1,000.0000000', symbol: 'XLM', decimals: 7 },
  { code: 'USDC', name: 'USD Coin (Testnet)', balance: '500.0000000', symbol: 'USDC', decimals: 7 },
  { code: 'EURC', name: 'Euro Coin (Testnet)', balance: '250.0000000', symbol: 'EURC', decimals: 7 },
];

export const MultiAssetBalance: React.FC<MultiAssetBalanceProps> = ({
  balances = DEFAULT_BALANCES,
}) => {
  return (
    <div data-testid="multi-asset-balance-card" className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
      {balances.map((token) => (
        <div
          key={token.code}
          data-testid={`asset-card-${token.code}`}
          className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between"
        >
          <div>
            <div className="text-xs text-slate-400 font-medium">{token.name}</div>
            <div className="text-lg font-bold text-white tracking-tight mt-0.5">
              {token.balance} <span className="text-xs text-indigo-400 font-mono">{token.code}</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Coins className="w-4 h-4" />
          </div>
        </div>
      ))}
    </div>
  );
};
