import React, { useState } from 'react';

interface WithdrawProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: { bankAccount: string; bankName: string; amount: number }) => void;
}

export const Sep24WithdrawModal: React.FC<WithdrawProps> = ({ isOpen, onClose, onSubmit }) => {
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('First Bank PLC');
  const [amount, setAmount] = useState('100');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-testid="sep24-withdraw-modal">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ bankAccount, bankName, amount: parseFloat(amount) || 0 });
          onClose();
        }}
        className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Off-Ramp Local Bank Withdrawal</h3>
          <button type="button" onClick={onClose} className="text-slate-400 font-bold" aria-label="Close">✕</button>
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Destination Bank Name</label>
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Account Number / IBAN</label>
          <input
            type="text"
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            placeholder="0123456789"
            required
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Withdrawal Amount (USDC)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            required
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
        >
          Confirm Local Off-Ramp Payout
        </button>
      </form>
    </div>
  );
};
