import React from 'react';
import { LiveStreamEntity } from '../../types/stream';
import { StreamMath } from '../../lib/streaming/stream-math';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  stream: LiveStreamEntity | null;
  onConfirm: (id: string, amount: number) => void;
}

export const WithdrawStreamModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  stream,
  onConfirm,
}) => {
  if (!isOpen || !stream) return null;
  const withdrawable = StreamMath.calculateWithdrawable(stream);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-testid="withdraw-stream-modal">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Claim Accrued Tokens</h3>
        <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono my-4">
          {withdrawable.toFixed(4)} {stream.tokenSymbol}
        </div>
        <p className="text-xs text-slate-500 mb-5">Tokens will be directly transferred to your connected Stellar wallet address.</p>
        <button
          onClick={() => { onConfirm(stream.id, withdrawable); onClose(); }}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors"
        >
          Confirm Withdrawal
        </button>
      </div>
    </div>
  );
};
