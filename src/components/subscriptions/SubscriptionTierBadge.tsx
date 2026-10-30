import React from 'react';
import { SubscriptionTier } from '../../types/subscription';

export const SubscriptionTierBadge: React.FC<{ tier: SubscriptionTier }> = ({ tier }) => {
  const styles: Record<SubscriptionTier, string> = {
    bronze: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300',
    silver: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300',
    gold: 'bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300 border-yellow-300',
    enterprise: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[tier]}`} data-testid="subscription-tier-badge">
      {tier}
    </span>
  );
};
