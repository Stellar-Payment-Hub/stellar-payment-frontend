import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { CadenceCalculator } from '../src/lib/subscriptions/cadence-calculator';
import { SubscriptionTierBadge } from '../src/components/subscriptions/SubscriptionTierBadge';
import { MerchantMrrMetrics } from '../src/components/subscriptions/MerchantMrrMetrics';
import { MerchantSubscriptionPortal } from '../src/components/subscriptions/MerchantSubscriptionPortal';

describe('Batch 9: Recurring Subscriptions & Merchant Direct Debit Portal', () => {
  it('Item 162: CadenceCalculator computes cadence seconds and proration correctly', () => {
    expect(CadenceCalculator.getCadenceSeconds('daily')).toBe(86400);
    expect(CadenceCalculator.getCadenceSeconds('monthly')).toBe(2592000);

    // Halfway through 30-day epoch: upgrading from $20 to $50
    // Remaining ratio = 0.5. Charge = $25, Credit = $10 -> Diff = $15
    const diff = CadenceCalculator.calculateProration(20, 50, 15 * 86400, 30 * 86400);
    expect(diff).toBe(15);
  });

  it('Item 174: SubscriptionTierBadge renders styled tier pill', () => {
    render(<SubscriptionTierBadge tier="gold" />);
    expect(screen.getByTestId('subscription-tier-badge')).toBeDefined();
    expect(screen.getByText('gold')).toBeDefined();
  });

  it('Item 169: MerchantMrrMetrics renders KPI figures', () => {
    render(<MerchantMrrMetrics mrrAmount={5000} activeCount={100} churnRate={2.5} totalCollected={20000} />);
    expect(screen.getByTestId('merchant-mrr-metrics')).toBeDefined();
    expect(screen.getByText('$5,000')).toBeDefined();
  });

  it('Item 179: MerchantSubscriptionPortal mounts cleanly', () => {
    render(<MerchantSubscriptionPortal />);
    expect(screen.getByTestId('merchant-subscription-portal')).toBeDefined();
    expect(screen.getByTestId('create-plan-btn')).toBeDefined();
  });
});
