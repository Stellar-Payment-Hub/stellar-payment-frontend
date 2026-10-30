import React from 'react';

export const ArbitratorFeePreview: React.FC<{ total: number; feeBps: number; symbol: string }> = ({
  total,
  feeBps,
  symbol,
}) => {
  const feeAmount = (total * feeBps) / 10000;

  return (
    <div className="flex justify-between items-center text-xs text-slate-500 font-mono py-1" data-testid="arbitrator-fee-preview">
      <span>Arbitration Service Fee ({(feeBps / 100).toFixed(1)}%):</span>
      <span className="font-semibold text-slate-800 dark:text-slate-200">{feeAmount.toFixed(2)} {symbol}</span>
    </div>
  );
};
