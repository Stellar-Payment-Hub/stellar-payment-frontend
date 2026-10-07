import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContractReader } from '../src/components/contracts/ContractReader';
import * as paymentRegistry from '../src/lib/contracts/paymentRegistry';

describe('ContractReader Component (Section 16: Contract Read Operations)', () => {
  it('renders contract reader input and query button', () => {
    render(<ContractReader />);
    expect(screen.getByText('Contract Read Operations')).toBeInTheDocument();
    expect(screen.getByTestId('contract-query-input')).toBeInTheDocument();
    expect(screen.getByTestId('contract-query-btn')).toBeInTheDocument();
  });

  it('queries contract and displays on-chain payment record', async () => {
    vi.spyOn(paymentRegistry, 'readContractPayment').mockResolvedValueOnce({
      id: 1,
      creator: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
      recipient: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
      amount: '25.0000',
      status: 'Pending',
      createdAt: 'Oct 6, 2026',
      updatedAt: 'Oct 6, 2026',
      source: 'soroban_rpc',
      contractAddress: 'CD5D7OITCBFJJDHQVEZ6Y7MYIZSWEVOCQO4ES7WZEWW3S37IGUVZAI7S',
    });

    render(<ContractReader />);
    const button = screen.getByTestId('contract-query-btn');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('contract-read-result')).toBeInTheDocument();
      expect(screen.getByText('Payment #PAY-001')).toBeInTheDocument();
      expect(screen.getByText('25.0000 XLM')).toBeInTheDocument();
      expect(screen.getByText('GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN')).toBeInTheDocument();
      expect(screen.getAllByText('Pending').length).toBeGreaterThanOrEqual(1);
    });
  });
});
