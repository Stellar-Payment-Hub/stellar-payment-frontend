import React from 'react';
import { LiveStreamEntity } from '../../types/stream';
import { useLiveStreamAccrual } from '../../hooks/useLiveStreamAccrual';

interface StreamFlowMeterProps {
  stream: LiveStreamEntity;
}

export const StreamFlowMeter: React.FC<StreamFlowMeterProps> = ({ stream }) => {
  const { accrued, withdrawable } = useLiveStreamAccrual(stream);

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 text-white shadow-xl" data-testid="stream-flow-meter">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-semibold tracking-wider uppercase text-indigo-400">Live Continuous Accrual</span>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
          {stream.status}
        </span>
      </div>
      <div className="font-mono text-4xl sm:text-5xl font-black tracking-tight text-white mb-2">
        {accrued.toFixed(6)} <span className="text-xl text-indigo-400 font-bold">{stream.tokenSymbol}</span>
      </div>
      <div className="flex justify-between text-xs text-slate-400 font-mono">
        <span>Velocity: {(stream.ratePerSecond * 3600).toFixed(2)} {stream.tokenSymbol}/hr</span>
        <span className="text-emerald-400 font-bold">Unclaimed: {withdrawable.toFixed(4)} {stream.tokenSymbol}</span>
      </div>
    </div>
  );
};
