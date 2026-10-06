import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { PaymentTracker } from '../src/components/tracker/PaymentTracker';

describe('PaymentTracker Component', () => {
  it('renders tracker header and filter tabs', async () => {
    render(<PaymentTracker />);

    expect(screen.getByTestId('payment-tracker')).toBeInTheDocument();
    expect(screen.getByTestId('realtime-stream-indicator')).toBeInTheDocument();
    expect(screen.getByTestId('filter-tab-all')).toBeInTheDocument();
    expect(screen.getByTestId('filter-tab-pending')).toBeInTheDocument();
    expect(screen.getByTestId('filter-tab-completed')).toBeInTheDocument();
  });

  it('renders seed payment items in list', async () => {
    render(<PaymentTracker />);

    await waitFor(() => {
      expect(screen.getByText('PAY-001')).toBeInTheDocument();
      expect(screen.getByText('PAY-002')).toBeInTheDocument();
    });
  });
});
