import React from 'react';
import { LiveStreamEntity } from '../../types/stream';
import { StreamMath } from '../../lib/streaming/stream-math';

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  stream: LiveStreamEntity | null;
  onConfirm: (id: string) => void;
}

export const CancelStreamModal: React.FC<CancelModalProps> = ({
  isOpen,
  onClose,
  stream,
  onConfirm,
}) => {
  if (!isOpen || !stream) return null;
  const toRecipient = StreamMath.calculateWithdrawable(stream);
  const toSender = Math.max(0, stream.totalDeposit - stream.withdrawnAmount - toRecipient);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-testid="cancel-stream-modal">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-bold text-rose-600 mb-2">Terminate Stream #{stream.id}</h3>
        <p className="text-xs text-slate-500 mb-4">Terminating this stream will immediately halt per-second accrual and split locked funds:</p>
        <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-xs mb-5">
          <div className="flex justify-between">
            <span className="text-slate-500">To Recipient:</span>
            <span className="font-bold text-slate-900 dark:text-white">{toRecipient.toFixed(4)} {stream.tokenSymbol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Refund to Sender:</span>
            <span className="font-bold text-emerald-600">{toSender.toFixed(4)} {stream.tokenSymbol}</span>
          </div>
        </div>
        <button
          onClick={() => { onConfirm(stream.id); onClose(); }}
          className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-colors"
        >
          Confirm Stream Termination
        </button>
      </div>
    </div>
  );
};
