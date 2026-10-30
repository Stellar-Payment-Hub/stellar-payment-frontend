import React from 'react';

interface VisualizerProps {
  pathHops: string[];
}

export const PathPaymentVisualizer: React.FC<VisualizerProps> = ({ pathHops }) => {
  return (
    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs" data-testid="path-payment-visualizer">
      <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Optimal DEX Liquidity Path</div>
      <div className="flex items-center gap-2 font-mono font-bold text-slate-900 dark:text-white">
        {pathHops.map((hop, idx) => (
          <React.Fragment key={idx}>
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
              {hop}
            </span>
            {idx < pathHops.length - 1 && <span className="text-indigo-500">→</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
