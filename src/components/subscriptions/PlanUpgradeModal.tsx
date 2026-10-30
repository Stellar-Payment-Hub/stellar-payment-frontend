import React, { useState } from 'react';
import { SubscriptionPlan, UserSubscription } from '../../types/subscription';
import { CadenceCalculator } from '../../lib/subscriptions/cadence-calculator';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSub: UserSubscription | null;
  availablePlans: SubscriptionPlan[];
  onConfirmUpgrade: (newPlanId: string, proratedFee: number) => void;
}

export const PlanUpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  currentSub,
  availablePlans,
  onConfirmUpgrade,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(availablePlans[0]?.id || '');

  if (!isOpen || !currentSub) return null;

  const targetPlan = availablePlans.find((p) => p.id === selectedPlanId);
  const diffCharge = targetPlan
    ? CadenceCalculator.calculateProration(currentSub.amount, targetPlan.amount, 15 * 86400, 30 * 86400)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-testid="plan-upgrade-modal">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Upgrade or Switch Plan</h3>
        <div className="space-y-2">
          {availablePlans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                selectedPlanId === plan.id
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">{plan.name}</div>
                <div className="text-xs text-slate-500 capitalize">{plan.tier} tier • {plan.cadence}</div>
              </div>
              <div className="font-mono font-bold text-slate-900 dark:text-white">{plan.amount} {plan.tokenSymbol}</div>
            </div>
          ))}
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex justify-between items-center text-xs font-mono">
          <span className="text-slate-500">Immediate Prorated Charge:</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">{diffCharge.toFixed(2)} {currentSub.tokenSymbol}</span>
        </div>
        <button
          onClick={() => { onConfirmUpgrade(selectedPlanId, diffCharge); onClose(); }}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
        >
          Confirm Plan Switch
        </button>
      </div>
    </div>
  );
};
