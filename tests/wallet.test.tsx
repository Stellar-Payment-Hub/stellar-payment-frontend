import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WalletStatus } from '../src/components/wallet/WalletStatus';
import { WalletAddress } from '../src/components/wallet/WalletAddress';

describe('Wallet Components', () => {
  describe('WalletStatus', () => {
    it('renders network indicator with Testnet label', () => {
      render(<WalletStatus status="disconnected" network="testnet" />);
      expect(screen.getByTestId('network-indicator')).toHaveTextContent(
        'Stellar TESTNET'
      );
    });

    it('renders Disconnected badge when disconnected', () => {
      render(<WalletStatus status="disconnected" />);
      expect(screen.getByTestId('status-disconnected')).toHaveTextContent(
        'Disconnected'
      );
    });

    it('renders Connecting badge with pulse when connecting', () => {
      render(<WalletStatus status="connecting" />);
      expect(screen.getByTestId('status-connecting')).toHaveTextContent(
        'Connecting...'
      );
    });

    it('renders Connected badge when connected', () => {
      render(<WalletStatus status="connected" />);
      expect(screen.getByTestId('status-connected')).toHaveTextContent(
        'Connected'
      );
    });

    it('renders Error badge when in error state', () => {
      render(<WalletStatus status="error" />);
      expect(screen.getByTestId('status-error')).toHaveTextContent('Error');
    });
  });

  describe('WalletAddress', () => {
    const testAddress =
      'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';

    it('renders truncated wallet address cleanly', () => {
      render(<WalletAddress address={testAddress} />);
      const addressEl = screen.getByTestId('wallet-address-text');
      expect(addressEl).toHaveTextContent('GBBD47IF...FLA5');
    });

    it('provides copy button and explorer link', () => {
      render(<WalletAddress address={testAddress} />);
      expect(screen.getByTestId('copy-address-btn')).toBeInTheDocument();
      const link = screen.getByTestId('explorer-account-link');
      expect(link).toHaveAttribute(
        'href',
        `https://stellar.expert/explorer/testnet/account/${testAddress}`
      );
    });
  });
});
