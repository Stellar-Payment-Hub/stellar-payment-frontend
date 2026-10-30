import React from 'react';
import { EscrowEntity } from '../../types/escrow';

interface ConsoleProps {
  escrow: EscrowEntity;
  onOpenSplitSlider: () => void;
}

export const ArbitratorReviewConsole: React.FC<ConsoleProps> = ({ escrow, onOpenSplitSlider }) => {
  return (
    <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4" data-testid="arbitrator-review-console">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Arbitration Session Active</span>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">Escrow #{escrow.id}</h4>
        </div>
        <button
          onClick={onOpenSplitSlider}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md"
        >
          Issue Award Judgment
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 text-xs font-mono">
        <div>
          <span className="text-slate-400">Buyer:</span>
          <div className="truncate text-slate-900 dark:text-white">{escrow.buyer}</div>
        </div>
        <div>
          <span className="text-slate-400">Seller:</span>
          <div className="truncate text-slate-900 dark:text-white">{escrow.seller}</div>
        </div>
      </div>
    </div>
  );
};
