import React from 'react';

export const AnchorHealthGrid: React.FC = () => {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs" data-testid="anchor-health-grid">
      <div className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Anchor Network Status</div>
      <div className="flex justify-between items-center font-mono">
        <span>Stellar Horizon Gateway</span>
        <span className="text-emerald-500 font-bold">● 100% Operational (42ms)</span>
      </div>
      <div className="flex justify-between items-center font-mono">
        <span>SEP-24 Interactive Service</span>
        <span className="text-emerald-500 font-bold">● Active (58ms)</span>
      </div>
    </div>
  );
};
