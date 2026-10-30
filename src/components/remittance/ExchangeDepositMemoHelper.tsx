import React from 'react';

export const ExchangeDepositMemoHelper: React.FC<{ requiresMemo: boolean }> = ({ requiresMemo }) => {
  if (!requiresMemo) return null;

  return (
    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2" data-testid="exchange-deposit-memo-helper">
      <span>⚠️</span>
      <span>This exchange address requires a <strong>Transaction Memo ID</strong> to credit recipient funds accurately.</span>
    </div>
  );
};
