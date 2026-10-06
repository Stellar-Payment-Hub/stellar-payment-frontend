import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TransactionStatus } from '../src/components/payments/TransactionStatus';

describe('TransactionStatus Component', () => {
  it('renders idle recent activity state when no transaction occurred', () => {
    render(<TransactionStatus status="idle" result={null} onReset={vi.fn()} />);
    expect(
      screen.getByTestId('transaction-result-idle')
    ).toBeInTheDocument();
    expect(
      screen.getByText('No transactions yet in this session.')
    ).toBeInTheDocument();
  });

  it('renders success result with transaction hash and explorer link', () => {
    const mockSuccessResult = {
      status: 'success' as const,
      hash: '342eb1e83ad159e628bb047e741e95632717c45bb438eb7a87dbb401f0bc247f',
      ledger: 104250,
      recipient: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
      amount: '25.00',
      memo: 'Test payment',
      timestamp: Date.now(),
    };

    render(
      <TransactionStatus
        status="success"
        result={mockSuccessResult}
        onReset={vi.fn()}
      />
    );

    expect(screen.getByTestId('transaction-result-success')).toBeInTheDocument();
    expect(screen.getByText('Payment Successful')).toBeInTheDocument();
    expect(
      screen.getByText('25.00 XLM sent to recipient on Stellar Testnet')
    ).toBeInTheDocument();
    expect(screen.getByTestId('tx-hash-value')).toHaveTextContent(
      '342eb1e83a...01f0bc247f'
    );
    expect(screen.getByTestId('explorer-tx-link')).toHaveAttribute(
      'href',
      `https://stellar.expert/explorer/testnet/tx/${mockSuccessResult.hash}`
    );
  });

  it('renders failure state with error message and retry button', () => {
    const mockFailedResult = {
      status: 'failed' as const,
      error: 'Transaction rejected by user in Freighter.',
      recipient: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
      amount: '10.00',
      timestamp: Date.now(),
    };

    render(
      <TransactionStatus
        status="failed"
        result={mockFailedResult}
        onReset={vi.fn()}
      />
    );

    expect(screen.getByTestId('transaction-result-failed')).toBeInTheDocument();
    expect(screen.getByText('Transaction Cancelled')).toBeInTheDocument();
    expect(
      screen.getByText('Transaction rejected by user in Freighter.')
    ).toBeInTheDocument();
    expect(screen.getByTestId('try-again-btn')).toBeInTheDocument();
  });
});
