import React from 'react';

interface TelemetryProps {
  activeCount: number;
  totalLockedXlm: number;
  flowRatePerHr: number;
}

export const StreamTelemetrySummary: React.FC<TelemetryProps> = ({
  activeCount,
  totalLockedXlm,
  flowRatePerHr,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6" data-testid="stream-telemetry-summary">
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="text-xs text-slate-500 mb-1">Active Streams</div>
        <div className="text-2xl font-black text-slate-900 dark:text-white">{activeCount}</div>
      </div>
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="text-xs text-slate-500 mb-1">Total Value Locked</div>
        <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{totalLockedXlm.toFixed(2)} XLM</div>
      </div>
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="text-xs text-slate-500 mb-1">Net Flow Velocity</div>
        <div className="text-2xl font-black text-emerald-500">{flowRatePerHr.toFixed(2)} XLM/hr</div>
      </div>
    </div>
  );
};
