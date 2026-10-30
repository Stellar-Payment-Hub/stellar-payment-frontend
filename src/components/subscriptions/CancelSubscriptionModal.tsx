import React from 'react';
import { UserSubscription } from '../../types/subscription';

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: UserSubscription | null;
  onConfirmCancel: (subId: string) => void;
}

export const CancelSubscriptionModal: React.FC<CancelModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onConfirmCancel,
}) => {
  if (!isOpen || !subscription) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-testid="cancel-subscription-modal">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-bold text-rose-600 mb-2">Cancel Subscription</h3>
        <p className="text-xs text-slate-500 mb-4">
          Are you sure you want to stop recurring payments for <strong className="text-slate-800 dark:text-slate-200">{subscription.planName}</strong>?
        </p>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-xs text-slate-600 dark:text-slate-400 mb-5">
          Access will remain active until: <strong>{new Date(subscription.nextChargeTimestamp * 1000).toLocaleDateString()}</strong>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold"
          >
            Keep Active
          </button>
          <button
            onClick={() => { onConfirmCancel(subscription.id); onClose(); }}
            className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
