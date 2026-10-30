import React from 'react';
import { UserSubscription } from '../../types/subscription';

interface DebitTriggerProps {
  subscriptions: UserSubscription[];
  onTriggerCharge: (subId: string) => void;
  onBatchCharge: () => void;
}

export const MerchantDebitTrigger: React.FC<DebitTriggerProps> = ({
  subscriptions,
  onTriggerCharge,
  onBatchCharge,
}) => {
  const overdueCount = subscriptions.filter((s) => s.status === 'active').length;

  return (
    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex justify-between items-center mb-6" data-testid="merchant-debit-trigger">
      <div>
        <div className="text-sm font-bold text-slate-900 dark:text-white">Automated Epoch Debiting</div>
        <div className="text-xs text-slate-500">{overdueCount} subscriptions ready for epoch debit invocation</div>
      </div>
      <div className="flex gap-2">
        {subscriptions[0] && (
          <button
            onClick={() => onTriggerCharge(subscriptions[0].id)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
          >
            Trigger Single
          </button>
        )}
        <button
          onClick={onBatchCharge}
          disabled={overdueCount === 0}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs transition-colors"
        >
          Invoke Batch Debit
        </button>
      </div>
    </div>
  );
};
