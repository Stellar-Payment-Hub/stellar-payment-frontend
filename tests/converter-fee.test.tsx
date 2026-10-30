import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CurrencyConverterWidget } from '../src/components/payments/CurrencyConverterWidget';
import { FeeEstimatorCard } from '../src/components/payments/FeeEstimatorCard';

describe('CurrencyConverterWidget & FeeEstimatorCard', () => {
  it('converts XLM to estimated USD accurately', () => {
    // 100 XLM @ 0.125 = $12.50 USD
    render(<CurrencyConverterWidget amount={100} asset="XLM" />);
    expect(screen.getByText((content) => content.includes('12.50 USD'))).toBeDefined();
  });

  it('renders estimated Stroops and XLM fees', () => {
    render(<FeeEstimatorCard estimatedStroops={150} operationCount={2} />);
    expect(screen.getByText(/300 Stroops/)).toBeDefined();
  });
});
