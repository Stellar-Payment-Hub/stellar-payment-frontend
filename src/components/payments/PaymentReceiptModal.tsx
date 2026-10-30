import { X, Printer, ShieldCheck, CheckCircle2 } from 'lucide-react';

export interface ReceiptPaymentData {
  id: string;
  hash?: string;
  source: string;
  destination: string;
  amount: string;
  asset: string;
  ledger?: number;
  fee?: string;
  timestamp?: number;
}

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: ReceiptPaymentData;
}

export function PaymentReceiptModal({ isOpen, onClose, payment }: PaymentReceiptModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const formattedDate = payment.timestamp
    ? new Date(payment.timestamp).toLocaleString()
    : new Date().toLocaleString();

  return (
    <div className="modal-backdrop" data-testid="payment-receipt-modal">
      <div className="modal-card modal-card-md">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <ShieldCheck size={20} className="text-emerald-400" />
            <div>
              <h3 className="modal-title">Payment Receipt</h3>
              <span className="text-muted text-xs">Cryptographic Settlement Proof</span>
            </div>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ background: '#0b0f19', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
          {/* Official Receipt Header */}
          <div style={{ textAlign: 'center', borderBottom: '1px dashed var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--success)', marginBottom: '0.25rem' }}>
              <CheckCircle2 size={16} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Payment Confirmed
              </span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }} data-testid="receipt-amount">
              {payment.amount} {payment.asset}
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formattedDate}</span>
          </div>

          {/* Receipt Properties */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Payment ID</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{payment.id}</span>
            </div>

            {payment.ledger && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Ledger Sequence</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>#{payment.ledger}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Network Fee</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{payment.fee || '100 Stroops (0.00001 XLM)'}</span>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>Source Account</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', wordBreak: 'break-all' }}>{payment.source}</span>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>Destination</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', wordBreak: 'break-all' }}>{payment.destination}</span>
            </div>

            {payment.hash && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>Transaction Hash</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent-cyan)', wordBreak: 'break-all' }}>
                  {payment.hash}
                </span>
              </div>
            )}
          </div>

          {/* Print Button */}
          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handlePrint}
              data-testid="print-receipt-btn"
              style={{ width: '100%' }}
            >
              <Printer size={16} /> Print / Save PDF Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
