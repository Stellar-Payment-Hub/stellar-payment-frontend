import React from 'react';
import { LiveStreamEntity } from '../../types/stream';

interface ShareableCardProps {
  stream: LiveStreamEntity;
}

export const ShareableStreamCard: React.FC<ShareableCardProps> = ({ stream }) => {
  return (
    <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/40 dark:bg-indigo-950/20 text-xs" data-testid="shareable-stream-card">
      <div className="font-bold text-indigo-900 dark:text-indigo-300 mb-1">Incoming Stream Voucher</div>
      <div className="text-slate-600 dark:text-slate-400">Stream #{stream.id} actively streaming {stream.totalDeposit} {stream.tokenSymbol}</div>
    </div>
  );
};
