import React from 'react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  anchorName: string;
}

export const Sep24DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, anchorName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-testid="sep24-deposit-modal">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">SEP-24 Interactive Deposit</h3>
          <button onClick={onClose} className="text-slate-400 font-bold" aria-label="Close">✕</button>
        </div>
        <p className="text-xs text-slate-500">Connecting to secure anchor session with <strong>{anchorName}</strong>...</p>
        <div className="h-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-xs text-slate-400 font-mono space-y-2">
          <span>🔒 Secure Anchor Gateway Frame</span>
          <span className="text-[10px] text-slate-500">SEP-24 Webhook Authenticated</span>
        </div>
        <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs">
          Done with Deposit
        </button>
      </div>
    </div>
  );
};
