import React, { useState } from 'react';
import { SubscriptionCadence, SubscriptionTier, SubscriptionPlan } from '../../types/subscription';

interface PlanBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlan: (plan: Omit<SubscriptionPlan, 'id' | 'createdAt' | 'activeSubscribersCount'>) => void;
}

export const SubscriptionPlanBuilder: React.FC<PlanBuilderProps> = ({
  isOpen,
  onClose,
  onCreatePlan,
}) => {
  const [name, setName] = useState('');
  const [tier, setTier] = useState<SubscriptionTier>('silver');
  const [amount, setAmount] = useState('25');
  const [cadence, setCadence] = useState<SubscriptionCadence>('monthly');
  const [trialDays, setTrialDays] = useState('0');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreatePlan({
      merchantId: 'GBMERCHANT7777777777777777777777777777777777777777777',
      name,
      tier,
      amount: parseFloat(amount) || 0,
      tokenSymbol: 'USDC',
      tokenAddress: 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
      cadence,
      trialDays: parseInt(trialDays, 10) || 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-testid="subscription-plan-builder">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create Subscription Plan</h3>
          <button type="button" onClick={onClose} className="text-slate-400 font-bold" aria-label="Close">✕</button>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Plan Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Pro SaaS Plan"
            required
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Amount (USDC)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.1"
              step="any"
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Billing Cadence</label>
            <select
              value={cadence}
              onChange={(e) => setCadence(e.target.value as SubscriptionCadence)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tier</label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as SubscriptionTier)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none capitalize"
            >
              <option value="bronze">Bronze</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Trial Days</label>
            <input
              type="number"
              value={trialDays}
              onChange={(e) => setTrialDays(e.target.value)}
              min="0"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors shadow-lg shadow-indigo-500/20"
        >
          Publish Plan to Ledger
        </button>
      </form>
    </div>
  );
};
