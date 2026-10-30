import React, { useState } from 'react';
import { CurrencyConverter } from './CurrencyConverter';
import { FeeSavingsComparison } from './FeeSavingsComparison';
import { AnchorDirectory } from './AnchorDirectory';
import { CorridorQuickSelect } from './CorridorQuickSelect';
import { RemittanceVolumeMetrics } from './RemittanceVolumeMetrics';
import { PathPaymentVisualizer } from './PathPaymentVisualizer';
import { Sep24DepositModal } from './Sep24DepositModal';
import { Sep24WithdrawModal } from './Sep24WithdrawModal';

export const RemittanceHub: React.FC = () => {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  return (
    <div className="space-y-6" data-testid="remittance-hub">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Cross-Border Remittance Hub</h2>
          <p className="text-xs text-slate-500">Sub-second international transfers via Stellar SEP Anchors</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsDepositOpen(true)}
            data-testid="on-ramp-btn"
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-xs"
          >
            Deposit Fiat
          </button>
          <button
            onClick={() => setIsWithdrawOpen(true)}
            data-testid="off-ramp-btn"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20"
          >
            Bank Payout
          </button>
        </div>
      </div>

      <RemittanceVolumeMetrics />

      <FeeSavingsComparison transferAmount={500} />

      <CorridorQuickSelect onSelectCorridor={() => {}} />

      <CurrencyConverter />

      <PathPaymentVisualizer pathHops={['USDC', 'XLM', 'EURC']} />

      <AnchorDirectory />

      <Sep24DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} anchorName="Cowrie Exchange" />
      <Sep24WithdrawModal isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} onSubmit={() => {}} />
    </div>
  );
};
