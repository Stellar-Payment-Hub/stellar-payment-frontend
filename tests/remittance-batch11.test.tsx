import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { FxRateEngine } from '../src/lib/remittance/fx-rates';
import { FeeSavingsComparison } from '../src/components/remittance/FeeSavingsComparison';
import { PathPaymentVisualizer } from '../src/components/remittance/PathPaymentVisualizer';
import { RemittanceHub } from '../src/components/remittance/RemittanceHub';

describe('Batch 11: Cross-Border Remittance & Anchor SEP Gateway', () => {
  it('Item 202: FxRateEngine converts rates and generates quotes', () => {
    const rate = FxRateEngine.getRate('USDC', 'NGN');
    expect(rate).toBe(1600.5);

    const quote = FxRateEngine.generateQuote('USDC', 'NGN', 100);
    expect(quote.savingsUsd).toBeGreaterThan(40);
    expect(quote.exchangeRate).toBe(1600.5);
  });

  it('Item 204: FeeSavingsComparison calculates wire fee savings', () => {
    render(<FeeSavingsComparison transferAmount={500} />);
    expect(screen.getByTestId('fee-savings-comparison')).toBeDefined();
    expect(screen.getByText(/You Save/)).toBeDefined();
  });

  it('Item 212: PathPaymentVisualizer displays multi-hop liquidity path', () => {
    render(<PathPaymentVisualizer pathHops={['USDC', 'XLM', 'NGN']} />);
    expect(screen.getByTestId('path-payment-visualizer')).toBeDefined();
    expect(screen.getByText('USDC')).toBeDefined();
    expect(screen.getByText('NGN')).toBeDefined();
  });

  it('Item 219: RemittanceHub mounts cleanly', () => {
    render(<RemittanceHub />);
    expect(screen.getByTestId('remittance-hub')).toBeDefined();
    expect(screen.getByTestId('on-ramp-btn')).toBeDefined();
    expect(screen.getByTestId('off-ramp-btn')).toBeDefined();
  });
});
