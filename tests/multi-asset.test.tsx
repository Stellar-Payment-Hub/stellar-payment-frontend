import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MultiAssetBalance } from '../src/components/balance/MultiAssetBalance';

describe('MultiAssetBalance Component', () => {
  it('renders XLM, USDC, and EURC asset cards', () => {
    render(<MultiAssetBalance />);
    expect(screen.getByTestId('asset-card-XLM')).toBeDefined();
    expect(screen.getByTestId('asset-card-USDC')).toBeDefined();
    expect(screen.getByTestId('asset-card-EURC')).toBeDefined();
  });
});
