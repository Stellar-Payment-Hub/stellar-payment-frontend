import React from 'react';

interface GuardProps {
  currentAllowance: number;
  upcomingChargeAmount: number;
  tokenSymbol: string;
  onTopUpAllowance: () => void;
}

export const SpendingLimitGuard: React.FC<GuardProps> = ({
  currentAllowance,
  upcomingChargeAmount,
  tokenSymbol,
  onTopUpAllowance,
}) => {
  const isExhausted = currentAllowance < upcomingChargeAmount;

  if (!isExhausted) return null;

  return (
    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-xs flex justify-between items-center" data-testid="spending-limit-guard">
      <div className="space-y-0.5">
        <div className="font-bold text-amber-900 dark:text-amber-200">Allowance Limit Reached</div>
        <div className="text-amber-700 dark:text-amber-400 font-mono">
          Remaining allowance ({currentAllowance} {tokenSymbol}) is insufficient for next charge ({upcomingChargeAmount} {tokenSymbol}).
        </div>
      </div>
      <button
        onClick={onTopUpAllowance}
        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shrink-0"
      >
        Increase Cap
      </button>
    </div>
  );
};
