import React, { useState } from 'react';
import { SubscriptionPlan, UserSubscription } from '../../types/subscription';
import { MerchantMrrMetrics } from './MerchantMrrMetrics';
import { SubscriptionPlanBuilder } from './SubscriptionPlanBuilder';
import { CancelSubscriptionModal } from './CancelSubscriptionModal';
import { PauseSubscriptionModal } from './PauseSubscriptionModal';
import { SubscriptionTierBadge } from './SubscriptionTierBadge';
import { SubscriptionFilterTabs } from './SubscriptionFilterTabs';

export const MerchantSubscriptionPortal: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([
    {
      id: 'plan-pro',
      merchantId: 'GBMERCHANT777',
      name: 'Pro Developer Plan',
      tier: 'gold',
      amount: 49.99,
      tokenSymbol: 'USDC',
      tokenAddress: 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
      cadence: 'monthly',
      trialDays: 14,
      activeSubscribersCount: 142,
      createdAt: Date.now() / 1000 - 86400 * 30,
    },
  ]);

  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([
    {
      id: 'sub-alice-1',
      planId: 'plan-pro',
      planName: 'Pro Developer Plan',
      merchantAddress: 'GBMERCHANT777',
      subscriberAddress: 'GBALICE777',
      amount: 49.99,
      tokenSymbol: 'USDC',
      cadence: 'monthly',
      status: 'active',
      nextChargeTimestamp: Date.now() / 1000 + 86400 * 15,
      lastChargeTimestamp: Date.now() / 1000 - 86400 * 15,
      cycleCount: 2,
      allowanceAuthorized: 600,
    },
  ]);

  const [isPlanBuilderOpen, setIsPlanBuilderOpen] = useState(false);
  const [selectedSubForCancel, setSelectedSubForCancel] = useState<UserSubscription | null>(null);
  const [selectedSubForPause, setSelectedSubForPause] = useState<UserSubscription | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="space-y-6" data-testid="merchant-subscription-portal">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Recurring Subscriptions Portal</h2>
          <p className="text-xs text-slate-500">Autonomous Soroban direct debit engine & MRR analytics</p>
        </div>
        <button
          onClick={() => setIsPlanBuilderOpen(true)}
          data-testid="create-plan-btn"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20"
        >
          + Create Plan
        </button>
      </div>

      <MerchantMrrMetrics mrrAmount={7098.58} activeCount={142} churnRate={1.4} totalCollected={42591.48} />

      <SubscriptionFilterTabs activeTab={activeTab} onSelectTab={setActiveTab} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <SubscriptionTierBadge tier={plan.tier} />
              <span className="text-xs text-slate-400 capitalize">{plan.cadence}</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{plan.name}</h3>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">
                {plan.amount} <span className="text-xs">{plan.tokenSymbol}</span>
              </div>
            </div>
            <div className="text-xs text-slate-500">Active Subscribers: <strong>{plan.activeSubscribersCount}</strong></div>
          </div>
        ))}
      </div>

      <SubscriptionPlanBuilder
        isOpen={isPlanBuilderOpen}
        onClose={() => setIsPlanBuilderOpen(false)}
        onCreatePlan={(p) => setPlans((prev) => [...prev, { ...p, id: `plan-${Date.now()}`, createdAt: Date.now() / 1000, activeSubscribersCount: 0 }])}
      />
      <CancelSubscriptionModal
        isOpen={!!selectedSubForCancel}
        onClose={() => setSelectedSubForCancel(null)}
        subscription={selectedSubForCancel}
        onConfirmCancel={(id) => {
          setSubscriptions((prev) => prev.filter((s) => s.id !== id));
        }}
      />
      <PauseSubscriptionModal
        isOpen={!!selectedSubForPause}
        onClose={() => setSelectedSubForPause(null)}
        subscription={selectedSubForPause}
        onTogglePause={(id, willPause) => {
          setSubscriptions((prev) =>
            prev.map((s) => (s.id === id ? { ...s, status: willPause ? 'paused' : 'active' } : s))
          );
        }}
      />
      {subscriptions.length > 0 && (
        <div className="text-xs text-slate-400">Total active managed subscriptions: {subscriptions.length}</div>
      )}
    </div>
  );
};
