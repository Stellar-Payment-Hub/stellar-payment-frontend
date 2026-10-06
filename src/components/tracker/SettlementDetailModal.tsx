import { useState } from 'react';
import { X, ExternalLink, Copy, Check, GitMerge, Users, CheckCircle2 } from 'lucide-react';
import { TrackerSettlement } from '../../services/payments';
import { getExplorerTxUrl, getExplorerAccountUrl, truncateHash } from '../../lib/stellar/explorer';

interface SettlementDetailModalProps {
  settlement: TrackerSettlement;
  isOpen: boolean;
  onClose: () => void;
}

export const SettlementDetailModal = ({
  settlement,
  isOpen,
  onClose,
}: SettlementDetailModalProps) => {
  const [copiedHash, setCopiedHash] = useState(false);

  if (!isOpen) return null;

  const handleCopyHash = async () => {
    if (!settlement.transaction_hash) return;
    try {
      await navigator.clipboard.writeText(settlement.transaction_hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } catch {
      //
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="badge badge-success">✓ Completed</span>;
      case 'PROCESSING':
        return <span className="badge badge-network">● Processing</span>;
      case 'CREATED':
        return <span className="badge badge-warning">🟡 Created</span>;
      case 'FAILED':
        return <span className="badge badge-danger">✕ Failed</span>;
      default:
        return <span className="badge badge-muted">{status}</span>;
    }
  };

  return (
    <div className="modal-backdrop" data-testid="settlement-detail-modal">
      <div className="modal-card modal-card-lg">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <GitMerge size={20} className="text-cyan-400" />
            <div>
              <h3 className="modal-title">Multi-Address Settlement {settlement.id}</h3>
              <span className="text-muted text-xs">On-chain Settlement #{settlement.on_chain_id}</span>
            </div>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Amount & Status Hero */}
          <div className="detail-hero-box">
            <div>
              <div className="detail-hero-amount">
                <span className="font-mono text-2xl font-bold">{settlement.total_amount}</span>
                <span className="text-cyan-400 font-bold ml-1">XLM</span>
              </div>
              <span className="text-muted text-xs">Total Multi-Recipient Settlement Amount</span>
            </div>
            {getStatusBadge(settlement.status)}
          </div>

          {/* Inter-Contract Call Notification Badge */}
          <div
            style={{
              padding: '0.65rem 0.85rem',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: 'var(--radius-sm)',
              marginTop: '0.85rem',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <CheckCircle2 size={15} className="text-cyan-400" style={{ flexShrink: 0 }} />
            <span style={{ color: 'var(--text-secondary)' }}>
              <strong>Soroban Inter-Contract Call:</strong> The <code>SettlementRouter</code> contract dispatched payments via <code>PaymentRegistry.create_payment</code>.
            </span>
          </div>

          {/* Core Properties */}
          <div className="review-meta-list mt-3">
            <div className="review-meta-item">
              <span className="meta-label">Payer</span>
              <a
                href={getExplorerAccountUrl(settlement.payer)}
                target="_blank"
                rel="noopener noreferrer"
                className="meta-value mono-text link-inline"
              >
                {truncateHash(settlement.payer, 6, 6)} <ExternalLink size={11} />
              </a>
            </div>

            <div className="review-meta-item">
              <span className="meta-label">Total Recipients</span>
              <span className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Users size={13} className="text-cyan-400" />
                {settlement.recipient_count} Accounts
              </span>
            </div>

            {settlement.memo && (
              <div className="review-meta-item">
                <span className="meta-label">Memo</span>
                <span className="meta-value">{settlement.memo}</span>
              </div>
            )}

            <div className="review-meta-item">
              <span className="meta-label">Settlement Contract</span>
              <span className="meta-value mono-text text-xs" title={settlement.contract_address}>
                {truncateHash(settlement.contract_address, 6, 6)}
              </span>
            </div>

            {settlement.transaction_hash && (
              <div className="review-meta-item">
                <span className="meta-label">Transaction Hash</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <a
                    href={getExplorerTxUrl(settlement.transaction_hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="meta-value mono-text text-cyan-400 link-inline text-xs"
                  >
                    {truncateHash(settlement.transaction_hash, 6, 6)}
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
                {new Date(settlement.created_at).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Nested Recipient Breakdown Tree (Section 15) */}
          <div className="events-timeline mt-4">
            <div className="events-timeline-header">
              <Users size={14} className="text-cyan-400" />
              <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                Settlement Recipient Tree ({settlement.recipients.length})
              </span>
            </div>

            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                background: 'var(--bg-primary)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                marginTop: '0.5rem',
              }}
            >
              <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.4rem' }}>
                Settlement #{settlement.on_chain_id} [{settlement.total_amount} XLM]
              </div>
              {settlement.recipients.map((rec, index) => {
                const isLast = index === settlement.recipients.length - 1;
                const prefix = isLast ? '└── ' : '├── ';
                return (
                  <div
                    key={rec.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.35rem 0',
                      borderBottom: isLast ? 'none' : '1px dashed rgba(255,255,255,0.05)',
                    }}
                  >
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>{prefix}</span>
                      <a
                        href={getExplorerAccountUrl(rec.recipient)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--cyan-400)', textDecoration: 'none' }}
                      >
                        {truncateHash(rec.recipient, 5, 5)}
                      </a>
                      {rec.sub_payment_id && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginLeft: '0.5rem' }}>
                          ({rec.sub_payment_id})
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {rec.amount} XLM
                      </span>
                      {rec.status === 'COMPLETED' ? (
                        <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                          Completed
                        </span>
                      ) : rec.status === 'FAILED' ? (
                        <span className="badge badge-danger" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                          Failed
                        </span>
                      ) : (
                        <span className="badge badge-warning" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {settlement.transaction_hash && (
            <a
              href={getExplorerTxUrl(settlement.transaction_hash)}
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
