import React from 'react';

export const AssetAllocationChart: React.FC = () => {
  const assets = [
    { code: 'USDC', pct: 65, color: 'bg-indigo-600' },
    { code: 'XLM', pct: 25, color: 'bg-emerald-500' },
    { code: 'EURC', pct: 10, color: 'bg-amber-500' },
  ];

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4" data-testid="asset-allocation-chart">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Treasury Asset Allocation</h3>
      <div className="h-4 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
        {assets.map((a) => (
          <div key={a.code} style={{ width: `${a.pct}%` }} className={`h-full ${a.color}`} />
        ))}
      </div>
      <div className="flex justify-between text-xs font-mono">
        {assets.map((a) => (
          <div key={a.code} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${a.color}`} />
            <span className="text-slate-800 dark:text-slate-200 font-bold">{a.code}: {a.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
