import React, { useState } from 'react';

interface CreateStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (stream: { recipient: string; amount: number; durationHours: number; token: string }) => void;
}

export const CreateStreamModal: React.FC<CreateStreamModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('100');
  const [hours, setHours] = useState('24');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      recipient,
      amount: parseFloat(amount) || 0,
      durationHours: parseInt(hours, 10) || 1,
      token: 'XLM',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-testid="create-stream-modal">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create Payment Stream</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold" aria-label="Close">✕</button>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
            placeholder="G..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Deposit (XLM)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Duration (Hours)</label>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              min="1"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors shadow-lg shadow-indigo-500/20"
        >
          Initialize Continuous Stream
        </button>
      </form>
    </div>
  );
};
