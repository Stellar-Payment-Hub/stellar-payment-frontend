import React from 'react';
import { LiveStreamEntity } from '../../types/stream';
import { StreamProgressBar } from './StreamProgressBar';

interface StreamCardProps {
  stream: LiveStreamEntity;
  onWithdraw?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export const StreamCard: React.FC<StreamCardProps> = ({ stream, onWithdraw, onCancel }) => {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow" data-testid={`stream-card-${stream.id}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-xs text-slate-400 font-mono">Stream #{stream.id}</div>
          <div className="font-bold text-slate-900 dark:text-white text-base">{stream.totalDeposit} {stream.tokenSymbol}</div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {stream.status}
        </span>
      </div>
      <div className="mb-4">
        <StreamProgressBar stream={stream} />
      </div>
      <div className="flex gap-2">
        {onWithdraw && (
          <button
            onClick={() => onWithdraw(stream.id)}
            data-testid={`withdraw-btn-${stream.id}`}
            className="flex-1 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
          >
            Claim Accrued
          </button>
        )}
        {onCancel && (
          <button
            onClick={() => onCancel(stream.id)}
            data-testid={`cancel-btn-${stream.id}`}
            className="px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-semibold text-xs hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};
