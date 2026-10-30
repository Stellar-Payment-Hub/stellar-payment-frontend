import React, { useState } from 'react';
import { SubscriptionPlan } from '../../types/subscription';

interface AllowanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan | null;
  onAuthorize: (approvedCap: number) => void;
}

export const SubscriptionAllowanceModal: React.FC<AllowanceModalProps> = ({
  isOpen,
  onClose,
  plan,
  onAuthorize,
}) => {
  const [capMonths, setCapMonths] = useState(12);

  if (!isOpen || !plan) return null;
  const totalCap = plan.amount * capMonths;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-testid="subscription-allowance-modal">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Authorize Soroban Allowance</h3>
        <p className="text-xs text-slate-500 mb-4">
          To enable automated recurring debits for <strong className="text-slate-800 dark:text-slate-200">{plan.name}</strong>, approve a spend cap for the subscription contract:
        </p>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 mb-4 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-500">Rate per {plan.cadence}:</span>
            <span className="font-bold text-slate-900 dark:text-white">{plan.amount} {plan.tokenSymbol}</span>
          </div>
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-500">Authorization Horizon:</span>
            <span className="font-bold text-slate-900 dark:text-white">{capMonths} billing cycles</span>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between text-sm font-mono font-bold">
            <span className="text-indigo-600 dark:text-indigo-400">Total Spend Cap:</span>
            <span className="text-indigo-600 dark:text-indigo-400">{totalCap.toFixed(2)} {plan.tokenSymbol}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs"
          >
            Cancel
          </button>
          <button
            onClick={() => { onAuthorize(totalCap); onClose(); }}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20"
          >
            Sign & Approve
          </button>
        </div>
      </div>
    </div>
  );
};
