import React from 'react';

export const RemittanceVolumeMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" data-testid="remittance-volume-metrics">
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="text-xs text-slate-500 mb-1">30-Day Remittance Volume</div>
        <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">$184,520</div>
      </div>
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="text-xs text-slate-500 mb-1">Total Fee Savings vs Banks</div>
        <div className="text-2xl font-black text-emerald-500 font-mono">$12,840</div>
      </div>
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="text-xs text-slate-500 mb-1">Median Settlement Speed</div>
        <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">3.8s</div>
      </div>
    </div>
  );
};
