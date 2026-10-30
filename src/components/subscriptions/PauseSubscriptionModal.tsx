import React from 'react';
import { UserSubscription } from '../../types/subscription';

interface PauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: UserSubscription | null;
  onTogglePause: (subId: string, willPause: boolean) => void;
}

export const PauseSubscriptionModal: React.FC<PauseModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onTogglePause,
}) => {
  if (!isOpen || !subscription) return null;
  const isPaused = subscription.status === 'paused';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-testid="pause-subscription-modal">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          {isPaused ? 'Resume Subscription' : 'Pause Subscription'}
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          {isPaused
            ? 'Resuming will reactivate recurring auto-debits on the original schedule.'
            : 'Pausing will suspend upcoming auto-debit cycles until manually resumed.'}
        </p>
        <button
          onClick={() => { onTogglePause(subscription.id, !isPaused); onClose(); }}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
        >
          {isPaused ? 'Reactivate Subscription' : 'Confirm Pause'}
        </button>
      </div>
    </div>
  );
};
