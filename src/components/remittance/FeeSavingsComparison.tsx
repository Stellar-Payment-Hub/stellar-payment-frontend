import React from 'react';

export const FeeSavingsComparison: React.FC<{ transferAmount: number }> = ({ transferAmount }) => {
  const bankWireFee = 45.0;
  const stellarFee = 0.00001;
  const savings = bankWireFee - stellarFee;

  return (
    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-xs flex justify-between items-center" data-testid="fee-savings-comparison">
      <div>
        <div className="font-bold text-emerald-900 dark:text-emerald-200">Sending ${transferAmount.toFixed(2)}: You Save ${savings.toFixed(2)} vs Bank Wire</div>
        <div className="text-emerald-700 dark:text-emerald-400 font-mono">
          Stellar Protocol Fee: <strong className="text-emerald-800 dark:text-emerald-100">${stellarFee}</strong> (vs Traditional ${bankWireFee} wire fee)
        </div>
      </div>
      <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-[11px]">
        99.9% Cheaper
      </span>
    </div>
  );
};
