import React from 'react';
import { FeeTier, FeeCalculator } from '../../lib/stellar/fee-calculator';

interface FeePrioritySelectorProps {
  selectedTier: FeeTier;
  onSelectTier: (tier: FeeTier) => void;
}

export const FeePrioritySelector: React.FC<FeePrioritySelectorProps> = ({
  selectedTier,
  onSelectTier,
}) => {
  const options = FeeCalculator.getFeeOptions();

  return (
    <div className="flex gap-2" data-testid="fee-priority-selector">
      {options.map((opt) => {
        const active = selectedTier === opt.tier;
        return (
          <button
            key={opt.tier}
            type="button"
            onClick={() => onSelectTier(opt.tier)}
            className={`flex-1 p-2.5 rounded-xl border text-left transition-all ${
              active ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30' : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="text-xs font-bold capitalize text-slate-900 dark:text-white">{opt.tier}</div>
            <div className="text-[11px] font-mono text-slate-500">{opt.xlm} XLM (~{opt.estimatedTimeSec}s)</div>
          </button>
        );
      })}
    </div>
  );
};
