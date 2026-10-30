import React from 'react';

interface SorobanFootprintProps {
  cpuInstructions: number;
  memoryBytes: number;
  minFeeStroops: number;
}

export const SorobanFootprintViewer: React.FC<SorobanFootprintProps> = ({
  cpuInstructions,
  memoryBytes,
  minFeeStroops,
}) => {
  return (
    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs" data-testid="soroban-footprint-viewer">
      <div className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Soroban Resource Footprint</div>
      <div className="grid grid-cols-3 gap-2 font-mono">
        <div>
          <div className="text-[10px] text-slate-400 uppercase">CPU Instructions</div>
          <div className="font-bold text-slate-900 dark:text-white">{cpuInstructions.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400 uppercase">Memory Footprint</div>
          <div className="font-bold text-slate-900 dark:text-white">{(memoryBytes / 1024).toFixed(1)} KB</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400 uppercase">Min Gas Fee</div>
          <div className="font-bold text-indigo-600 dark:text-indigo-400">{(minFeeStroops / 10_000_000).toFixed(6)} XLM</div>
        </div>
      </div>
    </div>
  );
};
