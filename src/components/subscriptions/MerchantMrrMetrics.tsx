import React from 'react';

interface MrrProps {
  mrrAmount: number;
  activeCount: number;
  churnRate: number;
  totalCollected: number;
}

export const MerchantMrrMetrics: React.FC<MrrProps> = ({
  mrrAmount,
  activeCount,
  churnRate,
  totalCollected,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6" data-testid="merchant-mrr-metrics">
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="text-xs text-slate-500 font-semibold mb-1">Monthly Recurring Revenue</div>
        <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">${mrrAmount.toLocaleString()}</div>
      </div>
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="text-xs text-slate-500 font-semibold mb-1">Active Subscribers</div>
        <div className="text-2xl font-black text-slate-900 dark:text-white">{activeCount}</div>
      </div>
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="text-xs text-slate-500 font-semibold mb-1">Churn Rate</div>
        <div className="text-2xl font-black text-emerald-500">{churnRate.toFixed(1)}%</div>
      </div>
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="text-xs text-slate-500 font-semibold mb-1">Total Settled</div>
        <div className="text-2xl font-black text-slate-900 dark:text-white">${totalCollected.toLocaleString()}</div>
      </div>
    </div>
  );
};
