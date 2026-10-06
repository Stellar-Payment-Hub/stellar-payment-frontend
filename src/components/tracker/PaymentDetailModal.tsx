import { useState, useEffect } from 'react';
import { X, ExternalLink, Copy, Check, ShieldCheck, Activity } from 'lucide-react';
import { TrackerPayment, TrackerEvent, paymentApiService } from '../../services/payments';
import { getExplorerTxUrl, getExplorerAccountUrl, truncateHash } from '../../lib/stellar/explorer';

interface PaymentDetailModalProps {
  payment: TrackerPayment;
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentDetailModal = ({
  payment,
  isOpen,
  onClose,
}: PaymentDetailModalProps) => {
  const [events, setEvents] = useState<TrackerEvent[]>([]);
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    if (isOpen && payment) {
      paymentApiService.getPaymentById(payment.id).then((res) => {
        if (res?.events) setEvents(res.events);
      });
    }
  }, [isOpen, payment]);

  if (!isOpen) return null;

  const handleCopyHash = async () => {
    if (!payment.transaction_hash) return;
    try {
      await navigator.clipboard.writeText(payment.transaction_hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } catch {
      //
    }
  };

  const getStatusBadgeClass = () => {
    switch (payment.status) {
      case 'COMPLETED':
        return 'badge-success';
      case 'PROCESSING':
        return 'badge-network';
      case 'PENDING':
        return 'badge-warning';
      case 'FAILED':
      case 'CANCELLED':
        return 'badge-danger';
      default:
        return 'badge-muted';
    }
  };

  return (
    <div className="modal-backdrop" data-testid="payment-detail-modal">
      <div className="modal-card modal-card-lg">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <ShieldCheck size={20} className="text-cyan-400" />
            <div>
              <h3 className="modal-title">Payment #{payment.id}</h3>
              <span className="text-muted text-xs">On-chain ID: {payment.on_chain_id}</span>
            </div>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Amount & Status Hero */}
          <div className="detail-hero-box">
            <div className="detail-hero-amount">
              <span className="font-mono text-2xl font-bold">{payment.amount}</span>
              <span className="text-cyan-400 font-bold ml-1">XLM</span>
            </div>
            <span className={`badge ${getStatusBadgeClass()}`}>
              {payment.status}
            </span>
          </div>

          {/* Core Properties */}
          <div className="review-meta-list mt-3">
            <div className="review-meta-item">
              <span className="meta-label">Creator</span>
              <a
                href={getExplorerAccountUrl(payment.creator_address)}
                target="_blank"
                rel="noopener noreferrer"
                className="meta-value mono-text link-inline"
              >
                {truncateHash(payment.creator_address, 6, 6)} <ExternalLink size={11} />
              </a>
            </div>

            <div className="review-meta-item">
              <span className="meta-label">Recipient</span>
              <a
                href={getExplorerAccountUrl(payment.recipient_address)}
                target="_blank"
                rel="noopener noreferrer"
                className="meta-value mono-text link-inline"
              >
                {truncateHash(payment.recipient_address, 6, 6)} <ExternalLink size={11} />
              </a>
            </div>

            {payment.memo && (
              <div className="review-meta-item">
                <span className="meta-label">Memo</span>
                <span className="meta-value">{payment.memo}</span>
              </div>
            )}

            <div className="review-meta-item">
              <span className="meta-label">Soroban Contract</span>
              <span className="meta-value mono-text text-xs" title={payment.contract_address}>
                {truncateHash(payment.contract_address, 6, 6)}
              </span>
            </div>

            {payment.transaction_hash && (
              <div className="review-meta-item">
                <span className="meta-label">Transaction Hash</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <a
                    href={getExplorerTxUrl(payment.transaction_hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="meta-value mono-text text-cyan-400 link-inline text-xs"
                  >
                    {truncateHash(payment.transaction_hash, 6, 6)}
                  </a>
                  <button
                    type="button"
                    className="icon-btn"
                    style={{ width: '22px', height: '22px' }}
                    onClick={handleCopyHash}
                  >
                    {copiedHash ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            )}

            <div className="review-meta-item">
              <span className="meta-label">Created At</span>
              <span className="meta-value text-muted text-xs">
                {new Date(payment.created_at).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Audit Event History */}
          <div className="events-timeline mt-4">
            <div className="events-timeline-header">
              <Activity size={14} className="text-cyan-400" />
              <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                Lifecycle Events ({events.length})
              </span>
            </div>
            <div className="events-list">
              {events.map((evt) => (
                <div key={evt.id} className="event-item">
                  <div className="event-dot"></div>
                  <div className="event-info">
                    <span className="event-type">{evt.event_type}</span>
                    <span className="event-time">
                      {new Date(evt.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {payment.transaction_hash && (
            <a
              href={getExplorerTxUrl(payment.transaction_hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
            >
              <span>Verify on Explorer</span>
              <ExternalLink size={12} />
            </a>
          )}
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
