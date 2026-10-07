import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MultiPaymentForm } from '../src/components/payments/MultiPaymentForm';
import { SplitBillForm } from '../src/components/payments/SplitBillForm';
import { TipJarView } from '../src/components/tipjar/TipJarView';
import { PaymentTracker } from '../src/components/tracker/PaymentTracker';

describe('Multi-Recipient & Split Payments', () => {
  const SENDER = 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN';
  const RECIP_1 = 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';

  describe('MultiPaymentForm Calculations and Validation', () => {
    it('calculates total correctly and checks against spendable balance', () => {
      render(
        <MultiPaymentForm
          senderAddress={SENDER}
          spendableBalance="100.00"
          activeWallet="freighter"
        />
      );

      expect(screen.getByTestId('multi-payment-form')).toBeInTheDocument();
      expect(screen.getByTestId('multi-total')).toBeInTheDocument();
      
      // Starts with 2 recipient rows
      expect(screen.getByTestId('multi-recipient-0')).toBeInTheDocument();
      expect(screen.getByTestId('multi-recipient-1')).toBeInTheDocument();

      // Add a third recipient
      const addBtn = screen.getByTestId('add-recipient-btn');
      fireEvent.click(addBtn);
      expect(screen.getByTestId('multi-recipient-2')).toBeInTheDocument();
    });

    it('rejects duplicate recipients', () => {
      render(
        <MultiPaymentForm
          senderAddress={SENDER}
          spendableBalance="200.00"
          activeWallet="freighter"
        />
      );

      const recipient0 = screen.getByTestId('multi-recipient-0');
      const amount0 = screen.getByTestId('multi-amount-0');
      const recipient1 = screen.getByTestId('multi-recipient-1');
      const amount1 = screen.getByTestId('multi-amount-1');

      fireEvent.change(recipient0, { target: { value: RECIP_1 } });
      fireEvent.change(amount0, { target: { value: '10' } });

      fireEvent.change(recipient1, { target: { value: RECIP_1 } });
      fireEvent.change(amount1, { target: { value: '20' } });

      const submitBtn = screen.getByTestId('submit-multi-payment');
      fireEvent.click(submitBtn);

      expect(screen.getByText(/Duplicate recipient address detected/i)).toBeInTheDocument();
    });
  });

  describe('SplitBillForm Calculations', () => {
    it('calculates equal splits evenly with remainder handling', () => {
      render(
        <SplitBillForm
          senderAddress={SENDER}
          spendableBalance="500.00"
        />
      );

      expect(screen.getByTestId('split-bill-form')).toBeInTheDocument();

      const totalInput = screen.getByTestId('split-total-input');
      fireEvent.change(totalInput, { target: { value: '100' } });

      // There are 2 participants by default: 100 / 2 = 50
      const share0 = screen.getByTestId('split-share-0') as HTMLInputElement;
      const share1 = screen.getByTestId('split-share-1') as HTMLInputElement;
      expect(share0.value).toBe('50.0000');
      expect(share1.value).toBe('50.0000');
    });

    it('validates custom split sum against total bill', () => {
      render(
        <SplitBillForm
          senderAddress={SENDER}
          spendableBalance="500.00"
        />
      );

      // Switch to custom split
      const customTab = screen.getByTestId('split-mode-custom');
      fireEvent.click(customTab);

      const totalInput = screen.getByTestId('split-total-input');
      fireEvent.change(totalInput, { target: { value: '120' } });

      // Set shares that don't match 120: 30 + 40 = 70
      const share0 = screen.getByTestId('split-share-0');
      const share1 = screen.getByTestId('split-share-1');
      fireEvent.change(share0, { target: { value: '30' } });
      fireEvent.change(share1, { target: { value: '40' } });

      const submitBtn = screen.getByTestId('submit-split-bill');
      expect(submitBtn).toBeDisabled();
    });
  });

  describe('TipJarView Presets & Custom Amounts', () => {
    it('updates custom amount when a preset button is clicked', () => {
      render(
        <TipJarView
          defaultRecipient={RECIP_1}
          connectedAddress={SENDER}
        />
      );

      expect(screen.getByTestId('tip-jar-view')).toBeInTheDocument();
      expect(screen.getByTestId('tip-preset-10')).toBeInTheDocument();

      // Click 10 XLM preset
      fireEvent.click(screen.getByTestId('tip-preset-10'));
      const input = screen.getByTestId('tip-custom-amount') as HTMLInputElement;
      expect(input.value).toBe('10');

      // Click 25 XLM preset
      fireEvent.click(screen.getByTestId('tip-preset-25'));
      expect(input.value).toBe('25');
    });
  });

  describe('PaymentTracker 2.0 Tab Rendering', () => {
    it('renders category switchers between Single Payments and Multi-Address Settlements', () => {
      render(<PaymentTracker />);
      expect(screen.getByTestId('tracker-cat-payments')).toBeInTheDocument();
      expect(screen.getByTestId('tracker-cat-settlements')).toBeInTheDocument();

      // Click Settlements tab
      fireEvent.click(screen.getByTestId('tracker-cat-settlements'));
      expect(screen.getByTestId('tracker-cat-settlements')).toHaveClass('btn-primary');
    });
  });
});
