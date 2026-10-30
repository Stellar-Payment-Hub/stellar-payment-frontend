import { useState, useEffect } from 'react';
import { X, Clock, Copy, Check, QrCode, FileText, CheckCircle2 } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: {
    id: string;
    destination: string;
    amount: string;
    asset?: string;
    memo?: string;
    expiresInSeconds?: number;
  };
}

export function InvoiceModal({ isOpen, onClose, invoice }: InvoiceModalProps) {
  const [timeLeft, setTimeLeft] = useState(invoice.expiresInSeconds || 900);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isExpired = timeLeft === 0;

  const invoiceUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?invoice=${invoice.id}&dest=${invoice.destination}&amount=${invoice.amount}`
    : `https://stellar-hub.pay/invoice/${invoice.id}`;

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(invoiceUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      //
    }
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(invoice.destination);
      setCopiedAddr(true);
      setTimeout(() => setCopiedAddr(false), 2000);
    } catch {
      //
    }
  };

  return (
    <div className="modal-backdrop" data-testid="invoice-modal">
      <div className="modal-card modal-card-md">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <FileText size={20} className="text-cyan-400" />
            <div>
              <h3 className="modal-title">Payment Invoice</h3>
              <span className="text-muted text-xs">Reference #{invoice.id}</span>
            </div>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center' }}>
          {/* Amount Badge */}
          <div style={{ margin: '1rem 0' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }} data-testid="invoice-amount">
              {invoice.amount}
            </span>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-cyan)', marginLeft: '0.4rem' }}>
              {invoice.asset || 'XLM'}
            </span>
          </div>

          {/* Expiration Countdown */}
          <div
            data-testid="invoice-countdown"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: isExpired ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: isExpired ? 'var(--danger)' : 'var(--warning)',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            <Clock size={14} />
            {isExpired ? 'Invoice Expired' : `Expires in ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}
          </div>

          {/* Simulated QR Code */}
          <div
            style={{
              width: '160px',
              height: '160px',
              margin: '0 auto 1.25rem auto',
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem',
            }}
          >
            <QrCode size={130} color="#07090e" />
            <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>SCAN TO PAY</span>
          </div>

          {/* Destination Details */}
          <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Destination Address</span>
              <button type="button" className="icon-btn" onClick={copyAddress} title="Copy address">
                {copiedAddr ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              </button>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', wordBreak: 'break-all' }}>
              {invoice.destination}
            </div>

            {invoice.memo && (
              <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Required Memo</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{invoice.memo}</span>
              </div>
            )}
          </div>

          {/* Copy Shareable Link */}
          <button
            type="button"
            className="btn btn-secondary w-full"
            onClick={copyUrl}
            data-testid="copy-invoice-link-btn"
            style={{ width: '100%' }}
          >
            {copiedLink ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
            {copiedLink ? 'Invoice Link Copied!' : 'Copy Shareable Payment Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
