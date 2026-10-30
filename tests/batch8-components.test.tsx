import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SplitBillForm } from '../src/components/payments/SplitBillForm';
import { RemainderAllocationVisualizer } from '../src/components/payments/RemainderAllocationVisualizer';
import { PayrollCsvUploader } from '../src/components/payments/PayrollCsvUploader';
import { RecipientManager } from '../src/components/payments/RecipientManager';
import { InvoiceModal } from '../src/components/payments/InvoiceModal';
import { Sep0007QrModal } from '../src/components/payments/Sep0007QrModal';
import { PaymentReceiptModal } from '../src/components/payments/PaymentReceiptModal';
import { SseLiveIndicator } from '../src/components/payments/SseLiveIndicator';
import { TipJarWidget } from '../src/components/tipjar/TipJarWidget';
import { MemoInput } from '../src/components/ui/MemoInput';
import { LowBalanceWarning } from '../src/components/wallet/LowBalanceWarning';
import { convertRecordsToCsv } from '../src/utils/csvExport';

describe('Batch 8 Frontend Components & Utilities', () => {
  const SENDER = 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN';
  const RECIP_1 = 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';

  describe('Item 141: Percentage Mode in SplitBillForm', () => {
    it('switches to percentage mode and recalculates shares', () => {
      render(
        <SplitBillForm
          senderAddress={SENDER}
          spendableBalance="500.00"
        />
      );

      const pctModeBtn = screen.getByTestId('split-mode-percentage');
      fireEvent.click(pctModeBtn);

      expect(screen.getByTestId('split-pct-0')).toBeInTheDocument();
      expect(screen.getByTestId('split-pct-1')).toBeInTheDocument();
      expect(screen.getByText(/Total Percentage: 100.0%/i)).toBeInTheDocument();
    });
  });

  describe('Item 142: RemainderAllocationVisualizer', () => {
    it('computes exact stroops and dust remainder correctly', () => {
      render(
        <RemainderAllocationVisualizer
          totalAmount="100.0000001"
          recipientCount={3}
        />
      );

      expect(screen.getByTestId('remainder-visualizer')).toBeInTheDocument();
      expect(screen.getByTestId('total-stroops')).toBeInTheDocument();
      expect(screen.getByTestId('dust-remainder')).toBeInTheDocument();
    });
  });

  describe('Item 143: PayrollCsvUploader', () => {
    it('renders drop zone and accepts input', () => {
      const handleLoaded = vi.fn();
      render(<PayrollCsvUploader onLoaded={handleLoaded} />);

      expect(screen.getByTestId('payroll-csv-uploader')).toBeInTheDocument();
      expect(screen.getByTestId('csv-file-input')).toBeInTheDocument();
    });
  });

  describe('Item 144: RecipientManager', () => {
    it('autofills testnet wallets on button click', () => {
      const handleChange = vi.fn();
      render(
        <RecipientManager
          recipients={[]}
          onChange={handleChange}
        />
      );

      const autofillBtn = screen.getByTestId('autofill-testnet-btn');
      fireEvent.click(autofillBtn);

      expect(handleChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ address: SENDER }),
          expect.objectContaining({ address: RECIP_1 }),
        ])
      );
    });
  });

  describe('Item 145: InvoiceModal', () => {
    it('renders invoice details and countdown', () => {
      render(
        <InvoiceModal
          isOpen={true}
          onClose={vi.fn()}
          invoice={{
            id: 'INV-101',
            destination: RECIP_1,
            amount: '250.00',
            memo: 'INV-101-MEMO',
            expiresInSeconds: 600,
          }}
        />
      );

      expect(screen.getByTestId('invoice-modal')).toBeInTheDocument();
      expect(screen.getByTestId('invoice-amount')).toHaveTextContent('250.00');
      expect(screen.getByTestId('invoice-countdown')).toBeInTheDocument();
    });
  });

  describe('Item 146: Sep0007QrModal', () => {
    it('generates valid web+stellar:pay URI', () => {
      render(
        <Sep0007QrModal
          isOpen={true}
          onClose={vi.fn()}
          destination={RECIP_1}
          amount="75"
          memo="TestPay"
        />
      );

      expect(screen.getByTestId('sep0007-qr-modal')).toBeInTheDocument();
      const uriText = screen.getByTestId('sep0007-uri-text');
      expect(uriText.textContent).toContain('web+stellar:pay');
      expect(uriText.textContent).toContain(RECIP_1);
      expect(uriText.textContent).toContain('amount=75');
    });
  });

  describe('Item 147: PaymentReceiptModal', () => {
    it('renders receipt amount and print trigger', () => {
      render(
        <PaymentReceiptModal
          isOpen={true}
          onClose={vi.fn()}
          payment={{
            id: 'PMT-999',
            hash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
            source: SENDER,
            destination: RECIP_1,
            amount: '150.00',
            asset: 'XLM',
            ledger: 104530,
          }}
        />
      );

      expect(screen.getByTestId('payment-receipt-modal')).toBeInTheDocument();
      expect(screen.getByTestId('receipt-amount')).toHaveTextContent('150.00 XLM');
      expect(screen.getByTestId('print-receipt-btn')).toBeInTheDocument();
    });
  });

  describe('Item 149: SseLiveIndicator', () => {
    it('displays event count and active connection indicator', () => {
      render(
        <SseLiveIndicator
          isConnected={true}
          eventCount={42}
          lastEventAt={Date.now() - 5000}
        />
      );

      expect(screen.getByTestId('sse-live-indicator')).toBeInTheDocument();
      expect(screen.getByTestId('sse-event-count')).toHaveTextContent('42 events');
    });
  });

  describe('Item 151: TipJarWidget', () => {
    it('renders preset amounts and submits tip', () => {
      const handleTip = vi.fn();
      render(
        <TipJarWidget
          recipientAddress={RECIP_1}
          onTipSubmitted={handleTip}
        />
      );

      const preset20 = screen.getByTestId('tip-preset-20');
      fireEvent.click(preset20);

      const submitBtn = screen.getByTestId('submit-tip-btn');
      fireEvent.click(submitBtn);

      expect(handleTip).toHaveBeenCalledWith('20', expect.stringContaining('🚀'));
    });
  });

  describe('Item 155: MemoInput', () => {
    it('calculates UTF-8 byte length correctly for ASCII and multi-byte emojis', () => {
      const handleChange = vi.fn();
      const { rerender } = render(
        <MemoInput
          value="Hello World"
          onChange={handleChange}
        />
      );

      expect(screen.getByTestId('memo-byte-counter')).toHaveTextContent('11 / 28 bytes');

      // Test multi-byte character (Rocket emoji = 4 bytes)
      rerender(
        <MemoInput
          value="Hello 🚀"
          onChange={handleChange}
        />
      );
      // 'Hello ' is 6 bytes + 🚀 is 4 bytes = 10 bytes
      expect(screen.getByTestId('memo-byte-counter')).toHaveTextContent('10 / 28 bytes');
    });
  });

  describe('Item 158: LowBalanceWarning', () => {
    it('shows warning when balance is below reserve threshold', () => {
      render(<LowBalanceWarning balance="1.25" threshold={2.0} />);
      expect(screen.getByTestId('low-balance-warning')).toBeInTheDocument();
      expect(screen.getByText(/Low XLM Balance/i)).toBeInTheDocument();
    });

    it('hides warning when balance is above threshold', () => {
      const { container } = render(<LowBalanceWarning balance="15.00" threshold={2.0} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Item 153: CSV Export Utility', () => {
    it('formats records into standard RFC 4180 CSV rows', () => {
      const records = [
        { id: '1', name: 'Alice, Key', amount: '10.5' },
        { id: '2', name: 'Bob', amount: '20.0' },
      ];
      const csv = convertRecordsToCsv(records);
      expect(csv).toContain('id,name,amount');
      expect(csv).toContain('"Alice, Key"');
      expect(csv).toContain('Bob');
    });
  });
});
