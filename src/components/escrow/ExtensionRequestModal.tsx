import React, { useState } from 'react';

interface ExtendProps {
  isOpen: boolean;
  onClose: () => void;
  onExtend: (extraDays: number) => void;
}

export const ExtensionRequestModal: React.FC<ExtendProps> = ({ isOpen, onClose, onExtend }) => {
  const [days, setDays] = useState('7');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-testid="extension-request-modal">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Request Escrow Extension</h3>
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Additional Days Needed</label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            min="1"
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
          />
        </div>
        <button
          onClick={() => { onExtend(parseInt(days, 10) || 7); onClose(); }}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
        >
          Propose Extension to Counterparty
        </button>
      </div>
    </div>
  );
};
