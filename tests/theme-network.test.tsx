import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NetworkMismatchBanner } from '../src/components/wallet/NetworkMismatchBanner';

describe('NetworkMismatchBanner Component', () => {
  it('renders warning when on Mainnet instead of Testnet', () => {
    render(<NetworkMismatchBanner currentNetwork="public" expectedNetwork="testnet" />);
    expect(screen.getByTestId('network-mismatch-banner')).toBeDefined();
    expect(screen.getByText(/Network Warning/)).toBeDefined();
  });

  it('renders nothing when current matches expected network', () => {
    const { container } = render(<NetworkMismatchBanner currentNetwork="testnet" expectedNetwork="testnet" />);
    expect(container.firstChild).toBeNull();
  });
});
