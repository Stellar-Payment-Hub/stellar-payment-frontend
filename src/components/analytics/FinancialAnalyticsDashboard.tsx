import React from 'react';
import { VolumeBarChart } from './VolumeBarChart';
import { AssetAllocationChart } from './AssetAllocationChart';
import { FeeExpenditureCard } from './FeeExpenditureCard';

export const FinancialAnalyticsDashboard: React.FC = () => {
  return (
    <div className="space-y-6" data-testid="financial-analytics-dashboard">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Financial Analytics & Reporting</h2>
        <p className="text-xs text-slate-500">Real-time ledger telemetry, fee savings, and treasury distribution</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">Total Settled Volume</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">$429,812.50</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">Total Soroban Transactions</div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">14,290</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">Protocol Fee Burn</div>
          <div className="text-2xl font-black text-emerald-500 font-mono">$0.1429</div>
        </div>
      </div>

      <VolumeBarChart />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AssetAllocationChart />
        <FeeExpenditureCard />
      </div>
    </div>
  );
};
