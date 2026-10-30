import React from 'react';
import { useRpcHealth } from '../../hooks/useRpcHealth';

export const RpcStatusIndicator: React.FC = () => {
  const { currentRpc } = useRpcHealth();

  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700" data-testid="rpc-status-indicator">
      <span className={`w-2 h-2 rounded-full ${currentRpc.healthy ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
      <span className="font-medium">{currentRpc.latencyMs}ms</span>
      <span className="text-slate-400">|</span>
      <span className="font-mono text-[11px] truncate max-w-[120px]">{currentRpc.url.replace('https://', '')}</span>
    </div>
  );
};
