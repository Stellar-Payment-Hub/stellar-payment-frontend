import React, { useState } from 'react';
import { EscrowMath } from '../../lib/escrow/escrow-math';

interface SplitProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  arbitratorFeeBps: number;
  tokenSymbol: string;
  onConfirmAward: (buyerPct: number) => void;
}

export const ArbitrationSplitSlider: React.FC<SplitProps> = ({
  isOpen,
  onClose,
  totalAmount,
  arbitratorFeeBps,
  tokenSymbol,
  onConfirmAward,
}) => {
  const [buyerPct, setBuyerPct] = useState(50);

  if (!isOpen) return null;

  const { toBuyer, toSeller, arbitratorFee } = EscrowMath.calculateArbitratorSplit(
    totalAmount,
    buyerPct,
    arbitratorFeeBps
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-testid="arbitration-split-slider">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Allocate Dispute Award</h3>
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>Buyer: {buyerPct}%</span>
            <span>Seller: {100 - buyerPct}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={buyerPct}
            onChange={(e) => setBuyerPct(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Awarded to Buyer:</span>
            <span className="font-bold text-slate-900 dark:text-white">{toBuyer.toFixed(2)} {tokenSymbol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Awarded to Seller:</span>
            <span className="font-bold text-slate-900 dark:text-white">{toSeller.toFixed(2)} {tokenSymbol}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-1 text-amber-500">
            <span>Arbitrator Protocol Fee:</span>
            <span className="font-bold">{arbitratorFee.toFixed(2)} {tokenSymbol}</span>
          </div>
        </div>
        <button
          onClick={() => { onConfirmAward(buyerPct); onClose(); }}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
        >
          Execute Binding Settlement
        </button>
      </div>
    </div>
  );
};
