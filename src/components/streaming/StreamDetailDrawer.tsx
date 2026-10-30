import React from 'react';
import { LiveStreamEntity } from '../../types/stream';

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stream: LiveStreamEntity | null;
}

export const StreamDetailDrawer: React.FC<DetailDrawerProps> = ({ isOpen, onClose, stream }) => {
  if (!isOpen || !stream) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between" data-testid="stream-detail-drawer">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Stream Protocol Details</h3>
          <button onClick={onClose} className="text-slate-400 font-bold" aria-label="Close">✕</button>
        </div>
        <div className="space-y-3 font-mono text-xs">
          <div>
            <div className="text-slate-400">Stream ID</div>
            <div className="text-slate-900 dark:text-white font-bold">{stream.id}</div>
          </div>
          <div>
            <div className="text-slate-400">Sender</div>
            <div className="truncate text-slate-800 dark:text-slate-200">{stream.sender}</div>
          </div>
          <div>
            <div className="text-slate-400">Recipient</div>
            <div className="truncate text-slate-800 dark:text-slate-200">{stream.recipient}</div>
          </div>
          <div>
            <div className="text-slate-400">Total Deposit</div>
            <div className="text-indigo-600 dark:text-indigo-400 font-bold">{stream.totalDeposit} {stream.tokenSymbol}</div>
          </div>
        </div>
      </div>
      <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs">
        Close Drawer
      </button>
    </div>
  );
};
