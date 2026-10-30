import React from 'react';

export const FeeExpenditureCard: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3" data-testid="fee-expenditure-card">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Gas & Stroop Cost Savings</h3>
      <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1 text-xs">
        <div className="font-bold text-emerald-800 dark:text-emerald-200">14,290 Transactions Settled</div>
        <div className="text-emerald-600 dark:text-emerald-400 font-mono">Total Stellar Fees: $0.14 vs Credit Card Interchange: $8,574.00</div>
        <div className="text-emerald-700 dark:text-emerald-300 font-bold text-sm pt-1">Total Saved: $8,573.86</div>
      </div>
    </div>
  );
};
