import React from 'react';

interface RetryProps {
  failedAttempts: number;
  nextRetryTimestamp: number;
  onRetryNow: () => void;
}

export const PaymentRetryNotifier: React.FC<RetryProps> = ({
  failedAttempts,
  nextRetryTimestamp,
  onRetryNow,
}) => {
  if (failedAttempts === 0) return null;

  return (
    <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex justify-between items-center text-xs" data-testid="payment-retry-notifier">
      <div>
        <div className="font-bold text-rose-800 dark:text-rose-200">Last Recurring Debit Failed</div>
        <div className="text-rose-600 dark:text-rose-400">
          Attempt {failedAttempts}/3 failed. Next scheduled retry: {new Date(nextRetryTimestamp * 1000).toLocaleTimeString()}
        </div>
      </div>
      <button
        onClick={onRetryNow}
        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs"
      >
        Retry Charge Now
      </button>
    </div>
  );
};
